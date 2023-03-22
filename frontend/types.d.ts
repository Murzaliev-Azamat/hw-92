// export interface CanvasPixels {
//   x: string;
//   y: string;
// }
//
// export interface IncomingMessage {
//   type: string;
//   payload: CanvasPixels;
// }
//
// export interface PixelsApi {
//   x: string;
//   y: string;
// }

export interface ChatMessage {
  username: string;
  text: string;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  image?: string;
  token: string;
  role: string;
}

export interface IncomingMessage {
  type: string;
  payload: ChatMessage;
}

export interface IncomingMessageForUsers {
  type: string;
  payload: User;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
  image: File | null;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface GlobalError {
  error: string;
}

