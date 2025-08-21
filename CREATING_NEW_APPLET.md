# Creating a New Applet

This guide shows how to create a new applet for the Nebula Platform.

## Step 1: Create a new service (if needed)

If your applet needs a specific service, create it first:

```typescript
// src/services/CounterService.ts
import { BaseService } from "../lib/core/BaseService";
import { createMutable } from "solid-js/store";

// Service state interface
export interface CounterState {
  count: number;
}

// Service event types
export const CounterEventType = {
  INCREMENT: "counter:increment",
  DECREMENT: "counter:decrement",
  RESET: "counter:reset"
} as const;

// Counter service
export class CounterService extends BaseService {
  static readonly SERVICE_ID = "nebula.counterservice";
  private _state: CounterState;

  constructor() {
    super(CounterService.SERVICE_ID);
    this._state = createMutable<CounterState>({ count: 0 });
  }

  get state(): CounterState {
    return this._state;
  }

  increment(): void {
    this._state.count += 1;
    this.emit(CounterEventType.INCREMENT, { count: this._state.count });
  }

  decrement(): void {
    this._state.count -= 1;
    this.emit(CounterEventType.DECREMENT, { count: this._state.count });
  }

  reset(): void {
    this._state.count = 0;
    this.emit(CounterEventType.RESET, { count: 0 });
  }
}
```

## Step 2: Register the service

Register the service in the ServiceRegistry:

```typescript
// In src/services/ServiceRegistry.ts, add:
import { CounterService } from "./CounterService";

// Register the counter service provider
ServiceRegistry.registerProvider({
  id: CounterService.SERVICE_ID,
  create: () => new CounterService()
});
```

## Step 3: Create a new applet

Create an applet that uses the service:

```typescript
// src/applets/CounterApplet.tsx
import type { JSX } from "solid-js";
import { BaseApplet } from "../lib/core/BaseApplet";
import { CounterService } from "../services/CounterService";
import { createAppletFactory } from "../lib/core/AppletFactory";

export class CounterApplet extends BaseApplet {
  private counterService: CounterService | null = null;

  protected override onInit(): void {
    this.counterService = this.getService<CounterService>(CounterService.SERVICE_ID);
  }

  render(): JSX.Element {
    if (!this.counterService) {
      return <div>Initializing...</div>;
    }

    const counter = this.counterService;

    return (
      <div>
        <h2>Counter: {counter.state.count}</h2>
        <button onClick={() => counter.increment()}>+</button>
        <button onClick={() => counter.decrement()}>-</button>
        <button onClick={() => counter.reset()}>Reset</button>
      </div>
    );
  }
}

// Create the applet factory
export const CounterAppletFactory = createAppletFactory(
  CounterApplet,
  {
    id: "nebula.counter",
    name: "Counter",
    description: "Simple counter applet"
  }
);
```

## Step 4: Register the applet

Register the applet factory:

```typescript
// In src/applets/AppletRegistry.ts, add:
import { CounterAppletFactory } from "./CounterApplet";

// Register the counter applet
AppletRegistry.registerFactory(CounterAppletFactory);
```

## Step 5: Update your App.tsx to display the new applet

```tsx
function App() {
  const core = new Core();

  // Initialize core services and applets
  ServiceRegistry.initializeCoreServices(core);
  AppletRegistry.initializeCoreApplets(core);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {core.getApplet("nebula.login")?.render()}
      {core.getApplet("nebula.greeter")?.render()}
      {core.getApplet("nebula.counter")?.render()}
    </div>
  );
}
```
