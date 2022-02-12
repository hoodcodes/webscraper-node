const PORT = 7777;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();


app.listen(PORT,() => console.log(`server running on PORT ${PORT}`));