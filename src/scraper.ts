import { chromium, Browser, Page } from 'playwright';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

export class FileScraper {
    private browser: Browser | null = null;
    private downloadPath: string;

    constructor(downloadPath: string = 'downloads') {
        this.downloadPath = path.resolve(process.cwd(), downloadPath);
        if (!fs.existsSync(this.downloadPath)) {
            fs.mkdirSync(this.downloadPath, { recursive: true });
        }
    }

    async launch() {
        this.browser = await chromium.launch({
            channel: 'chrome', // Try to use system Chrome
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-http2'
            ]
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    /**
     * Navigates to a URL and waits for a download.
     * Use this if the URL itself triggers a download or if you need to click a button.
     * @param url The URL to visit
     * @param triggerSelector Optional selector to click to trigger the download
     */
    async scrapeFile(url: string, triggerSelector?: string): Promise<string | null> {
        if (!this.browser) await this.launch();

        const context = await this.browser!.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            acceptDownloads: true,
            extraHTTPHeaders: {
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'Referer': 'https://www.nseindia.com/',
            }
        });
        const page = await context.newPage();

        try {
            console.log(`Navigating to ${url}...`);
            
            // NSE often requires a session or referrer from the main site
            if (url.includes('nseindia.com')) {
                try {
                    console.log("Visiting NSE homepage to establish session...");
                    // Just trigger navigation and wait blindly, as load event might be blocked or slow
                    await page.goto("https://www.nseindia.com/", { waitUntil: 'commit', timeout: 15000 });
                    console.log("Homepage committed, waiting 5s...");
                    await page.waitForTimeout(5000); 
                } catch (e) {
                    console.warn("Could not load homepage, continuing...", e);
                }
            }

            // Setup download listener before action
            const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

            // Navigate to the page
            if (triggerSelector) {
                 await page.goto(url, { waitUntil: 'networkidle' });
                 console.log(`Clicking selector: ${triggerSelector}...`);
                 await page.click(triggerSelector);
            } else {
                 // If no selector, maybe the URL is a direct download or auto-triggers
                 // We still use goto, but wrap it to catch if it aborts due to being a download
                 try {
                     const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
                     if (response) {
                        console.log(`Response Status: ${response.status()}`);
                        if (response.status() !== 200) {
                            console.log(`Page Content: ${await page.content()}`);
                        }
                     }
                 } catch (e) {
                     // Sometimes direct download URLs cause navigation errors in Playwright, which is expected
                     console.log('Navigation might have been aborted by download (expected for direct links).');
                 }
            }

            console.log('Waiting for download...');
            const download = await downloadPromise;
            
            const originalName = download.suggestedFilename();
            const savePath = path.join(this.downloadPath, originalName);
            
            console.log(`Downloading ${originalName}...`);
            await download.saveAs(savePath);
            
            console.log(`Saved to: ${savePath}`);
            return savePath;

        } catch (error) {
            console.error('Error during scraping:', error);
            return null;
        } finally {
            await page.close();
            await context.close();
        }
    }

    /**
     * Unzips a file to a folder with the same name as the zip file.
     * @param filePath Absolute path to the zip file
     * @returns Path to the extracted folder or null if failed
     */
    async unzipFile(filePath: string): Promise<string | null> {
        try {
            if (path.extname(filePath).toLowerCase() !== '.zip') {
                console.log('File is not a zip file, skipping extraction.');
                return null;
            }

            const fileName = path.basename(filePath, '.zip');
            const extractPath = path.join(path.dirname(filePath), fileName);

            console.log(`Extracting ${filePath} to ${extractPath}...`);
            
            const zip = new AdmZip(filePath);
            zip.extractAllTo(extractPath, true); // overwrite = true

            console.log(`Extraction complete.`);
            return extractPath;
        } catch (error) {
            console.error('Error during extraction:', error);
            return null;
        }
    }

    /**
     * Navigates to a page, searches for a link containing the fileName, and downloads it.
     * @param pageUrl URL to search on
     * @param fileNamePattern Substring to look for in href or text
     */
    async findLinkAndDownload(pageUrl: string, fileNamePattern: string): Promise<string | null> {
        if (!this.browser) await this.launch();

        const context = await this.browser!.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            acceptDownloads: true,
             extraHTTPHeaders: {
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.nseindia.com/',
            }
        });
        const page = await context.newPage();

        try {
            console.log(`Navigating to ${pageUrl}...`);
            await page.goto(pageUrl, { waitUntil: 'commit', timeout: 30000 });
            await page.waitForTimeout(5000); // Wait for dynamic content

            console.log(`Searching for link containing: ${fileNamePattern}`);

            // Find link where href contains pattern or text contains pattern
            // We use a locator with filter
            const link = page.locator('a').filter({ hasText: fileNamePattern }).first();
            const hrefLink = page.locator(`a[href*="${fileNamePattern}"]`).first();

            let targetLocator = null;
            if (await link.count() > 0 && await link.isVisible()) {
                console.log('Found link by text.');
                targetLocator = link;
            } else if (await hrefLink.count() > 0) {
                 console.log('Found link by href.');
                 targetLocator = hrefLink;
            } else {
                console.log('File link not found on page.');
                return null;
            }

            // Download Strategy:
            // 1. Try to get href from the locator
            const href = await targetLocator.getAttribute('href');

            // Setup download
            const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
            
            if (href) {
                console.log(`Navigating directly to download link: ${href}`);
                // If href is relative, resolve it (though NSE usually gives absolute or we can handle it)
                const downloadUrl = href.startsWith('http') ? href : new URL(href, pageUrl).toString();
                
                // Trigger download via navigation (more reliable than click)
                try {
                     await page.goto(downloadUrl, { timeout: 30000 });
                } catch (e) {
                    console.log('Navigation for download triggered (expected).');
                }
            } else {
                 console.log('No href found, trying force click...');
                 await targetLocator.click({ force: true });
            }

            const download = await downloadPromise;
            const originalName = download.suggestedFilename();
            const savePath = path.join(this.downloadPath, originalName);
            
            console.log(`Downloading ${originalName}...`);
            await download.saveAs(savePath);
            
            return savePath;

        } catch (error) {
            console.error(`Error in findLinkAndDownload: ${error}`);
            return null;
        } finally {
            await page.close();
            await context.close();
        }
    }
}
