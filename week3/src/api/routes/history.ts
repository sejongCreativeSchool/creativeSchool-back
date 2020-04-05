import express from "express";
import History from "../../models/History";
import User from "../../models/User";
import Book from "../../models/Book";

const router = express.Router();

router.post('/', async(req, res, next)=>{
    try{
        const history = await new History(req.body).save();
        console.log(req.body.book, history._id);
        
        await Book.findOneAndUpdate(
            { _id: req.body.book },
            { $push : {historys : history._id}}
        );
        res.send({status:200, data:history});
    }catch( error ){ 
        next(error);
    }
});

router.get('/', async(req : any ,res, next) =>{
    try{ 
      const historys = await History.find({user : req.user._id}).populate('book').populate('report');
      res.send({status:200, data:historys})
    }
    catch(error){
        next(error);
    }
});
// router.get('/', async(req : any ,res, next) =>{
//     try{ 
//       const historys = await History.find({user : req.user._id}).populate('book').populate('report');
//       res.send({status:200, data:historys})
//     }
//     catch(error){
//         next(error);
//     }
// });

router.get('/:id', async(req,res, next) =>{
    try{
        await History.findOne({_id: req.params.id}, (err, post) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            if ( !post ) {
                return res.status(404).json({error: 'post not found!'});
            }
            res.send({success : true, data : post});
        });
        
    }catch(error){
        next(error);
    }
});

router.delete('/:id', async(req, res, next) => {
    try{
        await History.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});

router.put('/:id', async(req, res, next) =>{
    try{
        const history = await History.findOneAndUpdate(
            { _id: req.params.id },
            { $set : req.body}
        );
        res.send({ success: true, data: history });
    }catch(error){
        next(error);
    }
})

export default router;
