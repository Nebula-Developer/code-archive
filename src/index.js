const { ipcRenderer } = require('electron');

ipcRenderer.on('toggle-visibility', (event, value) => {
    document.body.classList.toggle('visible', value);
});

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.emit('get-visibility');
    console.log('a');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.emit('toggle-visibility', false);
    } else if (e.key == 'Enter') {
        document.body.classList.toggle('handler');
    }
});
