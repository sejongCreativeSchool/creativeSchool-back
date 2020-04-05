import express from "express";
import Book from "../../models/Book";
import {getHashCode} from '../../modules/getHashCode'
import Publisher from "../../models/Publisher";

const router = express.Router();

router.post('/', async(req : any, res, next)=>{
    try{
        const hash = await getHashCode('book');
        const data = {
            name : req.body.name,
            hash : hash,
            code : [],
            publisher : req.body.publisher
        }
        const book = await new Book(data).save();
        await Publisher.findOneAndUpdate(
            { _id: req.user._id },
            { $push : {book : book._id}},
        );     
        res.send({status:200, data:book});
    }catch( error ){ 
        next(error);
    }
});


router.get('/', async(req,res, next) =>{
    console.log(req.query);
    try{ 
      const books = await Book.find(req.query);
      res.send({status:200, data:books})
    }
    catch(error){
        next(error);
    }
});

router.get('/:hash', async(req,res, next) =>{
    try{
        await Book.findOne({hash: req.params.hash}, (err, book) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            if ( !book ) {
                return res.status(404).json({error: 'book not found!'});
            }
            res.send({success : true, data : book});
        });
        
    }catch(error){
        next(error);
    }
});

router.delete('/:id', async(req, res, next) => {
    try{
        await Book.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});

router.put('/:id', async(req, res, next) =>{
    if (req.query.type === 'code'){
        console.log(req.body);
        
        try{
            const book = await Book.findOneAndUpdate(
                { _id: req.params.id },
                { $push : {codes : req.body}},
                { new : true}
            );
            res.send({ success: true, data: book });
        }catch(error){
            next(error);
        }
    }
    else{
        try{
            const book = await Book.findOneAndUpdate(
                { _id: req.params.id },
                { $set : req.body},
                { new : true}
            );
            res.send({ success: true, data: book });
        }catch(error){
            next(error);
        }
    }
    
})

export default router;
