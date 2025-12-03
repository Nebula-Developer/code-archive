import logger, { attributeObject } from "../src/logger";

describe("Logger Test", () => {
  test("Logger Test", () => {
    logger.debug("debug");
    logger.log("info");
    logger.warn("warn");
    logger.error("error");
  });

  test("Attribute Test", () => {
    expect(attributeObject({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({
      a: 1,
      c: 3,
    });

    expect(
      attributeObject(
        [
          { a: 1, b: 2, c: 3 },
          { a: 4, b: 5, c: 6 },
        ],
        ["a", "c"]
      )
    ).toEqual([
      { a: 1, c: 3 },
      { a: 4, c: 6 },
    ]);
  });

  test("Attribute Test with Exclude", () => {
    expect(attributeObject({ a: 1, b: 2, c: 3 }, ["a", "c"], ["c"])).toEqual({
      a: 1,
    });

    expect(
      attributeObject(
        [
          { a: 1, b: 2, c: 3 },
          { a: 4, b: 5, c: 6 },
        ],
        ["a", "c"],
        ["c"]
      )
    ).toEqual([{ a: 1 }, { a: 4 }]);
  });

  test("Attribute Test with nested values", () => {
    const base = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
        f: [
          { a: 1, b: 2 },
          { a: 3, b: 4 },
        ],
      },
    };

    logger.debug(attributeObject(base, ["a", "c.d", "c.f.a"]));

    expect(
      attributeObject(base, ["a", "c.d", "c.f.a", "does.not.exist"])
    ).toEqual({
      a: 1,
      c: {
        d: 3,
        f: [{ a: 1 }, { a: 3 }],
      },
    });
  });
});
