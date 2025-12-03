import { createSignal } from "solid-js";
import { createAppletFactory } from "../core/AppletFactory";
import { BaseApplet } from "../core/BaseApplet";
import type { AuthState, LoginPayload } from "../services/AuthService";
import { AuthEventType, AuthService } from "../services/AuthService";

/**
 * Greeter applet that welcomes users after login
 */
export class GreeterApplet extends BaseApplet {
	private messageSignal = createSignal("Waiting for login...");

	private state: AuthState | null = null;

	/**
	 * Initialize the applet and subscribe to auth events
	 */
	protected override onInit() {
		const auth = this.getService<AuthService>(AuthService.SERVICE_ID);

		this.state = auth.state;

		// Check if already logged in and update message
		if (auth.state.loggedIn && auth.state.user) {
			this.messageSignal[1](`Welcome, ${auth.state.user}! 🎉`);
		}

		// Subscribe to login events and update the message signal
		auth.on<LoginPayload>(AuthEventType.LOGIN, ({ user }) => {
			this.messageSignal[1](`Welcome, ${user}! 🎉`);
		});

		// Subscribe to logout events
		auth.on(AuthEventType.LOGOUT, () => {
			this.messageSignal[1]("Waiting for login...");
		});
	}

	/**
	 * Render the greeter UI
	 */
	render() {
		return (
			<div
				style={{
					padding: "1rem",
					"border-radius": "0.5rem",
					"background-color": "#f0f4f8",
					"box-shadow": "0 2px 4px rgba(0,0,0,0.1)",
					"min-width": "200px",
				}}
			>
				<h3 style={{ "margin-top": "0" }}>Greeter</h3>
				<p>{this.messageSignal[0]()}</p>

				<p>{JSON.stringify(this.state)}</p>
			</div>
		);
	}
}

/**
 * Create and export the greeter applet factory
 */
export const GreeterAppletFactory = createAppletFactory(GreeterApplet, {
	id: "nebula.greeter",
	name: "Greeter",
	description: "Displays welcome messages for users",
});
