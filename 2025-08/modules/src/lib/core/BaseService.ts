import type { IService, ServiceEvent, ServiceId } from "./types";

/**
 * Abstract base class for all services
 */
export abstract class BaseService implements IService {
	private eventHandlers: Map<string, Set<(payload: unknown) => void>> =
		new Map();

	readonly id: ServiceId;

	constructor(id: ServiceId) {
		this.id = id;
	}

	/**
	 * Register an event handler
	 * @returns A function to unsubscribe
	 */
	on<T = unknown>(
		eventType: string,
		handler: (payload: T) => void,
	): () => void {
		if (!this.eventHandlers.has(eventType)) {
			this.eventHandlers.set(eventType, new Set());
		}

		// biome-ignore lint/style/noNonNullAssertion: We just created this set, so it must exist
		const handlers = this.eventHandlers.get(eventType)!;
		handlers.add(handler as (payload: unknown) => void);

		return () => {
			handlers.delete(handler as (payload: unknown) => void);
			if (handlers.size === 0) {
				this.eventHandlers.delete(eventType);
			}
		};
	}

	/**
	 * Emit an event to registered handlers
	 */
	emit<T = unknown>(eventType: string, payload: T): void {
		const handlers = this.eventHandlers.get(eventType);
		if (handlers) {
			handlers.forEach((handler) => {
				handler(payload);
			});
		}
	}

	/**
	 * Emit a typed service event
	 */
	emitEvent<T = unknown>(event: ServiceEvent<T>): void {
		this.emit(event.type, event.payload);
	}
}
