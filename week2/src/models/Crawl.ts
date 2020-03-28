import mongoose, { Schema } from "mongoose";

export interface KeywordModel extends mongoose.Document {
    keywords : String[];
}
const KeywordSchema: Schema<KeywordModel> = new Schema({
    keywords: [],
});

export default  mongoose.model('keyword', KeywordSchema);