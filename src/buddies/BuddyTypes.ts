import { JSX } from "solid-js";

export interface Position {
  x: number;
  y: number;
}

export interface BuddyConfig {
  // Base properties all buddies share
  initialPosition: Position;
  frameRate?: number;  // milliseconds between frames
  width?: number;
  height?: number;
  zIndex?: number;
}

// Base interface all buddies will implement
export interface DesktopBuddy {
  // Core methods
  render: () => JSX.Element;
  handleClick: (clickPosition: Position) => void;
  
  // Optional lifecycle methods
  cleanup?: () => void;
  initialize?: () => void;
}

// Registry of available animation categories
export enum AnimationCategory {
  FrameAngle = "frame-angle-animation",
  // Future categories can be added here
} 