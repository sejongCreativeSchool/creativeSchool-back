import puppeteer from 'puppeteer';

export const extract = (async (userid : string, userpw : string) => {
    const browser = await puppeteer.launch({
        headless : false
    });
    const page = await browser.newPage();
    const blockResource = [
    ];
    await page.setRequestInterception(true);

    page.on('request', req => {
        // 리소스 유형
        const resource = req.resourceType(); 
        if (blockResource.indexOf(resource) !== -1) {
          req.abort();  // 리소스 막기
        } else {
          req.continue(); // 리소스 허용하기
        }
    });
    
    await page.goto('https://everytime.kr/login');

    await page.evaluate((id, pw) => {
        (<HTMLInputElement>document.querySelector('input[name="userid"]')).value = id;
        (<HTMLInputElement>document.querySelector('input[name="password"]')).value = pw;
    }, userid, userpw);
    
    await page.click('input[type="submit"]');

    
    await page.waitFor(500);

    await page.goto('https://everytime.kr/timetable/2019/2');
    await page.waitFor(500);

    const  positions = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll('.subject span'), x => x.innerHTML)
    });
    const subjects = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll('.subject h3'), x => x.innerHTML)
    });
    const data = [ subjects, positions]
    return data;
});
