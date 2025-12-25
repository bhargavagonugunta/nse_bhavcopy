import { FileScraper } from './scraper';
import { EmailService } from './email';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Format Date YYYYMMDD
const getFormattedDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
};

// Retry interval: 30 minutes
const RETRY_INTERVAL_MS = 30 * 60 * 1000; 

async function runScheduler() {
    const scraper = new FileScraper();
    const emailService = new EmailService();
    
    // Determine Target Date (Today)
    const todayStr = getFormattedDate(new Date());
    console.log(`[Scheduler] Starting workflow for date: ${todayStr}`);

    // Define Tasks
    const tasks = [
        {
            name: "Capital Market (CM)",
            pageUrl: "https://www.nseindia.com/all-reports",
            fileNamePattern: `BhavCopy_NSE_CM_0_0_0_${todayStr}_F_0000.csv.zip`
        },
        {
            name: "Derivatives (FO)",
            pageUrl: "https://www.nseindia.com/all-reports-derivatives",
            fileNamePattern: `BhavCopy_NSE_FO_0_0_0_${todayStr}_F_0000.csv.zip`
        }
    ];

    // Track completion and files
    let completedTasks = new Set<string>();
    let collectedAttachments: string[] = [];

    try {
        await scraper.launch();

        // Infinite loop (or until success/stop condition)
        while (completedTasks.size < tasks.length) {
            console.log(`[Scheduler] Checking for files... (Completed: ${completedTasks.size}/${tasks.length})`);

            for (const task of tasks) {
                if (completedTasks.has(task.name)) continue;

                console.log(`[Scheduler] Checking ${task.name}...`);
                const downloadedFile = await scraper.findLinkAndDownload(task.pageUrl, task.fileNamePattern);

                if (downloadedFile) {
                    console.log(`[Scheduler] Success! Downloaded: ${downloadedFile}`);
                    
                    // Unzip
                    const extractedPath = await scraper.unzipFile(downloadedFile);
                    let attachmentPath = downloadedFile; // Default to zip
                    
                    if (extractedPath) {
                        try {
                            const files = fs.readdirSync(extractedPath);
                            const csvFile = files.find(f => f.endsWith('.csv'));
                            if (csvFile) {
                                attachmentPath = path.join(extractedPath, csvFile);
                            }
                        } catch (e) {
                            console.error('Error finding extracted CSV:', e);
                        }
                    }
                    
                    collectedAttachments.push(attachmentPath);
                    completedTasks.add(task.name);
                } else {
                    console.log(`[Scheduler] File ${task.fileNamePattern} not found yet.`);
                }
            }

            if (completedTasks.size < tasks.length) {
                console.log(`[Scheduler] Not all files found. Waiting 30 minutes before retry...`);
                await scraper.close();
                await delay(RETRY_INTERVAL_MS);
                await scraper.launch();
            }
        }
        
        console.log('[Scheduler] All tasks completed. Sending batch email...');
        const toEmail = process.env.SMTP_TO || 'recipient@example.com';
        const subject = `NSE Reports For ${todayStr} (${collectedAttachments.length} items)`;
        const customMessage = `Processing Date: ${todayStr}\n\nAttached Reports:\n` + 
                            tasks.map(t => `- ${t.name}`).join('\n');
        
        await emailService.sendEmailWithAttachments(toEmail, subject, customMessage, collectedAttachments);
        
        console.log('[Scheduler] Workflow completed successfully.');

    } catch (error) {
        console.error('[Scheduler] Fatal error:', error);
    } finally {
        await scraper.close();
    }
}

// Schedule: 7:30 PM IST (19:30)
// Cron expression for 19:30 every Mon-Fri: '30 19 * * 1-5'
// IST is UTC+5:30. The node-cron library usually uses server time.
// If the Docker container time is UTC, we need 14:00.
// If Docker container time is IST (not guaranteed), we use 19:30.
// BEST PRACTICE: Use a timezone aware cron or assume UTC.
// The user asked for "7:30 evening" (IST presumably).
// 19:30 IST = 14:00 UTC.
// Let's use the 'timezone' option of node-cron for clarity if possible, or just log the time.
console.log('[App] Initializing NSE Bhavcopy Scheduler...');
console.log('[App] Scheduled to run at 19:30 IST (Asia/Kolkata) Mon-Fri.');

// Schedule to run at 19:30 IST (Asia/Kolkata timezone)
cron.schedule('00 20 * * 1-5', () => {
    console.log(`[Cron] Triggering scheduled job at ${new Date().toISOString()}`);
    runScheduler();
}, {
    timezone: "Asia/Kolkata"
});

// Use this for testing/immediate run if env var is set
if (process.env.RUN_IMMEDIATELY === 'true') {
    console.log('[App] RUN_IMMEDIATELY set. Running once now...');
    runScheduler();
} else {
    console.log('[App] Waiting for next scheduled run...');
}
