import cors from "cors";
import express from "express";
import expressWs from "express-ws";
import { ActiveConnections, IncomingMessage, IUser } from "./types";
import * as crypto from "crypto";
import usersRouter from "./routers/users";
import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use("/users", usersRouter);

const router = express.Router();
app.use(router);

const activeConnections: ActiveConnections = {};
const baseUsers: IUser[] = [];

router.ws("/chat", async (ws, req) => {
  const id = crypto.randomUUID();
  console.log("client connected! id=", id);
  activeConnections[id] = ws;
  let user: IUser | null = null;

  for (const baseUser of baseUsers) {
    ws.send(
      JSON.stringify({
        type: "NEW_USER",
        payload: baseUser,
      })
    );
  }

  ws.on("message", async (msg) => {
    const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

    switch (decodedMessage.type) {
      case "LOGIN":
        user = await User.findOne({ token: decodedMessage.payload });
        if (user) {
          baseUsers.push(user);
        }
        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];
          conn.send(
            JSON.stringify({
              type: "NEW_USER",
              payload: user,
            })
          );
        });
        break;
      case "SEND_MESSAGE":
        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];
          conn.send(
            JSON.stringify({
              type: "NEW_MESSAGE",
              payload: {
                text: decodedMessage.payload,
              },
            })
          );
        });
        break;
      default:
        console.log("Unknown message type:", decodedMessage.type);
    }
  });

  ws.on("close", () => {
    console.log("client disconnected! id=" + id);
    delete activeConnections[id];
    Object.keys(activeConnections).forEach((connId) => {
      const conn = activeConnections[connId];
      conn.send(
        JSON.stringify({
          type: "DELETE_USER",
          payload: user,
        })
      );
    });
  });
});

const run = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log("We are live on " + port);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
