const redis = require('../utils/redis');
const db = require('../utils/db');

class AppController {
    async getstatus(req, res) {
        const redisAlive = await redis.isAlive();
        const dbAlive = await redis.isAlive();

        res.status(200).json({
            "redis": redisAlive,
            "db": dbAlive 
        });
    }

    async getstats(req, res) {
        const numFiles = await db.nbFiles();
        const numUsers = await db.nbUsers();

        res.status(200).json({
            "users": numUsers,
            "files": numFiles
        });
    }
}
module.exports = AppController;