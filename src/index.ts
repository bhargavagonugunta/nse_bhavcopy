import { FileScraper } from './scraper';
import { EmailService } from './email';
import { log, error as logError } from './logger';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { format, parseISO, isValid, isWeekend, addDays, isBefore, isEqual } from 'date-fns';
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

// Format Date DDMMYYYY
const getDDMMYYYYDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${dd}${mm}${yyyy}`;
};

// Format Date DD-MMM-YYYY (e.g. 19-Jun-2026)
const getDDMMMYYYYDate = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mmm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd}-${mmm}-${yyyy}`;
};

// Get Yesterday's Date Formatted YYYYMMDD
const getYesterdaysFormattedDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return getFormattedDate(date);
};

// Retry interval: 30 minutes
const RETRY_INTERVAL_MS = 30 * 60 * 1000; 

async function runScheduler() {
    const today = new Date();
    if (isWeekend(today)) {
        log(`[Scheduler] Today is a weekend (${format(today, 'EEEE')}). Skipping daily scheduled workflow.`);
        return;
    }

    const scraper = new FileScraper();
    const emailService = new EmailService();
    
    // Determine Target Date (Today)
    const todayStr = getFormattedDate(today);
    const todayDDMMYYYY = getDDMMYYYYDate(today);
    const todayDDMMMYYYY = getDDMMMYYYYDate(today);
    log(`[Scheduler] Starting workflow for date: ${todayStr}`);

    // Define Tasks (including MWPL)
    const tasks = [
        {
            name: "Capital Market (CM)",
            pageUrl: "https://www.nseindia.com/all-reports",
            fileNamePattern: `BhavCopy_NSE_CM_0_0_0_${todayStr}_F_0000.csv.zip`
        },
        {
            name: "Security-wise Bhavdata",
            directUrl: `https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_${todayDDMMYYYY}.csv`,
            fileNamePattern: `sec_bhavdata_full_${todayDDMMYYYY}.csv`
        },
        {
            name: "FAO Participant OI",
            directUrl: `https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_${todayDDMMYYYY}.csv`,
            fileNamePattern: `fao_participant_oi_${todayDDMMYYYY}.csv`
        },
        {
            name: "FII Stats",
            directUrl: `https://nsearchives.nseindia.com/content/fo/fii_stats_${todayDDMMMYYYY}.xls`,
            fileNamePattern: `fii_stats_${todayDDMMMYYYY}.xls`
        },
        {
            name: "Derivatives (FO)",
            pageUrl: "https://www.nseindia.com/all-reports-derivatives",
            fileNamePattern: `BhavCopy_NSE_FO_0_0_0_${todayStr}_F_0000.csv.zip`
        },
        {
            name: "Market Wide Position Limit (MWPL)",
            directUrl: `https://nsearchives.nseindia.com/archives/nsccl/mwpl/combineoi_deleq_${todayDDMMYYYY}.csv`,
            fileNamePattern: `combineoi_deleq_${todayDDMMYYYY}.csv`
        }
    ];

    // Track completion and files
    let completedTasks = new Set<string>();
    let collectedAttachments: string[] = [];
    let attempts = 0;
    const maxAttempts = 6; // Limit to 6 retries (approx 3 hours) to prevent infinite loops on holidays

    try {
        await scraper.launch();

        while (completedTasks.size < tasks.length && attempts < maxAttempts) {
            attempts++;
            log(`[Scheduler] Checking for files... Attempt ${attempts}/${maxAttempts} (Completed: ${completedTasks.size}/${tasks.length})`);

            for (const task of tasks) {
                if (completedTasks.has(task.name)) continue;

                log(`[Scheduler] Checking ${task.name}...`);
                const downloadedFile = task.directUrl
                    ? await scraper.downloadDirectFile(task.directUrl)
                    : await scraper.findLinkAndDownload(task?.pageUrl!, task.fileNamePattern);

                if (downloadedFile) {
                    log(`[Scheduler] Success! Downloaded: ${downloadedFile}`);
                    
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
                            logError('Error finding extracted CSV:', e);
                        }
                    }
                    
                    collectedAttachments.push(attachmentPath);
                    completedTasks.add(task.name);
                } else {
                    log(`[Scheduler] File ${task.fileNamePattern} not found yet.`);
                }
            }

            if (completedTasks.size < tasks.length && attempts < maxAttempts) {
                log(`[Scheduler] Not all files found. Waiting 30 minutes before retry...`);
                await scraper.close();
                await delay(RETRY_INTERVAL_MS);
                await scraper.launch();
            }
        }

        const totalTasks = tasks.length;
        const succeededCount = completedTasks.size;
        
        log(`[Scheduler] Scraping completed. Success rate: ${succeededCount}/${totalTasks}. Preparing email...`);
        const toEmail = process.env.SMTP_TO || 'recipient@example.com';
        
        let subject = "";
        let customMessage = "";
        
        if (succeededCount === totalTasks) {
            subject = `[SUCCESS] NSE Reports For ${todayStr}`;
            customMessage = `All scheduled NSE reports for ${todayStr} have been successfully scraped.\n\n` +
                            `Attached Reports (${collectedAttachments.length}):\n` + 
                            tasks.map(t => `- ${t.name}`).join('\n');
        } else if (succeededCount > 0) {
            subject = `[PARTIAL SUCCESS] NSE Reports For ${todayStr} (${succeededCount}/${totalTasks} retrieved)`;
            const successfulTasksList = Array.from(completedTasks).map(name => `- ${name} (Success)`).join('\n');
            const failedTasksList = tasks.filter(t => !completedTasks.has(t.name)).map(t => `- ${t.name} (Missing/Failed)`).join('\n');
            customMessage = `Daily NSE reports scraping completed with partial results after ${attempts} attempts.\n\n` +
                            `Successful:\n${successfulTasksList}\n\n` +
                            `Missing/Failed:\n${failedTasksList}\n\n` +
                            `The successfully retrieved reports are attached.`;
        } else {
            subject = `[FAILED/HOLIDAY] NSE Reports For ${todayStr}`;
            customMessage = `No NSE reports could be retrieved for ${todayStr} after ${attempts} attempts.\n\n` +
                            `This is likely due to a market holiday or connection issues.\n\n` +
                            `List of expected files:\n` +
                            tasks.map(t => `- ${t.name}`).join('\n');
        }
        
        await emailService.sendEmailWithAttachments(toEmail, subject, customMessage, collectedAttachments);
        log('[Scheduler] Workflow email sent successfully.');

    } catch (error) {
        logError('[Scheduler] Fatal error:', error);
    } finally {
        await scraper.close();
    }
}

async function runRangeScraper(fromDate: Date, toDate: Date) {
    const scraper = new FileScraper();
    
    log(`[Range Scraper] Starting scraper from ${format(fromDate, 'yyyy-MM-dd')} to ${format(toDate, 'yyyy-MM-dd')}...`);
    
    try {
        await scraper.launch();
        
        let currentDate = fromDate;
        
        while (isBefore(currentDate, toDate) || isEqual(currentDate, toDate)) {
            if (isWeekend(currentDate)) {
                log(`[Range Scraper] Skipping weekend: ${format(currentDate, 'yyyy-MM-dd')}`);
                currentDate = addDays(currentDate, 1);
                continue;
            }
            
            const dateStr = getFormattedDate(currentDate);
            const dateDDMMYYYY = getDDMMYYYYDate(currentDate);
            const dateDDMMMYYYY = getDDMMMYYYYDate(currentDate);
            log(`[Range Scraper] Processing date: ${dateStr}...`);
            
            const tasks = [
                {
                    name: "Capital Market (CM)",
                    url: `https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${dateStr}_F_0000.csv.zip`,
                    fileName: `BhavCopy_NSE_CM_0_0_0_${dateStr}_F_0000.csv.zip`
                },
                {
                    name: "Security-wise Bhavdata (Sec Bhavdata)",
                    url: `https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_${dateDDMMYYYY}.csv`,
                    fileName: `sec_bhavdata_full_${dateDDMMYYYY}.csv`
                },
                {
                    name: "FAO Participant OI",
                    url: `https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_${dateDDMMYYYY}.csv`,
                    fileName: `fao_participant_oi_${dateDDMMYYYY}.csv`
                },
                {
                    name: "FII Stats",
                    url: `https://nsearchives.nseindia.com/content/fo/fii_stats_${dateDDMMMYYYY}.xls`,
                    fileName: `fii_stats_${dateDDMMMYYYY}.xls`
                },
                {
                    name: "Derivatives (FO)",
                    url: `https://nsearchives.nseindia.com/content/fo/BhavCopy_NSE_FO_0_0_0_${dateStr}_F_0000.csv.zip`,
                    fileName: `BhavCopy_NSE_FO_0_0_0_${dateStr}_F_0000.csv.zip`
                },
                {
                    name: "Market Wide Position Limit (MWPL)",
                    url: `https://nsearchives.nseindia.com/archives/nsccl/mwpl/combineoi_deleq_${dateDDMMYYYY}.csv`,
                    fileName: `combineoi_deleq_${dateDDMMYYYY}.csv`
                }
            ];
            
            for (const task of tasks) {
                const targetFilePath = path.join(scraper.getDownloadPath(), task.fileName);
                if (fs.existsSync(targetFilePath)) {
                    log(`[Range Scraper] [SKIP] File already exists: ${task.fileName}`);
                    continue;
                }
                
                log(`[Range Scraper] Downloading ${task.name} BhavCopy for ${dateStr}...`);
                const downloadedFile = await scraper.downloadDirectFile(task.url);
                if (downloadedFile) {
                    log(`[Range Scraper] Success! Downloaded: ${downloadedFile}`);
                    
                    // Unzip
                    const extractedPath = await scraper.unzipFile(downloadedFile);
                    if (extractedPath) {
                        log(`[Range Scraper] Extracted to: ${extractedPath}`);
                    }
                } else {
                    log(`[Range Scraper] File ${task.fileName} not found or failed to download.`);
                }
            }
            
            // Respectful delay to avoid rate limit/blocking
            await delay(1000);
            
            currentDate = addDays(currentDate, 1);
        }
        
    } finally {
        await scraper.close();
    }
}

// Parse arguments
const args = process.argv.slice(2);
let fromArg: string | undefined;
let toArg: string | undefined;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from' && args[i + 1]) {
        fromArg = args[i + 1];
    } else if (args[i] === '--to' && args[i + 1]) {
        toArg = args[i + 1];
    }
}

const fromDateStr = fromArg || process.env.FROM_DATE;
const toDateStr = toArg || process.env.TO_DATE;

if (fromDateStr && toDateStr) {
    const fromDate = parseISO(fromDateStr);
    const toDate = parseISO(toDateStr);

    if (!isValid(fromDate) || !isValid(toDate)) {
        logError(`[Range Scraper] Invalid dates provided: ${fromDateStr}, ${toDateStr}. Please use YYYY-MM-DD format.`);
        process.exit(1);
    }

    if (fromDate > toDate) {
        logError(`[Range Scraper] Start date (${fromDateStr}) must be before or equal to End date (${toDateStr}).`);
        process.exit(1);
    }

    runRangeScraper(fromDate, toDate)
        .then(() => {
            log('[Range Scraper] Completed range scraping successfully.');
            process.exit(0);
        })
        .catch((err) => {
            logError('[Range Scraper] Fatal error during range scraping:', err);
            process.exit(1);
        });
} else {
    // Schedule: 7:30 PM IST (19:30)
    // Cron expression for 19:30 every Mon-Fri: '30 19 * * 1-5'
    // IST is UTC+5:30. The node-cron library usually uses server time.
    // If the Docker container time is UTC, we need 14:00.
    // If Docker container time is IST (not guaranteed), we use 19:30.
    // BEST PRACTICE: Use a timezone aware cron or assume UTC.
    // The user asked for "7:30 evening" (IST presumably).
    // 19:30 IST = 14:00 UTC.
    // Let's use the 'timezone' option of node-cron for clarity if possible, or just log the time.
    log('[App] Initializing NSE Bhavcopy Scheduler...');
    log('[App] Scheduled to run at 19:30 IST (Asia/Kolkata) Mon-Fri.');

    // Schedule to run at 19:30 IST (Asia/Kolkata timezone)
    cron.schedule('30 19 * * 1-5', () => {
        log(`[Cron] Triggering scheduled job at ${new Date().toISOString()}`);
        runScheduler();
    }, {
        timezone: "Asia/Kolkata"
    });

    // Use this for testing/immediate run if env var is set
    if (process.env.RUN_IMMEDIATELY === 'true') {
        log('[App] RUN_IMMEDIATELY set. Running once now...');
        runScheduler();
    } else {
        log('[App] Waiting for next scheduled run...');
    }
}
