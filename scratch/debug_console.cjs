const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9225',
  'https://thot168190.github.io/09_kodari_study_room/'
]);

async function check() {
  await new Promise(r => setTimeout(r, 2500));
  http.get('http://127.0.0.1:9225/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const pages = JSON.parse(d);
        const p = pages.find(x => x.type === 'page');
        console.log('PAGE URL:', p?.url);
        console.log('WS URL:', p?.webSocketDebuggerUrl);
      } catch (e) {
        console.error(e);
      }
      chrome.kill();
    });
  }).on('error', e => {
    console.error('HTTP err:', e.message);
    chrome.kill();
  });
}

check();
