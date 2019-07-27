const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');
const $path = require('path');

//For reference
// const publicDir = $path.resolve('./public');

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))