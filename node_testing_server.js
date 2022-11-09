const express = require('express');
const app = express();

const http = require('http');
const url = require('url');

const port = 8080
app.get('/*', (req, res) => {
  const queryObject = url.parse(req.url, true);

  res.sendFile(queryObject.pathname, {root: __dirname })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
