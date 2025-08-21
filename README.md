# Nebula Applet Platform

A modular, instance-based platform for building dynamic applications with applets and services. This library provides a flexible architecture for creating extensible applications where functionality can be dynamically loaded and managed.

## Features

- **Instance-based Architecture**: No singletons - create and manage your own instances
- **Modular Design**: Services and applets can be loaded dynamically
- **Dependency Injection**: Services are automatically injected into applets
- **Hot Reload Support**: Proper lifecycle management for development
- **TypeScript Support**: Fully typed with excellent IntelliSense
- **SolidJS Integration**: Reactive UI components with efficient updates

## Core Concepts

### Core
The central orchestrator that manages services and applets. Each `Core` instance maintains its own registry of services and applets.

### Services
Background functionality providers (e.g., authentication, data storage, API clients). Services implement the `IService` interface and can be reactive.

### Applets
UI components with their own lifecycle. Applets implement the `IApplet` interface and can access services through dependency injection.

### Registries
- **ServiceRegistry**: Manages service providers and initialization
- **AppletRegistry**: Manages applet factories and creation

## Installation

```bash
npm install nebula-applet-platform
```

## Basic Usage

```typescript
import { 
  Core, 
  AppletRegistry, 
  ServiceRegistry, 
  AuthService,
  GreeterAppletFactory,
  LoginAppletFactory 
} from 'nebula-applet-platform';

// Create instances (not singletons!)
const core = new Core();
const serviceRegistry = new ServiceRegistry();
const appletRegistry = new AppletRegistry();

// Register service providers
serviceRegistry.registerProvider({
  id: AuthService.SERVICE_ID,
  create: () => new AuthService()
});

// Initialize services in core
serviceRegistry.initializeCoreServices(core);

// Register applet factories
appletRegistry.registerFactory(GreeterAppletFactory);
appletRegistry.registerFactory(LoginAppletFactory);

// Initialize applets in core
appletRegistry.initializeCoreApplets(core);

// Use the platform
const greeterApplet = core.getApplet('nebula.greeter');
const authService = core.getService(AuthService.SERVICE_ID);

// Render applets (in a SolidJS component)
function MyApp() {
  return (
    <div>
      {greeterApplet?.render()}
    </div>
  );
}
```

## Creating Custom Services

```typescript
import { BaseService } from 'nebula-applet-platform';

export class MyCustomService extends BaseService {
  static readonly SERVICE_ID = "my.custom.service";
  
  constructor() {
    super(MyCustomService.SERVICE_ID);
  }
  
  doSomething() {
    // Your service logic here
    this.emit('something-happened', { data: 'example' });
  }
}

// Register with ServiceRegistry
serviceRegistry.registerProvider({
  id: MyCustomService.SERVICE_ID,
  create: () => new MyCustomService()
});
```

## Creating Custom Applets

```typescript
import { BaseApplet, createAppletFactory } from 'nebula-applet-platform';

export class MyCustomApplet extends BaseApplet {
  protected onInit() {
    console.log('Applet initialized!');
    
    // Access services
    const authService = this.getService<AuthService>(AuthService.SERVICE_ID);
  }
  
  protected onDestroy() {
    console.log('Applet destroyed!');
    // Cleanup resources here
  }
  
  render() {
    return (
      <div>
        <h2>My Custom Applet</h2>
        <p>Hello from {this.metadata.name}!</p>
      </div>
    );
  }
}

export const MyCustomAppletFactory = createAppletFactory(
  (metadata) => new MyCustomApplet(metadata),
  {
    id: "my.custom.applet",
    name: "My Custom Applet",
    description: "A custom applet example"
  }
);

// Register with AppletRegistry
appletRegistry.registerFactory(MyCustomAppletFactory);
```

## Advanced Usage

### Dynamic Applet Loading

```typescript
// Load an applet dynamically
const customApplet = appletRegistry.ensureApplet(core, "my.custom.applet");

// Unload an applet
core.unregisterApplet("my.custom.applet");
```

### Reactive Services

```typescript
import { ReactiveService } from 'nebula-applet-platform';
import { createSignal } from 'solid-js';

export class ReactiveDataService extends ReactiveService {
  private [data, setData] = createSignal([]);
  
  constructor() {
    super("reactive.data.service");
  }
  
  get items() {
    return this.data();
  }
  
  addItem(item: any) {
    this.setData(prev => [...prev, item]);
    this.emit('item-added', { item });
  }
}
```

### Multiple Core Instances

```typescript
// You can have multiple, isolated platform instances
const mainCore = new Core();
const pluginCore = new Core();

// Each with their own services and applets
const mainRegistry = new AppletRegistry();
const pluginRegistry = new AppletRegistry();

// Completely isolated from each other
mainRegistry.registerFactory(MainAppFactory);
pluginRegistry.registerFactory(PluginAppFactory);
```

## Built-in Components

The platform comes with several built-in applets and services:

### Services
- **AuthService**: Basic authentication state management

### Applets
- **GreeterApplet**: Simple greeting component
- **LoginApplet**: Basic login form
- **RandomNumberApplet**: Example applet with cleanup (intervals)
- **AppletLauncherApplet**: Demo for dynamic applet loading

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build: `npm run build`

## Architecture Benefits

- **No Global State**: Each instance is independent
- **Better Testing**: Easy to mock and isolate components
- **Library Friendly**: Can be embedded in larger applications
- **Hot Reload Safe**: Proper cleanup prevents memory leaks
- **TypeScript First**: Excellent developer experience

## License

MIT
