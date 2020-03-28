import express from "express";
import Post from "../../models/Post";

const router = express.Router();

router.post('/', async(req, res, next)=>{
    try{
        const post = await new Post(req.body).save();
        res.send({status:200, data:post});

    }catch( error ){ 
        next(error);
    }
});


router.get('/', async(req,res, next) =>{

    try{ 
      const posts = await Post.find({});
      res.send({status:200, data:posts})
    }
    catch(error){
        next(error);
    }
});

router.get('/:id', async(req,res, next) =>{
    try{
        await Post.findOne({_id: req.params.id}, (err, post) => {
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
        await Post.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});

router.put('/:id', async(req, res, next) =>{
    try{
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { $set : req.body}
        );
        res.send({ success: true, data: post });
    }catch(error){
        next(error);
    }
})

export default router;
