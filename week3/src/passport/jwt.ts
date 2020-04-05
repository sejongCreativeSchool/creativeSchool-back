import User from '../models/User';
import { Request } from 'express';
import passpost from 'passport';
import config from '../config/vars'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { UserModel } from '../models/User'

const secret = config.secret

interface tokenPayload extends UserModel {
    iat: string
    exp: string
}

passpost.use(
    new JwtStrategy(
        {
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        },
        async(req: Request, payload : tokenPayload, next : any) => {
            try{
                const user = await User.findById(payload._id);
                console.log('JWT 발급중');
                
                return user ? next(null, user.toObject()) : next('user not found', false) 
            }catch(error){
                next(error);
            }    
        }
    )
)
