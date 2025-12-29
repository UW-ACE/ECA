import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model('ace-offs', schema);
