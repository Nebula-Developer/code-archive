import type { IApplet, IService, ServiceId, ServiceRegistry } from "./types";

/**
 * Core class that manages the lifecycle of services and applets
 */
export class Core implements ServiceRegistry {
	private services = new Map<ServiceId, IService>();
	private applets = new Map<string, IApplet>();

	/**
	 * Register a service with the core
	 */
	registerService<T extends IService>(service: T): void {
		if (this.services.has(service.id)) {
			console.warn(
				`Service with ID ${service.id} already registered. Overriding.`,
			);
		}
		this.services.set(service.id, service);
	}

	/**
	 * Get a registered service by ID
	 */
	getService<T extends IService>(id: ServiceId): T | undefined {
		return this.services.get(id) as T | undefined;
	}

	/**
	 * Register an applet with the core and initialize it
	 */
	registerApplet(applet: IApplet): void {
		if (this.applets.has(applet.id)) {
			console.warn(
				`Applet with ID ${applet.id} already registered. Overriding.`,
			);
			this.unregisterApplet(applet.id);
		}

		this.applets.set(applet.id, applet);
		applet.init(this);
	}

	/**
	 * Get a registered applet by ID
	 */
	getApplet(id: string): IApplet | undefined {
		return this.applets.get(id);
	}

	/**
	 * Get all registered applets
	 */
	getAllApplets(): IApplet[] {
		return Array.from(this.applets.values());
	}

	/**
	 * Unregister and destroy an applet
	 */
	unregisterApplet(id: string): boolean {
		const applet = this.applets.get(id);
		if (applet) {
			applet.destroy?.();
			this.applets.delete(id);
			return true;
		}
		return false;
	}

	/**
	 * Unregister a service
	 */
	unregisterService(id: ServiceId): boolean {
		return this.services.delete(id);
	}

	/**
	 * Get all registered services
	 */
	getAllServices(): IService[] {
		return Array.from(this.services.values());
	}

	/**
	 * Clean up all applets and resources
	 * Useful for hot reloads and app teardown
	 */
	cleanup(): void {
		console.log("Core: Cleaning up all applets and resources");

		// Clean up all applets
		for (const [id, applet] of this.applets.entries()) {
			try {
				console.log(`Core: Destroying applet ${id}`);
				applet.destroy?.();
			} catch (error) {
				console.error(`Error destroying applet ${id}:`, error);
			}
		}

		// Clear the maps
		this.applets.clear();

		// We don't clear services as they might be stateful and needed across hot reloads
		console.log("Core: Cleanup complete");
	}
}
