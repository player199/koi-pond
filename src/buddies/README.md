# Desktop Buddy System

This folder contains a modular system for creating different types of desktop buddies that can be animated in various ways.

## Structure

- `BuddyTypes.ts` - Core interfaces and types for all buddies
- `BuddyFactory.ts` - Factory to create buddies of different types
- `frame-angle-animation/` - Animation category for buddies that use frames and angles
  - `FrameAngleBuddy.tsx` - Base class for this animation category
  - `koi-fish/` - Specific implementation for koi fish

## How to Add a New Buddy

### 1. Adding a new buddy to an existing animation category

For example, to add a new frame-angle animated buddy (like a duck):

1. Create a new folder: `src/buddies/frame-angle-animation/duck/`
2. Add your assets to `src/assets/duck-frames/` with naming convention `duck-[angle]-[frame].png`
3. Create a class extending `FrameAngleBuddy` in `src/buddies/frame-angle-animation/duck/Duck.tsx`
4. Update `BuddyFactory.ts` to support the new buddy type

### 2. Adding a new animation category

To add an entirely new animation system:

1. Create a new folder for the category: `src/buddies/your-category/`
2. Define a base class for your animation system 
3. Add specific implementations within that folder
4. Update `AnimationCategory` enum in `BuddyTypes.ts`
5. Update `BuddyFactory.ts` to recognize the new animation category and buddy types

## Buddy Configurations

Each buddy type can have its own configuration options that extend the base `BuddyConfig` interface.

## Using Buddies in the App

```tsx
// Example of creating a buddy
const buddy = BuddyFactory.createBuddy("koi-fish", { initialPosition: { x: 0, y: 0 } });

// Handle click events
buddy.handleClick(clickPosition);

// Render the buddy
return <div>{buddy.render()}</div>;
``` 