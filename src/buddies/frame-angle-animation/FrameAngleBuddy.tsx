import { createSignal, onCleanup, createEffect, JSX } from "solid-js";
import { Position, DesktopBuddy, BuddyConfig } from "../BuddyTypes";

export interface FrameAngleConfig extends BuddyConfig {
  // Properties specific to frame-angle animations
  frameCount: number;
  directionStepDegrees?: number;  // Default: 15
  transitionDuration?: number;    // Default: 1.5s
}

export abstract class FrameAngleBuddy implements DesktopBuddy {
  protected position = createSignal<Position>({ x: 0, y: 0 });
  protected direction = createSignal<number>(0);
  protected frame = createSignal<number>(1);
  protected config: FrameAngleConfig;
  protected element: HTMLDivElement | undefined;

  constructor(config: FrameAngleConfig) {
    this.config = {
      ...config,
      directionStepDegrees: config.directionStepDegrees || 15,
      frameRate: config.frameRate || 50,
      transitionDuration: config.transitionDuration || 1.5,
      width: config.width || 175,
      height: config.height || 150,
      zIndex: config.zIndex || 1
    };
    
    // Initialize position with config
    this.position[1](config.initialPosition);
  }

  // Methods that concrete implementations must provide
  protected abstract getImagePath(): string;
  
  // Initialize animation cycle
  public initialize(): void {
    const interval = setInterval(() => {
      this.incrementFrame();
    }, this.config.frameRate);

    onCleanup(() => clearInterval(interval));
  }

  // Protected helper methods
  protected incrementFrame(): void {
    const [frame, setFrame] = this.frame;
    setFrame((prev) => (prev % this.config.frameCount) + 1);
  }

  protected calculateStyle(): string {
    const [position] = this.position;
    
    // Get dimensions from config
    const fishWidth = this.config.width!;
    const fishHeight = this.config.height!;
    
    // Center offsets (approximately half of the dimensions)
    const offsetX = fishWidth / 2;
    const offsetY = fishHeight / 2;
    
    // Get viewport dimensions with small margin
    const viewportWidth = window.innerWidth - 10;
    const viewportHeight = window.innerHeight - 10;
    
    // Calculate constrained position
    const constrainedX = Math.max(offsetX + 10, Math.min(position().x, viewportWidth - (fishWidth - offsetX + 10)));
    const constrainedY = Math.max(offsetY + 10, Math.min(position().y, viewportHeight - (fishHeight - offsetY + 10)));
    
    return `position: absolute; 
      left: ${constrainedX - offsetX}px; 
      top: ${constrainedY - offsetY}px; 
      animation-timing-function: ease-in-out;
      transition: top ${this.config.transitionDuration}s, left ${this.config.transitionDuration}s, transform 0.5s;
      z-index: ${this.config.zIndex};
    `;
  }

  protected calculateDirection(oldPosition: Position, newPosition: Position): void {
    const [, setDirection] = this.direction;
    const x = oldPosition.x - newPosition.x;
    const y = oldPosition.y - newPosition.y;
    let angle = (Math.atan2(y, x) * 180) / Math.PI;

    if (angle < 0) angle = 360 + angle;
    
    const step = this.config.directionStepDegrees!;
    const roundedAngle = Math.round(angle / step) * step;
    const normalizedAngle = roundedAngle === 360 ? 0 : roundedAngle;
    
    setDirection(normalizedAngle);
  }

  // Core interface implementations
  public handleClick(clickPosition: Position): void {
    const [position, setPosition] = this.position;
    
    if (this.sendHome(clickPosition)) return;

    this.calculateDirection(position(), clickPosition);
    setPosition(clickPosition);
  }

  protected sendHome(clickPosition: Position): boolean {
    if (!this.element) return false;

    const [position, setPosition] = this.position;
    const homePosition = this.config.initialPosition;
    const boundingBox = this.element.getBoundingClientRect();
    
    if (!this.boundingBoxIsClicked(boundingBox, clickPosition)) return false;

    this.calculateDirection(position(), homePosition);
    setPosition(homePosition);
    return true;
  }

  protected boundingBoxIsClicked(boundingBox: DOMRect, clickPosition: Position): boolean {
    const { x, y } = clickPosition;

    return (
      x > boundingBox.left &&
      x < boundingBox.right &&
      y > boundingBox.top &&
      y < boundingBox.bottom
    );
  }

  // Render method
  public render(): JSX.Element {
    return (
      <div style={this.calculateStyle()} ref={(el) => this.element = el}>
        <img width={this.config.width} src={this.getImagePath()} />
      </div>
    );
  }
} 