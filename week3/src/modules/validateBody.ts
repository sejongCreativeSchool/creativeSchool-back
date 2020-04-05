import { Request, Response } from 'express';
import Joi from 'joi';

export const validateBody = async(req : Request, res : Response, next : any) =>{
    const schema = Joi.object({
        user_id : Joi.string().min(1).max(12).regex(/^[a-z0-9가-힇]+$/i),
        user_pw : Joi.string().min(8).max(64).regex(/^[ -~]+$/i),
        admin : Joi.boolean()
    })
    const result = Joi.validate(req.body, schema);
    if ( result.error ) {
        next(result.error );
    }
    return next();
}