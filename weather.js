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
const cities = citiesByRegion[region];
const cityListElement = document.getElementById("city-list");
const container = document.getElementById("weather-details");

if (!cities) {
    container.textContent = "Please choose a region on the start page first.";
} else {
    document.getElementById("region-title").textContent = regionNames[region];

    for (const cityName of cities) {
        const button = document.createElement("button");
        button.textContent = cityName;
        button.addEventListener("click", () => getWeather(cityName));
        cityListElement.appendChild(button);
    }

    getWeather(cities[0]);
}

const searchInput = document.getElementById("city-search");
const searchButton = document.getElementById("city-search-button");

searchButton.addEventListener("click", () => {
    const cityName = searchInput.value;
    getWeather(cityName);
});

async function getWeather(cityName) {
    for (const button of cityListElement.children) {
        if (button.textContent === cityName) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    }

    container.innerHTML = "";

    if (cityName.trim() === "") {
        container.textContent = "Please enter a place.";
        return;
    }

    container.textContent = "Loading…";

    try {
        const temperatureUnit = params.get("temperatureUnit") || "celsius";

        const cityResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&countryCode=AT`);
        if (!cityResponse.ok) {
            throw new Error(`Geocoding failed: ${cityResponse.status}`);
        }
        const cityData = await cityResponse.json();
        console.log(cityData);

        if (!cityData.results) {
            container.textContent = `No place found for "${cityName}".`;
            return;
        }

        const city = cityData.results[0];

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&temperature_unit=${temperatureUnit}`);
        if (!response.ok) {
            throw new Error(`Forecast failed: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        container.innerHTML = "";

        const place = document.createElement("p");
        place.textContent = `Location: ${city.name}, ${city.country}`;
        container.appendChild(place);

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
    } catch (error) {
        container.textContent = "Could not load data. Please try again later.";
        console.error(error);
    }
}