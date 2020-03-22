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
const request_1 = __importDefault(require("request"));
const express_1 = __importDefault(require("express"));
const cheerio_1 = require("../../crawler/cheerio");
const Crawl_1 = __importDefault(require("../../models/Crawl"));
const router = express_1.default.Router();
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    request_1.default.get('https://www.naver.com', (err, response) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            console.log(err);
        try {
            let keywords;
            keywords = yield cheerio_1.extract(response.body);
            const keyword_model = yield Crawl_1.default.find({});
            if (keyword_model.length == 0) {
                yield new Crawl_1.default({ keywords }).save();
                res.send({ status: 200, data: keywords });
            }
            else {
                yield Crawl_1.default.findOneAndUpdate({ _id: keyword_model[0]._id }, { $set: keywords });
                res.send({ status: 200, data: keywords });
            }
        }
        catch (error) {
            next(error);
        }
    }));
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Crawl_1.default.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keywords = yield Crawl_1.default.find({});
        res.send({ status: 200, data: keywords });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
