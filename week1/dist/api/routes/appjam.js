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
const Appjam_1 = __importDefault(require("../../models/Appjam"));
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appjam = yield new Appjam_1.default(req.body).save();
        res.send({ success: true, data: appjam });
    }
    catch (error) {
        console.log(error);
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appjam = yield Appjam_1.default.find({});
        res.send({ success: true, data: appjam });
    }
    catch (e) {
        console.log(e);
    }
}));
router.get('/:appjam_id', function (req, res) {
    Appjam_1.default.findOne({ _id: req.params.appjam_id }, function (err, model) {
        if (err)
            return res.status(500).json({ error: err });
        if (!model)
            return res.status(404).json({ error: 'data not found' });
        res.send({ success: true, data: model });
    });
});
exports.default = router;
