if (document.readyState != 'loading') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}

function main() {

    var weather = {},

    geoData = {

        lon: 0,
        lat: 0,
        city: "",
        apiKey: "5875dabf47c6318d8b525887042c344c",
        daysForecast: 1,
        geoOrCityName: true,
        linkUrl: function () {
            return "http://api.openweathermap.org/data/2.5/weather?lat=" + this.lat + '&lon=' + this.lon + "&units=metric";
        },
        weekGeoDataUrl: function () {
            return "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + this.lat + "&lon=" + this.lon + "&cnt=" + this.daysForecast + "&mode=json&units=metric";
        },
        weekCityNameUrl: function () {
            return "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + this.city + "&mode=json&units=metric&cnt=" + this.daysForecast + "&APPID=" + this.apiKey;
        },
        picUrl: function () {
            return "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
        },
        picCityUrl: function () {
            return "http://openweathermap.org/img/w/" + weather.list[0].weather[0].icon + ".png";
        }
    },
    selectorData = {

        placeInfo: document.getElementById("place"),
        dateInfo: document.getElementById("date"),
        weatherInfo: document.getElementById("weather"),
        tempInfo: document.getElementById("temp"),

        weatherPic: document.getElementById("img"),
        weatherCard: document.getElementById("weatherCard"),
        errorInfo: document.getElementById("errorText"),
        waitImg: document.getElementById("waitImg"),

        geoButton: document.getElementsByTagName('button')[0],
        cityButton: document.getElementsByTagName('button')[1],
        button3Days: document.getElementById("3d"),
        button5Days: document.getElementById("5d"),
        button7Days: document.getElementById("7d"),
        button14Days: document.getElementById("14d"),

        cityInput: document.getElementsByTagName('input')[0]
    };

    function showWeatherByGeo() {
        selectorData.placeInfo.innerHTML = weather.name + ', ' + weather.sys.country;
        selectorData.dateInfo.innerHTML = (new Date(weather.dt * 1000)).toString().substring(0, 21);
        selectorData.weatherInfo.innerHTML = weather.weather[0].description;
        selectorData.tempInfo.innerHTML = Math.round(weather.main.temp);
        selectorData.weatherPic.src = geoData.picUrl();
        selectorData.weatherCard.style.display = "block";
    }

    var showWeatherByCityName = function () {
        selectorData.placeInfo.innerHTML = weather.city.name + ', ' + weather.city.country;
        selectorData.dateInfo.innerHTML = (new Date(weather.list[0].dt * 1000)).toString().substring(0, 21);
        selectorData.weatherInfo.innerHTML = weather.list[0].weather[0].description;
        selectorData.tempInfo.innerHTML = Math.round(weather.list[0].temp.day);
        selectorData.weatherPic.src = geoData.picCityUrl();
        selectorData.weatherCard.style.display = "block";
    };

    var showWeatherWeekly = function () {
        selectorData.weatherCard.style.display = "none";
        removeForecastElems("newCard");
        for (var i = 0; i < geoData.daysForecast; i++) {
            var day = (new Date(weather.list[i].dt * 1000)).toString().substring(0, 10);
            var imgIcon = "http://openweathermap.org/img/w/" + weather.list[i].weather[0].icon + ".png";
            var weatherString = " " + weather.list[i].weather[0].description + " ";
            var temp = Math.round(weather.list[i].temp.day) + "/" + Math.round(weather.list[i].temp.night);
            makeElem(day, imgIcon, weatherString, temp);
        }
    };

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            selectorData.errorInfo.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        geoData.lon = (position.coords.longitude).toFixed(5);
        geoData.lat = (position.coords.latitude).toFixed(5);
        makeRequest(geoData.linkUrl(), showWeatherByGeo);
    }
    function makeRequest(link, ifOK, longForecast) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", link, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                selectorData.errorInfo.innerHTML = "Something is wrong! Please check your connection and reboot web-page..";
                weatherCard.style.display = "none";
                return;
            }
            weather = JSON.parse(xhr.responseText);
            selectorData.errorInfo.innerHTML = "";
            selectorData.waitImg.src = "weather-153703_640.png";
            ifOK();

        };
        selectorData.waitImg.src = "wait.gif";
        xhr.send();
    }
    var makeElem = function (day, imgIcon, weatherString, temp) {

        var newCard = document.createElement("div");
        newCard.className = "card";
        newCard.setAttribute('id', "newCard");
        document.body.appendChild(newCard);

        var newDate = document.createElement("span");
        newDate.className = "medium";
        newDate.setAttribute('id', "newDate");
        newDate.innerHTML = day;
        newCard.appendChild(newDate);

        var newWeatherPic = document.createElement("img");
        newWeatherPic.className = "newImg";
        newWeatherPic.setAttribute('id', "newWeatherPic");
        newWeatherPic.src = imgIcon;
        newCard.appendChild(newWeatherPic);

        var newWeather = document.createElement("span");
        newWeather.className = "medium";
        newWeather.setAttribute('id', "newWeather");
        newWeather.innerHTML = weatherString;
        newCard.appendChild(newWeather);

        var newTempCels = document.createElement("span");
        newTempCels.style.display = "inline-block";
        newTempCels.style.float = "right";
        newCard.appendChild(newTempCels);

        var newTempDay = document.createElement("span");
        newTempDay.className = "newDegree";
        newTempDay.setAttribute('id', "newTempDay");
        newTempDay.innerHTML = temp;
        newTempCels.appendChild(newTempDay);

        var newTempNight = document.createElement("span");
        newTempNight.className = "newCelcius";
        newTempNight.innerHTML = "&deg;C";
        newTempCels.appendChild(newTempNight);

    };

    var removeForecastElems = function (elem) {
        while (document.getElementById(elem)) {
            var newCard = document.getElementById(elem);
            document.body.removeChild(newCard);
        }
    };

    selectorData.geoButton.addEventListener("click", function (event) {
        removeForecastElems("newCard");
        geoData.geoOrCityName = true;
        getLocation();

    });

    selectorData.cityButton.addEventListener("click", function (event) {
        removeForecastElems("newCard");
        geoData.geoOrCityName = false;
        geoData.city = selectorData.cityInput.value;
        makeRequest(geoData.weekCityNameUrl(), showWeatherByCityName);
    });

    selectorData.cityInput.addEventListener("keypress", function (key) {
        if (key.which == 13) {
            removeForecastElems("newCard");
            geoData.geoOrCityName = false;
            geoData.city = selectorData.cityInput.value;
            makeRequest(geoData.weekCityNameUrl(), showWeatherByCityName);
        }
    });

    selectorData.button3Days.addEventListener("click", function (event) {
        geoData.daysForecast = 3;
        if (geoData.geoOrCityName) {
            makeRequest(geoData.weekGeoDataUrl(), showWeatherWeekly);
        } else makeRequest(geoData.weekCityNameUrl(), showWeatherWeekly);
    });

    selectorData.button5Days.addEventListener("click", function (event) {
        geoData.daysForecast = 5;
        if (geoData.geoOrCityName) {
            makeRequest(geoData.weekGeoDataUrl(), showWeatherWeekly);
        } else makeRequest(geoData.weekCityNameUrl(), showWeatherWeekly);

    });

    selectorData.button7Days.addEventListener("click", function (event) {
        geoData.daysForecast = 7;
        if (geoData.geoOrCityName) {
            makeRequest(geoData.weekGeoDataUrl(), showWeatherWeekly);
        } else makeRequest(geoData.weekCityNameUrl(), showWeatherWeekly);
    });

    selectorData.button14Days.addEventListener("click", function (event) {
        geoData.daysForecast = 14;
        if (geoData.geoOrCityName) {
            makeRequest(geoData.weekGeoDataUrl(), showWeatherWeekly);
        } else makeRequest(geoData.weekCityNameUrl(), showWeatherWeekly);
    });

    getLocation();

}
