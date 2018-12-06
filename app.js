"use strict"
const getUserLocation = () => {

    const success = (position) => {

        console.log("GeoLocation is working. Finding location.")

        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        console.log(lat + "," + lon);

        findNearestStations(lat, lon);

    }

    const error = (position) => {

        console.error("GeoLocation error. Unable to find location.")

    }

    navigator.geolocation.getCurrentPosition(success, error);

}

const findNearestStations = (lat, lon) => {

    let app_id = "07d9fdf7";
    let app_key = "a4ec22d05f193c140cac612cd5a8f3f4";
    let nearest_url = "https://transportapi.com/v3/uk/places.json?app_id=" + app_id + "&app_key=" + app_key + "&lat=" + lat + "&lon=" + lon + "&type=train_station";

    fetchData(nearest_url, nearestStationsHandler)

}

const fetchData = (url, callback) => {

    fetch(url).then(response => response.json()).then(data => {
        callback(data);
    }).catch((error => {
        console.error("error", error);
    }));

}

const nearestStationsHandler = (data) => {

    let stations_array = [];
    let station_element
    let station_name_element
    let station_timetable_element
    let station_code_array = [];
    let data_name
    let data_code
    let data_lat
    let data_lon

    let nearest_data = data.member.map((data, index) => {

        // console.log(data);

        station_element = createElements("div", "station");
        station_name_element = createElements("div", "station-name");
        station_timetable_element = createElements("div", "station-timetable");

        station_element.appendChild(station_name_element);
        station_element.appendChild(station_timetable_element);

        data_name = data.name;
        data_code = data.station_code;
        data_lat = data.latitude;
        data_lon = data.longitude;

        station_name_element.innerHTML = data_name;
        station_element.dataset.stationCode = data_code;

        stations_array.push(station_element)

        // console.log(station_element)

        // console.log(data_name);
        // console.log(data_code);
        // console.log(data_lat);
        // console.log(data_lon);

        return stations_array

    });

    console.log(stations_array);

    let wrapper = document.getElementById("wrapper");

    appendElements(stations_array, wrapper);

    createTimetableUrl(station_code)

}

const createElements = (tag, className) => {

    let element = document.createElement(tag)
    element.classList.add(className);

    return element
}

const createTimetableUrl = (stationCodeArray) => {



    let app_id = "07d9fdf7";
    let app_key = "a4ec22d05f193c140cac612cd5a8f3f4";
    let timetable_url = "https://transportapi.com/v3/uk/train/station/" + stationCode + "/live.json?app_id=" + app_id + "&app_key=" + app_key + "&darwin=false&train_status=passenger"

    console.log(stationCodeArray)

    // fetchData(timetable_url, timetableHandler)


}

const timetableHandler = (data) => {

    console.log(data);




}

const appendElements = (array, container) => {

    array.map((data, index) => {

        container.appendChild(data);

    });

}

const app = () => {

    console.log("App is running.");

    getUserLocation()

}

window.onload = app