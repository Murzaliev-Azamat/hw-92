export interface CanvasPixels {
  x: string;
  y: string;
}

export interface IncomingMessage {
  type: string;
  payload: CanvasPixels;
}

export interface PixelsApi {
  x: string;
  y: string;
}
