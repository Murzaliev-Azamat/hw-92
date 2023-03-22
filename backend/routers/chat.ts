// import express from "express";
// import expressWs from "express-ws";
// import { OAuth2Client } from "google-auth-library";
// import config from "../config";
// import * as crypto from "crypto";
// import { ActiveConnections, IncomingMessage } from "../types";
//
// const chatRouter = express.Router();
//
// const client = new OAuth2Client(config.google.clientId);
//
// const activeConnections: ActiveConnections = {};
// const basePixels: BasePixels[] = [];

// chatRouter.ws("/", (ws, req) => {
//   const id = crypto.randomUUID();
//   console.log("client connected! id=", id);
//   activeConnections[id] = ws;
//   let username = "Anonymous";
//
//   ws.on("message", (msg) => {
//     const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
//
//     switch (decodedMessage.type) {
//       case "SET_USERNAME":
//         username = decodedMessage.payload;
//         break;
//       case "SEND_MESSAGE":
//         Object.keys(activeConnections).forEach((connId) => {
//           const conn = activeConnections[connId];
//           conn.send(
//             JSON.stringify({
//               type: "NEW_MESSAGE",
//               payload: {
//                 username,
//                 text: decodedMessage.payload,
//               },
//             })
//           );
//         });
//         break;
//       default:
//         console.log("Unknown message type:", decodedMessage.type);
//     }
//   });
//
//   ws.on("close", () => {
//     console.log("client disconnected! id=" + id);
//     delete activeConnections[id];
//   });
// });
// export default chatRouter;
