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
        this.InputEvent.emit('one', 0);
        break;
      case '2':
        this.InputEvent.emit('two', 1);
        break;
      case '3':
        this.InputEvent.emit('three', 2);
        break;
      case '4':
        this.InputEvent.emit('four', 3);
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
          this.InputEvent.emit('any');
          break;
      }
    });

    window.electron.ipcRenderer.sendMessage(this.name, 'ready');

    // Check for keyboard input
    let lastKey;
    document.addEventListener('keydown', (event) => {
      if (
        event.key !== '1' &&
        event.key !== '2' &&
        event.key !== '3' &&
        event.key !== '4' &&
        event.key !== 'Escape'
      )
        return;

      if (event.key === lastKey) return;
      lastKey = event.key;

      this.emitInput(event.key);
      if (event.key === 'Escape') return;
      this.InputEvent.emit('any', parseInt(event.key));
    });
    document.addEventListener('keyup', () => (lastKey = null));
  }
}

export default Input;
