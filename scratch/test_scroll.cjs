const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testScroll() {
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    'http://127.0.0.1:5173/09_kodari_study_room/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const webSocketUrl = tabs[0]?.webSocketDebuggerUrl;
        console.log('WS URL:', webSocketUrl);
        if (!webSocketUrl) {
          chromeProcess.kill();
          return;
        }

        const WebSocket = require('ws'); // ws check
      } catch (err) {
        console.log('Error or no ws module:', err.message);
        chromeProcess.kill();
      }
    });
  }).on('error', (e) => {
    console.error('HTTP error:', e.message);
    chromeProcess.kill();
  });
}

testScroll();
