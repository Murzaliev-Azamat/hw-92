import { WebSocket } from "ws";

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface BasePixels {
  x: string;
  y: string;
}

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface IUser {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  googleId?: string;
  image?: string;
}

// export interface IncomingMessage {
//   type: string;
//   payload: BasePixels;
// }
