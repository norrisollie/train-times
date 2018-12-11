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

    let app_id = "0dd7f0c3";
    let app_key = "21cc24a8e4686b17209f36ec54ca31e9";
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
        station_timetable_element.dataset.stationCode = data_code;

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

        let app_id = "0dd7f0c3";
        let app_key = "21cc24a8e4686b17209f36ec54ca31e9";
        let timetable_url = "https://transportapi.com/v3/uk/train/station/" + stationCode + "/live.json?app_id=" + app_id + "&app_key=" + app_key + "&darwin=false&train_status=passenger"


        fetchData(timetable_url, timetableHandler);

    });
}

const timetableHandler = (data) => {

    let station_code = data.station_code
    let station_name = data.station_name
    let departures_all = data.departures.all

    console.log(data)

    let station_timetable = document.querySelectorAll(".station-timetable");

    departures_all.map((departure, index) => {

        let aimed_departure_time = departure.aimed_departure_time;
        let destination_name = departure.destination_name;
        let expected_departure_time = departure.expected_departure_time;
        let operator_name = departure.operator_name;
        let platform_number = departure.platform;
        let service_timetable = departure.service_timetable.id;
        let service_status = departure.status;
        let train_uid = departure.train_uid;

        if (platform_number === null) {
            platform_number = "n/a";
        }

        if (expected_departure_time !== aimed_departure_time) {
            expected_departure_time = "exp " + expected_departure_time
        }

        if (expected_departure_time === aimed_departure_time && service_status !== "DELAYED") {
            expected_departure_time = "On time";
        }

        if (service_status === "EARLY" || service_status === "ON TIME") {
            service_status = "On Time";
        } else if (service_status === "LATE") {
            service_status = "Delayed"
        }

        let template = "<div class='service' data-train-id='" + train_uid + "'><div class='expected-aimed-departure-time'><span class='aimed-departure-time'>" + aimed_departure_time + "</span><span class='expected-depart-time'>" + expected_departure_time + "</span></div>" +
            "<div class='destination-name'>" + destination_name + "</div>" +
            "<div class='platform-number'>Platform " + platform_number + "</div>" +
            "<div class='operator-name'>Operated by " + operator_name + "</div></div>";

        let currentWrapper = [...station_timetable].find((wrapper) => wrapper.dataset.stationCode === station_code);
        let serviceBoxFragment = document.createRange().createContextualFragment(template);

        currentWrapper.appendChild(serviceBoxFragment);

        let serviceWrapper = document.querySelectorAll(".service");

        for (let i = 0; i < serviceWrapper.length; i++) {

            serviceWrapper[i].addEventListener("click", serviceClickHandler);

        }


    });
}

const serviceClickHandler = (e) => {

    let targetStationCode = e.currentTarget.parentNode.dataset.stationCode
    let targetTrainUID = e.currentTarget.dataset.trainId

    let app_id = "0dd7f0c3";
    let app_key = "21cc24a8e4686b17209f36ec54ca31e9";
    let service_url = "https://transportapi.com/v3/uk/train/service/train_uid:" + targetTrainUID + "///timetable.json?app_id=" + app_id + "&app_key=" + app_key + "&darwin=false&live=false";

    fetchData(service_url, serviceInfoHandler);

}

const serviceInfoHandler = (data) => {

    console.log(data)

    console.log("category", data.category)
    console.log("date", data.date)
    console.log("destination_name", data.destination_name)
    console.log("headcode", data.headcode)
    console.log("mode", data.mode)
    console.log("operator", data.operator)
    console.log("operator_name", data.operator_name)
    console.log("origin_name", data.origin_name)
    console.log("request_time", data.request_time)
    console.log("service", data.service)
    console.log("stop_of_interest", data.stop_of_interest)
    console.log("stops", data.stops)
    console.log("time_of_day", data.time_of_day)
    console.log("toc", data.toc)
    console.log("train_status", data.train_status)


    let template;

    let fixedWrapper = document.getElementById("fixed-wrapper");
    let innerWrapper = document.getElementById("inner-wrapper");
    let mapContainer = document.getElementById("map-container");

    data.stops.map((stop, index) => {

        let station_name = stop.station_name;
        let station_code = stop.station_code;
        let station_platform = stop.platform;
        let station_aimed_departure_time = stop.aimed_departure_time;

        let template = "<div class='stop'>" +
            "<div class='stop-platform'><span class='route-station-name'>" + station_name + "</span><span class='route-station-aimed-departure'>" + station_aimed_departure_time + "</span></div>" +
            "</div>";

    mapContainer.innerHTML += template;
            
    });













    fixedWrapper.style.opacity = "1";
    fixedWrapper.style.pointerEvents = "all";



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