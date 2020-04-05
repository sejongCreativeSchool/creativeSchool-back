import mongoose, { Schema } from "mongoose";
import { BookModel } from './Book'
export interface PublisherModel extends mongoose.Document {
    author : string;
    address : string;
    page : string;
    name : string;
    rank : string;
    phone : string;
    email : string;
    book : [BookModel]
    publisher_id : string;
}
const PublisherSchema: Schema<PublisherModel> = new Schema({
    book : [{ type: mongoose.Schema.Types.ObjectId, ref: 'book', default: [] }],
    publisher_id : { type: String },
    author : { type: String },
    address : { type: String },
    page : { type: String },
    name : { type: String },
    rank : { type: String },
    phone : { type: String },
    email : { type: String },
},{ timestamps: true } );

export default  mongoose.model('publisher', PublisherSchema);