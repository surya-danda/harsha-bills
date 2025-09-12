import Entry from '../models/Entry.js';
import mongoose from 'mongoose';

// A helper function to check for authentication
const checkAuth = (req, res) => {
  if (!req.user || !req.user.id) {
    console.error('Authentication error: req.user is not defined. Middleware may have failed.');
    res.status(401).json({ msg: 'User not authenticated' });
    return false;
  }
  return true;
};

export const getEntries = async (req, res) => {
  if (!checkAuth(req, res)) return;

  try {
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const entries = await Entry.find({
      user: req.user.id,
      purchaseDate: { $gte: startDate, $lt: endDate },
    }).sort({ purchaseDate: -1 });
    res.json(entries);
  } catch (err) {
    console.error(`Error in getEntries: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

export const addEntry = async (req, res) => {
  if (!checkAuth(req, res)) return;

  try {
    const newEntry = new Entry({ ...req.body, user: req.user.id });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(`Error in addEntry: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

export const updateEntry = async (req, res) => {
  if (!checkAuth(req, res)) return;
  
  try {
    const entry = await Entry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    console.error(`Error in updateEntry: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

export const deleteEntry = async (req, res) => {
  if (!checkAuth(req, res)) return;

  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(`Error in deleteEntry: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

export const getYearlyCompanyReport = async (req, res) => {
  if (!checkAuth(req, res)) return;

    try {
        const year = parseInt(req.query.year, 10);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        const report = await Entry.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), purchaseDate: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: { shop: '$shop', company: '$company', month: { $month: '$purchaseDate' } }, monthlyTotal: { $sum: '$purchaseAmount' } } },
            { $group: { _id: { shop: '$_id.shop', company: '$_id.company' }, monthlyTotals: { $push: { month: '$_id.month', total: '$monthlyTotal' } }, totalPurchase: { $sum: '$monthlyTotal' } } },
            { $group: { _id: '$_id.shop', companies: { $push: { company: '$_id.company', monthlyTotals: '$monthlyTotals', totalPurchase: '$totalPurchase' } } } },
            { $facet: { fashions: [{ $match: { _id: 'Ramu Fashions' } }], readymade: [{ $match: { _id: 'Ramu Readymade' } }] } },
            { $project: { fashions: { $ifNull: [{ $arrayElemAt: ['$fashions.companies', 0] }, []] }, readymade: { $ifNull: [{ $arrayElemAt: ['$readymade.companies', 0] }, []] } } }
        ]);
        res.json(report[0]);
    } catch (err) {
        console.error(`Error in getYearlyCompanyReport: ${err.message}`);
        res.status(500).send('Server Error');
    }
};

