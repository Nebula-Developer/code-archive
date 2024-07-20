import express from 'express';
import { User, Remedy } from './server';
import jwt from 'jsonwebtoken';

const router = express.Router();

type EndpointMethod = (params: {
  req: express.Request, res: express.Response,
  next: express.NextFunction, user?: User,
}, success: (data: object) => void, error: (error: string) => void) => void;

function endPoint(name: string, method: EndpointMethod, auth: boolean = false) {
  router.post(`/${name}`, async (req, res, next) => {
    let user: User | undefined = undefined;

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, 'secret', async (err, userRes) => {
        if (err && auth) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        
        if (userRes)
          user = (await User.findByPk((userRes as any).id)) ?? undefined;
      });
    }

    method({ req, res, next, user }, (data) => {
      res.json(data);
    }, (error) => {
      res.status(400).json({ error });
    });
  });
}

endPoint('login', async ({ req, res, next }, success, error) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    error('Invalid email or password');
    return;
  }

  const user = await User.findOne({ where: { email, password } });

  if (!user) {
    error('Invalid email or password');
    return;
  }

  const token = jwt.sign({ id: user.id }, 'secret');
  success({ token });
});

endPoint('register', async ({ req, res, next }, success, error) => {
  const { email, name, password } = req.body;
  if (typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string') {
    error('Invalid email, name or password');
    return;
  }

  try {
    const user = await User.create({ email, name, password });
    success({ user });
  } catch (e) {
    error('Email already exists');
  }
});

export default router;
