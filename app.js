let city = "riyadh"; // default city
window.addEventListener("load", () => {
  photos.start(city);
  weather.defalutSearch(city);
});

document.querySelector(".search .button").addEventListener("click", () => {
  try {
    city = document.querySelector(".search-bar").value;
    photos.start(city);
    weather.search();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "something went wrong! Enter a correct city name 😒",
    });
  }
});
document.querySelector(".search-bar").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    try {
      city = document.querySelector(".search-bar").value;
      photos.start(city);
      weather.search();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "something went wrong! Enter a correct city name 😒",
      });
    }
  }
});

let photos = {
  start: function (city) {
    fetch(
      `https://api.unsplash.com/search/photos/?query=${city}&client_id=W0ofDxdDQI-cr5mYZQ9i5x6hpSQaRuzJ2R2hANnK0iU`
    )
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
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".temp").innerText = ~~temp + "° C";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + "KM/H";
  },
  defalutSearch: function (city) {
    this.fetchWeather(city);
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};
