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
            var redOutline = $("<button>");
            redOutline.addClass("btn btn-danger active");
            redOutline.text(value);
            redOutline.attr("aria-pressed", "true");

            //Display UV index
            var today=$("#today");
            var UVindex = $("<p>");
            UVindex.text("UV index: ");
            UVindex.append(redOutline);
            today.append(UVindex);
            
    }, function(error){
        console.log(error);
    })
}
