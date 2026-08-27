import { TacticalEvent } from '../types/widget';

type EventHandler = (event: TacticalEvent) => void;

class TacticalEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private history: TacticalEvent[] = [];
  private readonly MAX_HISTORY = 100;

  public subscribe(channel: string, handler: EventHandler): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(handler);

    // Return unbind function
    return () => {
      const channelListeners = this.listeners.get(channel);
      if (channelListeners) {
        channelListeners.delete(handler);
        if (channelListeners.size === 0) {
          this.listeners.delete(channel);
        }
      }
    };
  }

  public publish(
    channel: string,
    eventData: {
      severity?: TacticalEvent['severity'];
      title: string;
      sourceWidgetId?: string;
      payload?: Record<string, any>;
    }
  ): TacticalEvent {
    const event: TacticalEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      channel,
      severity: eventData.severity || 'info',
      sourceWidgetId: eventData.sourceWidgetId || 'system',
      title: eventData.title,
      payload: eventData.payload || {},
    };

    this.history.unshift(event);
    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop();
    }

    // Direct channel listeners
    const channelListeners = this.listeners.get(channel);
    if (channelListeners) {
      channelListeners.forEach((handler) => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error in event handler for channel ${channel}:`, err);
        }
      });
    }

    // Wildcard channel listeners '*'
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((handler) => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error in wildcard event handler:`, err);
        }
      });
    }

    return event;
  }

  public getHistory(limit = 50): TacticalEvent[] {
    return this.history.slice(0, limit);
  }

  public clearHistory(): void {
    this.history = [];
  }
}

export const eventBus = new TacticalEventBus();
