const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // headless: 'new' 也可，但屏幕共享最好用非纯 headless
        args: [
            "--use-fake-ui-for-media-stream",
            '--auto-select-desktop-capture-source="Entire screen"',
            "--ignore-certificate-errors",   // 忽略证书错误
        ]
    });

    const page = await browser.newPage();
    await page.goto("https://192.168.0.20/sender.html");
    setTimeout(async()=>  await page.click("#startBtn"), 3000); // 用 id 选择器

    // 在页面里执行屏幕共享
    await page.evaluate(async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        });
        console.log("Got screen stream:", stream);
    });
})();
