import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js"; // pastikan .js jika sudah di-build
import { setupVite, serveStatic, log } from "./vite.js"; // juga tambahkan .js jika perlu

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // ...existing code...
  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }
})();

// Export default app for Vercel serverless
export default app;
