/**
 * MEMENTO PATTERN
 * Salvează și restaurează starea de configurare a PC-ului,
 * permițând utilizatorului acțiuni de Undo și Redo.
 */

export class PCConfigMemento {
  constructor(state) {
    this.state = JSON.stringify(state);
  }

  getState() {
    return JSON.parse(this.state);
  }
}

export class PCConfigCaretaker {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }

  save(state) {
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    if (this.history.length > 0) {
      const lastState = this.history[this.history.length - 1].getState();
      if (lastState.cpu === state.cpu && lastState.ram === state.ram && lastState.gpu === state.gpu) {
        return; 
      }
    }

    this.history.push(new PCConfigMemento(state));
    this.currentIndex = this.history.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      this.currentIndex--;
      return this.history[this.currentIndex].getState();
    }
    return null;
  }

  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      return this.history[this.currentIndex].getState();
    }
    return null;
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}
