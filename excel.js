// ========================================
// Field Work Tracker
// Excel Export Module
// Wage + Mileage Summary
// ========================================


function exportExcel() {


    let selectedWeek =
        document.getElementById("weekSelector").value;



    let weekEntries =
        entries.filter(
            e => e.week === selectedWeek
        );



    if(weekEntries.length === 0){

        alert("No entries found for this week.");

        return;

    }



    let totalHours = 0;
    let totalMiles = 0;
    let totalAcres = 0;
    let totalTravel = 0;

    let personalMiles = 0;
    let mileageReimbursement = 0;

    let hourlyRate = 0;



    weekEntries.forEach(e=>{


        totalHours += e.hours;

        totalMiles += e.miles;

        totalAcres += e.acres;

        totalTravel += e.travel;



        if(e.vehicle === "Personal Vehicle"){

            personalMiles += e.miles;

            mileageReimbursement +=
                e.miles * e.mileageRate;

        }


        if(e.hourlyRate > 0){

            hourlyRate = e.hourlyRate;

        }


    });



    let regularHours =
        Math.min(totalHours,40);


    let overtimeHours =
        Math.max(totalHours-40,0);



    let regularPay =
        regularHours * hourlyRate;



    let overtimePay =
        overtimeHours *
        (hourlyRate * 1.5);



    let totalWages =
        regularPay + overtimePay;



    let totalCompensation =
        totalWages +
        mileageReimbursement;




    let data = [];



    // ---------- Header ----------


    data.push([
        "FIELD WORK REPORT"
    ]);


    data.push([
        "Week Starting Monday",
        selectedWeek
    ]);


    data.push([]);



    // ---------- Summary ----------


    data.push([
        "WEEKLY SUMMARY"
    ]);



    data.push([
        "Total Hours",
        totalHours
    ]);


    data.push([
        "Regular Hours",
        regularHours
    ]);


    data.push([
        "Overtime Hours",
        overtimeHours
    ]);



    data.push([]);



    data.push([
        "HOURLY WAGES"
    ]);


    data.push([
        "Hourly Rate",
        `$${hourlyRate.toFixed(2)}`
    ]);


    data.push([
        "Regular Pay",
        `$${regularPay.toFixed(2)}`
    ]);


    data.push([
        "Overtime Pay",
        `$${overtimePay.toFixed(2)}`
    ]);


    data.push([
        "Total Wages",
        `$${totalWages.toFixed(2)}`
    ]);



    data.push([]);



    data.push([
        "MILEAGE REIMBURSEMENT"
    ]);


    data.push([
        "Personal Vehicle Miles",
        personalMiles
    ]);


    data.push([
        "Mileage Rate",
        `$${weekEntries[0]?.mileageRate.toFixed(2)}`
    ]);


    data.push([
        "Mileage Reimbursement",
        `$${mileageReimbursement.toFixed(2)}`
    ]);



    data.push([]);



    data.push([
        "TOTAL COMPENSATION",
        `$${totalCompensation.toFixed(2)}`
    ]);



    data.push([]);

    data.push([]);



    // ---------- Detailed Entries ----------


    data.push([

        "Date",

        "Hours",

        "Starting Odometer",

        "Ending Odometer",

        "Miles",

        "Acres",

        "Sampling Type",

        "Travel Time",

        "Vehicle",

        "Mileage Rate",

        "Location",

        "Comments"

    ]);




    weekEntries.forEach(e=>{


        data.push([


            e.date,

            e.hours,

            e.startOdo,

            e.endOdo,

            e.miles,

            e.acres,

            e.sampling,

            e.travel,

            e.vehicle,

            `$${e.mileageRate.toFixed(2)}`,

            e.location,

            e.comments


        ]);


    });





    let worksheet =
        XLSX.utils.aoa_to_sheet(data);



    worksheet["!cols"] = [

        {width:18},

        {width:12},

        {width:18},

        {width:18},

        {width:12},

        {width:12},

        {width:18},

        {width:15},

        {width:18},

        {width:15},

        {width:20},

        {width:45}

    ];




    let workbook =
        XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Weekly Report"

    );




    XLSX.writeFile(

        workbook,

        `Field_Work_Report_${selectedWeek}.xlsx`

    );


}
