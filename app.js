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

        stations_array.push(station_element);
        station_code_array.push(data_code);

        // console.log(station_element)

        // console.log(data_name);
        // console.log(data_code);
        // console.log(data_lat);
        // console.log(data_lon);

        return stations_array

    });

    console.log(stations_array);
    console.log(station_code_array);

    let wrapper = document.getElementById("wrapper");

    appendElements(stations_array, wrapper);

    createTimetableUrl(station_code_array)

}

const createElements = (tag, className) => {

    let element = document.createElement(tag)
    element.classList.add(className);

    return element
}

const createTimetableUrl = (stationCodeArray) => {

    console.log(stationCodeArray);

    let timetable_url_array = [];

    stationCodeArray.map((stationCode, index) => {

        let app_id = "07d9fdf7";
        let app_key = "a4ec22d05f193c140cac612cd5a8f3f4";
        let timetable_url = "https://transportapi.com/v3/uk/train/station/" + stationCode + "/live.json?app_id=" + app_id + "&app_key=" + app_key + "&darwin=false&train_status=passenger"


        fetchData(timetable_url, timetableHandler);

    });
}

const timetableHandler = (data) => {

    let station_code = data.station_code
    let station_name = data.station_name
    let departures_all = data.departures.all

    departures_all.map((departure, index) => {

        let aimed_departure_time = departure.aimed_departure_time;
        let destination_name = departure.destination_name;
        let expected_departure_time = departure.expected_departure_time;
        let operator_name = departure.operator_name;
        let platform_number = departure.platform;
        let service_timetable = departure.service_timetable.id;
        let service_status = departure.status;

        console.log(aimed_departure_time);
        console.log(destination_name);
        console.log(expected_departure_time);
        console.log(operator_name);
        console.log(platform_number);
        console.log(service_timetable);
        console.log(service_status);

        let service_element = createElements("div", "service");

        let station_timetable_elements = document.querySelectorAll(".station-timetable");

        station_timetable_elements[0].appendChild(service_element)

        // console.log(departure.aimed_arrival_time);
        // console.log(departure.aimed_departure_time);
        // console.log(departure.aimed_pass_time);
        // console.log(departure.best_arrival_estimate_mins);
        // console.log(departure.best_departure_estimate_mins);
        // console.log(departure.category);
        // console.log(departure.destination_name);
        // console.log(departure.expected_arrival_time);
        // console.log(departure.expected_departure_time);
        // console.log(departure.mode);
        // console.log(departure.operator);
        // console.log(departure.operator_name );
        // console.log(departure.origin_name);
        // console.log(departure.platform);
        // console.log(departure.service);
        // console.log(departure.service_timetable);
        // console.log(departure.source);
        // console.log(departure.status );
        // console.log(departure.train_uid);

    });




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