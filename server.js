const express = require('express');
const routes = require('./routes/index');

const app = express();

const port = (process.env.PORT) ? process.env.PORT : 5000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
app.use('/', routes);
