import mongoose, { Schema } from "mongoose";

export interface SubjectModel extends mongoose.Document {
  name: string;
  position : string;

  createAt: Date;
  updateAt: Date;
}
const SubjectSchema: Schema<SubjectModel> = new Schema({
    name: String,
    position: String,

    createAt: { type: Date, default: Date.now  },
    updateAt: { type: Date, default: Date.now  },
});

export default  mongoose.model('subject', SubjectSchema);