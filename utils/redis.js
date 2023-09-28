const { resolve } = require('mongodb/lib/core/topologies/read_preference');
const redis = require('redis');

class RedisClient {
  constructor () {
    this.client = redis.createClient({
      host: 'localhost',
      port: 6379
    });
    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  isAlive () {
    return this.client.connected;
  }

  async get (key) {
    return new Promise((reolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async set (key, value, duration) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.client.set(key, value, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            resolve(reply);
          }
        });
      }, duration);
    });
  }

  async del (key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
