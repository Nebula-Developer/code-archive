import { createSignal } from "solid-js";
import { createAppletFactory } from "../core/AppletFactory";
import { BaseApplet } from "../core/BaseApplet";
import { AuthService, type AuthState } from "../services";

/**
 * RandomNumber applet that displays a random number updated every second
 * Demonstrates proper cleanup of resources (interval)
 */
export class RandomNumberApplet extends BaseApplet {
	private numberSignal = createSignal<number>(Math.random());
	private intervalId: number | null = null;
	private authState: AuthState | null = null;

	/**
	 * Initialize the applet and start the interval
	 */
	protected override onInit() {
		console.log(`RandomNumberApplet: initializing with ID ${this.id}`);

		// Clean up any existing interval first (defensive programming)
		this.cleanupInterval();

		// Generate a new random number every second
		this.intervalId = window.setInterval(() => {
			this.numberSignal[1](Math.random());
			console.log(`RandomNumberApplet ${this.id}: generated new number`);
		}, 1000);

		this.authState = this.getService<AuthService>(AuthService.SERVICE_ID).state;
	}

	/**
	 * Helper method to clean up the interval
	 */
	private cleanupInterval() {
		if (this.intervalId !== null) {
			console.log(
				`RandomNumberApplet: clearing existing interval for ${this.id}`,
			);
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * Clean up resources when the applet is destroyed
	 */
	protected override onDestroy() {
		console.log(`RandomNumberApplet: cleaning up with ID ${this.id}`);
		this.cleanupInterval();
	}

	/**
	 * Render the random number UI
	 */
	render() {
		return (
			<div
				style={{
					padding: "1rem",
					"border-radius": "0.5rem",
					"background-color": "#fef3c7",
					"box-shadow": "0 2px 4px rgba(0,0,0,0.1)",
					"min-width": "200px",
					"text-align": "center",
				}}
			>
				<h3 style={{ "margin-top": "0" }}>Random Number Generator</h3>
				<p>Updating every second:</p>
				<div
					style={{
						padding: "1rem",
						"font-size": "1.5rem",
						"font-weight": "bold",
						background: "white",
						"border-radius": "0.25rem",
						"margin-bottom": "0.5rem",
					}}
				>
					{this.numberSignal[0]().toFixed(6)}
				</div>
				<p style={{ "font-size": "0.8rem", color: "#666" }}>
					(This applet cleans up its interval on destroy)
				</p>

				<p style={{ "font-size": "0.8rem", color: "#666" }}>
					Auth State: {JSON.stringify(this.authState)}
				</p>
			</div>
		);
	}
}

/**
 * Create and export the random number applet factory
 */
export const RandomNumberAppletFactory = createAppletFactory(
	(metadata) => new RandomNumberApplet(metadata),
	{
		id: "nebula.randomnumber",
		name: "Random Number",
		description: "Displays a random number updated every second",
	},
);
