import express from 'express';
import { extract } from '../../crawler/Puppeteer';
import request from 'request';
import { filter } from '../../modules/filter'
import Subject from "../../models/Subject";

const router = express.Router();

router.post('/', async(req, res, next) => {
    try{
        const crawlingData = await extract(req.body.id, req.body.pw);
        const positions = await filter(crawlingData[1])
        crawlingData[0].map(async(name, i) => {
            const subj = {
                name : name, 
                position : positions[i]
            }
            await new Subject(subj).save();
        });
        res.send({status : 200, data : crawlingData});
    }catch(error){
        next(error);
    }
});

router.get('/', async(req, res, next) => {
    try{ 
        const subjects = await Subject.find({});
        res.send({status:200, data:subjects})
    }
    catch(error){
        next(error);
    }
});
router.delete('/', async(req, res, next) => {
    try{
        await Subject.remove();
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});

export default router;



// const options = {
//     uri : "https://dapi.kakao.com/v2/local/search/address.json",
//     method : "GET",
//     headers: {
//         "Authorization" : "KakaoAK 73e26710b8fae8b91be1a1a60d3b985f"
//     },
//     qs:{
//         query: "서울 은평구 갈현로 4"
//     }
// }
// request(options, async(err, response) => {
//     const resp = await JSON.parse(response.body);
//     await res.send({status : 200, data : resp});
// });