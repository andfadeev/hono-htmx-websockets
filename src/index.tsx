import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

app
  .get("/", (c) => {
    return c.html(
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Hono HTMX Websockets</title>
          <script
            src="https://unpkg.com/htmx.org@1.9.12"
            integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
            crossOrigin="anonymous"
          />
          <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js" />
        </head>
        <body style="background:black">
          <div>
            <h1 style="color:white">Order Status:</h1>
            {/* <div hx-ext="ws" ws-connect="/order/1/status">
              <div id="orderUpdate" hx-swap-oob="beforeend"></div>
            </div> */}
          </div>
        </body>
      </html>,
    );
  })
  .get(
    "/order/1/status",
    upgradeWebSocket((c) => {
      let intervalId: ReturnType<typeof setInterval>;
      return {
        onOpen(_event, ws) {
          intervalId = setInterval(() => {
            console.log("Sending order update");
            ws.send(
              `<div id="orderUpdate" hx-swap-oob="beforeend"><h2 style="color:white">Order Updated</h2></div>`,
            );
          }, 2000);
        },
        onClose() {
          clearInterval(intervalId);
        },
      };
    }),
  );

export default {
  fetch: app.fetch,
  websocket,
};
