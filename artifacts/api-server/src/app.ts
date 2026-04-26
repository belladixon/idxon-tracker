import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Serve the built React frontend.
// In production (Azure App Service) the Vite build outputs to
// artifacts/reading-tracker/dist/public/, and the Express bundle lives at
// artifacts/api-server/dist/index.mjs, so we step two levels up.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, "../../reading-tracker/dist/public");

app.use(express.static(frontendDist));

// SPA fallback — any route that isn't /api/* and isn't a static asset returns
// index.html so that client-side routing (Wouter) works correctly.
// Uses app.use() (not app.get("*")) because Express 5 dropped bare-wildcard support.
app.use((_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
