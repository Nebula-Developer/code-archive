# Nebula Applet Platform Architecture

This document describes the architecture of the Nebula Applet Platform.

## Core Components

### Core

The `Core` class is the central registry for services and applets. It provides methods to register, retrieve, and manage services and applets.

```typescript
const core = new Core();
```

### Services

Services are shared resources that provide functionality to applets. They implement the `IService` interface or extend the `BaseService` class.

#### Creating a new service

```typescript
import { BaseService } from "../lib/core/BaseService";

export class MyService extends BaseService {
  static readonly SERVICE_ID = "nebula.myservice";
  
  constructor() {
    super(MyService.SERVICE_ID);
  }
  
  // Add your service methods here
}
```

#### Registering a service provider

```typescript
import { ServiceRegistry } from "../services";
import { MyService } from "./MyService";

// Register the service provider
ServiceRegistry.registerProvider({
  id: MyService.SERVICE_ID,
  create: () => new MyService()
});
```

### Applets

Applets are UI components that provide specific functionality. They implement the `IApplet` interface or extend the `BaseApplet` class.

#### Creating a new applet

```typescript
import { BaseApplet } from "../lib/core/BaseApplet";
import type { JSX } from "solid-js";

export class MyApplet extends BaseApplet {
  protected override onInit(): void {
    // Initialize your applet here
  }
  
  render(): JSX.Element {
    return <div>My Applet</div>;
  }
}
```

#### Registering an applet factory

```typescript
import { createAppletFactory } from "../lib/core/AppletFactory";
import { AppletRegistry } from "../applets";
import { MyApplet } from "./MyApplet";

// Create the applet factory
export const MyAppletFactory = createAppletFactory(
  MyApplet,
  {
    id: "nebula.myapplet",
    name: "My Applet",
    description: "My awesome applet"
  }
);

// Register the applet factory
AppletRegistry.registerFactory(MyAppletFactory);
```

## Best Practices

1. Always extend `BaseService` or `BaseApplet` for new services and applets
2. Use the factory pattern for creating applets
3. Register services and applets using the registry classes
4. Use dependency injection for services within applets
5. Use the event system for communication between services and applets
