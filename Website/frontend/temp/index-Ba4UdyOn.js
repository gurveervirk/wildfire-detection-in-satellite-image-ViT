import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#root');

const captureButton = document.getElementById('capture-button');
const screenshotCanvas = document.getElementById('screenshot-canvas');

captureButton.addEventListener('click', async () => {
  const screenshotTarget = document.body;
  const canvas = await html2canvas(screenshotTarget);
  const base64image = canvas.toDataURL("image/png");
  const a = document.createElement('a');
  a.href = base64image;
  a.download = 'screenshot.png';
  a.click();
});
