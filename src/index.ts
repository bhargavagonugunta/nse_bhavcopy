import { FileScraper } from './scraper';

(async () => {
    // Example usage
    const scraper = new FileScraper();
    const targetUrl = process.env.TARGET_URL || 'https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_20251223_F_0000.csv.zip'; 
    const triggerSelector = process.env.TRIGGER_SELECTOR || '';

    try {
        await scraper.launch();
        const filePath = await scraper.scrapeFile(targetUrl, triggerSelector);
        
        if (filePath) {
            console.log('Success! File downloaded to:', filePath);
            
            // Check if it's a zip and extract
            if (filePath.endsWith('.zip')) {
                const extractPath = await scraper.unzipFile(filePath);
                if (extractPath) {
                    console.log('File unzipped to:', extractPath);
                }
            }
        } else {
            console.log('Failed to download file.');
        }
    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        await scraper.close();
    }
})();
