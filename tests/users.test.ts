import User from "../src/models/User"

describe('Users Test', () => {
  const email = "testuser" + Date.now() + "@test.com";
  it('should create a user', (done) => {
    const user = User.create({
      username: "testuser",
      email: email,
      password: "password"
    }).then(() => {
      expect(user).toBeTruthy();
      done();
    });
  });

  it('should find a user', (done) => {
    User.findOne({
      where: {
        email
      }
    }).then((user) => {
      expect(user).toBeTruthy();
      done();
    });
  });

  it('should delete a user', (done) => {
    User.destroy({
      where: {
        email
      }
    }).then(() => {
      User.findOne({
        where: {
          email
        }
      }).then((user) => {
        expect(user).toBeFalsy();
        done();
      });
    });
  });

  it('should not find a user', (done) => {
    User.findOne({
      where: {
        email
      }
    }).then((user) => {
      expect(user).toBeFalsy();
      done();
    });
  });
});
