import { startLotteryCron } from './cron';

let initialized = false;

export function initializeApp() {
  if (initialized) {
    return;
  }

  console.log('Initializing application...');

  // Start the lottery cron job
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
    startLotteryCron();
  } else {
    console.log('Cron job disabled in development. Set ENABLE_CRON=true to enable.');
  }

  initialized = true;
  console.log('Application initialized successfully');
}
