// ========================================
// Field Work Tracker
// Excel Export Module
// ========================================


function exportExcel() {


    let selectedWeek =
        document.getElementById("weekSelector").value;



    let weekEntries =
        entries.filter(
            e => e.week === selectedWeek
        );



    if(weekEntries.length === 0) {

        alert("No entries found for this week.");

        return;

    }



    let worksheetData = [];



    // Title

    worksheetData.push([
        "Field Work Report"
    ]);


    worksheetData.push([
        "Week",
        selectedWeek
    ]);


    worksheetData.push([]);



    // Summary

    let totalHours = 0;
    let totalMiles = 0;
    let totalAcres = 0;
    let totalTravel = 0;



    weekEntries.forEach(e => {

        totalHours += e.hours;

        totalMiles += e.miles;

        totalAcres += e.acres;

        totalTravel += e.travel;

    });



    worksheetData.push([
        "Weekly Totals"
    ]);

    worksheetData.push([
        "Hours Worked",
        totalHours
    ]);

    worksheetData.push([
        "Miles Driven",
        totalMiles
    ]);

    worksheetData.push([
        "Acres Sampled",
        totalAcres
    ]);

    worksheetData.push([
        "Travel Time",
        totalTravel
    ]);



    worksheetData.push([]);




    // Detailed Table

    worksheetData.push([

        "Date",

        "Hours",

        "Starting Odometer",

        "Ending Odometer",

        "Miles",

        "Acres",

        "Sampling Type",

        "Travel Time",

        "Location Area",

        "Comments"

    ]);




    weekEntries.forEach(e => {


        worksheetData.push([

            e.date,

            e.hours,

            e.startOdo,

            e.endOdo,

            e.miles,

            e.acres,

            e.sampling,

            e.travel,

            e.location,

            e.comments

        ]);


    });





    // Create Excel Sheet

    let worksheet =
        XLSX.utils.aoa_to_sheet(
            worksheetData
        );



    // Column sizing

    worksheet["!cols"] = [

        {width:15},
        {width:12},
        {width:18},
        {width:18},
        {width:12},
        {width:12},
        {width:18},
        {width:15},
        {width:20},
        {width:40}

    ];



    let workbook =
        XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Weekly Report"

    );




    // File Name

    let filename =
        `Field_Work_Report_${selectedWeek}.xlsx`;



    XLSX.writeFile(

        workbook,

        filename

    );


}
