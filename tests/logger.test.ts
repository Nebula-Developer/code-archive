import logger, { attributeObject } from "../src/logger";

test("Logger Test", () => {
  logger.debug("debug");
  logger.log("info");
  logger.warn("warn");
  logger.error("error");
});

test("Attribute Test", () => {
  expect(attributeObject({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
  expect(attributeObject([
    { a: 1, b: 2, c: 3 },
    { a: 4, b: 5, c: 6 },
  ], ["a", "c"])).toEqual([
    { a: 1, c: 3 },
    { a: 4, c: 6 },
  ]);
});

test("Attribute Test with Exclude", () => {
  expect(attributeObject({ a: 1, b: 2, c: 3 }, ["a", "c"], ["c"])).toEqual({ a: 1 });
  expect(attributeObject([
    { a: 1, b: 2, c: 3 },
    { a: 4, b: 5, c: 6 },
  ], ["a", "c"], ["c"])).toEqual([
    { a: 1 },
    { a: 4 },
  ]);
});
