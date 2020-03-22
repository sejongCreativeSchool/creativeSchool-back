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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appjam_1 = require("../../models/appjam");
const router = express_1.default.Router();
router.post('/', function (req, res) {
    var appjam = new appjam_1.default();
    appjam.title = req.body.name;
    appjam.author = req.body.author;
    appjam.save(function (err) {
        if (err) {
            console.error(err);
            res.json({ result: 0 });
            return;
        }
        res.json({ result: 1 });
    });
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appjam = yield appjam_1.default.find({});
        res.send({ success: true, data: appjam });
    }
    catch (e) {
        console.log(e);
    }
}));
router.get('/:appjam_id', function (req, res) {
    appjam_1.default.findOne({ _id: req.params.appjam_id }, function (err, model) {
        if (err)
            return res.status(500).json({ error: err });
        if (!model)
            return res.status(404).json({ error: 'book not found' });
        res.json(model);
    });
});
exports.default = router;
