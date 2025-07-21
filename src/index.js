import "./styles.css";
import Rain from "./images/rain.png";
import Cloudy from "./images/cloudy.png";
import PartlyCloudy from "./images/partly-cloudy-day.png";
import Sunny from "./images/sunny.png";
import PartlyCloudyNight from "./images/night-partly-cloudy.png";
import Night from "./images/night.png";
const mainContainer = document.querySelector(".main-container");
const input = document.querySelector(".input");
const metric = document.querySelector(".metric");
const us = document.querySelector(".us");

const loc = document.querySelector(".loc");
const degree = document.querySelector(".degree");
const conditions = document.querySelector(".conditions");
const image = document.querySelector(".image");
const descriptions = document.querySelector(".descriptions");
const feelslike = document.querySelector(".feelslike");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".windSpeed");
const uvIndex = document.querySelector(".uvIndex");
const visibilty = document.querySelector(".visibilty");
const dew = document.querySelector(".dew");
const dailyContainer = document.querySelector(".daily-container");
const hourlyContainer = document.querySelector(".hourly-container");

let locSearch = "manila";
let usFMiles = "us";
let metricCkm = "metric";
let dataUnits = metricCkm;

async function fetchAPI() {
  const apiKey = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locSearch}?unitGroup=${dataUnits}&key=7KCFQQKUUU7SRPWKZB6ALPHGE&contentType=json`;
  console.log(apiKey);
  try {
    const response = await fetch(apiKey, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const location = await response.json();

    getLocation(location);
  } catch (error) {
    console.log(error.message);
    alert("Location not found!");
  }
}

fetchAPI();

input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    locSearch = input.value;
    if (!locSearch) {
      alert("Enter Location");
    } else {
      fetchAPI();
    }
  }
});

us.addEventListener("click", (e) => {
  e.preventDefault();
  dataUnits = usFMiles;
  fetchAPI();
});

metric.addEventListener("click", (e) => {
  e.preventDefault();
  dataUnits = metricCkm;
  fetchAPI();
});

const getLocation = (location) => {
  loc.textContent = `${location.resolvedAddress}`;
  degree.textContent = `${location.days[0].temp}°`;
  image.src = getIcon(location.days[0].icon);
  conditions.textContent = `${location.days[0].conditions}`;
  descriptions.textContent = `${location.days[0].description}`;

  feelslike.textContent = `${location.days[0].feelslike}°`;
  humidity.textContent = `${location.days[0].humidity}%`;
  windSpeed.textContent = `${location.days[0].windspeed} ${
    dataUnits == metricCkm ? "kph" : "mph"
  }`;
  uvIndex.textContent = `${location.days[0].uvindex}`;
  visibilty.textContent = `${location.days[0].visibility} ${
    dataUnits == metricCkm ? "km" : "mi"
  }`;
  dew.textContent = `${location.days[0].dew}°`;

  const arr = location.days;
  dailyContainer.textContent = "";
  arr.forEach((daily, index) => {
    if (index <= 9) {
      const inputDate = new Date(daily.datetime);

      const options = {
        weekday: "long",
      };
      let formattedDate = inputDate.toLocaleDateString("en-US", options);
      if (index == 0) {
        formattedDate = "Today";
      }
      const flex = document.createElement("div");
      flex.classList.add("flex-container");
      const date = document.createElement("div");
      date.textContent = formattedDate;
      flex.appendChild(date);
      const condition = document.createElement("div");
      condition.textContent = daily.conditions;
      flex.appendChild(condition);
      const temp = document.createElement("div");
      temp.textContent = `${daily.temp}°`;
      flex.appendChild(temp);
      dailyContainer.appendChild(flex);
    }
  });

  const arrHours = location.days[0].hours;

  const asdsad = new Date().toLocaleString("en-US", {
    timeZone: location.timezone,
    hour12: false,
  });
  const currentDate = new Date(asdsad);

  const currentHours = currentDate.getHours();
  hourlyContainer.textContent = "";
  arrHours.forEach((element, index) => {
    const elementHours = new Date(`0001-01-01 ${element.datetime}`);
    let elCurrentHours = elementHours.getHours();
    if (elCurrentHours > currentHours) {
      let ampm = elCurrentHours >= 12 ? "PM" : "AM";
      let elHour = elCurrentHours % 12;

      elHour = elHour ? elHour : 12;

      const flexHourlyContainer = document.createElement("div");
      flexHourlyContainer.classList.add("flex-hourly-container");

      const hour = document.createElement("div");
      hour.textContent = `${elHour} ${ampm}`;
      flexHourlyContainer.appendChild(hour);

      const image = document.createElement("img");
      image.classList.add("small-image");

      flexHourlyContainer.appendChild(image);

      if (element.icon == "rain") {
        image.src = Rain;
      } else if (element.icon == "cloudy") {
        image.src = Cloudy;
      } else if (element.icon == "partly-cloudy-day") {
        image.src = PartlyCloudy;
      } else if (element.icon == "clear-day") {
        image.src = Sunny;
      } else if (element.icon == "partly-cloudy-night") {
        image.src = PartlyCloudyNight;
      } else if (element.icon == "clear-night") {
        image.src = Night;
      }

      const temp = document.createElement("div");
      temp.textContent = `${element.temp}°`;
      flexHourlyContainer.appendChild(temp);

      hourlyContainer.appendChild(flexHourlyContainer);
    }
  });
};

const getIcon = (icon) => {
  switch (icon) {
    case "rain":
      return (image.src = Rain);
    case "cloudy":
      return (image.src = Cloudy);
    case "partly-cloudy-day":
      return (image.src = PartlyCloudy);
    case "clear-day":
      return (image.src = Sunny);
    case "partly-cloudy-night":
      return (image.src = PartlyCloudyNight);
    case "clear-night":
      return (image.src = Night);
  }
};
