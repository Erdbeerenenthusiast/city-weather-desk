async function getWeather() {

    const params = new URLSearchParams(window.location.search);
    const temperatureUnit = params.get("temperatureUnit");

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=48.2085&longitude=16.3721&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&temperature_unit=${temperatureUnit}`);
    const data = await response.json();

    const container = document.getElementById("weather-details");

    const date = document.createElement("p");
    date.textContent = `Date: ${data.daily.time[0]}`;
    container.appendChild(date);

    const maxTemp = document.createElement("p");
    maxTemp.textContent = `Max: ${data.daily.temperature_2m_max[0]} ${data.daily_units.temperature_2m_max}`;
    container.appendChild(maxTemp);

    const minTemp = document.createElement("p");
    minTemp.textContent = `Min: ${data.daily.temperature_2m_min[0]} ${data.daily_units.temperature_2m_min}`;
    container.appendChild(minTemp);

    const precipitation = document.createElement("p");
    precipitation.textContent = `Precipitation Probability: ${data.daily.precipitation_probability_max[0]} ${data.daily_units.precipitation_probability_max}`;
    container.appendChild(precipitation);

    console.log(data);
}

getWeather();