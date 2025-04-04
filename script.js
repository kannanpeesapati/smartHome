// export const WL_API_KEY_DEV = '6qkYCWmnCN27xxfi' // Development-key to transmit as 'sender' parameter for api requests at the realtime data api from Wiener Linien. Restricted to 100 requests per minute.
// export const WL_API_KEY = 'VxFSXGDhGJm59LWY' // Key to transmit as 'sender' parameter for api requests at the realtime data api from Wiener Linien
// export const WL_API_EXAMPLE_URL = 'http://www.wienerlinien.at/ogd_realtime/monitor?rbl=147&activateTrafficInfo=stoerungkurz&activateTrafficInfo=stoerunglang&activateTrafficInfo=aufzugsinfo&sender='
// export const WL_API_BASE_URL = 'http://www.wienerlinien.at/ogd_realtime' // from http://data.wien.gv.at/pdf/wienerlinien-echtzeitdaten-dokumentation.pdf
// export const CORS_DOMAIN = 'https://cors-anywhere.herokuapp.com/' //


// http://localhost:8080/
// http://www.wienerlinien.at/ogd_realtime/monitor?&activeTrafficInfo=${activeTrafficInfo}&sender=6qkYCWmnCN27xxfi&rbl=1894

var clockElement = document.getElementById("atclock");

function updateClock(clock) {
    const currentDate = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    // Get the date in the format DD.MM.YYYY
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).replace(/\//g, ".");

    // Get the time in the format HH:mm:ss
    const formattedTime = currentDate.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    // Combine the components
    const formattedDateTime = `${dayOfWeek}, ${formattedDate}, ${formattedTime}`;

    // Add IST time
    const istTime = new Date(currentDate.getTime() + 3.5 * 60 * 60 * 1000);
    const formattedIST = istTime.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    date.innerHTML = `${dayOfWeek}, ${formattedDate}  `;
    atclock.innerHTML = `  ${formattedTime} `;
    istclock.innerHTML = `  ${formattedIST}`;

    return formattedDate;
}

setInterval(function () {
    updateClock(clockElement);
}, 1000);


// Maps (from google embed maps)
const API_KEY = 'AIzaSyADH2kzb9gOyzOFmOPOMOOa_if1MDleVQ4'; // Replace with your actual API key
const homeLatLng = { lat: 48.153684, lng: 16.365141 }; // Coordinates for Home
const ac2tLatLng = { lat: 47.83749, lng: 16.25338 }; // Coordinates for AC2T
const alaudagasseLatLng = { lat: 48.15372, lng: 16.38242 }; // Coordinates for Alaudagasse
const meidlingLatLng = { lat: 48.173299, lng: 16.331490 }; // Coordinates for Medling
const troststrasseLatLng = { lat: 48.16894, lng: 16.37992 }; // Coordinates for Troststraße
const wienHbfLatLng = { lat: 48.18608, lng: 16.37456 }; // Coordinates for Wien Hauptbahnhof
const wienerNeustadtLatLng = { lat: 47.81173, lng: 16.23446 }; // Coordinates for Wiener Neustadt

const bus_oberlaa = { lat: 48.1509, lng: 16.3758 }; //17A-Oberlaa U: Alaudagasse
const bus_inzerdorfBiro = { lat: 48.1377, lng: 16.3542 }; //17A- Inzerdorf-Biro: Jochen Rindt
const bus_reumannplatz = { lat: 48.16894, lng: 16.37992 }; //66A- Reumannplatz: Trost
const bus_liesing = { lat: 48.1497, lng: 16.3341 }; //66A- Liesing: Purkytgasse

const sourceLatLng = homeLatLng;

document.body.onclick = function(event) {
    const clickedElement = event.target;

    if(clickedElement.innerHTML == 'AC2T'){
        document.getElementById('destination').value = clickedElement.innerHTML;
        getFrequentDirections(ac2tLatLng)
    }
    else if(clickedElement.innerHTML == 'Alaudagasse'){
        document.getElementById('destination').value = clickedElement.innerHTML;
        getFrequentDirections(alaudagasseLatLng)
    }
    else if(clickedElement.innerHTML == 'Meidling'){
        document.getElementById('destination').value = clickedElement.innerHTML;
        getFrequentDirections(meidlingLatLng)
    }
    else if(clickedElement.innerHTML == 'Troststraße-U'){
        document.getElementById('destination').value = clickedElement.innerHTML;
        getFrequentDirections(troststrasseLatLng)
    }
    else if(clickedElement.innerHTML == 'Wien Hbf'){
        document.getElementById('destination').value = clickedElement.innerHTML;
        getFrequentDirections(wienHbfLatLng)
    }
    else if(clickedElement.innerHTML == 'Wiener Neustadt'){
        document.getElementById('destination').value = clickedElement.innerHTML;
        getFrequentDirections(wienerNeustadtLatLng)
    }
};

function getFrequentDirections(destinationLatLng){
    const directionsSrc=`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${sourceLatLng.lat}, ${sourceLatLng.lng}&destination=${destinationLatLng.lat}, ${destinationLatLng.lng}&mode=transit`;
    document.getElementById('mapFrame').src = directionsSrc;
}

function homeLocation(){
    document.getElementById('destination').value = '';
    const placeSrc = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${homeLatLng.lat}, ${homeLatLng.lng}&zoom=18`;
    document.getElementById('mapFrame').src = placeSrc;
}


homeLocation();


// Departures
async function fetchDepartures() {
    // http://www.wienerlinien.at/ogd_realtime/monitor?&activeTrafficInfo=${activeTrafficInfo}&sender=6qkYCWmnCN27xxfi&rbl=1894
    // const response = await fetch(`http://www.wienerlinien.at/ogd_realtime/monitor?&activeTrafficInfo=stoerunglang&sender=6qkYCWmnCN27xxfi&rbl=${stopNum}`);

    // https://www.data.gv.at/katalog/en/application/3b30087e-8454-4706-b649-a924660d64ff#views
    const response = await fetch(`https://vtapi.floscodes.net/monitor/?line=66A&station=Wienerfeld&towards=Reumannplatz&countdown&geodata`);
    const data = await response.json();

    if (Array.isArray(data)) {
        data.forEach(item => {
            // console.log(item.geodata.lat)
            if (item.station === "Wienerfeld" && item.line === "17A" && item.towards === "Oberlaa U") {
                document.getElementById("bus1").querySelector("#busNum").innerHTML = item.line;
                document.getElementById("bus1").querySelector("#busName").innerHTML = item.towards;
                document.getElementById("bus1").querySelector("#busTime").innerHTML = item.countdown[0] + " min";
                document.getElementById("bus1").querySelector("#busTime2").innerHTML = item.countdown[1] + " min";
            }
            else if (item.station === "Wienerfeld" && item.line === "17A" && item.towards === "Inzersdorf, Birostraße" && item.geodata.lat === 48.1527217) {
                document.getElementById("bus2").querySelector("#busNum").innerHTML = item.line;
                document.getElementById("bus2").querySelector("#busName").innerHTML = item.towards;
                document.getElementById("bus2").querySelector("#busTime").innerHTML = item.countdown[0] + " min";
                document.getElementById("bus2").querySelector("#busTime2").innerHTML = item.countdown[1] + " min";
            }
            else if (item.station === "Wienerfeld" && item.line === "66A" && item.towards === "Reumannplatz U") {
                document.getElementById("bus3").querySelector("#busNum").innerHTML = item.line;
                document.getElementById("bus3").querySelector("#busName").innerHTML = item.towards;
                document.getElementById("bus3").querySelector("#busTime").innerHTML = item.countdown[0] + " min";
                document.getElementById("bus3").querySelector("#busTime2").innerHTML = item.countdown[1] + " min";
            }
            else if (item.station === "Wienerfeld" && item.line === "66A" && item.towards === "Liesing S") {
                document.getElementById("bus4").querySelector("#busNum").innerHTML = item.line;
                document.getElementById("bus4").querySelector("#busName").innerHTML = item.towards;
                document.getElementById("bus4").querySelector("#busTime").innerHTML = item.countdown[0] + " min";
                document.getElementById("bus4").querySelector("#busTime2").innerHTML = item.countdown[1] + " min";
            }                 
        });
    }    
}

let refreshRate = 30;
const updateSeconds = () => {
    document.getElementById('refreshRate').innerHTML = " "+ refreshRate;
    refreshRate--;
    if (refreshRate < 0) {
        refreshRate = 30;
    }
};


setInterval(() => {
    fetchDepartures();
}, 30000);  //update every 30sec

setInterval(() => {
    fetchDepartures();
    refreshRate = 30; // Reset the seconds after fetching
}, 30000);

setInterval(updateSeconds, 1000); // Update the refreshRate every second


// Energy Data
const zeitArr = [];
const consumptionArr = [ ];

d3.dsv(";", "energy_quarterly.csv", function(data) {
    // Assuming the column name is "AT0010000000000000001000002529276 (1200171890) - Verbrauch [kWh]"
    
    var dataArray = Array.isArray(data) ? data : [data];

    // Assuming column names
    var consumptionColumn = dataArray.map(function(row) {
        var consumptionValue = row["AT0010000000000000001000002529276 (1200171890) - Verbrauch [kWh]"];
        var formattedValue = consumptionValue.replace(/,/g, ".");
        return parseFloat(formattedValue);
    });

    var zeitVonColumn = dataArray.map(function(row) {
        timeString = row["Zeit von"];
        // return timeString;
        var [hours, minutes, seconds] = timeString.split(":");
    
        // Create a Date object with arbitrary date (e.g., January 1, 2000)
        var arbitraryDate = new Date(2000, 0, 1, hours, minutes, seconds);
        
        // Format the time as desired (e.g., HH:mm:ss)
        var formattedTimeString = arbitraryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23'});
        
        return formattedTimeString;
    });
    

    zeitArr.push(zeitVonColumn[0])
    consumptionArr.push(consumptionColumn[0])
    // console.log("Zeit von values:", zeitVonColumn);
    // console.log("Consumption values:", consumptionColumn);
  
});

xValues = zeitArr;
yValues = consumptionArr;
const graphColor = "#ffffff"
const dateGMT = new Date();
const yesterday = new Date(dateGMT);
yesterday.setDate(dateGMT.getDate() - 1);
const dd = String(yesterday.getDate()).padStart(2, '0');
const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
const yyyy = yesterday.getFullYear();

const formattedYesterday = `${dd}.${mm}.${yyyy}`;

// new Chart("myChart", {
//     type: "line",
//     data: {
//         labels: xValues,
//         datasets: [{
//             data: yValues,
//             label: 'Energy Consumption (kWh)',
//             borderColor: graphColor, // Set the line color
//             borderWidth: 2, // Optional: Adjust line thickness
//             fill: true, // Optional: Set to false to remove area under the line           
//         }]
//     },
//     options: {
//         // Customize chart options here
//         responsive: true, // Make the chart responsive
//         maintainAspectRatio: true, // Allow aspect ratio to adjust based on container size
//         "legend": {
//             "display": false,
//         },
//         "title": {
//             "display": true,
//             "text": `Energy Consumption - ${formattedYesterday}`,
//         }
//     }
// });


document.getElementById('btn').addEventListener('click', function() {
    var energyDiv = document.getElementById('energy');
    if (energyDiv.style.display === 'block') {
        energyDiv.style.display = 'none';
    } else {
        energyDiv.style.display = 'block';
    }
});

document.getElementById('btn2').addEventListener('click', function() {
    var energyDiv = document.getElementById('smartMeterFrame');
    if (energyDiv.style.display === 'block') {
        energyDiv.style.display = 'none';
    } else {
        energyDiv.style.display = 'block';
    }
});


const ctx = document.getElementById("myChart").getContext("2d");

// Initial data for the line chart
const initialData = {
    labels: xValues,
    datasets: [{
        data: yValues,
        label: "Energy Consumption (kWh)",
        borderColor: graphColor,
        borderWidth: 2,
        fill: true,
    }]
};

// Chart options
const options = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
        display: false,
    },
    title: {
        display: true,
        text: `Energy Consumption - ${formattedYesterday}`,
    }
};

// Create the initial line chart
let myChart = new Chart(ctx, {
    type: "line",
    data: initialData,
    options: options
});

// Toggle function to switch chart type
function toggleChart() {
    // Destroy the existing chart
    myChart.destroy();

    // Change chart type (from line to bar or vice versa)
    const newChartType = myChart.config.type === "line" ? "bar" : "line";

    // Create a new chart with the updated type
    myChart = new Chart(ctx, {
        type: newChartType,
        data: initialData,
        options: options
    });
}


// Analog clock
function toggleClock() {
    // Destroy the existing chart
    var splitDiv = document.getElementById('splitDiv');
    if (splitDiv.style.display === 'block') {
        splitDiv.style.display = 'none';
    } else {
        splitDiv.style.display = 'block';
    }
}

setInterval(() => {
    d = new Date();
    htime = d.getHours();
    mtime = d.getMinutes();
    stime = d.getSeconds();
    hrotation = 30*htime + mtime/2;
    mrotation = 6*mtime;
    srotation = 6*stime;
    hour.style.transform = `rotate(${hrotation}deg)`;
    minute.style.transform = `rotate(${mrotation}deg)`;
    second.style.transform = `rotate(${srotation}deg)`;
}, 1000);


setInterval(() => {
    d = new Date();
    htime = d.getHours() + 3;
    mtime = d.getMinutes() + 30;
    stime = d.getSeconds();
    hrotation = 30*htime + mtime/2;
    mrotation = 6*mtime;
    srotation = 6*stime;
    in_hour.style.transform = `rotate(${hrotation}deg)`;
    in_minute.style.transform = `rotate(${mrotation}deg)`;
    in_second.style.transform = `rotate(${srotation}deg)`;
}, 1000);
// Analog clock

