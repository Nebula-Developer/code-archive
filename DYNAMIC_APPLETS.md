# Dynamic Applet Loading & Lifecycle Management

The Nebula Platform supports dynamically loading and unloading applets at runtime, which allows for better resource management and a more modular architecture.

## Applet Lifecycle

Applets in the Nebula Platform go through a well-defined lifecycle:

1. **Creation**: An applet instance is created through its factory
2. **Initialization**: The applet's `init` method is called with the core registry
3. **Rendering**: The applet's `render` method is called to display its UI
4. **Destruction**: The applet's `destroy` method is called when it's unregistered

## Resource Cleanup

When an applet is unloaded, it's important to clean up any resources it may have allocated, such as:

- Timers and intervals
- Event listeners
- WebSocket connections
- External subscriptions
- DOM elements created outside the component tree

The `BaseApplet` class provides an `onDestroy` hook that derived classes can override to perform cleanup.

## Example: RandomNumberApplet

The `RandomNumberApplet` demonstrates proper cleanup of an interval when the applet is unloaded:

```tsx
export class RandomNumberApplet extends BaseApplet {
  private numberSignal = createSignal<number>(Math.random());
  private intervalId: number | null = null;

  protected override onInit() {
    // Start an interval that updates the random number every second
    this.intervalId = window.setInterval(() => {
      this.numberSignal[1](Math.random());
    }, 1000);
  }

  protected override onDestroy() {
    // Clean up the interval when the applet is destroyed
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  render() {
    return (
      <div>
        <h3>Random Number Generator</h3>
        <div>{this.numberSignal[0]().toFixed(6)}</div>
      </div>
    );
  }
}
```

## Dynamically Loading Applets

The `AppletLauncher` component demonstrates how to dynamically load and unload applets:

```tsx
// Load an applet
const loadApplet = () => {
  // Create a unique instance ID
  const instanceId = `applet.id.${Date.now()}`;
  
  // Create custom metadata with the unique ID
  const customMetadata = {
    ...AppletFactory.metadata,
    id: instanceId
  };
  
  // Create a new applet instance
  const applet = new AppletClass(customMetadata);
  
  // Register the applet with the core
  core.registerApplet(applet);
};

// Unload an applet
const unloadApplet = (id) => {
  // Unregister the applet (this calls destroy)
  core.unregisterApplet(id);
};
```

## Benefits of Dynamic Loading

Dynamic applet loading provides several benefits:

1. **Resource Efficiency**: Only load applets when they're needed
2. **Memory Management**: Release resources when applets are no longer needed
3. **User Experience**: Show/hide features based on user actions
4. **Extensibility**: Load new applets at runtime from external sources

## Best Practices

1. Always clean up resources in the `onDestroy` method
2. Use unique IDs for dynamically loaded applet instances
3. Make applets self-contained to avoid leaking references
4. Use signals and reactive state for UI updates
5. Verify an applet is properly unregistered after unloading
