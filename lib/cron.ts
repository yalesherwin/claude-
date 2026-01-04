import cron from 'node-cron';

export function startLotteryCron() {
  // Run at 7:00 AM China time (UTC+8)
  // In UTC time, that's 11:00 PM (23:00) the previous day
  // Cron format: minute hour day month weekday
  // '0 23 * * *' means every day at 23:00 UTC

  const cronExpression = '0 23 * * *'; // 7 AM China Time (UTC+8)

  console.log('Setting up lottery cron job for 7:00 AM China time (23:00 UTC)');

  cron.schedule(cronExpression, async () => {
    console.log('Running daily lottery draw...');

    try {
      const apiKey = process.env.CRON_API_KEY || 'your-secret-cron-key';
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/lottery/draw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Lottery draw completed successfully:', result);
      } else {
        console.error('Lottery draw failed:', result);
      }
    } catch (error) {
      console.error('Error running lottery draw:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Shanghai',
  });

  console.log('Lottery cron job started successfully');
}
