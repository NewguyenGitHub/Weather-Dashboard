// Delare Variables
const cityEl = document.getElementById("enter-city");
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const historyEl = document.getElementById("history");
const nameEl = document.getElementById("city-name");

var currentWeatherEl = document.getElementById("current-weather");
const currentIconEl = document.getElementById("current-icon");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");

var fivedayHeaderEl = document.getElementById("fiveday-header");
var fivedayEl = document.getElementById("fiveday");
const forecastEls = document.querySelectorAll(".forecast");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// Assigning a unique API to a variable
const APIKey = "84b79da5e5d7c92085660485702f4ce8";

function initPage() {

    function getWeather(cityName) {
        // Execute a current weather get request from open weather api
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

                // Display Current Weather
                currentWeatherEl.classList.remove("d-none");
                
                // Name & Date for Current Weather
                const date = new Date(response.data.dt * 1000);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                
                // Icon for Current Weather
                let weatherIcon = response.data.weather[0].icon;
                currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                currentIconEl.setAttribute("alt", response.data.weather[0].description);
                
                // Temp, Humidity, & Wind Speed for Current Weather
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
                
                // Get 5 day forecast for this city
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        
                        //  Display 5 Day Forecast
                        fivedayHeaderEl.classList.remove("d-none");
                        fivedayEl.classList.remove("d-none");

                        // Loop Through next 5 Days
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            
                            // Date for Forecast Weather
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            // Icon for Forecast Weather
                            const forecastIconEl = document.createElement("img");
                            forecastIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastIconEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastIconEl);

                            // Temp for Forecast Weather
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);

                            // Humidity for Forecast Weather
                            const forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);

                            // Wind Speed for Forecast Weather
                            const forecastWindSpeedEl = document.createElement("p");
                            forecastWindSpeedEl.innerHTML = "Wind Speed: " + response.data.list[forecastIndex].wind.speed + " MPH";
                            forecastEls[i].append(forecastWindSpeedEl);
                        }
                    })
            });
    }

    // Search Button & Save Search Value into History
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clear History button
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
        currentWeatherEl.classList.add("d-none");
        fivedayHeaderEl.classList.add("d-none");
        fivedayEl.classList.add("d-none");
        cityEl.value = "";
    })

    // Kelvin to Fahrenheit Conversion
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    // Create & Pull Search History 
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

initPage();
