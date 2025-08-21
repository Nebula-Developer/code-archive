import type { AppletMetadata, IApplet } from "./types";

/**
 * Factory for creating applet instances
 */
export interface AppletFactory<T extends IApplet = IApplet> {
	/**
	 * Create a new instance of the applet
	 */
	create(...args: any[]): T;

	/**
	 * Get the metadata for this applet
	 */
	readonly metadata: AppletMetadata;
}

/**
 * Create an applet factory with either a constructor or factory function
 */
export function createAppletFactory<T extends IApplet>(
	createFn:
		| ((metadata: AppletMetadata, ...args: any[]) => T)
		| (new (
				metadata: AppletMetadata,
				...args: any[]
		  ) => T),
	metadata: AppletMetadata,
): AppletFactory<T> {
	return {
		create: (...args: any[]) => {
			// If createFn is a constructor (class), use 'new'
			// Otherwise treat it as a factory function
			try {
				if (
					typeof createFn === "function" &&
					createFn.prototype &&
					createFn.prototype.constructor === createFn
				) {
					// It's likely a class constructor
					return new (
						createFn as new (
							metadata: AppletMetadata,
							...args: any[]
						) => T
					)(metadata, ...args);
				} else {
					// It's likely a factory function
					return (createFn as (metadata: AppletMetadata, ...args: any[]) => T)(
						metadata,
						...args,
					);
				}
			} catch (error) {
				console.error(`Error creating applet ${metadata.id}:`, error);
				throw error;
			}
		},
		metadata,
	};
}
