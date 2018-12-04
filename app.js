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
    });

}

const nearestStationsHandler = (data) => {

	let numberOfStations = data.member.length;

	let nearest_data = data.member.map((data, index) => {

		let station_name = data.name;
		let station_code = data.station_code;
		let station_distance = (data.distance * 0.001).toFixed(2) + "km";

		return createElements("div", "station", "station", station_name, station_code);

	});

	// console.log(nearest_data);

    let wrapper = document.getElementById("wrapper");

    appendElements(nearest_data, wrapper);

    createTimetableUrl(station_code);

}

const createElements = (tag, className, type, content, stationCode) => {

		let element = document.createElement(tag)
			element.classList.add(className);

            switch(type) {

                case "station":
                
                    element.innerHTML = content;
                    element.dataset.stationCode = stationCode;

                break;

                // case "":
                // break;
                // case "":
                // break;
                // default:
                // break;


            }

	return element
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