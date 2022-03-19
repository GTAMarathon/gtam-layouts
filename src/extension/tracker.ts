/* import needle from 'needle'; */



/* // Get donation total from HTTPS API, backup for the repeater socket server.
// We need to add both events together to get the correct total.
async function updateDontationTotalFromAPI(): Promise<void> {
  try {
    const resp = await needle('get', statsURL);
    if (resp.statusCode !== 200) {
      throw new Error(JSON.stringify(resp.body));
    }
    const total = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
    if (donationTotal.value !== total) {
      nodecg.log.info(`API donation total changed: $${total}`);
    }
    donationTotal.value = total;
  } catch (err) {
    nodecg.log.info('Issue getting API donation total:', err);
  }
}

// Getting the initial donation total on startup.
updateDontationTotalFromAPI();
setInterval(updateDontationTotalFromAPI, 60000); // Also do this every 60s as a socket fallback.

repeater.on('connect', () => nodecg.log.info('Connected to repeater server:', repeaterURL));
repeater.on('connect_error', (err: Error) => nodecg.log.warn('Repeater connect_error:', err));
repeater.on('disconnect', () => nodecg.log.warn('Disconnected from repeater'));
repeater.on('error', (err: Error) => nodecg.log.warn('Repeater error:', err));

// Triggered when a new donation that can be shown on stream is received.
repeater.on('donation', (data: { event: string; id: string }) => {
  if (data.event === eventShort) {
    nodecg.log.info(`Received new donation with ID ${data.id}`);
    nodecg.sendMessage('newDonation', data);
  }
});

// Triggered when the updated donation total is received.
repeater.on('total', (data: { event: string; new_total: string }) => {
  if (data.event === eventShort) {
    donationTotal.value = parseFloat(data.new_total);
  }
  nodecg.log.info(`Updated donation total received: $${parseFloat(data.new_total).toFixed(2)}`);
}); */
