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
exports.filter = (datas) => __awaiter(void 0, void 0, void 0, function* () {
    return datas.map(data => {
        switch (data[0]) {
            case '센':
                data = '대양AI센터';
                break;
            case '광':
                data = '광개토관';
                break;
            case '학':
                data = '학술정보원';
                break;
            case 'L':
                data = '군자관';
                break;
            case '영':
                data = '영실관';
                break;
            case '충':
                data = '충무관';
                break;
            default:
                data = '세종대학교';
                break;
        }
        return data;
    });
});
