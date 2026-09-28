const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9226',
  'https://thot168190.github.io/09_kodari_study_room/'
]);

setTimeout(async () => {
  http.get('http://127.0.0.1:9226/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const target = tabs.find(t => t.type === 'page' && t.url.includes('09_kodari_study_room'));
      console.log('TARGET:', target);
      if (!target) {
        chrome.kill();
        return;
      }

      // Read errors via DevTools HTTP evaluate if possible or ws
      const wsUrl = target.webSocketDebuggerUrl;
      const WebSocket = require('node:http'); // raw check
      console.log('Debugger URL:', wsUrl);
      chrome.kill();
    });
  }).on('error', e => {
    console.error(e);
    chrome.kill();
  });
}, 3000);
