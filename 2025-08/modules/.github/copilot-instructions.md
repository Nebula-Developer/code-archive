# Overlay Platform -- Goals & Context

## Purpose

Build a lightweight **overlay platform** (like a student-focused
command/utility overlay) where features aren't hardcoded; they're
modular **applets** and **services** dynamically plugged in.

## Core Responsibilities

-   Provide applet lifecycle: load, instantiate, destroy.
-   Offer shared services: reactive state, event buses, etc.
-   Maintain registry of services and applets; allow applets to request
    services by ID/type.

## Services

-   Self-contained providers of reactive state and event APIs.
-   Do not know about applets---only expose state and events.

## Applets

-   Small modular units of UI + logic.
-   Request services (typed), render UI, and emit/listen to events
    through services.
-   Never directly reference other applets.

## Reactivity

-   Applet state will normally use Solid's `createMutable`, so UI updates
    automatically when state changes. But, this should not be hard coded into
    the types.

## Communication

-   Applets don't communicate directly---everything happens through
    service events (decoupled), or states, etc.

## Extensible / Future-Proof

-   Could support downloading applets at runtime.
-   Could support remounting views in different UI "slots" or windows.
-   Keeps core minimal and stable; features live in applets.

------------------------------------------------------------------------

**In short**: You're building a modular overlay system with a clean
separation: - **Core**: orchestrates. - **Services**: state & events. -
**Applets**: UI + logic that consume services.
