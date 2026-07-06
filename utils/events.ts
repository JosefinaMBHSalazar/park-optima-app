type EventListener = (...args: any[]) => void;

type EventMap = {
  logout: [];
};

class EventEmitter {
  private listeners: Map<keyof EventMap, EventListener[]> = new Map();

  addListener<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener as EventListener);
    
    return () => {
      const currentListeners = this.listeners.get(event);
      if (currentListeners) {
        this.listeners.set(
          event,
          currentListeners.filter(l => l !== listener)
        );
      }
    };
  }

  emit<K extends keyof EventMap>(
    event: K,
    ...args: EventMap[K]
  ): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  clearListeners(event: keyof EventMap): void {
    this.listeners.delete(event);
  }

  clearAllListeners(): void {
    this.listeners.clear();
  }

  listenerCount(event: keyof EventMap): number {
    return this.listeners.get(event)?.length || 0;
  }
}

export const events = new EventEmitter();

export const logoutEvents = {
  addListener: (listener: () => void) => events.addListener('logout', listener),
  emit: () => events.emit('logout'),
};