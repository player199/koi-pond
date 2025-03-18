import { DesktopBuddy, AnimationCategory, BuddyConfig } from "./BuddyTypes";
import { KoiFish, KoiFishConfig } from "./frame-angle-animation/koi-fish/KoiFish";

export type BuddyType = "koi-fish" | string; // Add more types as needed

export class BuddyFactory {
  // Create a buddy of the specified type
  static createBuddy(type: BuddyType, config: BuddyConfig): DesktopBuddy | null {
    switch (type) {
      case "koi-fish":
        return new KoiFish(config as KoiFishConfig);
      
      // Add more cases for other buddy types
      
      default:
        console.error(`Unknown buddy type: ${type}`);
        return null;
    }
  }

  // Get the animation category for a given buddy type
  static getBuddyCategory(type: BuddyType): AnimationCategory | null {
    switch (type) {
      case "koi-fish":
        return AnimationCategory.FrameAngle;
      
      // Add more cases for other buddy types
      
      default:
        console.error(`Unknown buddy type: ${type}`);
        return null;
    }
  }
} 