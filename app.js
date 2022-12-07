// the default city and default data
let city = "Riyadh"; // default city
window.addEventListener("load", () => {
  photos.search(city);
  weather.defaultSearch(city);
  time.defaultSearch(city);
});

document.querySelector(".search .button").addEventListener("click", () => {
  try {
    city = document.querySelector(".search-bar").value;
    photos.search(city);
    weather.search();
    time.search(city);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "something went wrong! Enter a correct city name 😒",
    });
  }
});

/** photo search object contains
 ** search key for fetching the given input and search for a city photo form the api*/
let photos = {
  search: function (city) {
    fetch(
      `https://api.unsplash.com/search/photos/?query=${city}&client_id=W0ofDxdDQI-cr5mYZQ9i5x6hpSQaRuzJ2R2hANnK0iU`
    )
      // check the response
      .then(function (response) {
        if (response.status !== 200) {
          console.log("There was a problem. Status code: " + response.status);
          return;
        }
        response.json().then(function (data) {
          let x = Math.random() * 10;
          x = ~~x;
          if (x < 10) {
            document.body.style.background = `url(${data.results[x].urls.regular})`;
          }
        });
      })
      .catch(function (err) {
        console.log(err + "404");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "something went wrong! Enter a correct city name 😒",
        });
      });
  },
};
/** weather  search object contains
 ** search key for fetching the given input and search for the city weather data form the api*/

let weather = {
  apiKey: "f44164c688a672c4c40b61be7ed37824",
  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=` +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data))
      .catch(function (err) {
        console.log(err + "404");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "something went wrong! Enter a correct city name 😒",
        });
      });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city-name").innerText = name;
    document.querySelector(".city-name-time").innerText = name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".temp").innerText = ~~temp + "° C";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + "KM/H";
  },
  defaultSearch: function (city) {
    this.fetchWeather(city);
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};
// show search button when the cloud button pressed
let button = document.querySelector(".btn-42");
button.style.display = "none";
let citySearch = document
  .querySelector(".search-icon")
  .addEventListener("click", () => {
    if (citySearch != "") {
      button.style.display = "flex";
      button.setAttribute("style", "transition: transition: all 0.6s ease;");
    }
  });

// submit the value when key enter pressed
document.querySelector(".search-bar").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    try {
      city = document.querySelector(".search-bar").value;
      photos.search(city);
      weather.search();
      time.search();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "something went wrong! Enter a correct city name 😒",
      });
    }
  }
});

// the current time of given city
let time = {
  apikey: "4ef714a959bb4cdfbdb536f1bffe39a5",
  fetchTime: function (city) {
    fetch(
      "https://timezone.abstractapi.com/v1/current_time/?api_key=" +
        this.apikey +
        `&location=${city}`
    )
      .then((response) => response.json())
      .then((data) => this.displayCurrenttime(data));
  },

  displayCurrenttime: function (data) {
    // values from api
    const dateTime = data.datetime.split(" ");
    const date = dateTime[0];
    let time = dateTime[1];
    const timezone = data.timezone_location;
    console.log(date, this.convert24To12(time), timezone);
    document.querySelector(".local-time").innerText = time;
    document.querySelector(".date").innerText = "Today's Date: " + date;
    document.querySelector(".timezone").innerText = "Time Zone" + timezone;
  },
  search: function () {
    this.fetchTime(document.querySelector(".search-bar").value);
  },
  defaultSearch: function (city) {
    this.fetchTime(city);
  },

  // ** function that takes current time and convert it to 12 h format
  convert24To12: function (time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  },
};
