import { createMutable } from "solid-js/store";
import { BaseService } from "./BaseService";
import type { ServiceId } from "./types";

/**
 * Base class for services using Solid's reactive state
 */
export abstract class ReactiveService<
	T extends Record<string, any>,
> extends BaseService {
	protected _state: T;

	constructor(id: ServiceId, initialState: T) {
		super(id);
		this._state = createMutable<T>(initialState);
	}

	/**
	 * Get the reactive state of this service
	 */
	get state(): T {
		return this._state;
	}
}
