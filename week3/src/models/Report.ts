import mongoose, { Schema } from "mongoose";
import {PublisherModel} from './Publisher'
import {BookModel} from './Book'
import {UserModel } from './User'

export interface ReportModel extends mongoose.Document {
    publisher : PublisherModel;
    user : UserModel;
    book : BookModel;
    code : string;
    text : string;
    reason : string;
    answer : string;
    refund : boolean;
}
const ReportSchema: Schema<ReportModel> = new Schema({
    publisher : { type: mongoose.Schema.Types.ObjectId, ref: 'publisher'},
    text : {type : String},
    book : { type: mongoose.Schema.Types.ObjectId, ref: 'book' },
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    code : {type : String},
    reason : {type : String},
    answer : {type : String},
    refund : {type : Boolean}

},{ timestamps: true } );

export default  mongoose.model('report', ReportSchema);