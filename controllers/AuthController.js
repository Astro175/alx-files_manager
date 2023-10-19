import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redis from '../utils/redis';
const sha1 = require('sha1');

class AuthController {
  static async getConnect (req, res) {
    const { authorization } = req.headers;
    const authData = authorization.slice(6);
    const authConverted = Buffer.from(authData.split(' ')[1], 'base64').toString('utf-8');
    const [email, password] = authConverted.split(':');

    if (!email) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const hashedPw = sha1(password);
    const Usercollection = dbClient.client.db('files_manager').collection('users');
    const user = await Usercollection.findOne({ email: email, password: hashedPw });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const token = uuidv4();
      const key = `auth_${token}`;
      const done = await redis.set(key, user._id.toString(), 86400);
      if (done) {
        res.status(200).json({ token: 'token' });
      }
    }
  }

  static async getDisconnect (req, res) {
    const token = req.headers['X-token'];
    const key = `auth_${token}`;
    const userId = await redis.get(key);
    if (!userId) {
      res.status(401).json({ error: 'unauthorized' });
    } else {
      await redis.del(key);
      res.status(204).json({});
    }
  }
}

module.exports = AuthController;
