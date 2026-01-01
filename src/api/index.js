const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors());

// Ruta para que tu Android busque animes
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  try {
    const { data } = await axios.get(`https://www3.animeflv.net/browse?q=${query}`);
    const $ = cheerio.load(data);
    const results = [];
    $('.ListAnimes li').each((i, el) => {
      results.push({
        title: $(el).find('.Title').text(),
        id: $(el).find('a').attr('href').replace('/anime/', ''),
        poster: $(el).find('img').attr('src')
      });
    });
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = app;
