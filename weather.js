const citiesByRegion = {
    VIE: ["Vienna"],
    LAT: ["Amstetten", "Baden", "Krems an der Donau", "Mödling", "Sankt Pölten", "Tulln an der Donau", "Wiener Neustadt"],
    UAT: ["Braunau am Inn", "Gmunden", "Linz", "Steyr", "Vöcklabruck", "Wels"],
    BUR: ["Eisenstadt", "Güssing", "Mattersburg", "Neusiedl am See", "Oberwart"],
    CAR: ["Feldkirchen in Kärnten", "Klagenfurt", "Spittal an der Drau", "Villach", "Wolfsberg"],
    STY: ["Bruck an der Mur", "Graz", "Kapfenberg", "Leibnitz", "Leoben", "Weiz"],
    TYR: ["Innsbruck", "Kitzbühel", "Kufstein", "Lienz", "Schwaz", "Wörgl"],
    SAL: ["Bischofshofen", "Hallein", "Salzburg", "Zell am See"],
    VOR: ["Bludenz", "Bregenz", "Dornbirn", "Feldkirch", "Hohenems", "Lustenau"]
};

const regionNames = {
    VIE: "Vienna",
    LAT: "Lower Austria",
    UAT: "Upper Austria",
    BUR: "Burgenland",
    CAR: "Carinthia",
    STY: "Styria",
    TYR: "Tyrol",
    SAL: "Salzburg",
    VOR: "Vorarlberg"
};

const params = new URLSearchParams(window.location.search);
const region = params.get("region");
document.getElementById("region-title").textContent = regionNames[region];
const cities = citiesByRegion[region];
const cityListElement = document.getElementById("city-list");

for (const cityName of cities) {
    const button = document.createElement("button");
    button.textContent = cityName;
    button.addEventListener("click", () => getWeather(cityName));
    cityListElement.appendChild(button);
}

const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("city-search-button");

searchButton.addEventListener("click", () => {
    const cityName = searchInput.value;
    getWeather(cityName);
});

getWeather(cities[0]);

async function getWeather(cityName) {
    for (const button of cityListElement.children) {
        if (button.textContent === cityName) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    }

    const container = document.getElementById("weather-details");
    container.innerHTML = "";

    if (cityName.trim() === "") {
        container.textContent = "Please enter a place."; return;
    }

    container.textContent = "Loading…";

    const temperatureUnit = params.get("temperatureUnit");

    const cityResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&countryCode=AT`);
    const cityData = await cityResponse.json();

    if (!cityData.results) {
        container.textContent = `No City found for "${cityName}"`;
        return;
    }

    const city = cityData.results[0];
    console.log(cityData);

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&temperature_unit=${temperatureUnit}`);
    const data = await response.json();

    container.innerHTML = "";

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