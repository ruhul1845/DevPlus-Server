import app from "./app.js";
import config from "./config/index.js";
import { initDB } from "./db/index.js";

const main = async () => {
  await initDB();
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main().catch((error) => {
  console.log("Failed to start DevPulse API", error);
  process.exit(1);
});
