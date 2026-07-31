export type EventListener<Args extends unknown[]> = (...args: Args) => void;
export type Unsubscribe = () => void;

export class EventEmitter<
	Events extends Record<keyof Events, unknown[]>
> {
	private readonly listeners = new Map<keyof Events, Set<unknown>>();

	private getListeners<K extends keyof Events>(
		event: K
	): Set<EventListener<Events[K]>> | undefined {
		return this.listeners.get(event) as
			| Set<EventListener<Events[K]>>
			| undefined;
	}

	on<K extends keyof Events>(
		event: K,
		listener: EventListener<Events[K]>
	): Unsubscribe {
		let eventListeners = this.getListeners(event);

		if (!eventListeners) {
			eventListeners = new Set();
			this.listeners.set(event, eventListeners);
		}

		eventListeners.add(listener);

		return () => {
			this.off(event, listener);
		};
	}

	once<K extends keyof Events>(
		event: K,
		listener: EventListener<Events[K]>
	): Unsubscribe {
		const unsubscribe = this.on(event, (...args: Events[K]) => {
			unsubscribe();
			listener(...args);
		});

		return unsubscribe;
	}

	off<K extends keyof Events>(
		event: K,
		listener: EventListener<Events[K]>
	): boolean {
		const eventListeners = this.getListeners(event);

		if (!eventListeners) {
			return false;
		}

		const removed = eventListeners.delete(listener);

		if (eventListeners.size === 0) {
			this.listeners.delete(event);
		}

		return removed;
	}

	emit<K extends keyof Events>(
		event: K,
		...args: Events[K]
	): boolean {
		const eventListeners = this.getListeners(event);

		if (!eventListeners?.size) {
			return false;
		}

		for (const listener of [...eventListeners]) {
			listener(...args);
		}

		return true;
	}

	listenerCount<K extends keyof Events>(event: K): number {
		return this.listeners.get(event)?.size ?? 0;
	}

	removeAllListeners(): void;
	removeAllListeners<K extends keyof Events>(event: K): void;
	removeAllListeners(event?: keyof Events): void {
		if (event === undefined) {
			this.listeners.clear();
			return;
		}

		this.listeners.delete(event);
	}
}