// Main library exports for the Nebula Applet Platform
// This file demonstrates how the platform can be used as a library

export {
	AppletLauncherApplet,
	AppletLauncherAppletFactory,
} from "./applets/AppletLauncherApplet";
export { AppletRegistry } from "./applets/AppletRegistry";
// Built-in applets (optional - consumers can choose which to include)
export {
	GreeterApplet,
	GreeterAppletFactory,
} from "./applets/GreeterApplet";
export {
	LoginApplet,
	LoginAppletFactory,
} from "./applets/LoginApplet";
export {
	RandomNumberApplet,
	RandomNumberAppletFactory,
} from "./applets/RandomNumberApplet";
export type { AppletFactory } from "./core/AppletFactory";

// Factory utilities
export { createAppletFactory } from "./core/AppletFactory";
// Base classes for creating custom applets and services
export { BaseApplet } from "./core/BaseApplet";
export { BaseService } from "./core/BaseService";
// Core platform components
export { Core } from "./core/Core";
export { ReactiveService } from "./core/ReactiveService";
// Type definitions
export type {
	AppletMetadata,
	IApplet,
	IService,
	ServiceId,
	ServiceRegistry as IServiceRegistry,
} from "./core/types";
// Built-in services (optional - consumers can choose which to include)
export { AuthService } from "./services/AuthService";
export type { ServiceProvider } from "./services/ServiceRegistry";
export { ServiceRegistry } from "./services/ServiceRegistry";

/**
 * Example usage:
 *
 * ```typescript
 * import {
 *   Core,
 *   AppletRegistry,
 *   ServiceRegistry,
 *   AuthService,
 *   GreeterAppletFactory,
 *   LoginAppletFactory
 * } from 'nebula-applet-platform';
 *
 * // Create instances
 * const core = new Core();
 * const serviceRegistry = new ServiceRegistry();
 * const appletRegistry = new AppletRegistry();
 *
 * // Register services
 * serviceRegistry.registerProvider({
 *   id: AuthService.SERVICE_ID,
 *   create: () => new AuthService()
 * });
 * serviceRegistry.initializeCoreServices(core);
 *
 * // Register applets
 * appletRegistry.registerFactory(GreeterAppletFactory);
 * appletRegistry.registerFactory(LoginAppletFactory);
 * appletRegistry.initializeCoreApplets(core);
 *
 * // Use the platform
 * const greeterApplet = core.getApplet('nebula.greeter');
 * const authService = core.getService(AuthService.SERVICE_ID);
 * ```
 */
