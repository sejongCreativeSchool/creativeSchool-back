"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const indexJs = path_1.default.basename(__filename);
router.get("/status", (req, res) => res.send("Ok"));
console.log(fs_1.default.readdirSync(__dirname), indexJs);
fs_1.default.readdirSync(__dirname)
    .filter(file => file.indexOf(".") !== 0 && file !== indexJs && file.slice(-3) === ".js")
    .forEach(routeFile => {
    router.use(`/${routeFile.split(".")[0]}`, require(`./${routeFile}`).default);
});
exports.default = router;
