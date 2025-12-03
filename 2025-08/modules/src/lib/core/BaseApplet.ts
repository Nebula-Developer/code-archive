import type { JSX } from "solid-js/jsx-runtime";
import type {
	AppletMetadata,
	IApplet,
	IService,
	ServiceRegistry,
} from "./types";

/**
 * Abstract base class for all applets
 */
export abstract class BaseApplet implements IApplet {
	readonly id: string;
	readonly metadata: AppletMetadata;
	protected serviceRegistry: ServiceRegistry | null = null;

	constructor(metadata: AppletMetadata) {
		this.id = metadata.id;
		this.metadata = metadata;
	}

	/**
	 * Initialize the applet with service registry for dependency injection
	 */
	init(serviceRegistry: ServiceRegistry): void {
		this.serviceRegistry = serviceRegistry;
		this.onInit();
	}

	/**
	 * Override this method to perform initialization tasks
	 */
	protected onInit(): void {}

	/**
	 * Render the applet's UI
	 */
	abstract render(): JSX.Element;

	/**
	 * Override this method to perform cleanup tasks
	 */
	destroy(): void {
		this.onDestroy();
		this.serviceRegistry = null;
	}

	/**
	 * Override this method to perform custom cleanup tasks
	 */
	protected onDestroy(): void {}

	/**
	 * Helper method to get a service by ID
	 */
	protected getService<T extends IService>(id: string): T {
		if (!this.serviceRegistry) {
			throw new Error(
				`Applet ${this.id} tried to access a service before initialization`,
			);
		}

		const service = this.serviceRegistry.getService<T>(id);
		if (!service) {
			throw new Error(`Service ${id} not found for applet ${this.id}`);
		}

		return service;
	}
}
