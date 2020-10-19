import puppeteer from 'puppeteer';
import { warning, info } from './log';
import { saveScrap } from './db';

export default async function scrape ( conn ) {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto( 'https://develop.pub.afflu.net', { waitUntil: 'networkidle2' });
    info( 'Page loaded' );
    await page.waitFor( 5000 );
    await page.waitForSelector( 'input[name=username]' );
    await page.type( 'input[name=username]', 'developertest@affluent.io' );
    info( 'Email Input added' );
    await page.type('input[name=password]', 'SOpcR^37' );
    info( 'Password Input added' );
    await page.waitForSelector( 'button.btn.green.uppercase' );
    await page.click( 'button.btn.green.uppercase' );
    info( 'Submit button click' );
    
    await page.waitForNavigation();
    await page.goto( 'https://develop.pub.afflu.net/list?type=dates' , { waitUntil: 'networkidle2', timeout: 100000 });
    info( 'Navigation completed to /list?types=dates' );
    await page.waitForSelector( '#datepicker' );
    await page.click( '#datepicker' );
    info( 'Datepicker selected' );
    await page.click( 'input[name=daterangepicker_start]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type( 'input[name=daterangepicker_start]', '04/30/2019' );
    info( 'Start date is set.' );
    await page.click( 'input[name=daterangepicker_end]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type( 'input[name=daterangepicker_end]', '04/01/2020' );
    info( 'End date is set.' );
    await page.click( 'button.applyBtn.btn.btn-sm.btn-success' );
    info( 'Submitted custom date.' );
    await page.waitFor( 10000 );
    await page.screenshot({ path: 'date.png' });
    await page.select( "select[name=DataTables_Table_0_length]", "-1");
    info( 'All dropdown option selected' );
    await page.screenshot({ path: 'image.png' });
    await page.waitFor(10000)
    const result = await page.$$eval('#DataTables_Table_0 tr', rows => {
        return Array.from(rows, row => {
        const columns = row.querySelectorAll('td');
        return Array.from(columns, column => column.innerText);
        });
    });
    // remove empty values
    const processedData = result.filter( item => item.length > 0 );
    // To do save result.
    const savedData = await saveScrap( processedData, conn );
    console.log( savedData );
    conn.destroy();

    await page.screenshot({ path: 'finalimage.png' });
    warning('completed');
    browser.close();
}
