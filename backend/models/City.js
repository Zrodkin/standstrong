import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }
  // imageUrl field removed
}, {
  timestamps: true,
});

const City = mongoose.model('City', citySchema);

export default City;