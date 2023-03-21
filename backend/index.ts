import cors from "cors";
import express from "express";
import expressWs from "express-ws";
import { ActiveConnections, BasePixels, IncomingMessage } from "./types";
import * as crypto from "crypto";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const router = express.Router();
app.use(router);

const activeConnections: ActiveConnections = {};
const basePixels: BasePixels[] = [];

router.ws("/canvas", (ws, req) => {
  const id = crypto.randomUUID();
  console.log("client connected! id=" + id);

  activeConnections[id] = ws;

  for (const basePixel of basePixels) {
    ws.send(
      JSON.stringify({
        type: "NEW_PIXELS",
        payload: basePixel,
      })
    );
  }

  ws.on("message", (message) => {
    const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

    basePixels.push(decodedMessage.payload);
    switch (decodedMessage.type) {
      case "SET_PIXELS":
        Object.keys(activeConnections).forEach((id) => {
          const conn = activeConnections[id];
          conn.send(
            JSON.stringify({
              type: "NEW_PIXELS",
              payload: decodedMessage.payload,
            })
          );
        });
        break;
      default:
        console.log("Unknown type", decodedMessage.type);
    }
  });

  ws.on("close", () => {
    console.log("client disconnected! id=" + id);
    delete activeConnections[id];
  });
});

app.listen(port, () => {
  console.log("We are live on " + port);
});
