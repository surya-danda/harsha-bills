import express from 'express';
import {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getYearlyCompanyReport
} from '../controllers/entryController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/entries
// @desc    Get entries for a specific month and year
// @access  Private
router.get('/', auth, getEntries);

// @route   POST api/entries
// @desc    Add a new entry
// @access  Private
router.post('/', auth, addEntry);

// @route   PUT api/entries/:id
// @desc    Update an entry
// @access  Private
router.put('/:id', auth, updateEntry);

// @route   DELETE api/entries/:id
// @desc    Delete an entry
// @access  Private
router.delete('/:id', auth, deleteEntry);

// @route   GET api/entries/reports/yearly-company
// @desc    Get the yearly company report
// @access  Private
router.get('/reports/yearly-company', auth, getYearlyCompanyReport);

export default router;

