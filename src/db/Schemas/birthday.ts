import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("birthdays", schema);
