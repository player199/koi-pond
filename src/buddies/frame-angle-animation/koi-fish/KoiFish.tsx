import { FrameAngleBuddy, FrameAngleConfig } from "../FrameAngleBuddy";
import { Position } from "../../BuddyTypes";

// Import all potential image folders statically
const koiFrames = import.meta.glob<{ default: string }>("../../../assets/koi-frames/*.png", { eager: true });

export interface KoiFishConfig extends FrameAngleConfig {
  // Koi specific config options can be added here
}

export class KoiFish extends FrameAngleBuddy {
  constructor(config: KoiFishConfig) {
    // Set koi fish defaults
    super({
      ...config,
      frameCount: 12,  // Koi has 12 frames per animation
      width: config.width || 175,
      height: config.height || 150
    });
  }

  protected getImagePath(): string {
    const [direction] = this.direction;
    const [frame] = this.frame;
    
    const dir = direction().toString().padStart(3, '0');
    const frameNum = frame().toString().padStart(2, '0');
    const path = `../../../assets/koi-frames/koi-${dir}-${frameNum}.png`;
    
    return koiFrames[path]?.default || "";
  }
} 