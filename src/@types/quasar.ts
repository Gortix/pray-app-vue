export interface Details {
    evt: Event;
    touch: boolean;
    mouse: boolean;
    position: { top: number; left: number };
    duration: number;
  }