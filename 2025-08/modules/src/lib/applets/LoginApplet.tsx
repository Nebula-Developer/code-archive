import { createAppletFactory } from "../core/AppletFactory";
import { BaseApplet } from "../core/BaseApplet";
import { AuthService } from "../services/AuthService";

/**
 * Login applet that provides authentication UI
 */
export class LoginApplet extends BaseApplet {
	private authService: AuthService | null = null;

	/**
	 * Initialize the applet and get required services
	 */
	protected override onInit() {
		this.authService = this.getService<AuthService>(AuthService.SERVICE_ID);
	}

	/**
	 * Render the login UI
	 */
	render() {
		if (!this.authService) {
			return <div>Initializing...</div>;
		}

		const auth = this.authService;

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
				<h3 style={{ "margin-top": "0" }}>Login</h3>
				<p>
					User: <strong>{auth.state.user ?? "Guest"}</strong>
				</p>
				<div style={{ display: "flex", gap: "0.5rem" }}>
					<button
						type="button"
						style={{
							padding: "0.5rem 1rem",
							"border-radius": "0.25rem",
							"background-color": auth.state.loggedIn ? "#e0e0e0" : "#4c51bf",
							color: auth.state.loggedIn ? "#666" : "white",
							border: "none",
							cursor: auth.state.loggedIn ? "not-allowed" : "pointer",
						}}
						onClick={() => auth.login("Nico")}
						disabled={auth.state.loggedIn}
					>
						Login as Nico
					</button>
					{auth.state.loggedIn && (
						<button
							type="button"
							style={{
								padding: "0.5rem 1rem",
								"border-radius": "0.25rem",
								"background-color": "#f56565",
								color: "white",
								border: "none",
								cursor: "pointer",
							}}
							onClick={() => auth.logout()}
						>
							Logout
						</button>
					)}
				</div>
			</div>
		);
	}
}

/**
 * Create and export the login applet factory
 */
export const LoginAppletFactory = createAppletFactory(
	(metadata) => new LoginApplet(metadata),
	{
		id: "nebula.login",
		name: "Login",
		description: "Provides user authentication UI",
	},
);
