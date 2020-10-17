var searchBtn = document.getElementById("searchBtn");

//Onload, display cities that have been visited in the past
function loadHistory(){
    if(!localStorage.getItem("Cities")){
        //Initialize local storage if none exist
        initializeStorage();
    }    
    else{
        var cityHistory = JSON.parse(localStorage.getItem("Cities"));
        cityHistory.forEach(function(item) {
            citySearched(item);
        });
    }
}

//Initialize a storage for history of visited cities
function initializeStorage(){
    var cityHistory = []
    localStorage.setItem("Cities", JSON.stringify(cityHistory));
}

//When user searches for a city
//The city is stored in localstorage
//The city's name is also displayed to the page
searchBtn.addEventListener("click", function(event){
    event.preventDefault();

    //Get city name
    var cityName = document.getElementById("searchbox").value;

    //if the search input is not empty
    if(cityName !== "")
    {
        //capitalize the city name
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

        //Initialize the storage
        if(!localStorage.getItem("Cities")){
            initializeStorage();
        }

        //retrieve current weather
        weatherApiQuery(cityName);

        //retrieve 5 day forecast
        fiveDayForecast(cityName);

        //Store the city's name in the storage
        var cityHistory = JSON.parse(localStorage.getItem("Cities"));

        //If the city hasn't been added to local storage
        if(!cityHistory.includes(cityName))
        {
            citySearched(cityName);
            cityHistory.push(cityName);
            localStorage.setItem("Cities", JSON.stringify(cityHistory));
        }
    }
});

//show the history of searched city
function citySearched(cityName){
    //Create a block
    var cityBlock = document.createElement("div");
    cityBlock.textContent = cityName;
    cityBlock.addEventListener("click", function(event){
        event.preventDefault();
        //return current weather when clicked
        weatherApiQuery(cityName);

        //return 5 day forecast
        fiveDayForecast(cityName);
    });

    //Display the block
    var listOfSearchedCity = document.querySelector("#searched-city");
    listOfSearchedCity.appendChild(cityBlock);
    cityBlock.classList.add("searched");
};

//Convert unix timestamp to date
function convertTimeStamp(timestamp)
{
    var finalDate = "";

    var date = new Date(timestamp*1000);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    finalDate = month+"/"+day+"/"+year;
    return finalDate;
};


//get current weather for city
function weatherApiQuery(city)
{
    let APIkey = "17bfdc31b9f4ebbcee9fc0577f2e9856";

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey, 
        method: "GET"
    }).then(function(response){
            var date = convertTimeStamp(response.dt);           //date
            var returnedIcon = response.weather[0].icon;        //icon
            var temperature = response.main.temp;               //temp
            var humidity = response.main.humidity;              //humidity
            var windSpeed = response.wind.speed;                //wind speed
            var lat = response.coord.lat;                       //lattiude
            var lon = response.coord.lon;                       //longitude

            var today = $("#today");
            today.empty();
            today.removeClass("hide");

            //city name, date and icon
            var header = $("<h3>");
            header.text(city+" ("+date+") ");
            var icon = $("<img>");
            icon.attr("src", "http://openweathermap.org/img/wn/" + returnedIcon + ".png");
            header.append(icon);
            
            //temperature, humidity, wind speed
            var temp = $("<p>");
            temp.text("Temperature: " + temperature + " \u00B0F");
            var humid = $("<p>");
            humid.text("Humidity: " + humidity +"%");
            var wind = $("<p>");
            wind.text("Wind speed: " + windSpeed +"MPH");

            //Display to the page;
            today.append(header);
            today.append(temp);
            today.append(humid);
            today.append(wind);
            UVindex(lat, lon);

    }, function (error){
        console.log(error);
    });
}

//Get UV index
function UVindex(lat, lon)
{
    let APIkey = "17bfdc31b9f4ebbcee9fc0577f2e9856";

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey, 
        method: "GET"
    }).then(function(response){
            var value = response.value;     //UV index
            var Outline = $("<button>");
            Outline.addClass("btn active");

            //change colors
            if(value <= 2)
            {
                Outline.addClass("btn-success");
            }
            else if(value >2 && value <8)
            {
                Outline.addClass("btn-warning");
            }
            else if(value >=8)
            {
                Outline.addClass("btn-danger");
            }
            Outline.text(value);
            Outline.attr("aria-pressed", "true");

            //Display UV index
            var today=$("#today");
            var UVindex = $("<p>");
            UVindex.text("UV index: ");
            UVindex.append(Outline);
            today.append(UVindex);
            
    }, function(error){
        console.log(error);
    })
}

//Get 5 day forecast
function fiveDayForecast(city){
    let APIkey = "17bfdc31b9f4ebbcee9fc0577f2e9856";

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey, 
        method: "GET"
    }).then(function(response){
            console.log(response);
            var result = response.list;        //Get the list of forecasts

            var forecast = $("#forecast");
            forecast.empty();
            forecast.removeClass("hide");

            //header
            var header = $("<h4>");
            header.addClass("mt-3");
            header.text("5-Day Forecast:");

            var row = $("<div>");
            row.addClass("row");

            forecast.append(header);
            forecast.append(row);
            
            //Get one day forecast every 8 index
            for(var i = 0; i < 39; i=i+8)
            {
                var temperature = result[i].main.temp;                                                  //temperature
                var humidity = result[i].main.humidity;                                                 //humidity
                var date = convertTimeStamp(result[i].dt);                                              //date
                var icon = "http://openweathermap.org/img/wn/" + result[i].weather[0].icon + ".png";    //weather icon

                //Build the forecast card
                var col = $("<div>");
                col.addClass("col-md-2");
                var card = $("<div>");
                card.addClass("card bg-primary text-white");
                var cardBody = $("<div>");
                cardBody.addClass("card-body p-2");
                var cardTitle = $("<h5>");   
                cardTitle.addClass("card-title");
                cardTitle.text(date);
                var weatherIcon = $("<img>");
                weatherIcon.addClass("card-subtitle");
                weatherIcon.attr("src", icon);
                var temp = $("<p>");
                temp.addClass("card-text");
                temp.text("Temp: " + temperature +" \u00B0F");
                var humid = $("<p>");
                humid.addClass("card-text");
                humid.text("Humidity: " + humidity +"%");

                //Assemble the card
                row.append(col);
                col.append(card);
                card.append(cardBody);
                cardBody.append(cardTitle);
                cardBody.append(weatherIcon);
                cardBody.append(temp);
                cardBody.append(humid);
            }


    }, function(error){
        console.log(error);
    })
};