import redis from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getstatus(req, res) {
    const redisAlive = redis.isAlive();
    const dbAlive = dbClient.isAlive();

    res.status(200).json({
      redis: redisAlive,
      db: dbAlive,
    });
  }

  static async getstats(req, res) {
    const numFiles = await dbClient.nbFiles();
    const numUsers = await dbClient.nbUsers();

    res.status(200).json({
      users: numUsers,
      files: numFiles,
    });
  }
}
module.exports = AppController;
