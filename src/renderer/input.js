import EventEmitter from 'events';

class Input {
  constructor(name) {
    this.InputEvent = new EventEmitter();
    this.name = name;
    this.initListeners();
  }

  emitInput(key) {
    switch (key) {
      case '1':
        this.InputEvent.emit('one');
        break;
      case '2':
        this.InputEvent.emit('two');
        break;
      case '3':
        this.InputEvent.emit('three');
        break;
      case '4':
        this.InputEvent.emit('four');
        break;
      case 'Escape':
        this.InputEvent.emit('back');
        break;
      default:
        break;
    }
  }

  initListeners() {
    window.electron.ipcRenderer.on(this.name, (key) => {
      // eslint-disable-next-line no-console
      console.log(key);

      switch (key) {
        case 'connected':
          this.InputEvent.emit('connected');
          break;
        case 'disconnected':
          this.InputEvent.emit('disconnected');
          break;
        default:
          this.emitInput(key);
          break;
      }
    });

    window.electron.ipcRenderer.sendMessage('one', 'ready');

    // Check for keyboard input
    document.addEventListener('keydown', (event) => {
      this.emitInput(event.key);
    });
  }
}

export default Input;
