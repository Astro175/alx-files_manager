import dbClient from '../utils/db';

const sha1 = require('sha1');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    const Usercollection = dbClient.client.db('files_manager').collection('users');

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await Usercollection.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPw = sha1(password);
    const newUser = {
      email,
      password: hashedPw,
    };
    const record = await Usercollection.insertOne(newUser);
    const id = record.insertedId;

    return res.status(201).json({ email, id });
  }
}

module.exports = UsersController;
