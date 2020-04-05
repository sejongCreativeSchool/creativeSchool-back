import mongoose, { Schema } from "mongoose";
import { UserModel } from './User'
import { HistoryModel } from "./History";
import { PublisherModel } from "./Publisher";

export interface PaymentModel extends mongoose.Document {
    user : UserModel, // 입금유저
    name : string, // 입금자명
    bank : string, // 거래은행
    check : Boolean, // 확인
    usage : string, // 용도
    tool : string // 수단
    date : string;
}
const Paymentschema: Schema<PaymentModel> = new Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    name : {type : String},
    bank : {type : String},
    check : {type : Boolean, default : false},
    usage : {type : String},
    tool : {type : String},
    date : {type : String}
},{ timestamps: true } );

export default  mongoose.model('payment', Paymentschema);