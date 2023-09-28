const Collection = require('mongodb/lib/collection');

const { MongoClient } = require('mongodb');

class DBClient {
  constructor () {
    // Use ternary if statement to determine the variables
    const host = (process.env.DB_HOST) ? process.env.DB_HOST : 'localhost'
    const port = (process.env.DB_PORT) ? process.env.DB_HOST : 27017;
    this.db = (process.env.DB_DATABASE) ? process.env.DB_DATABASE : 'files_manager';
    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url);


  }

  isAlive () {
   return this.client.connect()
  }

  async nbUsers () {
    const numUser = await Collection.find({ users }).toArray();
    return numUser;
  }

  async nbFiles () {
    const numFiles = await Collection.find({ files }).toArray();
    return numFiles;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
