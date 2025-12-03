import { createSignal, onCleanup, onMount, Show } from "solid-js";
import {
	AppletLauncherApplet,
	AppletLauncherAppletFactory,
	AppletRegistry,
	GreeterAppletFactory,
	LoginAppletFactory,
} from "./lib/applets";
import { Core } from "./lib/core/Core";
import type { IApplet } from "./lib/core/types";
import { ServiceRegistry } from "./lib/services";
import { AuthService } from "./lib/services/AuthService";
import { createAppletFactory } from "./lib";

function App() {
	// Create instance-based registries
	const core = new Core();
	const serviceRegistry = new ServiceRegistry();
	const appletRegistry = new AppletRegistry();

	// Create reactive signals for the applets with proper typing
	const [loginApplet, setLoginApplet] = createSignal<IApplet | undefined>(
		undefined,
	);
	const [greeterApplet, setGreeterApplet] = createSignal<IApplet | undefined>(
		undefined,
	);
	const [launcherApplet, setLauncherApplet] = createSignal<IApplet | undefined>(
		undefined,
	);

	const [launcherApplet2, setLauncherApplet2] = createSignal<IApplet | undefined>(
		undefined,
	);

	// Track if applets are loaded
	const [appletsLoaded, setAppletsLoaded] = createSignal(false);

	/**
	 * Initialize services, register applet factories, and create applets
	 */
	const initializeApplication = () => {
		console.log("App: Initializing application");

		// Register service providers
		serviceRegistry.registerProvider({
			id: AuthService.SERVICE_ID,
			create: () => new AuthService(),
		});

		// Initialize services in core
		serviceRegistry.initializeCoreServices(core);

		// Register applet factories
		appletRegistry.registerFactory(LoginAppletFactory);
		appletRegistry.registerFactory(GreeterAppletFactory);
		appletRegistry.registerFactory(AppletLauncherAppletFactory);
		let nFactory = createAppletFactory(
			(metadata, appletRegistry: AppletRegistry) =>
				new AppletLauncherApplet(metadata, appletRegistry),
			{
				id: "nebula.applet-launcher.2",
				name: "Applet Launcher",
				description: "Demonstrates dynamic loading and unloading of applets",
			},
		);
		appletRegistry.registerFactory(nFactory);

		// Initialize applets in core
		appletRegistry.initializeCoreApplets(core);

		// Update our reactive applet references
		setLoginApplet(core.getApplet("nebula.login"));
		setGreeterApplet(core.getApplet("nebula.greeter"));
		setLauncherApplet(core.getApplet("nebula.applet-launcher"));


		setLauncherApplet2(core.getApplet("nebula.applet-launcher.2"));

		setAppletsLoaded(true);

		console.log(
			"Services:",
			core
				.getAllServices()
				.map((s) => s.id)
				.join(", "),
		);
		console.log(
			"Applets:",
			core
				.getAllApplets()
				.map((a) => a.id)
				.join(", "),
		);
	};

	// Initialize application on component mount
	onMount(() => {
		initializeApplication();
	});

	// Clean up resources when component is unmounted
	onCleanup(() => {
		console.log("App: Component unmounted - cleaning up resources");
		core.cleanup();
	});

	return (
		<div
			style={{
				"max-width": "1200px",
				margin: "2rem auto",
				padding: "1rem",
				display: "flex",
				"flex-wrap": "wrap",
				gap: "2rem",
			}}
		>
			<div style={{ width: "100%", "margin-bottom": "1rem" }}>
				<h1 style={{ margin: "0", color: "#4a5568" }}>
					Nebula Applet Platform
				</h1>
				<p style={{ "margin-top": "0.5rem", color: "#718096" }}>
					A modular platform for dynamic applet registration
				</p>
			</div>

			<Show
				when={appletsLoaded()}
				fallback={<div>Initializing applets...</div>}
			>
				<div
					style={{
						display: "flex",
						gap: "2rem",
						"flex-wrap": "wrap",
						width: "100%",
					}}
				>
					{/* Dynamic Applet Loading Demo - now as an applet */}
					<Show
						when={launcherApplet()}
						fallback={<div>Loading Launcher applet...</div>}
					>
						{launcherApplet()?.render()}
					</Show>

					<Show
						when={launcherApplet2()}
						fallback={<div>Loading Launcher applet 2...</div>}
					>
						{launcherApplet2()?.render()}
					</Show>

					{/* Other Static Applets */}
					<div style={{ display: "flex", gap: "2rem", "flex-wrap": "wrap" }}>
						<Show
							when={loginApplet()}
							fallback={<div>Loading Login applet...</div>}
						>
							{loginApplet()?.render()}
						</Show>

						<Show
							when={greeterApplet()}
							fallback={<div>Loading Greeter applet...</div>}
						>
							{greeterApplet()?.render()}
						</Show>
					</div>
				</div>
			</Show>
		</div>
	);
}

export default App;
