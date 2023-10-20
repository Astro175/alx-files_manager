import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const fs = require('fs').promises;
const path = require('path');

const Usercollection = dbClient.client.db('files_manager').collection('users');
const Filecollection = dbClient.client.db('files_manager').collection('files');
class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const value = redisClient.get(key);
    const _id = ObjectId(value);
    const user = Usercollection.find({ _id });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const {
      name, type, isPublic, data,
    } = req.body;
    let { parentId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId) {
      const _id = new ObjectId(parentId);
      const file = Filecollection.find({ _id });

      if (!file) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    const userId = user._id;
    if (type === 'folder') {
      const newFile = {
        userId,
        name,
        type,
        parentId,
        isPublic,
      };
      const folder = await Filecollection.insertOne(newFile);
      return res.status(201).json({ folder });
    }
    const directoryPath = (process.env.FOLDER_PATH) ? process.env.FOLDER_PATH : '/tmp/files_manager';
    const filename = uuidv4();
    const filepath = path.join(directoryPath, filename);
    const fileData = Buffer.from(data, 'base64').toString('utf-8');
    try {
      await fs.writeFile(filepath, fileData);
    } catch (err) {
      console.log(`Got an error trying to write to a file: ${err.message}`);
    }
    const localpath = path.join(__dirname, filepath);

    if (!parentId) {
      parentId = 0;
    }
    const newFile = {
      userId,
      name,
      type,
      parentId,
      isPublic,
      localpath,
    };
    const folder = await Filecollection.insertOne(newFile);
    return res.status(201).json({ folder });
  }
}

module.exports = FilesController;
