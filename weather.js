async function getWeather(cityName) {

    const params = new URLSearchParams(window.location.search);
    const temperatureUnit = params.get("temperatureUnit");

    const cityResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&countryCode=AT`);
    const cityData = await cityResponse.json();
    const city = cityData.results[0];
    console.log(cityData);

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&temperature_unit=${temperatureUnit}`);
    const data = await response.json();

    const container = document.getElementById("weather-details");

    const location = document.createElement("p");
    location.textContent = `Location: ${city.name}, ${city.country}`;
    container.appendChild(location);

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

getWeather("Vienna");