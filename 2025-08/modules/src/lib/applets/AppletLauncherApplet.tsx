import { createSignal, Show } from "solid-js";
import { createAppletFactory } from "../core/AppletFactory";
import { BaseApplet } from "../core/BaseApplet";
import type { Core } from "../core/Core";
import type { AppletRegistry } from "./AppletRegistry";
import {
	RandomNumberApplet,
	RandomNumberAppletFactory,
} from "./RandomNumberApplet";

/**
 * AppletLauncher applet that demonstrates dynamically loading
 * and unloading applets with proper resource cleanup
 */
export class AppletLauncherApplet extends BaseApplet {
	private appletRegistry: AppletRegistry;

	// Track whether the random number applet is loaded
	private isRandomNumberAppletLoaded = createSignal(false);

	// Track the applet instance ID to manage loading/unloading
	private appletInstanceId = createSignal<string | null>(null);

	// Consistent ID for the random number applet
	private readonly randomAppletId = `nebula.randomnumber.launcher.${Math.random().toString(36).substring(2, 15)}`;

	constructor(metadata: any, appletRegistry: AppletRegistry) {
		super(metadata);
		this.appletRegistry = appletRegistry;
	}

	protected override onInit(): void {
		console.log(`AppletLauncherApplet: initializing with ID ${this.id}`);
		this.syncAppletState();
	}

	protected override onDestroy(): void {
		console.log(`AppletLauncherApplet: cleaning up with ID ${this.id}`);
		// Unload the random applet if it's loaded
		if (this.isRandomNumberAppletLoaded[0]()) {
			this.unloadRandomNumberApplet();
		}
	}

	/**
	 * Check if the applet is already registered and update state accordingly
	 */
	private syncAppletState = (): boolean => {
		if (!this.serviceRegistry) return false;

		const core = this.serviceRegistry as Core;
		const exists = core.getApplet(this.randomAppletId);
		this.isRandomNumberAppletLoaded[1](!!exists);
		this.appletInstanceId[1](exists ? this.randomAppletId : null);
		return !!exists;
	};

	/**
	 * Load the random number applet
	 */
	private loadRandomNumberApplet = (): void => {
		if (this.isRandomNumberAppletLoaded[0]()) return;
		if (!this.serviceRegistry) return;

		const core = this.serviceRegistry as Core;

		// Check if the applet already exists
		if (this.syncAppletState()) {
			console.log(
				`AppletLauncherApplet: Random number applet already loaded with ID ${this.randomAppletId}`,
			);
			return;
		}

		try {
			// Register the factory if not already registered
			if (!this.appletRegistry.getFactory(this.randomAppletId)) {
				const factory = {
					...RandomNumberAppletFactory,
					metadata: {
						...RandomNumberAppletFactory.metadata,
						id: this.randomAppletId,
					},
					create: () =>
						new RandomNumberApplet({
							...RandomNumberAppletFactory.metadata,
							id: this.randomAppletId,
						}),
				};

				this.appletRegistry.registerFactory(factory);
			}

			// Ensure the applet is created and registered
			const applet = this.appletRegistry.ensureApplet<RandomNumberApplet>(
				core,
				this.randomAppletId,
			);

			if (applet) {
				// Update state
				this.appletInstanceId[1](this.randomAppletId);
				this.isRandomNumberAppletLoaded[1](true);
				console.log(
					`AppletLauncherApplet: Loaded random number applet with ID ${this.randomAppletId}`,
				);
			} else {
				console.error(
					`AppletLauncherApplet: Failed to ensure random number applet with ID ${this.randomAppletId}`,
				);
			}
		} catch (error) {
			console.error("Error loading random number applet:", error);
		}
	};

	/**
	 * Unload the random number applet
	 */
	private unloadRandomNumberApplet = (): void => {
		if (!this.isRandomNumberAppletLoaded[0]()) return;
		if (!this.serviceRegistry) return;

		const core = this.serviceRegistry as Core;

		try {
			// Unregister the applet (this will trigger the destroy method)
			const success = core.unregisterApplet(this.randomAppletId);

			if (success) {
				// Update state
				this.appletInstanceId[1](null);
				this.isRandomNumberAppletLoaded[1](false);
				console.log(
					`AppletLauncherApplet: Unloaded random number applet with ID ${this.randomAppletId}`,
				);
			} else {
				console.warn(
					`AppletLauncherApplet: Failed to unload applet with ID ${this.randomAppletId}`,
				);
			}
		} catch (error) {
			console.error("Error unloading random number applet:", error);
		}
	};

	/**
	 * Render the applet launcher UI
	 */
	render() {
		const core = this.serviceRegistry as Core;

		return (
			<div
				style={{
					padding: "1.5rem",
					"border-radius": "0.5rem",
					"background-color": "#e6f7ff",
					"box-shadow": "0 4px 6px rgba(0,0,0,0.1)",
					width: "100%",
					"margin-bottom": "1.5rem",
				}}
			>
				<h2 style={{ "margin-top": "0", color: "#0066cc" }}>
					Applet Launcher Demo
				</h2>
				<p>
					This demonstrates dynamically loading and unloading applets at
					runtime, with proper cleanup of resources.
				</p>

				<div
					style={{ display: "flex", gap: "1rem", "margin-bottom": "1.5rem" }}
				>
					<button
						type="button"
						style={{
							padding: "0.5rem 1rem",
							"border-radius": "0.25rem",
							"background-color": this.isRandomNumberAppletLoaded[0]()
								? "#e0e0e0"
								: "#4c9aff",
							color: this.isRandomNumberAppletLoaded[0]() ? "#666" : "white",
							border: "none",
							cursor: this.isRandomNumberAppletLoaded[0]()
								? "not-allowed"
								: "pointer",
						}}
						onClick={this.loadRandomNumberApplet}
						disabled={this.isRandomNumberAppletLoaded[0]()}
					>
						Load Random Number Applet
					</button>

					<button
						type="button"
						style={{
							padding: "0.5rem 1rem",
							"border-radius": "0.25rem",
							"background-color": !this.isRandomNumberAppletLoaded[0]()
								? "#e0e0e0"
								: "#ff4d4f",
							color: !this.isRandomNumberAppletLoaded[0]() ? "#666" : "white",
							border: "none",
							cursor: !this.isRandomNumberAppletLoaded[0]()
								? "not-allowed"
								: "pointer",
						}}
						onClick={this.unloadRandomNumberApplet}
						disabled={!this.isRandomNumberAppletLoaded[0]()}
					>
						Unload Random Number Applet
					</button>
				</div>

				<div
					style={{
						"min-height": "200px",
						border: "1px dashed #ccc",
						"border-radius": "0.5rem",
						padding: "1rem",
					}}
				>
					<Show
						when={
							this.isRandomNumberAppletLoaded[0]() && this.appletInstanceId[0]()
						}
						fallback={
							<div
								style={{
									"text-align": "center",
									color: "#666",
									padding: "3rem 0",
								}}
							>
								No applet loaded. Click "Load Random Number Applet" to see it in
								action.
							</div>
						}
					>
						{/** biome-ignore lint/style/noNonNullAssertion: We check this before rendering */}
						{core?.getApplet(this.appletInstanceId[0]()!)?.render()}
					</Show>
				</div>

				<p
					style={{
						"font-size": "0.85rem",
						color: "#666",
						"margin-top": "1rem",
					}}
				>
					When the applet is unloaded, its <code>destroy</code> method is
					called, which cleans up the interval to prevent memory leaks.
				</p>
			</div>
		);
	}
}

/**
 * Factory for creating AppletLauncher applets
 */
export const AppletLauncherAppletFactory = createAppletFactory(
	(metadata, appletRegistry: AppletRegistry) =>
		new AppletLauncherApplet(metadata, appletRegistry),
	{
		id: "nebula.applet-launcher",
		name: "Applet Launcher",
		description: "Demonstrates dynamic loading and unloading of applets",
	},
);
