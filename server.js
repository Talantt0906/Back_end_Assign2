const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.use(express.static('public'));

// 1. weater API
app.get('/api/weather', async (req, res) => {
    try {
        const city = req.query.city;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const d = response.data;
        res.json({
            temperature: d.main.temp,
            description: d.weather[0].description,
            coordinates: d.coord,
            feels_like: d.main.feels_like,
            wind_speed: d.wind.speed,
            country_code: d.sys.country,
            rain: d.rain ? (d.rain['3h'] || 0) : 0
        });
    } catch (e) { res.status(500).json({ error: "Weather data failed" }); }
});

// 2. country API
app.get('/api/country/:code', async (req, res) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/alpha/${req.params.code}`);
        const c = response.data[0];
        
        
        const currencyKey = Object.keys(c.currencies || {})[0];
        const currencyData = c.currencies[currencyKey];

        res.json({
            fullName: c.name.official,
            flag: c.flags.png,
            population: c.population,
            region: c.region,
            currencyCode: currencyKey, 
            currencyName: currencyData ? currencyData.name : "N/A"
        });
    } catch (e) { res.status(500).json({ error: "Country failed" }); }
});

//  3. currency API
app.get('/api/exchange/:currency', async (req, res) => {
    try {
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        const rate = response.data.rates[req.params.currency];
        res.json({ rate: rate ? rate.toFixed(2) : "N/A" });
    } catch (e) { res.json({ rate: "N/A" }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));