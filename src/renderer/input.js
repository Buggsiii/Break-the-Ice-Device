import EventEmitter from 'events';

const InputEvent = new EventEmitter();

function emitInput(key) {
  switch (key) {
    case '1':
      InputEvent.emit('one');
      break;
    case '2':
      InputEvent.emit('two');
      break;
    case '3':
      InputEvent.emit('three');
      break;
    case '4':
      InputEvent.emit('four');
      break;
    case 'Escape':
      InputEvent.emit('back');
      break;
    default:
      break;
  }
}

// Check for keyboard input
document.addEventListener('keydown', (event) => {
  emitInput(event.key);
});

export default InputEvent;
