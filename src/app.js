// input now  Date
function displaytDate() {
  let nowDate = new Date();
  // console.log(nowDate);
  let hours = nowDate.getHours();
  let minutes = nowDate.getMinutes();
  let day = nowDate.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${days[day]}  ${hours}:${minutes}`;
}

// set Unit Temperature
function setUnitTemperature(event) {
  event.preventDefault();
  if (unit === "metric") {
    currentTemp = (currentTemp * 9) / 5 + 32;
    document.querySelector("#units").innerHTML = "°F";
    currentWind = currentWind * 0.621371;
    unitWind = "miles/h";
    unit = "imperial";
  } else {
    currentTemp = ((currentTemp - 32) * 5) / 9;
    document.querySelector("#units").innerHTML = `°C`;
    currentWind = currentWind * 1.60934;
    unitWind = "km/h";
    unit = "metric";
  }
  document.querySelector("#setTempValue").innerHTML = `${Math.round(
    currentTemp
  )}`;
  document.querySelector("#wind").innerHTML = ` ${Math.round(
    currentWind
  )}${unitWind}`;
  getForecast(positionCityName);
}

// display Forecast;
function displayForecast(response) {
  // console.log(response.data.daily);
  function formatDayForecast(timestamp) {
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let nowDate = new Date(timestamp * 1000);
    let day = nowDate.getDay();
    console.log(days[day]);
    return days[day];
  }
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".weather-week");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2 weather-forecast-date">
            <div>${formatDayForecast(forecastDay.dt)}</div>
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
                alt="${forecastDay.weather[0].description}" width="64"/>
            <div class="weather-forecast-temp">
              <span class="weather-forecast-max">${Math.round(
                forecastDay.temp.max
              )}°  </span>
              <span class="weather-forecast-min">${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?${coordinates}&appid=${apiKey}&units=${unit}`;
  //  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  // console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

// set Unit Temperature
function displayWeatherCondition(response) {
  //   console.log(response.data);
  let displayCity = document.querySelector("h1");
  let displayDate = document.querySelector("#input-time");
  let displayIcons = document.querySelector("#weather-icon");
  let displayTemp = document.querySelector("#setTempValue");
  let displayDescript = document.querySelector("#description");
  let displayClouds = document.querySelector("#clouds");
  let displayHumidity = document.querySelector("#humidity");
  let displayWind = document.querySelector("#wind");
  displayCity.innerHTML = `${response.data.name} ${response.data.sys.country}`;
  displayDate.innerHTML = displaytDate();
  displayDescript.innerHTML = `${response.data.weather[0].description}`;
  displayIcons.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  displayIcons.setAttribute("alt", `${response.data.weather[0].description}`);
  currentTemp = response.data.main.temp;
  displayTemp.innerHTML = `${Math.round(currentTemp)}`;
  displayClouds.innerHTML = ` ${response.data.clouds.all}`;
  displayHumidity.innerHTML = ` ${response.data.main.humidity}`;
  currentWind = response.data.wind.speed;
  if (unit === "metric") {
    currentWind = currentWind * 3.6;
  }
  displayWind.innerHTML = ` ${Math.round(currentWind)}${unitWind}`;
  positionCityName = `lat=${response.data.coord.lat}&lon=${response.data.coord.lon}`;
  // getForecast(response.data.coord);
  getForecast(positionCityName);
}

function retrieveDataWeather(cityName) {
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?${cityName}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

// search  City  Name
function searchCityName(event) {
  event.preventDefault();
  let inputCityName = document.querySelector("#city-input").value;
  //   console.log(`q=${inputCityName}`);
  retrieveDataWeather(`q=${inputCityName}`);
}

// current City Name
function currentLocation(event) {
  function retrievePosition(position) {
    let positionCityName = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    retrieveDataWeather(positionCityName);
  }
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

// start
let currentTemp = 0;
let currentWind = 0;
let unitWind = "km/h";
let unit = "metric";
let positionCityName = "";
retrieveDataWeather("q=lagos");
// search City Name
let cityInput = document.querySelector("#form-input");
cityInput.addEventListener("submit", searchCityName);
// current City Name
let currentCity = document.querySelector("#current-location-button");
currentCity.addEventListener("click", currentLocation);
// favorite navigator
function nameCityLagos(event) {
  event.preventDefault();
  retrieveDataWeather(`q=${document.querySelector("#lagos").textContent}`);
}
function nameCityAbuja(event) {
  event.preventDefault();
  retrieveDataWeather(`q=${document.querySelector("#abuja").textContent}`);
}
function nameCityLondon(event) {
  event.preventDefault();
  retrieveDataWeather(`q=${document.querySelector("#london").textContent}`);
}
function nameCityBristol(event) {
  event.preventDefault();
  retrieveDataWeather(`q=${document.querySelector("#bristol").textContent}`);
}
document.querySelector("#lagos").addEventListener("click", nameCityLagos);
document.querySelector("#abuja").addEventListener("click", nameCityAbuja);
document.querySelector("#london").addEventListener("click", nameCityLondon);
document.querySelector("#bristol").addEventListener("click", nameCityBristol);
// set Unit Temperature
let setTempValue = document.querySelector("#units");
setTempValue.addEventListener("click", setUnitTemperature);
