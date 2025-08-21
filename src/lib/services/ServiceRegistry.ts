import type { Core } from "../core/Core";
import type { IService } from "../core/types";

/**
 * Service provider interface for creating service instances
 */
export interface ServiceProvider<T extends IService = IService> {
	/**
	 * Create a new instance of the service
	 */
	create(): T;

	/**
	 * The service ID
	 */
	readonly id: string;
}

/**
 * Registry for core services
 */
export class ServiceRegistry {
	/**
	 * Registry of all available service providers
	 */
	private providers: Map<string, ServiceProvider<any>> = new Map();

	/**
	 * Register a service provider
	 */
	registerProvider<T extends IService>(provider: ServiceProvider<T>): void {
		this.providers.set(provider.id, provider);
	}

	/**
	 * Get a service provider by ID
	 */
	getProvider<T extends IService>(id: string): ServiceProvider<T> | undefined {
		return this.providers.get(id);
	}

	/**
	 * Get all registered service providers
	 */
	getAllProviders(): ServiceProvider<IService>[] {
		return Array.from(this.providers.values());
	}

	/**
	 * Initialize all registered services in the core
	 */
	initializeCoreServices(core: Core): void {
		// Register all services
		for (const provider of this.providers.values()) {
			console.log(`ServiceRegistry: Registering service ${provider.id}`);
			core.registerService(provider.create());
		}
	}
}
