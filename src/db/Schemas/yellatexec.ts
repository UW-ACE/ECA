import mongoose from "mongoose";

const schema = new mongoose.Schema({
  exec: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

export default mongoose.model("yellatexec", schema);
