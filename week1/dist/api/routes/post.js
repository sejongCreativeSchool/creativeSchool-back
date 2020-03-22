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
const Post_1 = __importDefault(require("../../models/Post"));
const router = express_1.default.Router();
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield new Post_1.default(req.body).save();
        res.send({ status: 200, data: post });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find({});
        res.send({ status: 200, data: posts });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Post_1.default.findOne({ _id: req.params.id }, (err, post) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!post) {
                return res.status(404).json({ error: 'post not found!' });
            }
            res.send({ success: true, data: post });
        });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Post_1.default.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }
    catch (error) {
        next(error);
    }
}));
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
        res.send({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
