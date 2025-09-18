import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
    phoneNumber: {
    type: String,
    unique: true,
    sparse: true, // allows multiple docs without phoneNumber
  },
  
});

export default mongoose.model('user', UserSchema);

