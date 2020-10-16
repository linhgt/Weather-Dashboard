var searchBtn = document.getElementById("searchBtn");

//Onload, display cities that have been visited in the past
function loadHistory(){
    if(!localStorage.getItem("Cities")){
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

    //Initialize the storage
    if(!localStorage.getItem("Cities")){
        initializeStorage();
    }
    
    //Store the city's name in the storage
    var cityHistory = JSON.parse(localStorage.getItem("Cities"));
    citySearched(cityName);
    cityHistory.push(cityName);
    localStorage.setItem("Cities", JSON.stringify(cityHistory));
});

//show the history of searched city
function citySearched(cityName){
    var cityBlock = document.createElement("div");
    cityBlock.textContent = cityName;

    var listOfSearchedCity = document.querySelector("#searched-city");
    listOfSearchedCity.appendChild(cityBlock);
    cityBlock.classList.add("searched");
};

//get current weather for city
function weatherApiQuery(city)
{
    let APIkey = "17bfdc31b9f4ebbcee9fc0577f2e9856";
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey, 
        method: "GET"
    }).then(function(response){
        console.log(response);

        var today = $("#today");
        today.attr("style", "border:1px solid grey");
        var header = $("<h2>");
        header.text(city);
        today.append(header);
    }, function (error){
        console.log(error);
    });
}

weatherApiQuery("seattle");