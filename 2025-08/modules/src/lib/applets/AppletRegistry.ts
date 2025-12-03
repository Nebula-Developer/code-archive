import type { AppletFactory } from "../core/AppletFactory";
import type { Core } from "../core/Core";
import type { IApplet } from "../core/types";

/**
 * Registry for applet factories
 */
export class AppletRegistry {
	/**
	 * Registry of all available applet factories
	 */
	private factories: Map<string, AppletFactory<any>> = new Map();

	/**
	 * Register an applet factory
	 */
	registerFactory<T extends IApplet>(factory: AppletFactory<T>): void {
		this.factories.set(factory.metadata.id, factory);
	}

	/**
	 * Get an applet factory by ID
	 */
	getFactory<T extends IApplet>(id: string): AppletFactory<T> | undefined {
		return this.factories.get(id);
	}

	/**
	 * Get all registered applet factories
	 */
	getAllFactories(): AppletFactory<IApplet>[] {
		return Array.from(this.factories.values());
	}

	/**
	 * Initialize all registered applets in the core
	 */
	initializeCoreApplets(core: Core): void {
		// Register all applets
		for (const factory of this.factories.values()) {
			// Skip if an applet with this ID is already registered
			if (core.getApplet(factory.metadata.id)) {
				console.log(
					`AppletRegistry: Applet ${factory.metadata.id} already registered, skipping`,
				);
				continue;
			}

			console.log(`AppletRegistry: Registering applet ${factory.metadata.id}`);
			// Pass this AppletRegistry instance as a dependency
			core.registerApplet(factory.create(this));
		}
	}

	/**
	 * Get a specific applet from the core, creating it if it doesn't exist
	 * This ensures the applet will always be available
	 */
	ensureApplet<T extends IApplet>(
		core: Core,
		id: string,
		...args: any[]
	): T | undefined {
		// Check if applet already exists
		let applet = core.getApplet(id) as T | undefined;
		if (applet) {
			return applet;
		}

		// If not, try to create it from factory
		const factory = this.getFactory<T>(id);
		if (factory) {
			// Pass this AppletRegistry instance and any additional args as dependencies
			applet = factory.create(this, ...args) as T;
			core.registerApplet(applet);
			return applet;
		}

		return undefined;
	}
}
