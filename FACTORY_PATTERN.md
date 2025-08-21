# Applet Factory Pattern

## Overview

The Applet Factory pattern is used in the Nebula Platform to provide a clean and flexible way to create applet instances. This pattern brings several benefits to the architecture:

## Benefits of the Applet Factory Pattern

1. **Separation of Concerns**: 
   - Keeps applet creation logic separate from the core platform
   - Allows the core to work with applets without knowing how to create them

2. **Dynamic Loading**:
   - Supports potential future dynamic loading of applets
   - Makes it possible to lazy-load applets only when needed

3. **Metadata Access**:
   - Provides access to applet metadata (ID, name, description) without instantiating the applet
   - Allows listing available applets in a UI without loading them all

4. **Centralized Registration**:
   - The `AppletRegistry` provides a single place to register all applets
   - Makes it easy to discover and manage available applets

5. **Configuration**:
   - Allows passing different configurations to applets when they're created
   - Supports potential future customization of applets

## How It Works

The factory pattern is implemented with three main components:

1. **AppletFactory Interface**: Defines the contract for applet factories
   ```typescript
   export interface AppletFactory<T extends IApplet = IApplet> {
     create(): T;
     readonly metadata: AppletMetadata;
   }
   ```

2. **createAppletFactory Function**: Creates a factory for a specific applet class
   ```typescript
   export function createAppletFactory<T extends IApplet>(
     AppletClass: new (metadata: AppletMetadata) => T,
     metadata: AppletMetadata
   ): AppletFactory<T> {
     return {
       create: () => new AppletClass(metadata),
       metadata
     };
   }
   ```

3. **AppletRegistry**: Manages all registered applet factories
   ```typescript
   export class AppletRegistry {
     private static factories: Map<string, AppletFactory<any>> = new Map();
     
     static registerFactory<T extends IApplet>(factory: AppletFactory<T>): void {
       this.factories.set(factory.metadata.id, factory);
     }
     
     static getFactory<T extends IApplet>(id: string): AppletFactory<T> | undefined {
       return this.factories.get(id);
     }
     
     static getAllFactories(): AppletFactory<IApplet>[] {
       return Array.from(this.factories.values());
     }
   }
   ```

## Usage Example

```typescript
// Create an applet class
export class MyApplet extends BaseApplet {
  render() {
    return <div>My Applet</div>;
  }
}

// Create a factory for the applet
export const MyAppletFactory = createAppletFactory(
  MyApplet, 
  {
    id: "my.applet",
    name: "My Applet",
    description: "A simple example applet"
  }
);

// Register the factory
AppletRegistry.registerFactory(MyAppletFactory);

// Later, create an instance when needed
const applet = MyAppletFactory.create();
```

## Future Possibilities

This pattern opens up several future possibilities:

1. **Dynamic Loading**: Applets could be downloaded at runtime
2. **Applet Store**: A UI for browsing and installing applets
3. **Versioning**: Support for multiple versions of the same applet
4. **User Configuration**: Allow users to configure applets before creating them
