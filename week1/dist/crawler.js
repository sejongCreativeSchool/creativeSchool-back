"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
exports.extract = (html) => {
    if (html === '')
        return [];
    const $ = cheerio_1.load(html);
    const crawledRealtimeKeywords = $('.ah_roll_area.PM_CL_realtimeKeyword_rolling ul > li span.ah_k');
    const keywords = $(crawledRealtimeKeywords)
        .map((i, ele) => {
        return $(ele).text();
    })
        .get();
    return keywords;
};
