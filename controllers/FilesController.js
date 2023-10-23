import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { promisify } = require('util');
const mkdir = promisify(require('fs').mkdir);

const fs = require('fs').promises;

const Usercollection = dbClient.client.db('files_manager').collection('users');
const Filecollection = dbClient.client.db('files_manager').collection('files');
class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const value = await redisClient.get(key);

    const _id = ObjectId(value);
    const user = await Usercollection.findOne({ _id });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const {
      name, type, data, parentId, isPublic,
    } = req.body;

    const userId = user._id;

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
      const file = await Filecollection.findOne({ _id });

      if (!file) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    if (type === 'folder') {
      const newFile = {
        userId,
        name,
        type,
        parentId: parentId || 0,
        isPublic: isPublic || false,
      };
      const results = await Filecollection.insertOne(newFile);
      const folder = { ...results.ops[0] };
      return res.status(201).send({ ...folder, id: folder.insertedId });
    }

    const directoryPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const filename = uuidv4();
    const fileData = Buffer.from(data, 'base64');
    const localpath = `${directoryPath}/${filename}`;

    async function ensuredirexists(dirPath) {
      try {
        await mkdir(dirPath, { recursive: true });
      } catch (err) {
        console.log(`Error creating the directory: ${err.message}`);
      }
    }
    await ensuredirexists(directoryPath);
    try {
      await fs.writeFile(localpath, fileData);
    } catch (err) {
      console.log(`Got an error trying to write to a file: ${err.message}`);
    }

    console.log(userId);
    const newFile = {
      userId,
      name,
      type,
      parentId: parentId || 0,
      isPublic: isPublic || false,
      localpath,
    };
    const result = await Filecollection.insertOne(newFile);
    const folder = { ...result.ops[0] };
    delete folder.localpath;
    return res.status(201).send({ ...folder, id: folder.insertedId });
  }
}

module.exports = FilesController;
