import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconmap";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((e) => {
      console.error(e);
      alert("error getting weather.");
    });
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow location tracking and refresh page"
  );
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconURL(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
  currentIcon.src = getIconURL(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });

const dailySection = document.querySelector("[data-day-section]");

const dayCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    // setValue("date", DAY_FORMATTER.format(day.timestamp), {parent: element})
    element.querySelector("[data-icon]").src = getIconURL(day.iconCode);
    dailySection.append(element);
  });
}

const hourlySection = document.querySelector("[data-hour-section]");

const hourRowTemplate = document.getElementById("hour-row-template");

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.Temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.wind, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    // setValue("hour", hour.timestamp, {parent: element} )
    // setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    // setValue("hour", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
  });
}
