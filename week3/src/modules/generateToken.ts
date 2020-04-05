import jwt from 'jsonwebtoken'
import config from '../config/vars'
import { UserModel } from '../models/User' // 이전에 만든 유저 타입
import { resolve } from 'dns'
import { rejects } from 'assert'

const secert = <string>config.secret

export const generateToken = async(payload : UserModel) : Promise<any> =>{
    return new Promise((resolve, rejects)=>{
        jwt.sign(
            payload,
            secert,
            {
                expiresIn : '7d'
            },
            (err, token)=>{
                if (!err){
                    resolve(token);
                } else{
                    rejects(err);
                }
                
            }

        )
    })
}