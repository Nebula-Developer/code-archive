import type { JSX } from "solid-js/jsx-runtime";

/**
 * Unique identifier for services
 */
export type ServiceId = string;

/**
 * Metadata for service registration
 */
export interface ServiceMetadata {
	id: ServiceId;
	description?: string;
}

/**
 * Base service event interface
 */
export interface ServiceEvent<T = unknown> {
	type: string;
	payload: T;
}

/**
 * Core service interface that all services must implement
 */
export interface IService {
	id: ServiceId;
	on<T = unknown>(event: string, handler: (payload: T) => void): () => void;
	emit<T = unknown>(event: string, payload: T): void;
}

/**
 * Metadata for applet registration
 */
export interface AppletMetadata {
	id: string;
	name: string;
	description?: string;
	version?: string;
}

/**
 * Core applet interface that all applets must implement
 */
export interface IApplet {
	readonly id: string;
	readonly metadata: AppletMetadata;
	init(serviceRegistry: ServiceRegistry): void;
	render(): JSX.Element;
	destroy?(): void;
}

/**
 * Service registry interface for dependency injection
 */
export interface ServiceRegistry {
	getService<T extends IService>(id: ServiceId): T | undefined;
}
