
import * as fs from 'fs';
import * as path from 'path';
import { format, addDays, isWeekend, startOfDay, isBefore, isEqual } from 'date-fns';

const USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5392.175 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.4.263.6 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5367.208 Safari/537.36',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5387.128 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.361675786808',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.361675786823',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.120 Safari/537.36',
];

const REFERERS = [
    "https://www.nseindia.com/all-reports"
];

class MWPLScraper {
    private downloadDir: string;

    constructor() {
        this.downloadDir = path.resolve(process.cwd(), 'downloads', 'mwpl');
        if (!fs.existsSync(this.downloadDir)) {
            fs.mkdirSync(this.downloadDir, { recursive: true });
        }
    }

    private getRandomHeaders(): HeadersInit {
        return {
            "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Referer": REFERERS[Math.floor(Math.random() * REFERERS.length)],
        };
    }

    private async downloadFile(date: Date): Promise<void> {
        const dateStr = format(date, 'ddMMyyyy');
        const fileName = `combineoi_deleq_${dateStr}.csv`;
        const url = `https://nsearchives.nseindia.com/archives/nsccl/mwpl/${fileName}`;
        const filePath = path.join(this.downloadDir, fileName);

        if (fs.existsSync(filePath)) {
            console.log(`[SKIP] File already exists: ${fileName}`);
            return;
        }

        let retries = 0;
        const maxRetries = 5;

        console.log(`[INFO] Attempting to download: ${fileName}`);

        while (retries < maxRetries) {
            try {
                const response = await fetch(url, {
                    headers: this.getRandomHeaders()
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`[WARN] File not found (404): ${fileName}`);
                        return;
                    }
                    throw new Error(`HTTP status ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("text/html")) {
                    console.log(`[WARN] NSE file ${fileName} not available (returned HTML).`);
                    return; // Stop retrying for this file
                }

                const buffer = await response.arrayBuffer();
                fs.writeFileSync(filePath, Buffer.from(buffer));
                console.log(`[SUCCESS] Downloaded: ${fileName}`);
                return;

            } catch (error) {
                console.error(`[ERROR] Failed to download ${fileName} (Attempt ${retries + 1}/${maxRetries}):`, error);
                retries++;
                const delay = retries * 1000;
                await new Promise(res => setTimeout(res, delay));
            }
        }
        console.error(`[FAIL] Could not download ${fileName} after ${maxRetries} attempts.`);
    }

    public async run() {
        // Start date: September 15, 2025
        let currentDate = new Date(2025, 9, 1); // Month is 0-indexed (8 is Sept)
        // End date: Current Date (User specified "to now")
        const endDate = new Date(); 

        while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
            if (!isWeekend(currentDate)) {
                await this.downloadFile(currentDate);
                // Respectful delay between files
                await new Promise(res => setTimeout(res, 500));
            }
            currentDate = addDays(currentDate, 1);
        }
        console.log("All complete.");
    }
}

// Execute if run directly
if (require.main === module) {
    const scraper = new MWPLScraper();
    scraper.run().catch(console.error);
}
