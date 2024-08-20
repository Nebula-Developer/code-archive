import { Server as IOServer } from "socket.io";
import { Server } from "http";
import Game, { Result } from "./gameManager";
import logger from "./logger";

const httpServer = new Server((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

const io = new IOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

type DataTypeSchema = { [key: string]: { type: string; required: boolean } };

io.on("connection", (socket) => {
  function socketListener(
    name: string,
    handler: (props: {
      data: any;
      success: (data?: any) => void;
      error: (error?: string) => void;
      callback: (...args: any[]) => void;
    }) => void,
    datatypes?: DataTypeSchema
  ) {
    socket.on(name, (data, callback) => {
      var cbk =
        !!callback && typeof callback === "function" ? callback : () => {};

      if (data === undefined || !data) {
        cbk({
          success: false,
          error: "Got undefined data",
        });
        return;
      }

      if (typeof data !== "object") {
        cbk({
          success: false,
          error: `Expected object data, got '${typeof data}'`,
        });
        return;
      }

      if (datatypes) {
        for (const [key, { type, required }] of Object.entries(datatypes)) {
          if (required && data[key] === undefined) {
            cbk({
              success: false,
              error: `Got undefined for required key '${key}'`,
            });
            return;
          }

          if (data[key] !== undefined && typeof data[key] !== type) {
            cbk({
              success: false,
              error: `Invalid data type for '${key}', got '${typeof data[
                key
              ]}' expected '${type}'`,
            });
            return;
          }
        }
      }

      handler({
        data,
        success: (data) => cbk({ success: true, data }),
        error: (error) => cbk({ success: false, error }),
        callback: cbk,
      });
    });
  }

  socketListener(
    "say",
    ({ data, success }) => {
      logger.info("Client said: " + data.message);
      success();
    },
    {
      message: {
        required: false,
        type: "string",
      },
    }
  );
});

async function listen(port: number) {
  return httpServer.listen(port, () => {
    logger.info("listening on *:" + port);
  });
}

export default {
  listen,
  httpServer,
  io,
};
