import { chromium } from 'playwright-extra';
import { Browser, Page } from 'playwright';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(stealthPlugin());
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { log, error as logError } from './logger';

export class FileScraper {
    private browser: Browser | null = null;
    private context: any | null = null;
    private page: Page | null = null;
    private downloadPath: string;

    constructor(downloadPath: string = 'downloads') {
        this.downloadPath = path.resolve(process.cwd(), downloadPath);
        if (!fs.existsSync(this.downloadPath)) {
            fs.mkdirSync(this.downloadPath, { recursive: true });
        }
    }

    async launch() {
        this.browser = await chromium.launch({
            // channel: 'chrome', // Commented out to use bundled Chromium (smaller image)
            headless: true,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-http2',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--dns-prefetch-disable'
            ]
        });

        // Initialize Context and Page once
        this.context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
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
        this.page = await this.context.newPage();

        // Prime Session immediately upon launch
        try {
            log("Visiting NSE homepage to establish session (launch)...");
            await this.page!.goto("https://www.nseindia.com/", { waitUntil: 'domcontentloaded', timeout: 60000 });
            log("Homepage committed, waiting 5s...");
            await this.page!.waitForTimeout(5000); 
        } catch (e) {
            logError("Could not load homepage during launch, continuing...", e);
        }
    }

    async close() {
        if (this.page) {
            await this.page.close().catch(() => {});
            this.page = null;
        }
        if (this.context) {
            await this.context.close().catch(() => {});
            this.context = null;
        }
        if (this.browser) {
            await this.browser.close().catch(() => {});
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
            log(`Navigating to ${url}...`);
            
            // NSE often requires a session or referrer from the main site
            if (url.includes('nseindia.com')) {
                try {
                    log("Visiting NSE homepage to establish session...");
                    // Just trigger navigation and wait blindly, as load event might be blocked or slow
                    await page.goto("https://www.nseindia.com/", { waitUntil: 'commit', timeout: 15000 });
                    log("Homepage committed, waiting 5s...");
                    await page.waitForTimeout(5000); 
                } catch (e) {
                    logError("Could not load homepage, continuing...", e);
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
                        log(`Response Status: ${response.status()}`);
                        if (response.status() !== 200) {
                            log(`Page Content: ${await page.content()}`);
                        }
                     }
                 } catch (e) {
                     // Sometimes direct download URLs cause navigation errors in Playwright, which is expected
                     console.log('Navigation might have been aborted by download (expected for direct links).');
                 }
            }

            log('Waiting for download...');
            const download = await downloadPromise;
            
            const originalName = download.suggestedFilename();
            const savePath = path.join(this.downloadPath, originalName);
            
            log(`Downloading ${originalName}...`);
            await download.saveAs(savePath);
            
            log(`Saved to: ${savePath}`);
            return savePath;

        } catch (error) {
            logError('Error during scraping:', error);
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
                log('File is not a zip file, skipping extraction.');
                return null;
            }

            const fileName = path.basename(filePath, '.zip');
            const extractPath = path.join(path.dirname(filePath), fileName);

            log(`Extracting ${filePath} to ${extractPath}...`);
            
            const zip = new AdmZip(filePath);
            zip.extractAllTo(extractPath, true); // overwrite = true

            log(`Extraction complete.`);
            return extractPath;
        } catch (error) {
            logError('Error during extraction:', error);
            return null;
        }
    }

    /**
     * Navigates to a page, searches for a link containing the fileName, and downloads it.
     * @param pageUrl URL to search on
     * @param fileNamePattern Substring to look for in href or text
     */
    /**
     * Navigates to a page, searches for a link containing the fileName, and downloads it.
     * @param pageUrl URL to search on
     * @param fileNamePattern Substring to look for in href or text
     */
    async findLinkAndDownload(pageUrl: string, fileNamePattern: string): Promise<string | null> {
        if (!this.browser || !this.page) await this.launch();
        const page = this.page!;

        try {
            log(`Navigating to ${pageUrl}...`);
            await page.goto(pageUrl, { waitUntil: 'commit', timeout: 30000 });
            await page.waitForTimeout(5000); // Wait for dynamic content

            log(`Searching for link containing: ${fileNamePattern}`);

            // Find link where href contains pattern or text contains pattern
            // We use a locator with filter
            const link = page.locator('a').filter({ hasText: fileNamePattern }).first();
            const hrefLink = page.locator(`a[href*="${fileNamePattern}"]`).first();

            let targetLocator = null;
            if (await link.count() > 0 && await link.isVisible()) {
                log('Found link by text.');
                targetLocator = link;
            } else if (await hrefLink.count() > 0) {
                 log('Found link by href.');
                 targetLocator = hrefLink;
            } else {
                log('File link not found on page.');
                
                // DEBUG: Log all zip links found to help diagnose
                try {
                    const allZips = await page.evaluate(() => {
                        return Array.from(document.querySelectorAll('a'))
                            .map(a => a.href)
                            .filter(h => h.includes('.zip'));
                    });
                    log(`DEBUG: Available .zip links on page: ${JSON.stringify(allZips, null, 2)}`);
                } catch (e) {
                    log('DEBUG: Failed to list links');
                }

                return null;
            }

            // Download Strategy:
            // 1. Try to get href from the locator
            const href = await targetLocator.getAttribute('href');

            // Setup download
            // Note: Since we are reusing the page, we handle the event carefully
            const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
            
            if (href) {
                log(`Navigating directly to download link: ${href}`);
                const downloadUrl = href.startsWith('http') ? href : new URL(href, pageUrl).toString();
                
                try {
                     await page.goto(downloadUrl, { timeout: 30000 });
                } catch (e) {
                    log('Navigation for download triggered (expected).');
                }
            } else {
                 log('No href found, trying force click...');
                 await targetLocator.click({ force: true });
            }

            const download = await downloadPromise;
            const originalName = download.suggestedFilename();
            const savePath = path.join(this.downloadPath, originalName);
            
            log(`Downloading ${originalName}...`);
            await download.saveAs(savePath);
            
            return savePath;

        } catch (error) {
            logError(`Error in findLinkAndDownload: ${error}`);
            return null;
        }
        // Do NOT close page/context here, as we reuse it
    }

    /**
     * Gets the download path directory.
     */
    getDownloadPath(): string {
        return this.downloadPath;
    }

    /**
     * Downloads a file directly from a URL using the active page and browser context.
     * Useful for range scraping without having to reload the browser for each request.
     * @param url Direct download URL
     */
    async downloadDirectFile(url: string): Promise<string | null> {
        if (!this.browser || !this.page) await this.launch();
        const page = this.page!;

        try {
            log(`Downloading direct file from URL: ${url}`);
            
            const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
            
            try {
                await page.goto(url, { timeout: 45000 });
            } catch (e) {
                // Direct downloads usually abort the navigation, which throws an error in Playwright.
                // We catch it and proceed since the download event is still triggered.
                log('Direct download navigation completed or aborted (expected).');
            }
            
            const download = await downloadPromise;
            const originalName = download.suggestedFilename();
            const savePath = path.join(this.downloadPath, originalName);
            
            log(`Downloading ${originalName}...`);
            await download.saveAs(savePath);
            log(`Successfully saved to: ${savePath}`);
            
            return savePath;
        } catch (error) {
            logError(`Error in downloadDirectFile: ${error}`);
            return null;
        }
    }
}
