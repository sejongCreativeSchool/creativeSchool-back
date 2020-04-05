import mongoose, { Schema } from "mongoose";
import { UserModel } from './User'
import { HistoryModel } from "./History";
import { PublisherModel } from "./Publisher";

export interface BookModel extends mongoose.Document {
    name : string;
    hash : string;
    active : boolean;
    codes : [{
        code : string;
        url : string;
        active : boolean;
        price : number;
        type : String;
        desc : String;
    }];
    user: [UserModel]
    historys : [HistoryModel],
    publisher : [PublisherModel]
}
const BookSchema: Schema<BookModel> = new Schema({
    name : { type: String, required : true },
    hash : { type: String },
    active : { type : Boolean, default : true},
    user : [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required : true }],
    historys : [{ type: mongoose.Schema.Types.ObjectId, ref: 'history'}],
    publisher : { type: mongoose.Schema.Types.ObjectId, ref: 'publisher'},
    codes : [{
        code : { type: String },
        url : { type: String },
        active : { type : Boolean, default : true },
        price : {type : Number, default : 0},
        desc : {type : String},
        type : {type : String},
    }]
},{ timestamps: true } );

export default  mongoose.model('book', BookSchema);