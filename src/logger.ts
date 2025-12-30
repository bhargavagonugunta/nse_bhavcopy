export const log = (message: string, ...args: any[]) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    console.log(`[${timestamp}] ${message}`, ...args);
};

export const error = (message: string, ...args: any[]) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    console.error(`[${timestamp}] ERROR: ${message}`, ...args);
};
