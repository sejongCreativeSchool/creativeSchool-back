import mongoose, { Schema } from "mongoose";
import { BookModel } from './Book'
import bcrypt from 'bcrypt';

export interface UserModel extends mongoose.Document {
    user_id : string;
    user_pw? : string;
    library? : BookModel[];
    coin? : number;
    experience : number;
    username :string;
    temp : boolean;
    hash : string 
    generateHash : (user_pw: string) => string;
    validatePassword : (user_pw: string) => boolean;
    admin : boolean,
    done : false
}
const UserSchema: Schema<UserModel> = new Schema({
    user_id : {type : String},
    user_pw : {type : String},
    admin : {type : Boolean, default : false},
    temp : {type : Boolean, default : true},
    username : {type : String},
    hash : {type : String},
    library : [{ type: mongoose.Schema.Types.ObjectId, ref: 'book' }],
    experience : { type: Number, default : 100 },
    coin : { type: Number, default : 0 },
    done : {type : Boolean, default : false}
},{ timestamps: true } );


UserSchema.methods.generateHash = function(user_pw: string): string {
  return bcrypt.hashSync(user_pw, bcrypt.genSaltSync(16))
}

UserSchema.methods.validatePassword = function(user_pw: string): boolean {
  return bcrypt.compareSync(user_pw, this.user_pw)
}

export default  mongoose.model('user', UserSchema);