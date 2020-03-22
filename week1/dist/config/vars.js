"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
require("dotenv-safe").config({
    allowEmptyValues: true,
    path: path_1.default.join(__dirname, "../../.env"),
    sample: path_1.default.join(__dirname, "../../.env.example")
});
const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
        uri: process.env.NODE_ENV === "test"
            ? process.env.MONGO_URI_TESTS
            : process.env.MONGO_URI
    },
};
exports.default = config;
