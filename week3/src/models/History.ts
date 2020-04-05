import mongoose, { Schema } from "mongoose";
import {PublisherModel} from './Publisher'
import {BookModel} from './Book'
import {UserModel } from './User'
import { ReportModel } from './Report'

export interface HistoryModel extends mongoose.Document {
    user : UserModel;
    book : BookModel;
    code : string;
    coin? : number;
    report : ReportModel
}
const HistorySchema: Schema<HistoryModel> = new Schema({
    book : { type: mongoose.Schema.Types.ObjectId, ref: 'book' },
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user', default : null},
    report : { type: mongoose.Schema.Types.ObjectId, ref: 'report' },
    code : {type : String},
    coin : {type : Number}

},{ timestamps: true } );

export default  mongoose.model('history', HistorySchema);