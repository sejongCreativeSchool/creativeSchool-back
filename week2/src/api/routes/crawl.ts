import request from 'request';
import express from 'express';
import { extract } from '../../crawler/cheerio';
import Crawl from "../../models/Crawl";

const router = express.Router();
router.post('/', async(req, res, next) => {
    request.get('https://www.naver.com', async(err, response) => {
        if (err) console.log(err);
        try {
            let keywords : string[];
            keywords = await extract(response.body);
            const keyword_model = await Crawl.find({});
            
            if (keyword_model.length == 0) {
                await new Crawl({keywords}).save();
                res.send({status : 200, data : keywords});
            }
            else{
                await Crawl.findOneAndUpdate(
                    { _id: keyword_model[0]._id },
                    { $set : keywords }
                );
                res.send({ status : 200, data : keywords });
            }
        } catch (error) {
            next(error)
        }
    });
});
router.delete('/:id', async(req, res, next) => {
    try{
        await Crawl.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});
router.get('/', async(req, res, next) => {
    try{ 
        const keywords = await Crawl.find({});
        res.send({status:200, data:keywords});
      }
      catch(error){
          next(error);
      }
});


export default router;
