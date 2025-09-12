import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  shop: {
    type: String,
    required: true,
    enum: ['Ramu Fashions', 'Ramu Readymade'],
  },
  company: {
    type: String,
    required: true,
  },
  purchaseAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  cashAmount: {
    type: Number,
    default: 0,
  },
  cashDate: {
    type: Date,
  },
  checkAmount: {
    type: Number,
    default: 0,
  },
  checkDate: {
    type: Date,
  },
  returnGoods: {
    type: Number,
    default: 0,
  },
  returnGoodsDate: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model('entry', EntrySchema);

