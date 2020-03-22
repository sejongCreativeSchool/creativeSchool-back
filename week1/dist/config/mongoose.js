"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vars_1 = __importDefault(require("./vars"));
/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
mongoose_1.default.connection.on("error", err => {
    process.exit(-1);
});
// print mongoose logs in dev env
if (vars_1.default.env === "development") {
    mongoose_1.default.set("debug", true);
}
exports.connect = () => {
    console.log(vars_1.default.mongo.uri);
    mongoose_1.default.connect(vars_1.default.mongo.uri, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return mongoose_1.default.connection;
};
