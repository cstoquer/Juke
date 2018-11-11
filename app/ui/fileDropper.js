function setdroppable(element, handlers) {
  handlers = handlers || {};

  element.addEventListener('dragover', function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, false);

  element.addEventListener('dragenter', function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handlers.enter && handlers.enter(e);
  }, false);

  element.addEventListener('dragleave', function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handlers.leave && handlers.leave(e);
  }, false);

  element.addEventListener('drop', function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    handlers.leave && handlers.leave(e);
    handlers.drop && handlers.drop(e);
  }, false);
}

exports.setdroppable = setdroppable;

setdroppable(document); // disable default droppable behavior.
