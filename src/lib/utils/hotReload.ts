/**
 * Hot reload detection and handling utility
 */

// Store a global flag in window to track if this is a hot reload
const globalKey = "__NEBULA_HOT_RELOAD_TRACKER__";

/**
 * Check if the current load is a hot reload
 */
export function isHotReload(): boolean {
	if (typeof window === "undefined") return false;

	// If our flag exists, this is a hot reload
	return !!(window as any)[globalKey];
}

/**
 * Mark that this module has been loaded
 */
export function markModuleLoaded(): void {
	if (typeof window === "undefined") return;

	// Set our flag for future loads
	(window as any)[globalKey] = true;
}

/**
 * Set up hot reload tracking
 */
export function setupHotReloadTracking() {
	const hotReload = isHotReload();
	console.log(`Application ${hotReload ? "hot reloaded" : "freshly loaded"}`);
	markModuleLoaded();
	return hotReload;
}

// Initialize on module import
setupHotReloadTracking();
