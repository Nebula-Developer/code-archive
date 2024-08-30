import server from '../server';

describe('Server Test', () => {
  beforeAll(() => {
    server.listen(4000);
  });

  afterAll(() => {
    let listenCount = 0;
    const listenSpin = setInterval(() => {
      if (server.httpServer.listening) {
        server.close();
        clearInterval(listenSpin);
      } else {
        listenCount++;
        if (listenCount > 10) {
          clearInterval(listenSpin);
        }
      }
    }, 100);
  });

  test('Server should run and respond', (done) => {
    expect(server.httpServer.listening).toBe(true);
    done();
  });
});