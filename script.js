//JSON object
var weather = {};
//Request data
var geoData = {
    lon: 0,
    lat: 0,
    city: "",
    daysForecast : function () {
                return 1;
                    },
    linkUrl: function () {
        return "http://api.openweathermap.org/data/2.5/weather?lat=" + this.lat + '&lon=' + this.lon + "&units=metric";
    },
    weekGeoDataUrl: function () {
        return "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + this.lat + "&lon=" + this.lon + "&cnt=" + this.daysForecast() + "&mode=json&units=metric";
    },
    weekCityNameUrl: function () {
        return "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + this.city + "&mode=json&units=metric&cnt=" + this.daysForecast() + "&APPID=" + apiKey;
    },
    picUrl: function () {
        return "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
    },
    picCityUrl: function () {
        return "http://openweathermap.org/img/w/" + weather.list[0].weather[0].icon + ".png";  
    }
};
// API key
var apiKey = "5875dabf47c6318d8b525887042c344c";

var placeInfo = document.getElementById("place");
var dateInfo = document.getElementById("date");
var weatherInfo = document.getElementById("weather");
var tempInfo = document.getElementById("temp");
var weatherPic = document.getElementById("img");

var errorInfo = document.getElementById("errorText");
var waitImg = document.getElementById("waitImg");

var geoButton = document.getElementsByTagName('button')[0];
var cityButton = document.getElementsByTagName('button')[1];

var cityInput = document.getElementsByTagName('input');

/*function showElem(id) {
  document.getElementById(id).style.display = 'inline-block';
} */
  
function showWeatherByGeo() {
    placeInfo.innerHTML = weather.name + ', ' + weather.sys.country;
    dateInfo.innerHTML = (new Date(weather.dt*1000)).toString().substring(0,21);
    weatherInfo.innerHTML = weather.weather[0].description;
    tempInfo.innerHTML = Math.round(weather.main.temp);
    weatherPic.src = geoData.picUrl();
    $('#card').removeClass("hide");

 }

 function showWeatherByCityName() {
    placeInfo.innerHTML = weather.city.name + ', ' + weather.city.country;
    dateInfo.innerHTML = (new Date(weather.list[0].dt*1000)).toString().substring(0,21);
    weatherInfo.innerHTML = weather.list[0].weather[0].description;
    tempInfo.innerHTML = Math.round(weather.list[0].temp.day);
    weatherPic.src = geoData.picCityUrl();
    $('#card').removeClass("hide");

 }

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        errorText.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    geoData.lon = (position.coords.longitude).toFixed(5);
    geoData.lat = (position.coords.latitude).toFixed(5);
    makeRequest(geoData.linkUrl(), showWeatherByGeo);
}
function makeRequest(link, ifOK) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            errorText.innerHTML = "Something is wrong! Please check your connection and reboot web-page..";
            return;
        }
        weather = JSON.parse(xhr.responseText);
        waitImg.src="weather-153703_640.png";
        ifOK();
    };
    waitImg.src="wait.gif"; //show wait for loading
    xhr.send();
}
/*function makeElem (elem, src) {
    var newElem = document.createElement(elem);
    if (elem === "img") {
    newElem.src = src;
   } else 
   { newElem.innerHTML = src; }
   newElem.setAttribute("style", "margin-left:20px");
   newElem.setAttribute("style", "display:inline");
   newElem.setAttribute("class", "temp");
   document.body.appendChild(newElem);
} */

geoButton.addEventListener("click", function (event) {  
    getLocation();
    
});
cityButton.addEventListener("click", function (event) { 
    geoData.city = cityInput[0].value;
    makeRequest(geoData.weekCityNameUrl(), showWeatherByCityName);
});

$('input').keydown(function(key) {
   if (key.which==13) {
    geoData.city = cityInput[0].value;
    makeRequest(geoData.weekCityNameUrl(), showWeatherByCityName);
   }
});

getLocation();
