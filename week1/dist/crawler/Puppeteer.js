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
const puppeteer_1 = __importDefault(require("puppeteer"));
exports.extract = ((userid, userpw) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: false
    });
    const page = yield browser.newPage();
    const blockResource = [];
    yield page.setRequestInterception(true);
    page.on('request', req => {
        // 리소스 유형
        const resource = req.resourceType();
        if (blockResource.indexOf(resource) !== -1) {
            req.abort(); // 리소스 막기
        }
        else {
            req.continue(); // 리소스 허용하기
        }
    });
    yield page.goto('https://everytime.kr/login');
    yield page.evaluate((id, pw) => {
        document.querySelector('input[name="userid"]').value = id;
        document.querySelector('input[name="password"]').value = pw;
    }, userid, userpw);
    yield page.click('input[type="submit"]');
    yield page.waitFor(500);
    yield page.goto('https://everytime.kr/timetable/2019/2');
    yield page.waitFor(500);
    const positions = yield page.evaluate(() => {
        return Array.from(document.querySelectorAll('.subject span'), x => x.innerHTML);
    });
    const subjects = yield page.evaluate(() => {
        return Array.from(document.querySelectorAll('.subject h3'), x => x.innerHTML);
    });
    const data = [subjects, positions];
    return data;
}));
