import server from "../src/server/server";

describe("Server Test", () => {
  beforeAll(() => {
    server.listen(4000).then(() => {
      expect(server.httpServer.listening).toBe(true);
    });
  });

  afterAll(() => {
    server.close().then(() => {
      expect(server.httpServer.listening).toBe(false);
    });
  });

  test("Server should run and respond", (done) => {
    expect(server.httpServer.listening).toBe(true);
    done();
  });
});
