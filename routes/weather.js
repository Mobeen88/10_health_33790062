//Create new routers
const express = require("express");
const router = express.Router();
const request = require("request");

//Determines if weather is good for running
function getRunningMessage(weather) {
  if (!weather || !weather.main || !weather.weather) {
    return "Not enough data.";
  }

  const temp = weather.main.temp;
  const wind = weather.wind?.speed || 0;
  const condition = weather.weather[0].main.toLowerCase();

  //Rules for running
  if (temp < 0) return "Too cold for running";
  if (temp > 30) return "Too hot for running";
  if (wind > 12) return "Too windy for running";
  if (condition.includes("storm") || condition.includes("thunder"))
    return "Stormy conditions — unsafe for running";
  if (condition.includes("rain"))
    return "Light running possible, but it's raining";

  return "Great weather for running!";
}

//Render form
router.get("/", (req, res, next) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let queryCity = (req.query.city || "").trim();
  let city = queryCity;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  //If city is null
  if(!queryCity){
    return res.render("weather", { 
      weather: null, 
      error: null, 
      city: "",
      runningMessage: ""
    });
  }

  request(url, function (err, response, body) {
    if(err) return next(err);

    let weather;
    try { 
      weather = JSON.parse(body); 
    }
    catch(e){
      return res.render("weather", { 
        weather: null, 
        error: "Unable to parse weather data.", 
        city,
        runningMessage: ""
      });
    }

    if(!weather || !weather.main) {
      return res.render("weather", { 
        weather: null, 
        error: weather?.message || "City not found.", 
        city,
        runningMessage: ""
      });
    }

    res.render("weather", { 
      weather, 
      error: null, 
      city,
      runningMessage: getRunningMessage(weather)
    });
  });
});

router.post("/results", (req, res, next) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let city = (req.body.city || "").trim();
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  if(!city) {
    return res.render("weather", { 
      weather: null, 
      error: "Please enter a city name.", 
      city: "",
      runningMessage: ""
    });
  }

  request(url, function (err, response, body) {
    if(err) return next(err);

    let weather;
    try{ 
      weather = JSON.parse(body); 
    }
    catch(e){
      return res.render("weather", { 
        weather: null, 
        error: "Unable to parse weather data.", 
        city,
        runningMessage: ""
      });
    }

    if(!weather || !weather.main) {
      return res.render("weather", { 
        weather: null, 
        error: weather?.message || "City not found.", 
        city,
        runningMessage: ""
      });
    }

    res.render("weather", { 
      weather, 
      error: null, 
      city,
      runningMessage: getRunningMessage(weather)
    });
  });
});

router.get("/now", (req, res, next) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let city = req.query.city || "london";
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if(err) return next(err);

    let weather;
    try{ weather = JSON.parse(body); }
    catch(e){ 
        return res.send("Invalid weather data returned."); 
    }

    if(!weather || !weather.main){
      return res.send("No data found");
    }

    const wmsg =
      "It is " + weather.main.temp + "°C in " + weather.name +
      "!<br>Humidity: " + weather.main.humidity +
      "<br>Wind: " + (weather.wind?.speed ? weather.wind.speed + " m/s" : "N/A");

    res.send(wmsg);
  });
});

//Export the router object so index.js can access it
module.exports = router;
