import dbClient from '../utils/db';

const sha1 = require('sha1');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    const Usercollection = dbClient.client.db('files_manager').collection('users');

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }
    const user = await Usercollection.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
    }
    const hashedPw = sha1(password);
    const newUser = {
      email,
      password: hashedPw,
    };
    const record = await Usercollection.insertOne(newUser);
    const id = record.insertedId;

    res.status(201).json({ email, id });
    res.end();
  }
}

module.exports = UsersController;
