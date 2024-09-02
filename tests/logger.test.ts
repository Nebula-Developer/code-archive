import logger from "../src/logger";

test("Logger Test", () => {
  logger.debug("debug");
  logger.log("info");
  logger.warn("warn");
  logger.error("error");
});
