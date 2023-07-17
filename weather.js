import axios from "axios";

export function getWeather(lat, lon, timezone) {
  return axios
    .get(
      "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,apparent_temperature_max&current_weather=true",
      {
        params: {
          latitude: lat,
          longitude: lon,
          timezone,
        },
      }
    )
    .then(({ data }) => {
      // return data
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data)
      };
    });
}

function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;

  const {
    temperature_2m_max: [maxTemp],
    apparent_temperature_max: [maxFeelsLike],
  } = daily;

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    // lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    // lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    // precip: Math.round(precip * 100) / 100,
    iconCode,
  };
}

function parseDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: time, 
      iconCode: daily.weathercode[index], 
      maxTemp: Math.round(daily.temperature_2m_max[index])
    }
  })
}

function parseHourlyWeather({ hourly, current_weather }) {
  return hourly.time.map((time, index) => {
    return {
      timestamp: time, 
      iconCode: hourly.weathercode[index], 
      temp: Math.round(hourly.temperature_2m[index]),
      feelsLike: Math.round(hourly.apparent_temperature[index]),
      windSpeed: Math.round(hourly.windspeed_10m[index]),
      precip: Math.round(hourly.precipitation[index])
    }
  }).filter(({timestamp}) => timestamp >= current_weather.time)
}
