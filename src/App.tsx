import "./App.css";
import { createSignal, onCleanup, createEffect, onMount } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import { checkForAppUpdates } from "./updater";
import { BuddyFactory } from "./buddies/BuddyFactory";
import { Position } from "./buddies/BuddyTypes";

function App() {
  // Create koi fish at a default position
  const homePosition = { x: 0, y: 0 };
  const buddy = BuddyFactory.createBuddy("koi-fish", { initialPosition: homePosition });
  
  if (!buddy) {
    return <div>Failed to create buddy!</div>;
  }
  
  onMount(async () => {
    // Check for updates
    await checkForAppUpdates();
    
    // Initialize the buddy
    buddy.initialize?.();
    
    // Listen for mouse clicks
    listen<Position>("mouse_click", (event) => {
      buddy.handleClick(event.payload);
    });
  });

  return (
    <div class="container">
      {buddy.render()}
    </div>
  );
}

export default App;
