"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Puppeteer_1 = require("../../crawler/Puppeteer");
const filter_1 = require("../../modules/filter");
const Subject_1 = __importDefault(require("../../models/Subject"));
const router = express_1.default.Router();
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crawlingData = yield Puppeteer_1.extract(req.body.id, req.body.pw);
        const positions = yield filter_1.filter(crawlingData[1]);
        crawlingData[0].map((name, i) => __awaiter(void 0, void 0, void 0, function* () {
            const subj = {
                name: name,
                position: positions[i]
            };
            yield new Subject_1.default(subj).save();
        }));
        res.send({ status: 200, data: crawlingData });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield Subject_1.default.find({});
        res.send({ status: 200, data: subjects });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Subject_1.default.remove();
        res.send({ success: true, data: "okay" });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
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
