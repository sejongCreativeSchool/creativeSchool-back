import mongoose, { Schema } from "mongoose";

export interface PostModel extends mongoose.Document {
  title: string;
  content : string;

  createAt: Date;
  updateAt: Date;
}
const PostSchema: Schema<PostModel> = new Schema({
    title: String,
    content: String,

    createAt: { type: Date, default: Date.now  },
    updateAt: { type: Date, default: Date.now  },
});

export default  mongoose.model('post', PostSchema);