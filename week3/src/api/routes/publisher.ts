import express from "express";
import Publisher from "../../models/Publisher";

const router = express.Router();

router.post('/', async(req, res, next)=>{
    try{
        const publisher = await new Publisher(req.body).save();
        res.send({status:200, data:publisher});
    }catch( error ){ 
        next(error);
    }
});


router.get('/', async(req,res, next) =>{
    try{ 
      const publishers = await Publisher.find({}).populate({path: "book", populate: {path: "historys"}})
      res.send({status:200, data:publishers})
    }
    catch(error){
        next(error);
    }
});



router.get('/check', async(req : any,res, next) =>{
    if (req.isAuthenticated()) {
        try{
            const publisher = await Publisher.findById(req.user._id).populate({path: "book", populate: {path: "historys"}})
            res.send({success : true, data : publisher});
        }catch(error){
            next(error);
        }
    }
    else{
        console.log('?');

    }
   
});

router.delete('/:id', async(req, res, next) => {
    try{
        await Publisher.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});

router.put('/:id', async(req, res, next) =>{
    try{
        const publisher = await Publisher.findOneAndUpdate(
            { _id: req.params.id },
            { $set : req.body},
            {new : true}
        );
        res.send({ success: true, data: publisher });
    }catch(error){
        next(error);
    }
})

export default router;
