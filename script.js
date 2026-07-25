// ========================================
// Field Work Tracker
// Main Application Logic
// ========================================


let entries = [];

let editingId = null;


let settings = {

    hourlyRate: 20,

    mileageRate: 0.76,

    vehicle: "Company Vehicle"

};


// ---------- Load Data ----------

document.addEventListener("DOMContentLoaded", () => {

    loadSettings();

    loadEntries();

    setDefaultDate();

    setDefaultWeek();

    fillDefaultValues();

    calculateMiles();

    renderTable();

});

    loadEntries();

    setDefaultDate();

    setDefaultWeek();

    calculateMiles();

    renderTable();

});


// ---------- Get Elements ----------

const dateInput = document.getElementById("date");
const hoursInput = document.getElementById("hours");
const startOdoInput = document.getElementById("startOdo");
const endOdoInput = document.getElementById("endOdo");
const milesInput = document.getElementById("dailyMiles");
const acresInput = document.getElementById("acres");
const samplingInput = document.getElementById("samplingType");
const travelInput = document.getElementById("travelTime");
const locationInput = document.getElementById("location");
const commentsInput = document.getElementById("comments");

const saveButton = document.getElementById("saveBtn");
const cancelButton = document.getElementById("cancelEditBtn");

const weekSelector = document.getElementById("weekSelector");


// ---------- Auto Calculate Miles ----------

startOdoInput.addEventListener("input", calculateMiles);
endOdoInput.addEventListener("input", calculateMiles);


function calculateMiles() {

    let start = Number(startOdoInput.value);
    let end = Number(endOdoInput.value);


    if(end >= start && start > 0) {

        milesInput.value = end - start;

    } else {

        milesInput.value = "";

    }

}



// ---------- Save Entry ----------


saveButton.addEventListener("click", () => {


    let entry = {

        id: editingId ? editingId : Date.now(),

        date: dateInput.value,

        week: function getWeek(dateString){

    let date = new Date(dateString);


    // Move to Monday
    let day = date.getDay();

    let diff = date.getDate() - day + 
        (day === 0 ? -6 : 1);


    let monday = new Date(date.setDate(diff));


    let year = monday.getFullYear();


    let month = String(
        monday.getMonth()+1
    ).padStart(2,"0");


    let dayNum = String(
        monday.getDate()
    ).padStart(2,"0");


    return `${year}-${month}-${dayNum}`;

},

        hours: Number(hoursInput.value) || 0,

        startOdo: Number(startOdoInput.value) || 0,

        endOdo: Number(endOdoInput.value) || 0,

        miles: Number(milesInput.value) || 0,

        acres: Number(acresInput.value) || 0,

        sampling: samplingInput.value,

        travel: Number(travelInput.value) || 0,

        location: locationInput.value,

        comments: comments: commentsInput.value,

vehicle: document.getElementById("vehicleType").value,

mileageRate: Number(
document.getElementById("mileageRate").value
) || 0.76,

hourlyRate: Number(
document.getElementById("hourlyRate").value
) || 0

    };



    if(editingId) {


        let index = entries.findIndex(
            e => e.id === editingId
        );


        entries[index] = entry;


        editingId = null;


        cancelButton.style.display = "none";


    } 
    
    else {

        entries.push(entry);

    }


    saveEntries();

    clearForm();

    renderTable();


});



// ---------- Edit Entry ----------


function editEntry(id) {


    let entry = entries.find(
        e => e.id === id
    );


    if(!entry) return;



    editingId = id;


    dateInput.value = entry.date;

    hoursInput.value = entry.hours;

    startOdoInput.value = entry.startOdo;

    endOdoInput.value = entry.endOdo;

    milesInput.value = entry.miles;

    acresInput.value = entry.acres;

    samplingInput.value = entry.sampling;

    travelInput.value = entry.travel;

    locationInput.value = entry.location;

    commentsInput.value = entry.comments;



    cancelButton.style.display = "block";


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });


}



// ---------- Delete Entry ----------


function deleteEntry(id) {


    if(confirm("Delete this entry?")) {


        entries = entries.filter(
            e => e.id !== id
        );


        saveEntries();

        renderTable();

    }

}



// ---------- Cancel Editing ----------


cancelButton.addEventListener(
    "click",
    () => {

        editingId = null;

        cancelButton.style.display = "none";

        clearForm();

    }
);



// ---------- Render Table ----------


function renderTable() {


    let tbody = document.querySelector(
        "#entryTable tbody"
    );


    tbody.innerHTML = "";



    let selectedWeek =
        weekSelector.value;



    let filtered = entries.filter(
        e => e.week === selectedWeek
    );



    filtered.sort(
        (a,b) =>
        new Date(a.date) - new Date(b.date)
    );



    filtered.forEach(entry => {


        let row =
        document.createElement("tr");



        row.innerHTML = `

        <td>${entry.date}</td>

        <td>${entry.hours}</td>

        <td>${entry.miles}</td>

        <td>${entry.acres}</td>

        <td>${entry.sampling}</td>

        <td>${entry.travel}</td>

        <td>${entry.location}</td>

        <td>${entry.comments}</td>

        <td>

        <button 
        class="action-btn edit-btn"
        onclick="editEntry(${entry.id})">
        Edit
        </button>


        <button 
        class="action-btn delete-btn"
        onclick="deleteEntry(${entry.id})">
        Delete
        </button>

        </td>

        `;



        tbody.appendChild(row);


    });



    function updateTotals(data){


let hours = 0;
let miles = 0;
let acres = 0;
let travel = 0;
let personalMiles = 0;

let mileagePay = 0;



let hourlyRate = 0;



data.forEach(e=>{


hours += e.hours;

miles += e.miles;

acres += e.acres;

travel += e.travel;


if(e.vehicle === "Personal Vehicle"){

personalMiles += e.miles;

mileagePay += 
e.miles * e.mileageRate;

}


if(e.hourlyRate > 0){

hourlyRate = e.hourlyRate;

}


});



let regularHours =
Math.min(hours,40);


let overtimeHours =
Math.max(hours-40,0);



let regularPay =
regularHours * hourlyRate;



let overtimePay =
overtimeHours *
(hourlyRate*1.5);



let gross =
regularPay +
overtimePay +
mileagePay;



document.getElementById(
"totalHours"
).innerText =
hours.toFixed(2);



document.getElementById(
"regularHours"
).innerText =
regularHours.toFixed(2);



document.getElementById(
"overtimeHours"
).innerText =
overtimeHours.toFixed(2);



document.getElementById(
"totalMiles"
).innerText =
miles;



document.getElementById(
"personalMiles"
).innerText =
personalMiles;



document.getElementById(
"mileagePay"
).innerText =
mileagePay.toFixed(2);



document.getElementById(
"regularPay"
).innerText =
regularPay.toFixed(2);



document.getElementById(
"overtimePay"
).innerText =
overtimePay.toFixed(2);



document.getElementById(
"grossPay"
).innerText =
gross.toFixed(2);


};


}



// ---------- Weekly Totals ----------


function updateTotals(data) {


    let hours = 0;
    let miles = 0;
    let acres = 0;
    let travel = 0;



    data.forEach(e => {

        hours += e.hours;

        miles += e.miles;

        acres += e.acres;

        travel += e.travel;

    });



    document.getElementById(
        "totalHours"
    ).innerText = hours.toFixed(2);



    document.getElementById(
        "totalMiles"
    ).innerText = miles;



    document.getElementById(
        "totalAcres"
    ).innerText = acres;



    document.getElementById(
        "totalTravel"
    ).innerText = travel.toFixed(2);



}



// ---------- Local Storage ----------


function saveEntries() {

    localStorage.setItem(
        "fieldEntries",
        JSON.stringify(entries)
    );

}



function loadEntries() {

    let saved =
    localStorage.getItem(
        "fieldEntries"
    );


    if(saved) {

        entries =
        JSON.parse(saved);

    }

}



// ---------- Dates ----------


function setDefaultDate(){

    let today =
    new Date()
    .toISOString()
    .split("T")[0];


    dateInput.value = today;

}



function setDefaultWeek(){

    weekSelector.value =
    getWeek(
        dateInput.value
    );

}



// ISO Week Number

function getWeek(dateString){


    let date = new Date(dateString);


    let day =
    date.getDay();


    date.setDate(
        date.getDate()
        + 4
        - (day || 7)
    );


    let yearStart =
    new Date(
        date.getFullYear(),
        0,
        1
    );


    let week =
    Math.ceil(
        (
            (
            (date-yearStart)
            /
            86400000
            )
            +1
        )
        /7
    );


    return (
        date.getFullYear()
        +
        "-W"
        +
        String(week)
        .padStart(2,"0")
    );

}



// Update when week changes

weekSelector.addEventListener(
    "change",
    renderTable
);



// ---------- Clear Form ----------


function clearForm(){

    dateInput.value =
    new Date()
    .toISOString()
    .split("T")[0];


    hoursInput.value="";

    startOdoInput.value="";

    endOdoInput.value="";

    milesInput.value="";

    acresInput.value="";

    samplingInput.value="";

    travelInput.value="";

    locationInput.value="";

    commentsInput.value="";


}
// ---------- Excel Export Button ----------

document
.getElementById("exportBtn")
.addEventListener(
    "click",
    exportExcel
);
// ---------- Register Service Worker ----------

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "service-worker.js"
            )
            .then(() => {

                console.log(
                    "Service Worker Registered"
                );

            })
            .catch(error => {

                console.log(
                    "Service Worker Failed:",
                    error
                );

            });

        }
    );

}
// ---------- Settings ----------


function loadSettings(){

    let saved =
    localStorage.getItem(
        "fieldSettings"
    );


    if(saved){

        settings =
        JSON.parse(saved);

    }


}



document
.getElementById("saveSettingsBtn")
.addEventListener(
"click",
()=>{


settings.hourlyRate =
Number(
document.getElementById(
"defaultHourlyRate"
).value
);



settings.mileageRate =
Number(
document.getElementById(
"defaultMileageRate"
).value
);



settings.vehicle =
document.getElementById(
"defaultVehicle"
).value;



localStorage.setItem(
"fieldSettings",
JSON.stringify(settings)
);



alert("Settings Saved");


});





function fillDefaultValues(){


document.getElementById(
"hourlyRate"
).value =
settings.hourlyRate;



document.getElementById(
"mileageRate"
).value =
settings.mileageRate;



document.getElementById(
"vehicleType"
).value =
settings.vehicle;



document.getElementById(
"defaultHourlyRate"
).value =
settings.hourlyRate;



document.getElementById(
"defaultMileageRate"
).value =
settings.mileageRate;



document.getElementById(
"defaultVehicle"
).value =
settings.vehicle;


}
