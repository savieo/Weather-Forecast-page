// For converting °K -> °C : °C = °K - 273.15
const ZERO_ABS = -273.15;

/**
 * Make some usefull conversions
 */
const CONV = {
    /**
     * Convert °K -> °C
     */
    k_a_c: k => (k + ZERO_ABS).toFixed(1) + "°C",
    //°K -> °F
    k_a_f: k => (((k + ZERO_ABS) * 9 / 5) + 32).toFixed(1) + "°F",

    /**
     * Provides time with format hh:mm from timestamp
     */
    dt_a_hm: dt => {
        let date = new Date(dt * 1000);
        return ("0" + date.getHours()).substr(-2) + "h" + (date.getMinutes() + "0").substr(0, 2);
    }
}

/**
 * Latitude and longitude of Montréal city 
 */
let cityLat, cityLon;

/**
 * Simple objet to handle URLs of API 
 */
// http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=875c57f47b15294e932c3a846c2a7e84
const OW_API = {
    // http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=875c57f47b15294e932c3a846c2a7e84
    base_api_url: ' http://api.openweathermap.org/data/2.5/',
    base_icon_url: 'http://openweathermap.org/img/w/',
    weather: 'weather?q={city}',
    forecast: 'forecast?q={city}&cnt=24',
    key: '&APPID=875c57f47b15294e932c3a846c2a7e84',

    //http://api.openweathermap.org/data/2.5/forecast/hourly?q=London,us&appid=d372021858e26c181fc642ca0f0dbd18
    get_weather_url: function (city) {
        return this.base_api_url + this.weather.replace('{city}', city) + this.key;
    },
    //http://api.openweathermap.org/data/2.5/forecast?q=Montreal,ca&cnt=24&APPID=875c57f47b15294e932c3a846c2a7e84
    get_city_weather: function (city) {


        return this.base_api_url + this.forecast.replace('{city}', city) + this.key
    },
    //http://openweathermap.org/img/w/10d.png
    get_icon_url: function (icon_id) {
        return this.base_icon_url + icon_id + ".png";
    },
};
//Hiding the current weather and forecast sections
document.querySelector("#current ").style.display = "none";
document.querySelector("#forecast ").style.display = "none";
let submitButton = document.querySelector("#btnSubmit");
submitButton.addEventListener('click', function () {
    //Unhiding the current weather and forecast sections
    document.querySelector("#current ").style.display = "block";
    document.querySelector("#forecast ").style.display = "block";
    let city = document.querySelector("#selectedCity").value;
    let tempType = document.querySelector("#tempType").value;


    console.log("city" + city);
    console.log("tempType" + tempType);
    fetch(OW_API.get_weather_url(city))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            document.querySelector(".cityName").textContent = data.name + " , " + data.sys.country;
            if (tempType === "°C") {
                document.querySelector(".temperature .val").textContent = CONV.k_a_c(data.main.temp);
            } else if (tempType === "°F") {
                document.querySelector(".temperature .val").textContent = CONV.k_a_f(data.main.temp);
            }
            document.querySelector(".description .val").textContent = data.weather[0].description;
            document.querySelector(".icon img").src = OW_API.get_icon_url(data.weather[0].icon);

        });


    fetch(OW_API.get_city_weather(city))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(table);
            //remove table rows to avoid the duplication
            let rowLength = table.rows.length;
            if (rowLength >= 2) {
                for (let i = 2; i < rowLength; i++) {
                    table.deleteRow(2);
                }

            }
            let trModel = document.querySelector(".model");
            let tBody = document.querySelector("tbody");
            //Iterating over the list of data from the response
            for (let listData of data.list) {
                document.querySelector(".model img").src = OW_API.get_icon_url(listData.weather[0].icon);
                document.querySelector(".model .description").textContent = listData.weather[0].description;
                document.querySelector(".model .hour").textContent = listData.dt_txt;
                if (tempType === "°C") {
                    console.log("Celsius");
                    document.querySelector(".model .temperature").textContent = CONV.k_a_c(listData.main.temp);
                } else if (tempType === "°F") {
                    console.log("Farren");
                    document.querySelector(".model .temperature").textContent = CONV.k_a_f(listData.main.temp);
                }
                let tableClone = trModel.cloneNode(true);
                tBody.appendChild(tableClone);
            }
            table.deleteRow(1);

            //Giving style to table
            for (let i = 1; i < table.rows.length; i++) {
                if (i % 2 == 0) {
                    table.rows[i].style.backgroundColor = "black";
                    table.rows[i].style.color = "red";
                }
            }
        });
});

//STYLING
document.body.style.backgroundImage = "url('images/red3.jpg')";
let section_selection = document.querySelector("#selection");
section_selection.style.height = "185px";
section_selection.style.fontSize = "25px";
section_selection.style.opacity = "0.65";
section_selection.style.textAlign = "center";
section_selection.style.backgroundColor = "#AF0A18"; //#9F0227
document.getElementById("selectedCity").style.width = "200px";
document.getElementById("selectedCity").style.backgroundColor = "#ff4d4d";
document.getElementById("tempType").style.width = "200px";
document.getElementById("tempType").style.backgroundColor = "#ff4d4d";
document.getElementById("btnSubmit").style.width = "150px";
document.getElementById("btnSubmit").style.backgroundColor = "#ff4d4d";
let section_current = document.getElementById("current");
section_current.style.backgroundColor = "#AF0A18";
section_current.style.color = "white";
section_current.style.textAlign = "center";
section_current.style.fontSize = "20px";
section_current.style.opacity = "0.65";
let section_forecast = document.getElementById("forecast");
section_forecast.style.backgroundColor = "#AF0A18";
section_forecast.style.textAlign = "center";
section_forecast.style.fontSize = "20px"
section_forecast.style.opacity = "0.8";
let table = document.getElementById("tb_forecast");
section_forecast.style.color = "white";
table.style.width = 100 + '%';
table.style.textAlign = "center";
document.querySelector("thead").style.color = "White";
document.querySelector("thead").style.backgroundColor = "darkred";
