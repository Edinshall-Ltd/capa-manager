<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">   </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/capaStyle.css"                            />
<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/edinshall_utilities.js">                  </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-ui.min.css"                 />
<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-ui.min.js">                 </script>
<script type="text/javascript"                      src =   "/_layouts/15/clientpeoplepicker.js">                                           </script>
<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/easepick_index.umd.js"> </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/easepick_index.css"     />   

<style>
    div[id='HeaderButtonRegion']{
        display: none;
    }
    div[id='s4-titlerow']{
        display: none;
    }
    div[id='O365_SuiteBranding_container']{
        display: none;
    }
</style>

<script>
'use strict';

//  Debug mode setting
    let debug           = false;
    let debugVerbose    = false;
    let debugCurrent    = false;
//

//  Variables
    var isQMKeyholder;
    var displayedAudits         = [];
    var toBeRemoved             = [];
    var validDeviationAudits    = [];
//

//  Filter arrays
    var filteredAuditsIDs           = [];
    var markActionIDs               = [];
    var markActionParentAuditIDs    = [];
    var markFindingIDs            = [];
    var markFindingParentAuditIDs = [];
    var markAuditIDs                = [];
    var filteredMarkActionIDs       = [];
    var filteredMarkFindingIDs    = [];
    var allActions                  = [];
    var actionQuery                 = "";
    var FindingQuery              = "";
    var auditQuery                  = "";
//

//  Addition version 2 variables
    var hasActionAssig;
    var hasActionStake;
    var haveLateActionsBeenRequested;
    var hasFindingLead;
    var hasFindingStak;
    var findingLead;
    var findingStak;
    var actionAssig;
    var actionStake;
//

//  Static permissions global variables
    let isQMA   = false;
    let isQM    = false;
//

$(document).ready(function () {

    CapaElementPlacement();

    if(debug | debugVerbose){
        console.log("\n\n******************************************************************************************************************\n" +
        "This page is running the latest script for CAPA Dashboard.\nPUBLISHED 14 Nov 2023\nUNOBFUSCATED Human readable version\n"+
        "(Obfuscated version to be produced for golive using https://javascriptobfuscator.com/Javascript-Obfuscator.aspx" +
        "\n******************************************************************************************************************\n");
    }
    
    $("div[id='MSOZoneCell_WebPartWPQ4']").hide();

    $( "#filterCats" ).tabs({
    });

    hideHTML();
    checkStaticPermissions()    .then(function(){
        displaySettings()           .done(function(){          
            formatDashboard()           .done(function(){      
                addEventListeners()         .done(function(){                      
                    formatActionsActivities()   .done(function(){       
                        dashboardMenu()           .done(function(){       
                            resetFilters();
                            showHTML();
                            if(debug | debugVerbose | debugCurrent){
                                console.log("Page fully loaded.  No activity expected until LOAD is requested. Setting the page to be the default for the site");
                            }
                        });
                    });
                });
            });
        });
    });
});

function resetFilters(){
    filterAuditsAndReviews().then(function(){
        prepareLocationsAndDepartments().done(function(){
            filterPeople().done(function(){
                filterDates().done(function(){
                    filterActionStatus();
                });
            });
        });
    });
}


/**
 * Set static permissions global variables
 */
   function checkStaticPermissions() {
    console.log("\n*********************** STATIC PERMISSIONS CHECK UNDERWAY ***********************\n");

    // Check membership in both groups
    return Promise.all([
        isMemberOfGroup("Quality Manager Admins"),
        isMemberOfGroup("Quality Managers")
    ]).then(results => {
        // results is an array where each element corresponds to the resolved value of each promise
        
        
        isQMA = results[0];
        isQM = results[1];

        // Process the results as needed
        console.log(`Is Quality Manager Admin: ${isQMA}`);
        console.log(`Is Quality Manager: ${isQM}`);

        console.log("\n*********************** STATIC PERMISSIONS CHECK COMPLETE ***********************\n");

        // You can return both results if needed
        return { isQMA, isQM };
    }).catch(error => {
        console.error('An error occurred during static permissions check:', error);
        alert("Error checking static authorisation. Please contact support.");
    });
}

function getDateRangeStart(rangeString){
    var answer = "error there was no rangeString";
    if(rangeString.length > 0){
       // console.log("the rangeString")
        var startdateString = rangeString.split("-")[0].trim();
        answer = getISODate(startdateString);
    }
    return answer;
}

function getDateRangeEnd(rangeString){
    var answer = "error there was no rangeString";
    if(rangeString.length > 0){
        var enddateString = rangeString.split("-")[1].trim();
        answer = getISODate(enddateString);
    }
    return answer;
}

function getISODate(dateString) {
    // Define an array that holds the names of the months.
    // The index of each month in this array corresponds to its numerical representation (0 for January, 1 for February, and so on).
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Split the input dateString into an array of three parts: the day, the month name, and the year.
    // The expected format of dateString is "DD Month YYYY".
    const [day, monthName, year] = dateString.split(" ");
    
    // Find the index of the monthName in the monthNames array.
    // This will give us the numerical representation of the month.
    const month = monthNames.indexOf(monthName);
    
    // Check if the month name was valid and found in the monthNames array.
    if (month === -1) {
        // If the month name is invalid (not found in monthNames), log an error message to the console.
        console.error("ERROR: The provided month name is not valid.");
        // Return null to indicate that the function was unable to process the input dateString.
        return null;
    }

    // Create a new Date object using the year, month, and day extracted from the input dateString.
    // The month is subtracted by 1 because the Date object expects months to be in the range 0-11.
    const date = new Date(year, month, day);
    
    // Convert the Date object to an ISO string and return it.
    return date.toISOString();
}

function createAuditDisplayTable() {
    // Create table element
    const table = document.createElement('table');
    table.id = 'auditDisplayTable';
    table.classList.add("capaTable");
    table.style.width = '100%';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [   '',
                        '',
                        '', 
                        '', 
                        'Ref.', 
                        'Type', 
                        '', 
                        'Title', 
                        'Location', 
                        'Start date', 
                        'Leader', 
                        'Stakeholders', 
                        'Findings'];
    
    const classes = [   'capaTable-th-i', 
                        'capaTable-th-i', 
                        'capaTable-th-i', 
                        'capaTable-th-i', 
                        'capaTable-th-n', 
                        'capaTable-th-m', 
                        'capaTable-th-m', 
                        'capaTable-th-w', 
                        'capaTable-th-m', 
                        'capaTable-th-n', 
                        'capaTable-th-m', 
                        'capaTable-th-w', 
                        'capaTable-th-xw'];

    for (let i = 0; i < headers.length; i++) {
        const th = document.createElement('th');
        th.textContent = headers[i];
        th.classList.add(classes[i]);
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    return table;
}

function loadData(){
    
    var deferred = $.Deferred();

    console.log("\n**** LOAD DATA   *************************\n");

    formatActionsActivities();

    const auditDisplayTable = createAuditDisplayTable();
    const auditDisplayBody = document.getElementById("auditDisplayBody");
    auditDisplayBody.innerHTML = '';
    auditDisplayBody.appendChild(auditDisplayTable);
    
    //  Reset the arrays
        filteredAuditsIDs           .length = 0;
        markActionIDs               .length = 0;
        markActionParentAuditIDs    .length = 0;
        markFindingIDs              .length = 0;
        markFindingParentAuditIDs   .length = 0;
        markAuditIDs                .length = 0;
        filteredMarkActionIDs       .length = 0;
        filteredMarkFindingIDs      .length = 0;
        allActions                  .length = 0;
    // end
    
    //  Initialize people emails
        var audPeopleQuery = "";
        var excPeopleQuery = "";
        var actPeopleQuery = "";

        //  Add emails to the Audit people query
            var audLeaderEmail = $("div[title='peoplepicker1']").find('.sp-peoplepicker-userSpan');
                if(audLeaderEmail.length > 0){  
                    audLeaderEmail = $(audLeaderEmail).attr("sid");
                    audLeaderEmail = audLeaderEmail.split("|")[2];
                }
                else{
                    audLeaderEmail = "";
                }
            var audStakehEmail = $("div[title='peoplepicker2']").find('.sp-peoplepicker-userSpan');
                
                if(audStakehEmail.length > 0){
                    console.log("We have the following in the Audit stakeholder filter  " + audStakehEmail.attr("sid"));
                    audStakehEmail = $(audStakehEmail).attr("sid");
                    audStakehEmail = audStakehEmail.split("|")[2];
                }
                else{
                    audStakehEmail = "";
                }
                
            if(audLeaderEmail.length > 0 | audStakehEmail.length > 0){    
                audPeopleQuery = " ( ";
            }
            if(audLeaderEmail.length > 0){
                audPeopleQuery += "( Audit_x0020_lead/EMail eq '" + audLeaderEmail + "' )";
            }
            if(audLeaderEmail.length > 0 && audStakehEmail .length > 0){
                audPeopleQuery += " and ";
            }
            if(audStakehEmail.length > 0){
                audPeopleQuery += "( Audit_x0020_stakeholders/EMail eq '" + audStakehEmail + "' )";
            }
            if(audLeaderEmail.length > 0 | audStakehEmail.length > 0){
                audPeopleQuery += " ) ";
            }
        //

        //  Add emails to the Finding people query
            var excLeaderEmail = $("div[title='peoplepicker3']").find('.sp-peoplepicker-userSpan');
                if(excLeaderEmail.length > 0){  
                    excLeaderEmail = $(excLeaderEmail).attr("sid");
                    excLeaderEmail = excLeaderEmail.split("|")[2];
                }
                else{
                    excLeaderEmail = null;
                }
            var excStakehEmail = $("div[title='peoplepicker4']").find('.sp-peoplepicker-userSpan');
                if(excStakehEmail.length > 0){  
                    excStakehEmail = $(excStakehEmail).attr("sid");
                    excStakehEmail = excStakehEmail.split("|")[2];
                }
                else{
                    excStakehEmail = null;
                }
            if(excLeaderEmail != null | excStakehEmail != null){    
                excPeopleQuery = " ( ";
            }
            if(excLeaderEmail != null){
                excPeopleQuery += "( ExceptionLead/EMail eq '" + excLeaderEmail + "' )";
            }
            if(excLeaderEmail != null && excStakehEmail != null){
                excPeopleQuery += " and ";
            }
            if(excStakehEmail != null){
                excPeopleQuery += "( ExceptionStakeholders/EMail eq '" + excStakehEmail + "' )";
            }
            if(excLeaderEmail != null | excStakehEmail != null){
                excPeopleQuery += " ) ";
            }
        //

        //  Add emails to the Action people query
            var actAssignEMail = $("div[title='peoplepicker5']").find('.sp-peoplepicker-userSpan');
                if(actAssignEMail.length > 0){  
                    actAssignEMail = $(actAssignEMail).attr("sid");
                    actAssignEMail = actAssignEMail.split("|")[2];
                }
                else{
                    actAssignEMail = null;
                }
            var actStakehEmail = $("div[title='peoplepicker6']").find('.sp-peoplepicker-userSpan');
                if(actStakehEmail.length > 0){  
                    actStakehEmail = $(actStakehEmail).attr("sid");
                    actStakehEmail = actStakehEmail.split("|")[2];
                }
                else{
                    actStakehEmail = null;
                }
            if(actAssignEMail != null | actStakehEmail != null){    
                actPeopleQuery = " ( ";
            }
            if(actAssignEMail != null){
                actPeopleQuery += "( Assignee/EMail eq '" + actAssignEMail + "' )";
            }
            if(actAssignEMail != null && actStakehEmail != null){
                actPeopleQuery += " and ";
            }
            if(actStakehEmail != null){
                actPeopleQuery += "( Action_x0020_stakeholders/EMail eq '" + actStakehEmail + "' )";
            }
            if(actAssignEMail != null | actStakehEmail != null){
                actPeopleQuery += " ) ";
            }
        //
    //  end
    
    //  Initialize the location and department variables
        var locationsArray      = [];
        var departmentsArray    = [];
        var locAndDepQuery      = "";

        //  Get all the checked locations and for each check location get the associated checked departments if there are any.
            var selectedLocations   = $("input[id^='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceOption']:checked");
            for(var a=0 ; a < selectedLocations.length ; a++){
                
                var locName = $(selectedLocations[a]).closest("span").attr("title");

                var deptCount       = $("input[id^='deptRef_" + locName + "']");
                var deptChecked     = $("input[id^='deptRef_" + locName + "']:checked");
                
                if(deptCount.length === deptChecked.length){
                    locationsArray.push(locName);
                }
                else{
                    for(var x=0 ; x < deptChecked.length ; x++){
                        departmentsArray.push($(deptChecked[x]).val());
                    } 
                }
            }
        //

        //  Add locations to the query
            if(locationsArray.length > 0){
                locAndDepQuery = " ( ";
            }
            for(var i=0 ; i < locationsArray.length ; i++){
                locAndDepQuery += "(AuditLocations eq '" + locationsArray[i] + "')";
                if((i+1) < locationsArray.length){
                    locAndDepQuery += " or ";
                }
            }
            if(locationsArray.length > 0){
                locAndDepQuery += ")";
            }
        //

        //  Add departments to the query
            if(departmentsArray.length > 0 && locationsArray.length > 0){
                locAndDepQuery += " and ( ";
            }
            else if(departmentsArray.length > 0){
                locAndDepQuery += " ( ";
            }
            for(var k=0 ; k < departmentsArray.length ; k++){
                locAndDepQuery += "(CAPA_DeptList/ID eq '" + departmentsArray[k] + "')";
                if((k+1) < departmentsArray.length){
                    locAndDepQuery += " or ";
                }
            }
            if(departmentsArray.length > 0){
                locAndDepQuery += ")"
            }
        //  
    //  end
    
    //  Initialize the date range variables
        var auditRangeQuery      = $("#auditRangePicker").val();
        if(auditRangeQuery.length > 0){
            auditRangeQuery = " ((Audit_x0020_start_x0020_date ge datetime'" + getDateRangeStart(auditRangeQuery) + "') and (Audit_x0020_start_x0020_date le datetime'" + getDateRangeEnd(auditRangeQuery) + "'))";
        }

        var actionRangeQuery      = $("#actionRangePicker").val();
        if(actionRangeQuery.length > 0){
            auditRangeQuery = " ((TaskDueDate ge datetime'" + getDateRangeStart(actionRangeQuery) + "') and (TaskDueDate le datetime'" + getDateRangeEnd(actionRangeQuery) + "'))";
        }
    //  end
    
    //  Initialize the action late status variables
        var lateActionsQuery = document.getElementById("lateCheckBox").checked;
        if(lateActionsQuery){
            var today = new Date();
            lateActionsQuery = "(TaskDueDate le datetime'" + today.toISOString() + "' and Action_x0020_complete eq false)";
        }
    //  end
    
    //  Initialize the audit types
        var auditTypesQuery = "";
        var customer        = "";
        var supplier        = "";
        var tempAuditTypes = $("input[id^='auditType']:checked");

        for(var a=0 ; a < tempAuditTypes.length ; a++){
            if($(tempAuditTypes[a]).val() === "Customer audit"){ customer = $("select[id='custPicker']").val(); }
            if($(tempAuditTypes[a]).val() === "Supplier audit"){ supplier = $("select[id='suppPicker']").val(); }
        }
        if(tempAuditTypes.length > 0){
            auditTypesQuery = " ( ";
        }
        for(var t=0 ; t < tempAuditTypes.length ; t++){
           if($(tempAuditTypes[t]).val() === "Customer audit"){
                if(customer.length === 0){  
                    alert("Please select one or more customers");
                    showAuditTable();
                }
                else{
                    for(var g=0 ; g < customer.length ; g++){
                        if(g > 0){  auditTypesQuery += " or ";  }
                        auditTypesQuery += "CA_CustomerId eq " + customer[g];
                    } 
                }
            }
            else if($(tempAuditTypes[t]).val() === "Supplier audit"){
                if(supplier.length === 0){  
                    alert("Please select one or more suppliers");  
                    showAuditTable();
                }
                else{
                    for(var h=0 ; h < supplier.length ; h++){
                        if(h > 0){  auditTypesQuery += " or ";}
                        auditTypesQuery += "SA_SupplierId eq " + supplier[h];
                    }
                }
            }
            else{
                auditTypesQuery += "(Audit_x0020_type eq '" + $(tempAuditTypes[t]).val() + "')";
            }
            if(tempAuditTypes.length > 1 && (t+1) < tempAuditTypes.length) {   auditTypesQuery += " or "}
        }
        if(tempAuditTypes.length > 0){
            auditTypesQuery += " ) ";
        }
        if(auditTypesQuery === " (  ) "){
            auditTypesQuery = "";
        }
    //  end
    
    //  Let's build and then run the queries one after the other to polulate the arrays
        
        //  Audit query build
            auditQuery = "";
            if(audPeopleQuery.length > 0){
                auditQuery = audPeopleQuery;
            }
            if(audPeopleQuery.length > 0 && locAndDepQuery.length > 0){
                auditQuery += " and ";
            }
            if(locAndDepQuery.length > 0){
                auditQuery += locAndDepQuery;
            }
            if((audPeopleQuery.length > 0 | locAndDepQuery.length > 0) && auditRangeQuery.length > 0){
                auditQuery += " and ";
            }
            if(auditRangeQuery.length > 0){
                auditQuery += auditRangeQuery;
            }
            if((audPeopleQuery.length > 0 | locAndDepQuery.length > 0 | auditRangeQuery.length > 0) && auditTypesQuery.length > 0){
                auditQuery += " and ";
            }
            if(auditTypesQuery.length > 0){
                auditQuery += auditTypesQuery;
            }
            console.log("***    auditQuery          : " + auditQuery);
        //  end

        //  Finding query build
            FindingQuery = "";
            if(excPeopleQuery.length > 0){
                FindingQuery = excPeopleQuery;
            }
            if(excPeopleQuery.length > 0 && locAndDepQuery.length > 0){
                FindingQuery += " and ";
            }
            if(excPeopleQuery.length > 0 && locAndDepQuery.length > 0){
                FindingQuery += locAndDepQuery;
            }
            console.log("***    FindingQuery      : " + FindingQuery);
        //  end

        //  Action query build
            actionQuery = "";
            if(actPeopleQuery.length > 0){
                actionQuery = actPeopleQuery;
            }
            if(actPeopleQuery.length > 0 && actionRangeQuery.length > 0 ){
                actionQuery += " and ";
            }
            if(actionRangeQuery.length > 0){
                actionQuery += actionRangeQuery;
            }
            if((actionRangeQuery.length > 0 | actPeopleQuery.length > 0) && locAndDepQuery.length > 0){
                actionQuery += " and ";
            }
            if(locAndDepQuery.length > 0 && (actPeopleQuery.length > 0 | actionRangeQuery.length > 0)){
                actionQuery += locAndDepQuery;
            }
            if(lateActionsQuery != false && actionQuery.length > 0){
                actionQuery += " and ";
            }
            if(lateActionsQuery != false){
                actionQuery += lateActionsQuery;
            }
            console.log("***    action query        : " + actionQuery);
        //  end
    
        //  Populate the arrays
            if(auditQuery.length > 0 && FindingQuery.length > 0 && actionQuery.length > 0){
                getAuditIDs(auditQuery).done(function(auditIDs){
                    for(var t=0 ; t < auditIDs.d.results.length ; t++){   
                        markAuditIDs                .push(auditIDs.d.results[t].ID.toString());
                    }
                    var auditFilter = "";
                    if(markAuditIDs.length > 0){
                        auditFilter += " and ( ";
                    }
                    for(var f=0 ; f < markAuditIDs.length ; f++){
                        auditFilter += "(parentAuditID eq '" + markAuditIDs[f] + "') ";
                        if((f+1) < markAuditIDs.length){
                            auditFilter += " or ";
                        }
                    }
                    if(markAuditIDs.length > 0){
                        auditFilter += ")";
                    }
                    getActionIDs(actionQuery + auditFilter).done(function(actionIDs){
                        for(var c=0 ; c < actionIDs.d.results.length ; c++){
                            markActionIDs               .push(actionIDs.d.results[c].ID.toString());
                            if(!markActionParentAuditIDs.includes(actionIDs.d.results[c].parentAuditID)){
                                markActionParentAuditIDs.push(actionIDs.d.results[c].parentAuditID);
                            }
                        }
                        getFindingIDs(FindingQuery + auditFilter).done(function(FindingIDs){
                            for(var d=0 ; d < FindingIDs.d.results.length ; d++){
                                markFindingIDs            .push(FindingIDs.d.results[d].ID.toString());
                                if(!markFindingParentAuditIDs.includes(FindingIDs.d.results[d].parentAuditID)){
                                     markFindingParentAuditIDs.push(FindingIDs.d.results[d].parentAuditID);
                                }
                            }

                            filteredAuditsIDs           = Array.from([...markFindingParentAuditIDs].filter(auditId => markActionParentAuditIDs.includes(auditId) && markAuditIDs.includes(auditId)));
                            filteredMarkActionIDs       = markActionIDs.filter((_, index) => filteredAuditsIDs.includes(markActionParentAuditIDs[index]));
                            filteredMarkFindingIDs    = markFindingIDs.filter((_, index) => filteredAuditsIDs.includes(markFindingParentAuditIDs[index]));

                            processArrays().then(function(){
                                // consoleArrays();
                                deferred.resolve();
                            });
                        });
                    });
                });
            }
            else if(auditQuery.length > 0 && FindingQuery.length > 0){
                getAuditIDs(auditQuery).done(function (auditIDs) {
                    for (var t = 0; t < auditIDs.d.results.length; t++) {
                        markAuditIDs.push(auditIDs.d.results[t].ID.toString());
                    }
                    var auditFilter = "";
                    if(markAuditIDs.length > 0){
                        auditFilter += " and ( ";
                    }
                    for(var f=0 ; f < markAuditIDs.length ; f++){
                        auditFilter += "(parentAuditID eq '" + markAuditIDs[f] + "') ";
                        if((f+1) < markAuditIDs.length){
                            auditFilter += " or ";
                        }
                    }
                    if(markAuditIDs.length > 0){
                        auditFilter += ")";
                    }
                    getFindingIDs(FindingQuery + auditFilter).done(function (FindingIDs) {
                        for (var d = 0; d < FindingIDs.d.results.length; d++) {
                            markFindingIDs.push(FindingIDs.d.results[d].ID.toString());
                            if(!markFindingParentAuditIDs.includes(FindingIDs.d.results[d].parentAuditID)){
                                markFindingParentAuditIDs.push(FindingIDs.d.results[d].parentAuditID);
                            };
                        }

                        filteredAuditsIDs = Array.from([...markFindingParentAuditIDs].filter(auditId => markAuditIDs.includes(auditId)));
                        filteredMarkFindingIDs = markFindingIDs.filter((_, index) => filteredAuditsIDs.includes(markFindingParentAuditIDs[index]));

                        processArrays().then(function(){
                            // consoleArrays();
                            deferred.resolve();
                        });
                    });
                });
            }
            else if(auditQuery.length > 0 && actionQuery.length > 0){
                 getAuditIDs(auditQuery).done(function (auditIDs) {
                    for (var t = 0; t < auditIDs.d.results.length; t++) {
                        markAuditIDs.push(auditIDs.d.results[t].ID.toString());
                    }
                    var auditFilter = "";
                    if(markAuditIDs.length > 0){
                        auditFilter += " and ( ";
                    }
                    for(var f=0 ; f < markAuditIDs.length ; f++){
                        auditFilter += "(parentAuditID eq '" + markAuditIDs[f] + "') ";
                        if((f+1) < markAuditIDs.length){
                            auditFilter += " or ";
                        }
                    }
                    if(markAuditIDs.length > 0){
                        auditFilter += ")";
                    }
                    getActionIDs(actionQuery + auditFilter).done(function (actionIDs) {
                        for (var c = 0; c < actionIDs.d.results.length; c++) {
                            markActionIDs       .push(actionIDs.d.results[c].ID.toString());
                            if (!markActionParentAuditIDs.includes(actionIDs.d.results[c].parentAuditID)) {
                                markActionParentAuditIDs.push(actionIDs.d.results[c].parentAuditID);
                            }
                            console.log("action ParentExceptionID : " + actionIDs.d.results[c].parentExceptionID);
                            if (!markFindingIDs.includes(actionIDs.d.results[c].parentExceptionID)) {
                                markFindingIDs.push(actionIDs.d.results[c].parentExceptionID);
                            }
                        }

                        filteredAuditsIDs = Array.from([...markActionParentAuditIDs].filter(auditId => markAuditIDs.includes(auditId)));
                        filteredMarkActionIDs = markActionIDs.filter((_, index) => filteredAuditsIDs.includes(markActionParentAuditIDs[index]));
                        filteredMarkFindingIDs = markFindingIDs.filter((_, index) => filteredAuditsIDs.includes(markFindingParentAuditIDs[index]));

                        processArrays().then(function(){
                            // consoleArrays();
                            deferred.resolve();
                        });
                    });
                });
            }
            else if(FindingQuery.length > 0 && actionQuery.length > 0){
                getActionIDs(actionQuery).done(function (actionIDs) {
                    for (var c = 0; c < actionIDs.d.results.length; c++) {
                        markActionIDs.push(actionIDs.d.results[c].ID.toString());
                        if(!markActionParentAuditIDs.includes(actionIDs.d.results[c].parentAuditID)){
                            markActionParentAuditIDs.push(actionIDs.d.results[c].parentAuditID);
                        }
                        if(!markFindingIDs.includes(actionIDs.d.results[c].parentExceptionID)){
                            markFindingIDs.push(actionIDs.d.results[c].parentExceptionID);
                        }
                    }
                    getFindingIDs(FindingQuery).done(function (FindingIDs) {
                        for (var d = 0; d < FindingIDs.d.results.length; d++) {
                            if(!markFindingIDs.includes(FindingIDs.d.results[d].ID.toString())){
                                markFindingIDs.push(FindingIDs.d.results[d].ID.toString());
                            }
                            if(!markFindingParentAuditIDs.includes(FindingIDs.d.results[d].parentAuditID)){
                                markFindingParentAuditIDs.push(FindingIDs.d.results[d].parentAuditID);
                            }
                        }

                        filteredAuditsIDs           = Array.from(new Set([...markFindingParentAuditIDs].filter(auditId => markActionParentAuditIDs.includes(auditId))));
                        filteredMarkActionIDs       = markActionIDs.filter((_, index) => filteredAuditsIDs.includes(markActionParentAuditIDs[index]));
                        filteredMarkFindingIDs    = markFindingIDs.filter((_, index) => filteredAuditsIDs.includes(markFindingParentAuditIDs[index]));

                        processArrays().then(function(){
                            // consoleArrays();
                            deferred.resolve();
                        });
                    });
                });
            }
            else if(auditQuery.length > 0){
                getAuditIDs(auditQuery).done(function (auditIDs) {
                    for (var t = 0; t < auditIDs.d.results.length; t++) {
                        markAuditIDs.push(auditIDs.d.results[t].ID.toString());
                    }

                    filteredAuditsIDs = markAuditIDs;

                    processArrays().then(function(){
                        // consoleArrays();
                        deferred.resolve();
                    });
                });
            }
            else if(FindingQuery.length > 0){ 
                getFindingIDs(FindingQuery).done(function (FindingIDs) {
                    for (var d = 0; d < FindingIDs.d.results.length; d++) {
                        markFindingIDs.push(FindingIDs.d.results[d].ID.toString());
                        markFindingParentAuditIDs.push(FindingIDs.d.results[d].parentAuditID);
                    }

                    filteredAuditsIDs = Array.from(new Set(markFindingParentAuditIDs));
                    filteredMarkFindingIDs = markFindingIDs;

                    processArrays().then(function(){
                        // consoleArrays();
                        deferred.resolve();
                    });
                });
            }
            else if(actionQuery.length > 0){
                getActionIDs(actionQuery).done(function (actionIDs) {
                    for (var c = 0; c < actionIDs.d.results.length; c++) {
                        markActionIDs.push(actionIDs.d.results[c].ID.toString());
                        markActionParentAuditIDs.push(actionIDs.d.results[c].parentAuditID);
                    }

                    filteredAuditsIDs = Array.from(new Set(markActionParentAuditIDs));
                    filteredMarkActionIDs = markActionIDs;

                    processArrays().then(function(){
                        // consoleArrays();
                        deferred.resolve();
                    });
                });
            }
            else{
                processArrays().then(function(){
                    // consoleArrays();
                    deferred.resolve();
                });
            }
        //  end
    //
    
        function processArrays(){
            
            var deferred = $.Deferred();
            var promises = [];

            filteredAuditsIDs.forEach(function(auditID) {
                var qFilter = "ID eq " + auditID;
                var promise = getAudits(qFilter).then(function(auditData) {
                    checkAuditRestrictions(auditData[0]).then(function(){                                                       ////////////////////////////////////////////////////////////////
                        getFindingsByAuditID(auditID).done(function(Findings){
                            for(var t=0 ; t < Findings.d.results.length ; t++){
                                displayFinding(Findings.d.results[t]).then(function(parentFindingID){
                                    getActionsByParentFindingID(parentFindingID).done(function(actions){
                                        for(var g=0 ; g < actions.d.results.length ; g++){
                                            displayAuditAction(actions.d.results[g]);
                                            allActions.push(actions.d.results[g]);
                                        }
                                        deferred.resolve();
                                    });
                                });
                            }
                            /*
                            Until the async is rewritten the following block will showHTML() and not the block at "stickyPlaster001"
                            */
                            showHTML();
                        })
                    });
                });
                promises.push(promise);
            });
            if (filteredAuditsIDs.length === 0) {
                deferred.resolve();
            }

            $.when.apply($, promises).done(function() {
                deferred.resolve();
            });

            return deferred.promise();
        }
    return deferred.promise();
}

function consoleArrays() {
    /**
     * This function logs the contents of various global arrays to the console for debugging purposes.
     * It helps in quickly assessing the current state of these arrays at any given point in time during the application's execution.
     * This is particularly useful for developers (especially juniors or trainees) to understand how data is being manipulated and stored across different parts of the application.
     */

    // Define an object that maps human-readable names to the actual global variable names of the arrays.
    // The keys are the names we want to log, and the values are the corresponding variable names of the arrays.
    const arraysToLog = {
        markActionIDs: "markActionIDs",
        markFindingIDs: "markFindingIDs",
        markAuditIDs: "markAuditIDs",
        markActionParentAuditIDs: "markActionParentAuditIDs",
        markFindingParentAuditIDs: "markFindingParentAuditIDs",
        filteredAuditsIDs: "filteredAuditsIDs",
        filteredMarkFindingIDs: "filteredMarkFindingIDs",
        filteredMarkActionIDs: "filteredMarkActionIDs"
    };

    // Iterate over each entry in the arraysToLog object. 
    // An entry is a key-value pair, where the key is the human-readable name and the value is the actual variable name.
    for (const [readableName, variableName] of Object.entries(arraysToLog)) {
        // Check if the array is defined in the global scope (window object in browsers).
        if (window[variableName]) {
            // If the array is defined, log its contents.
            // We use .join(', ') to convert the array elements to a string, separating each element with a comma and a space.
            console.log(`****   consoleArrays   ${readableName}: ${window[variableName].join(', ')}`);
        } else {
            // If the array is not defined, log a warning message.
            // This helps in identifying issues where we might have forgotten to define the array or if it's not in the global scope.
            console.warn(`****   consoleArrays   ${readableName} is not defined`);
        }
    }
}

function getCandidateAuditFindings(auditId, findingLead, findingStak){
    var queryFilter = "parentAuditID eq '" + auditId + "' ";

    if(findingLead != "emptyPeoplePicker"){
        queryFilter += " and ExceptionLead/EMail eq '" + findingLead + "'"
    }

    if(findingStak != "emptyPeoplePicker"){
        queryFilter += " and ExceptionStakeholders/EMail eq '" + findingStak + "'"
    }

    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Exceptions')/items?$top=5000&$filter=" + queryFilter + 
                    "&$expand=ExceptionLead,ExceptionStakeholders " + 
                    "&$select=*,ExceptionLead/FirstName, ExceptionLead/LastName, ExceptionLead/EMail, ExceptionStakeholders/FirstName, ExceptionStakeholders/LastName, ExceptionStakeholders/EMail";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Audit Findings ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
          //  if(debug | debugVerbose){
          //      console.log("success getting " + suc.d.results.length + " Findings with query : " + queryURL);
          //  }
          //  if(debugVerbose){
          //      console.log(JSON.stringify(suc,null,4));
         //   }
        }   
    });

}

function getCandidateAuditFindingsActions(auditID, actionRS, actionRE, actionAssig, actionStake){
    var queryFilter = "(parentAuditID eq '" + auditID + "') ";

    if(actionRS != null && actionRE != null){
        if(debugVerbose){
            console.log("\n*********************************\nThis should be filtered by date if we store dates against action due date\n******************************\n");
        }
    }

    if(actionAssig != "emptyPeoplePicker"){
        queryFilter += " and (Assignee/EMail eq '" + actionAssig + "') "
    }

    if(actionStake != "emptyPeoplePicker"){
        queryFilter += " and (Action_x0020_stakeholders/EMail eq '" + actionStake + "') "
    }

    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=5000&$filter=" + queryFilter + 
                    "&$expand=Assignee,Action_x0020_stakeholders,CAPA_DeptList,Assignee&$select=*,Assignee/FirstName,Assignee/LastName,Action_x0020_stakeholders/EMail,Assignee/EMail,CAPA_DeptList/DepartmentName&$orderby=parentAuditID";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Audit Findings ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            //if(debug | debugVerbose){
            //    console.log("success getting " + suc.d.results.length + " Findings with query : " + queryURL);
            //}
            //if(debugVerbose){
            //    console.log(JSON.stringify(suc,null,4));
            //}
        }   
    });
}

function getAuditFindings(auditId) {
    var dfd = $.Deferred();

    var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Exceptions')/items?$top=5000&$filter=(parentAuditID eq '" + auditId + "')" +
        "&$expand=ExceptionLead,ExceptionStakeholders " +
        "&$select=*,ExceptionLead/FirstName, ExceptionLead/LastName, ExceptionLead/EMail, ExceptionStakeholders/FirstName, ExceptionStakeholders/LastName, ExceptionStakeholders/EMail";
    
    $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function (err) {
            console.log("error getting Audit Findings ");
            console.log(JSON.stringify(err, null, 4));
            dfd.reject(auditId);
        },
        success: function (suc) {
            if(debug | debugVerbose){
                console.log("success getting " + suc.d.results.length + " Findings with getAuditFindings(" + auditId + ")");
            }
            if(debugVerbose){
                console.log(JSON.stringify(suc, null, 4));
            }
            if (suc.d.results.length === 0) {
                dfd.resolve(auditId);
            } else {
                dfd.resolve(suc);
            }
        }
    });

    return dfd.promise();
}

//  START of menus
    function createMenus() {
        // Start a chain of promises
        return Promise.resolve()
            .then(() => createFilter()      .then(populateFilter))      // Create and populate FILTER
            .then(() => createCreate()      .then(populateCreate))      // Create and populate CREATE
            .then(() => createSettings()    .then(populateSettings))    // Create and populate SETTINGS
            .then(() => createLegend()      .then(populateLegend));     // Create and populate LEGEND
    }

    function createFilter() {
        return new Promise((resolve) => {
            const filterSwitch = document.createElement("img");
            filterSwitch.src = "/sites/ChangeManager/Exceptions/code/images/collapsedOrange.svg";
            filterSwitch.id = "filterSwitch";
            filterSwitch.classList.add("control-icon");
            filterSwitch.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleMenus('filter');
            });
            const filterToggle = document.getElementById("filterToggle");
            filterToggle.prepend(filterSwitch);
            resolve();
        });
        }
    function populateFilter() {
        return new Promise((resolve) => {
        
             var filterMenu = document.getElementById("filterMenu");

            // Create and append the reset button
                const resetButton = document.createElement("input");
                resetButton.type = "button";
                resetButton.value = "Reset all filters";
                resetButton.addEventListener("click", function(e) {
                    e.stopPropagation();
                    resetFilters();
                });
                filterMenu.prepend(resetButton);
            
            // Create and append the load button
                const loadButton = document.createElement("input");
                loadButton.type = "button";
                loadButton.value = "Load";
                loadButton.classList.add("active-button");
                loadButton.addEventListener("click", function(e) {
                    e.stopPropagation();
                    hideHTML();
                    loadData().then(() => {
                        //showHTML();   stickyPlaster001
                        toggleMenus();
                    });
                });
                filterMenu.prepend(loadButton);
            
            // Create and append the logo
                const logo = document.createElement("img");
                logo.src = "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg";
                logo.classList.add("capa-squares-s");
                filterMenu.prepend(logo);
            
            resolve();

        });
    }

    function createCreate(){

        var deferred = $.Deferred();

        var create = document.createElement("img");
        create.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
        create.classList.add("control-icon");
        create.setAttribute("ID", "createSwitch");
        create.addEventListener("click", function(e){
            e.stopPropagation();
            toggleMenus("create");
        });
        var filterToggle = document.getElementById("filterToggle");
            filterToggle.prepend(create);

        deferred.resolve();

        return deferred.promise();
        }

    function populateCreate(){

        var deferred = $.Deferred();
        
        var createMenu = document.getElementById("createMenu");

        var logo = document.createElement("img");
            logo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
            logo.setAttribute("style", "height: 40px; padding-right: 15px;");
            $(createMenu).prepend(logo);

        var divTitle = document.createElement("span");
            $(divTitle).addClass("capa-section-title");
            divTitle.append("Create an audit, review, or internal deviation");
            $(createMenu).append(divTitle);
            $(createMenu).append(document.createElement("br"));
            $(createMenu).append(document.createElement("br"));

        var divSubTitle = document.createElement("span");
            divSubTitle.append("When creating a new Audit the fields included in the Audit details can vary depending on the type of Audit.  For example if selecting 'Customer audit' then the audit will be tailored for a Customer Audit.  Please advise if there are certain fields to include or exclude for each type of Audit.");
            $(createMenu).append(divSubTitle);

            $(createMenu).append(document.createElement("br"));
            $(createMenu).append(document.createElement("br"));

        var auditTypes = getAuditTypes();
            auditTypes.then(function(tys){
                if(tys.d.results.length === 0){
                    deferred.resolve();
                }
                else{
                    var typePicker = document.createElement("select");
                    typePicker.setAttribute("ID", "creationAuditType");
                    typePicker.setAttribute("type", "dropdown");
                    for(var g=0 ; g < tys.d.results.length ; g++){
                        var opt = document.createElement("option");
                            opt.setAttribute("ID", "auditTypeOption" + g);
                            opt.value   = tys.d.results[g].AuditType;
                            opt.text    = tys.d.results[g].AuditType;
                        typePicker.appendChild(opt);
                    }
                    //var createDiv = document.getElementById("createDiv");
                    $(createMenu).append(typePicker);
                    $(createMenu).append(document.createElement("br"));
                    $(createMenu).append(document.createElement("br"));
                    $(createMenu).append(document.createElement("br"));
                    var createButton = document.createElement("input");
                    createButton.setAttribute("type", "button");
                    $(createButton).addClass("active-button");
                    createButton.setAttribute("value", "Create");
                    createButton.addEventListener("click",function(e){
                        //alert("Debug script test creation Tuesdday 21/11/2023");
                        var auditTypeToCreate = document.getElementById("creationAuditType");
                            auditTypeToCreate = $(auditTypeToCreate).val();
                        createNewAudit(auditTypeToCreate);
                    });
                    $(createMenu).append(createButton);
                    deferred.resolve();
                }
            });

        return deferred.promise();
    }

    function createSettings(){
        var deferred = $.Deferred();

        var settings    = document.createElement("img");
        settings.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/settings2.svg");
        settings.setAttribute("ID", "settingsSwitch");
        $(settings).removeClass().addClass("control-icon");
        settings.addEventListener("click", function(e){
            e.stopPropagation();
            toggleMenus("settings");
        });
        var filterToggle = document.getElementById("filterToggle");
            filterToggle.prepend(settings);

        deferred.resolve();

        return deferred.promise();
        }
    function populateSettings(){

        var deferred = $.Deferred();

        var settingsMenu = document.getElementById("settingsMenu");
            
        var settingsMenuSquares    = document.createElement("img");
            settingsMenuSquares.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
            settingsMenuSquares.classList.add("capa-squares-s");
        var settingsMenuTitleSpan = document.createElement("span");
            settingsMenuTitleSpan.classList.add("capa-section-title");
            settingsMenuTitleSpan.append(settingsMenuSquares);
            settingsMenu.append(settingsMenuTitleSpan);

        var settingsMenuTitle = document.createElement("span");
            settingsMenuTitle.classList.add("capa-section-title");
            settingsMenuTitle.append("CAPA Control Panel");
            settingsMenu.append(settingsMenuTitle);

            settingsMenu.append(document.createElement("br"));
            settingsMenu.append(document.createElement("br"));
            settingsMenu.append(document.createElement("br"));

        var divSettingsSubTitle = document.createElement("span");
            divSettingsSubTitle.append("Please use the following options to manage aspects of the CAPA App.");
            settingsMenu.append(divSettingsSubTitle);

            settingsMenu.append(document.createElement("br"));
            settingsMenu.append(document.createElement("br"));

        if(isQM){
            console.log("User isQM");
            
            var addCustomer = document.createElement("img");
                addCustomer.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
                $(addCustomer).addClass("active-icon");
                addCustomer.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Customers/NewForm.aspx?&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(addCustomer, document.createTextNode("Add customer"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));

            var addSupplier = document.createElement("img");
                addSupplier.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
                $(addSupplier).addClass("active-icon");
                addSupplier.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Suppliers/NewForm.aspx?&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(addSupplier, document.createTextNode("Add supplier"));
        }
        else{
            console.log("User is not a QM : isQM = " + isQM);
        }
        if(isQMA){
            console.log("User isQMA");
            var manageCustomer              = document.createElement("img");
                manageCustomer.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/amberOpen.svg");
                $(manageCustomer).addClass("active-icon");
                manageCustomer.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Customers/Customer.aspx?&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                    destination = encodeURI(destination);
                        window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageCustomer, document.createTextNode("Manage customers"));

            var manageSuppliers             = document.createElement("img");
                manageSuppliers.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/amberOpen.svg");
                $(manageSuppliers).addClass("active-icon");
                manageSuppliers.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Suppliers/Supplier.aspx?&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageSuppliers, document.createTextNode("Manage suppliers"));

            var manageAuditTypes            = document.createElement("img");
                manageAuditTypes.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/amberOpen.svg");
                $(manageAuditTypes).addClass("active-icon");
                manageAuditTypes.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/AuditReviewTypes/AllItems.aspx?&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageAuditTypes, document.createTextNode("Manage audit and review types"));

            
            var manageFlowActionStatus      = document.createElement("img");
                manageFlowActionStatus.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/PowerAutomateIcon.svg");
                $(manageFlowActionStatus).addClass("active-icon");
                manageFlowActionStatus.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://make.powerautomate.com/environments/Default-12ed45aa-44de-49ef-970a-168cf3cdce34/flows/shared/bb66c935-487c-405e-8df1-857fa101a2e4/details";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageFlowActionStatus, document.createTextNode("Manage action status notifications"));

            var manageFlowActionReminders   = document.createElement("img");
                manageFlowActionReminders.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/PowerAutomateIcon.svg");
                $(manageFlowActionReminders).addClass("active-icon");
                manageFlowActionReminders.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://make.powerautomate.com/environments/Default-12ed45aa-44de-49ef-970a-168cf3cdce34/flows/shared/8dc4915a-62d9-4023-8ea5-88b0c5ce5357/details";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageFlowActionReminders, document.createTextNode("Manage actions reminder notifications"));

            var manageQMAs                  = document.createElement("img");
                manageQMAs.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/groupIcon.svg");
                $(manageQMAs).addClass("active-icon");
                manageQMAs.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_layouts/15/people.aspx?MembershipGroupId=32";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageQMAs, document.createTextNode("Manage quality manager administrators"));


            var manageQMKs                  = document.createElement("img");
                manageQMKs.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/groupIcon.svg");
                $(manageQMKs).addClass("active-icon");
                manageQMKs.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_layouts/15/people.aspx?MembershipGroupId=175";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageQMKs, document.createTextNode("Manage quality manager keyholders"));

            var manageQMs                   = document.createElement("img");
                manageQMs.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/groupIcon.svg");
                $(manageQMs).addClass("active-icon");
                manageQMs.addEventListener("click", function(e){
                    e.stopPropagation();
                    var destination = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_layouts/15/people.aspx?MembershipGroupId=13";
                    destination = encodeURI(destination);
                    window.open(destination, '_blank');
                });
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(document.createElement("br"));
                $(settingsMenu).append(manageQMs, document.createTextNode("Manage quality managers"));

            // To indicate that teh user is logged in as QMA we will update teh background colour of the header-sections
            let sects = document.getElementsByClassName("section-header");
            let sectsArray = Array.from(sects);
            sectsArray.forEach(function(sect){
                sect.classList.add("section-header-admin");
                sect.classList.remove("section-header");
            });
        }
        else{
            console.log("User is not a QMA : isQMA = " + isQMA);
        }
        deferred.resolve();


        return deferred.promise();
    }

    function createLegend(){
        var deferred = $.Deferred();

        var legend = document.createElement("img");
        legend.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/legend.svg");
        $(legend).removeClass().addClass("control-icon");
        legend.setAttribute("ID", "legendSwitch");
        legend.addEventListener("click", function(e){
            e.stopPropagation();
            toggleMenus("legend");
        });
        var filterToggle = document.getElementById("filterToggle");
            filterToggle.prepend(legend);

        deferred.resolve();

        return deferred.promise();
        }

    function populateLegend(){
        var deferred = $.Deferred();

        var legendMenu = document.getElementById("legendMenu");

        $(legendMenu).empty();
        
        var logo = document.createElement("img");
            logo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
            logo.setAttribute("style", "height: 40px; padding-right: 15px;");
            $(legendMenu).prepend(logo);

        var divTitle = document.createElement("span");
            $(divTitle).addClass("capa-section-title");
            divTitle.append("CAPA Manager Legend");
            $(legendMenu).append(divTitle);
            $(legendMenu).append(document.createElement("br"));
            $(legendMenu).append(document.createElement("br"));

        var divSubTitle = document.createElement("span");
            $(legendMenu).append(divSubTitle);

            $(legendMenu).append(document.createElement("br"));
            $(legendMenu).append(document.createElement("br"));

        var iconsAndText = [];

        iconsAndText.push(["subheading",,"General navigation"]);
        iconsAndText.push(["hr"]);
        iconsAndText.push(["airnov4square.svg"          ,20 , "Navigate to dashboard"   ]);
        iconsAndText.push(["greenOpen.svg"              ,20 , "Open item"               ]);
        iconsAndText.push(["lockedRed.svg"              ,20 , "Locked data item"        ]);
        iconsAndText.push(["unlockedGreen.svg"          ,20 , "Unlocked data item"      ]);
        iconsAndText.push(["add.svg"                    ,20 , "Create new"              ]);
        iconsAndText.push(["settings2.svg"              ,20 , "Settings"                ]);
        iconsAndText.push(["legend.svg"                 ,20 , "Legend"                  ]);
        iconsAndText.push(["eyesOpenGreen.svg"          ,20 , "Unrestricted access"           ]);
        iconsAndText.push(["eyesClosedRed.svg"          ,20 , "Restricted access" ]);
        iconsAndText.push(["blank"                                                      ]);
        iconsAndText.push(["subheading"                 ,   , "Findings"                ]);
        iconsAndText.push(["hr"]);
        iconsAndText.push(["Recommendation_bullet.JPG"  ,20 , "Recomendation"           ]);
        iconsAndText.push(["Minor_bullet.JPG"           ,20 , "Minor deviation"         ]);
        iconsAndText.push(["Major_bullet.JPG"           ,20 , "Major deviation"         ]);
        iconsAndText.push(["Critical_bullet.JPG"        ,20 , "Critic deviation"        ]);
        iconsAndText.push(["Unknown_bullet.JPG"         ,20 , "Undefined finding"       ]);
        iconsAndText.push(["blank"]);
        iconsAndText.push(["subheading"                 ,   , "Action status"           ]);
        iconsAndText.push(["hr"]);
        iconsAndText.push(["Plan.svg"                   ,20 , "Plan"                    ]);
        iconsAndText.push(["Do.svg"                     ,20 , "Do"                      ]);
        iconsAndText.push(["Check.svg"                  ,20 , "Check"                   ]);
        iconsAndText.push(["Act.svg"                    ,20 , "Act"                     ]);
        
        iconsAndText.push(["blank"]);
        iconsAndText.push(["subheading"                 ,   , "Action schedule"         ]);
        iconsAndText.push(["hr"]);
        iconsAndText.push(["GreenSolidSquare.svg"       ,20 , "On schedule"             ]);
        iconsAndText.push(["AmberSolidSquare.svg"       ,20 , "Details missing"         ]);
        iconsAndText.push(["RedSolidSquare.svg"         ,20 , "Late"                    ]);
        


        var legendTable = "<div><table><thead><tr><th width='75px;'></th><th></th></thead><tbody>";
        for(var t=0 ; t < iconsAndText.length ; t++){
            if(iconsAndText[t][0] === "hr"){
                legendTable += "<tr><td colspan='2'><hr></td></tr>";
            }
            else if(iconsAndText[t][0] === "subheading"){
                legendTable += "<tr><td colspan='2'><strong>" + iconsAndText[t][2] + "</strong></td></tr>";
            }
            else if(iconsAndText[t][0] === "blank"){
                legendTable += "<tr><td colspan='2'>&nbsp;</td></tr>";
            }
            else{
                legendTable += "<tr><td align='left' style='padding-top: 5px;'><img src='/sites/ChangeManager/Exceptions/code/images/" 
                            + iconsAndText[t][0] + "' height='" + iconsAndText[t][1] + "'></td><td style='padding-top: 5px;'>" + iconsAndText[t][2] + "</td></tr>";
            }
        }
        legendTable += "</tbody></table></div>";

        $(legendMenu).append(legendTable);

        deferred.resolve();

        return deferred.promise();
    }
    
    function toggleMenus(menuName){
        return new Promise((resolve) => {
            switch (menuName) {
                case "legend":
                    const legendMenu = document.getElementById("legendMenu");
                    if(legendMenu.classList.contains(   "menu-hide")){
                        legendMenu                              .classList  .remove(    "menu-hide");
                        legendMenu                              .classList  .add(       "menu-show");
                    }
                    else{
                        legendMenu                              .classList  .remove(    "menu-show");
                        legendMenu                              .classList  .add(       "menu-hide");
                    }
                    document.getElementById("settingsMenu")     .classList  .add(       "menu-hide");
                    document.getElementById("createMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterSwitch") .src = "/sites/ChangeManager/Exceptions/code/images/collapsedOrange.svg";
                    
                    break;

                case "settings":
                    const settingsMenu = document.getElementById("settingsMenu");
                    if(settingsMenu.classList.contains(   "menu-hide")){
                        settingsMenu                            .classList  .remove(    "menu-hide");
                        settingsMenu                            .classList  .add(       "menu-show");
                    }
                    else{
                        settingsMenu                            .classList  .remove(    "menu-show");
                        settingsMenu                            .classList  .add(       "menu-hide");
                    }
                    document.getElementById("legendMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("createMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterSwitch") .src = "/sites/ChangeManager/Exceptions/code/images/collapsedOrange.svg";
                    
                    break;

                case "create":
                    const createMenu = document.getElementById("createMenu");
                    if(createMenu.classList.contains(   "menu-hide")){
                        createMenu                              .classList  .remove(    "menu-hide");
                        createMenu                              .classList  .add(       "menu-show");
                    }
                    else{
                        createMenu                              .classList  .remove(    "menu-show");
                        createMenu                              .classList  .add(       "menu-hide");
                    }
                    document.getElementById("legendMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("settingsMenu")     .classList  .add(       "menu-hide");
                    document.getElementById("filterMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterSwitch") .src = "/sites/ChangeManager/Exceptions/code/images/collapsedOrange.svg";
                    break;
                
                case "filter":
                    const filterMenu = document.getElementById("filterMenu");
                    if(filterMenu.classList.contains(   "menu-hide")){
                        filterMenu                              .classList  .remove(    "menu-hide");
                        filterMenu                              .classList  .add(       "menu-show");
                        filterMenu.src = "/sites/ChangeManager/Exceptions/code/images/collapsedOrange.svg";
                    }
                    else{
                        filterMenu                              .classList  .remove(    "menu-show");
                        filterMenu                              .classList  .add(       "menu-hide");
                        filterMenu.src = "/sites/ChangeManager/Exceptions/code/images/expandededOrange.svg";
                    }
                    document.getElementById("legendMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("settingsMenu")     .classList  .add(       "menu-hide");
                    document.getElementById("createMenu")       .classList  .add(       "menu-hide");
                    break;
                
                default:
                    document.getElementById("settingsMenu")     .classList  .add(       "menu-hide");
                    document.getElementById("legendMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("createMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterMenu")       .classList  .add(       "menu-hide");
                    document.getElementById("filterSwitch")     .src = "/sites/ChangeManager/Exceptions/code/images/collapsedOrange.svg";
                    break;
            }

            resolve();
        });
    }

    function dashboardMenu(){
        console.log("\n******************\nbuild dashboard menu");
        
        var deferred = $.Deferred();

        createMenus().then(function(){
            console.log("create menus has completed");
            toggleMenus().then(function(){
                console.log("hide menus has comeplted");
                deferred.resolve();
            });
        });

        return deferred.promise();
    }
//  END of menus

function filterAuditsAndReviews() {
    // Creating a Promise to handle asynchronous operations.
    return new Promise(resolve => {
        // Selecting the audit display header element and clearing its content.
        const auditDisplayHeader = document.getElementById("auditDisplayHeader");
        auditDisplayHeader.innerHTML = '';

        // Fetching the audit types.
        getAuditTypes().then(types => {
            types.d.results.forEach(type => {
                    /*
                        // Creating a checkbox for each audit type.
                        const selectTypes = document.createElement("input");
                        selectTypes.type = "checkbox";
                        selectTypes.style.padding = "40px";
                        selectTypes.style.margin = "2px";
                        selectTypes.name = "selectAuditType";
                        selectTypes.value = type.AuditType;
                        selectTypes.id = "auditType" + type.ID;

                        // Creating a label for the checkbox.
                        const label = document.createElement("label");
                        label.htmlFor = "auditType" + type.ID;
                        label.textContent = "   " + type.AuditType;
                    //   label.classList.add("auditReviewType");
                    */
                const checkboxId = "auditType" + type.ID;  // This should create a unique ID for each checkbox
                const selectTypes = document.createElement("input");
                selectTypes.type = "checkbox";
                selectTypes.style.padding = "40px";
                selectTypes.style.margin = "2px";
                selectTypes.name = "selectAuditType";
                selectTypes.value = type.AuditType;
                selectTypes.id = checkboxId;  // Set the unique ID here

                const label = document.createElement("label");
                label.htmlFor = checkboxId;  // Ensure the `for` attribute matches the unique ID
                label.textContent = "   " + type.AuditType;

                // Handling specific audit types differently.
                auditDisplayHeader.appendChild(document.createElement("br"));

                switch (type.AuditType) {
                    case "Customer audit":
                        handleCustomerAudit(auditDisplayHeader, selectTypes, label);
                        break;

                    case "Supplier audit":
                        handleSupplierAudit(auditDisplayHeader, selectTypes, label);
                        break;

                    default:
                        // For other audit types, simply appending the checkbox and label.
                        auditDisplayHeader.appendChild(selectTypes);
                        auditDisplayHeader.appendChild(label);
                        break;
                }
                
                auditDisplayHeader.appendChild(document.createElement("br"));
            });

            /*  Removing the option to include closed audits
                // Creating a checkbox to include closed audits and reviews.
                const includeClosed = document.createElement("input");
                includeClosed.type = "checkbox";
                includeClosed.id = "includeClosed";

                // Creating a label for the include closed checkbox.
                const includeClosedText = document.createElement("span");
                includeClosedText.classList.add("auditReviewType");
                includeClosedText.textContent = "Include closed audits and reviews";

                // Appending the include closed checkbox and label to the audit display header.
                auditDisplayHeader.appendChild(document.createElement("hr"));
                auditDisplayHeader.appendChild(document.createElement("br"));
                auditDisplayHeader.appendChild(includeClosed);
                auditDisplayHeader.appendChild(includeClosedText);
            */

            // Resolving the Promise after all operations are complete.
            resolve();
        });
    });
}

function handleCustomerAudit(auditDisplayHeader, selectTypes, label) {
    // Creating a div to hold the customer picker.
    const customerDiv = document.createElement("div");
    customerDiv.id = "customerDiv";
    customerDiv.style.display = "none";

    // Fetching the customers.
    getCustomers().then(customers => {
        // Creating a select element for the customer picker.
        const custPicker = document.createElement("select");
        custPicker.id = "custPicker";
        custPicker.size = 6;
        custPicker.multiple = true;
        custPicker.style.marginLeft = "30px";
        custPicker.style.width = "300px";

        // Appending options for each customer to the select element.
        customers.d.results.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer.ID;
            option.textContent = customer.Customer_x0020_name;
            custPicker.appendChild(option);
        });

        // Appending the customer picker to the customer picker div.
        customerDiv.append(custPicker);
    });

    // Adding a change event listener to the customer audit checkbox.
    selectTypes.addEventListener("change", function (e) {
        e.stopPropagation();
        const customerPicker = document.getElementById("customerDiv");
        if (this.checked) {
            customerPicker.style.display = "block";
            customerPicker.style.paddingTop = "10px";
            customerPicker.style.paddingBottom = "10px";
        } else {
            customerPicker.style.display = "none";
            document.querySelector("select#custPicker").querySelectorAll("option").forEach(option => {
                option.selected = false;
            });
        }
    });

    // Appending the customer audit checkbox and label to the audit display header.
    auditDisplayHeader.append(selectTypes);
    auditDisplayHeader.append(label);
        
    // Appending the customer picker div to the audit display header.
    auditDisplayHeader.append(customerDiv);

    // Creating a checkbox to select all customers.
    const selectAllCusts = document.createElement("input");
    selectAllCusts.type = "checkbox";
    selectAllCusts.style.marginLeft = "30px";
    selectAllCusts.id = "selectAllCusts";

    // Adding a change event listener to the select all customers checkbox.
    selectAllCusts.addEventListener("change", function (e) {
        e.stopPropagation();
        const custPicker = document.querySelector("select#custPicker");
        const allOptions = custPicker.querySelectorAll("option");
        allOptions.forEach(option => {
            option.selected = this.checked;
        });
    });

    // Appending the select all customers checkbox and label to the customer picker div.
    customerDiv.append(document.createElement('br'), selectAllCusts, document.createTextNode("Select all customers"));
}

function handleSupplierAudit(auditDisplayHeader, selectTypes, label) {
    // Creating a div to hold the supplier picker.
    const supplierDiv = document.createElement("div");
    supplierDiv.id = "supplierDiv";
    supplierDiv.style.display = "none";

    // Fetching the suppliers.
    getSuppliers().then(suppliers => {
        // Creating a select element for the supplier picker.
        const suppPicker = document.createElement("select");
        suppPicker.id = "suppPicker";
        suppPicker.size = 6;
        suppPicker.multiple = true;
        suppPicker.style.marginLeft = "30px";
        suppPicker.style.width = "300px";

        // Appending options for each supplier to the select element.
        suppliers.d.results.forEach(supplier => {
            const option = document.createElement("option");
            option.value = supplier.ID;
            option.textContent = supplier.Supplier_x0020_name;
            suppPicker.appendChild(option);
        });

        // Appending the supplier picker to the supplier picker div.
        supplierDiv.append(suppPicker);
    });

    // Adding a change event listener to the supplier audit checkbox.
    selectTypes.addEventListener("change", function (e) {
        e.stopPropagation();
        const supplierPicker = document.getElementById("supplierDiv");
        if (this.checked) {
            supplierPicker.style.display = "block";
            supplierPicker.style.paddingTop = "10px";
            supplierPicker.style.paddingBottom = "10px";
        } else {
            supplierPicker.style.display = "none";
            document.querySelector("select#suppPicker").querySelectorAll("option").forEach(option => {
                option.selected = false;
            });
        }
    });

    // Appending the supplier audit checkbox and label to the audit display header.
    auditDisplayHeader.append(selectTypes);
    auditDisplayHeader.append(label);
    
    // Appending the supplier picker div to the audit display header.
    auditDisplayHeader.append(supplierDiv);
    
    // Creating a checkbox to select all suppliers.
    const selectAllSupps = document.createElement("input");
    selectAllSupps.type = "checkbox";
    selectAllSupps.style.marginLeft = "30px";
    selectAllSupps.id = "selectAllSupps";

    // Adding a change event listener to the select all suppliers checkbox.
    selectAllSupps.addEventListener("change", function (e) {
        e.stopPropagation();
        const suppPicker = document.querySelector("select#suppPicker");
        const allOptions = suppPicker.querySelectorAll("option");
        allOptions.forEach(option => {
            option.selected = this.checked;
        });
    });

    // Appending the select all suppliers checkbox and label to the supplier picker div.
    supplierDiv.append(selectAllSupps, document.createTextNode("Select all suppliers"));
}

function createNewAudit(typeOfAudit){
    var ex = createAudit(typeOfAudit);
    ex.done(function(audit){
        document.location.href = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Audits%20and%20reviews/EditForm.aspx?ID=" + audit.d.ID 
                                + "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
        
    });
}

function createAuditTypeFilter(parentElement, type, selectTypes, label) {

    /**
     * Creates and configures a filter div and select element for a specific audit type (customer or supplier).
     * @param {HTMLElement} parentElement - The parent element to append the filter options to.
     * @param {string} type - The type of audit ("customer" or "supplier").
     * @param {HTMLInputElement} selectTypes - The checkbox input element for the audit type.
     * @param {HTMLLabelElement} label - The label element for the audit type.
     */
    // Creating and configuring the filter div.
    const filterDiv = document.createElement("div");
    filterDiv.id = `${type}Menu`;
    filterDiv.style.display = "none";
    parentElement.append(filterDiv);

    // Fetching data (customers or suppliers) to populate the filter dropdown.
    const fetchData = type === "customer" ? getCustomers() : getSuppliers();
    fetchData.then(data => {
        // Creating and configuring the select element.
        const picker = document.createElement("select");
        picker.id = `${type}Picker`;
        picker.size = 6;
        picker.multiple = true;
        picker.style.marginLeft = "30px";
        picker.style.width = "300px";

        // Populating the select element with options.
        data.d.results.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ID;
        option.text = item[`${type}_x0020_name`];
        picker.appendChild(option);
        });

        filterDiv.appendChild(picker);
    });

    // Adding an event listener to show/hide filter div based on checkbox state.
    selectTypes.addEventListener("change", function(e) {
        e.stopPropagation();
        const pickerDiv = document.getElementById(`${type}Div`);
        pickerDiv.style.display = this.checked ? "block" : "none";
        if (!this.checked) {
        const picker = document.getElementById(`${type}Picker`);
        Array.from(picker.options).forEach(option => option.selected = false);
        }
    });

    // Appending the checkbox and label elements to the parent element.
    parentElement.append(selectTypes, label, document.createElement("br"));

    // Creating and configuring the "Select all" checkbox.
    const selectAll = document.createElement("input");
    selectAll.type = "checkbox";
    selectAll.style.marginLeft = "30px";
    selectAll.id = `selectAll${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    selectAll.addEventListener("change", function(e) {
        e.stopPropagation();
        const picker = document.getElementById(`${type}Picker`);
        Array.from(picker.options).forEach(option => option.selected = this.checked);
    });

    // Appending the "Select all" checkbox and label to the filter div.
    filterDiv.append(document.createElement("br"), selectAll, document.createTextNode(`Select all ${type}s`));
}

function formatActionsActivities(){
    var deferred = $.Deferred();

    var rowsSelected = $("input[id^='loadActions']:checked");
    var actionActivitiesHeader = document.getElementById("actionActivitiesHeader");
    $(actionActivitiesHeader).empty();
    var actionDisplayBody    = document.getElementById("actionActivitiesDisplay");
    $(actionDisplayBody).empty();

    if(rowsSelected.length > 0){
        var loadButtonActions = document.createElement("input");
        loadButtonActions.setAttribute("type", "button");
        loadButtonActions.setAttribute("ID", "loadButtonActions");
        loadButtonActions.setAttribute("value", "Load");
        $(actionActivitiesHeader).append(loadButtonActions);
        $(loadButtonActions).addClass("active-button");
        var loadActionsTitleSpan = document.createElement("span");
        $(loadActionsTitleSpan).addClass("capa-section-title");
     //   loadActionsTitleSpan.append("Load the actions and activities for the selected audits and reviews.");
        
      /*  This was here to make it quicjker for keyholders to select all teh items above.  However, we will leave this out for now as it is quite resource intensive.
        if(isQMKeyholder){
            var selectAllAudits = document.createElement("input");
                selectAllAudits.setAttribute("type", "checkbox");
                selectAllAudits.setAttribute("style", "padding-left: 15px;");
                selectAllAudits.addEventListener("change", function(e){
                    e.stopPropagation();
                    if(this.checked === true){
                        //  Select all the audits and reviews
                        $("input[id^='loadActions']").prop("checked", true).closest("tr").removeClass().addClass("selected-row");
                    }
                    else{
                        $("input[id^='loadActions']").prop("checked", false).closest("tr").removeClass().addClass('blue-background data-row');
                    }
                });
            loadActionsTitleSpan.append(document.createElement("br"));
            loadActionsTitleSpan.append(selectAllAudits);
            loadActionsTitleSpan.append(document.createTextNode("Select/deselect all the above audits and reviews (QM keyholders only)"));
        }
        */


        $(actionActivitiesHeader).append(loadActionsTitleSpan);
        loadButtonActions.addEventListener("click", function(e){
            e.stopPropagation();
            loadActions();
        });
    }
    deferred.resolve();
    return deferred.promise();
}

function formatDashboard(){
    var deferred = $.Deferred();

    var toggleAuditsIcon = document.createElement("img");
        var tAudits = document.getElementById("auditsBody");
        tAudits.style.display = "";
        toggleAuditsIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/remove.svg");
        toggleAuditsIcon.setAttribute("style", "height: 20px; padding-right: 5px;");
        toggleAuditsIcon.setAttribute("id", "toggleAuditsIcon");
        $(toggleAuditsIcon).addClass("active-icon");
        toggleAuditsIcon.addEventListener("click", function(e){
            e.stopPropagation();
            toggleAudits();
        });
        $("span[id='toggleAudits']").append(toggleAuditsIcon);

    var toggleFindingsIcon = document.createElement("img");
        var tFindings = document.getElementById("FindingsBody");
        tFindings.style.display = "";
        toggleFindingsIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/remove.svg");
        toggleFindingsIcon.setAttribute("style", "height: 20px; padding-right: 5px;");
        toggleFindingsIcon.setAttribute("id", "toggleFindingsIcon");
        $(toggleFindingsIcon).addClass("active-icon");
        toggleFindingsIcon.addEventListener("click", function(e){
            e.stopPropagation();
            toggleFindings();
        });
        $("span[id='toggleFindings']").append(toggleFindingsIcon);

    
    deferred.resolve();
    
    return deferred.promise();
}

function isMemberOfGroup(groupName){
    var deferred = new $.Deferred();
    var membership = getGroupMembers(groupName);
    membership.done(function(members){
        var currentUser = _spPageContextInfo.userLoginName; 
        for(var i = 0 ; i < members.d.results.length ; i++){
            if(members.d.results[i].Email.toLowerCase() === currentUser.toLowerCase()){
                deferred.resolve(true);
            }
            if(i === (members.d.results.length - 1)){
                deferred.resolve(false);
            }
        }
    });
    return deferred.promise();
}

function getGroupMembers(groupName){
    // Build the query URL using the group name.
    var queryURL = "/_api/Web/SiteGroups/GetByName('" + groupName + "')/users?$select=Email, Title";
    
    // Perform the AJAX request to the SharePoint API.
    return $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + queryURL, // Construct the full URL using the page context info.
        type: "GET", // HTTP method is GET.
        headers: {
            "accept": "application/json;odata=verbose" // Request header for verbose JSON response.
        },
        success: function (suc) {  
            // If debug flags are set, log the success message and data to the console.
            //if(debug || debugVerbose){
            //    console.log("Success on returning members of " + groupName);
            //}
            //if(debugVerbose){
            //    console.log(JSON.stringify(suc, null, 4)); // Log the success data with indentation for readability.
            //}
            // The success callback does not return or resolve the data received.
        },
        error: function (err) {   
            // On error, log the error message and details to the console.
            console.log("Error on returning members of " + groupName + "\n" + JSON.stringify(err, null, 4));
        }
    });
}

function getGroupMembersById(groupId){
    // Build the query URL using the group name.
    var queryURL = "/_api/Web/SiteGroups/GetById('" + groupId + "')/users?$select=Email, Title";
    
    // Perform the AJAX request to the SharePoint API.
    return $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + queryURL, // Construct the full URL using the page context info.
        type: "GET", // HTTP method is GET.
        headers: {
            "accept": "application/json;odata=verbose" // Request header for verbose JSON response.
        },
        success: function (suc) {  
            // If debug flags are set, log the success message and data to the console.
            //if(debug || debugVerbose){
            //    console.log("Success on returning members of " + groupId);
            //}
            //if(debugVerbose){
            //    console.log(JSON.stringify(suc, null, 4)); // Log the success data with indentation for readability.
            //}
            // The success callback does not return or resolve the data received.
        },
        error: function (err) {   
            // On error, log the error message and details to the console.
            console.log("Error on returning members of " + groupId + "\n" + JSON.stringify(err, null, 4));
        }
    });
}

function getAuditTypes() {
    /**
     * Function to retrieve a list of active audit types from the SharePoint list 'AuditReviewTypes'.
     * The function uses the SharePoint REST API to make a GET request.
     * 
     * Returns:
     * - A Promise that resolves to an array of audit types.
     */

    // Constructing the URL for the SharePoint REST API request.
    // We are querying the 'AuditReviewTypes' list, retrieving items where 'Archived' is set to 'Active'.
    // The results will be sorted according to the 'SortOrder' field.
    // The '$top=100' parameter is used to limit the results to 100 items.
    // The '$select=AuditType' parameter is used to only return the 'AuditType' field of each item.
    const queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('AuditReviewTypes')/items?$top=100&$select=AuditType,ID&$filter=Archived eq 'Active'&$orderby=SortOrder";
    
    // Using the Fetch API to make the HTTP GET request.
    return fetch(queryURL, {
        method: "GET", // The HTTP method for the request.
        headers: {
            // Setting the 'Accept' header to specify the desired response format (verbose JSON).
            Accept: "application/json;odata=verbose"
        }
    })
    .then(response => {
        // The response from the server is a Response object.
        // Checking if the HTTP request was successful (status code 200-299).
        if (!response.ok) {
            // If the response was not successful, throw an error.
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); // Parsing the response body as JSON.
    })
    .then(data => {
        // 'data' holds the parsed JSON object.

        // The audit types are located in data.d.results. 
        // Each item in this array represents an audit type, with its details.
        if (debug) {
            console.log("Success in getAuditTypes()");
        }
        if (debugVerbose) {
            // If verbose debugging is enabled, log each individual audit type.
            data.d.results.forEach(item => {
                console.log("AuditType:", item.AuditType);
            });
        }
        return data; // Returning the array of audit types.
    })
    .catch(error => {
        // If an error occurred during the fetch or data parsing, log the error.
        console.error("Error in getAuditTypes():", error);
        console.log("SharePoint site URL:", _spPageContextInfo.webAbsoluteUrl);
    });
}

function getDepartments(){
    var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Departments')/items?$top=5000&$select=DepartmentName,AuditLocations,ID&$filter=Archived eq 'Active'&$orderby=DepartmentName";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getDepartments");
            console.log(JSON.stringify(err,null,4));
            console.log(_spPageContextInfo.webAbsoluteUrl);
        },
        success: function(suc){
            //if(debug | debugVerbose){
            //   console.log("success with getDepartments.  The query returned " + suc.d.results.length + " departments");
            //}
            //if(debugVerbose){
            //   console.log(JSON.stringify(suc,null,4));
            //}
        }
    });
}

function loadActions(){

    console.log("There are " + allActions.length + " actions in the top section");

    var actionDisplayBody    = document.getElementById("actionActivitiesDisplay");
    $(actionDisplayBody).empty().append(getActionDisplayTable());

    var selectedAudits = $("input[id^='loadActions']:checked");

    if(actionQuery.length === 0 && auditQuery.length > 0){
        var count = 0;
        for(var f=0 ; f < selectedAudits.length ; f++){
            for(var g=0 ; g < allActions.length ; g++){
                if(allActions[g].parentAuditID === $(selectedAudits[f]).val().toString()){
                    displayAction(allActions[g]);
                    count++;
                }
            }
        }
        console.log(count + " actions using auditQuery");

    }
    else if(actionQuery.length > 0){
        var count = 0;
        for(var f=0 ; f < selectedAudits.length ; f++){
            for(var s=0 ; s < markActionParentAuditIDs.length ; s++){
                if($(selectedAudits[f]).val().toString() === markActionParentAuditIDs[s]){
                    for(var x=0 ; x < markActionIDs.length ; x++){
                        for(var g=0 ; g < allActions.length ; g++){
                            if(allActions[g].ID.toString() === markActionIDs[x] && allActions[g].parentAuditID === markActionParentAuditIDs[s]){
                                displayAction(allActions[g]);
                                count++;
                            }
                        }
                    }
                }
            }
        }
        console.log(count + " actions using auditQuery && FindingQuery && actionQuery");
    }
    else{
        var count = 0;   
        for(var f=0 ; f < selectedAudits.length ; f++){
            for(var x=0 ; x < allActions.length ; x++){
                if(allActions[x].parentAuditID === $(selectedAudits[f]).val().toString()){
                    displayAction(allActions[x]);
                    count++;
                }
            }
        }
        console.log(count + " actions using no filters");
    }
    var actionTable = document.getElementById("actionDisplayTable");
    //$(actionTable).tablesorter();
    //enableTableSorting(actionTable.id);
}

function getActionDisplayTable() {
    // Create table element
    const table = document.createElement('table');
    table.id = 'actionDisplayTable';
    table.className = 'capaTable';
    table.style.width = '100%';

    // Create thead element
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Column headers
    const headers = ['Audit', 'Finding', 'Action', 'Edit', 'Status', 'Type', 'Title', 'Location and department', 'Assignee', 'Due date'];
    const headerClasses = ['capaTable-th-n', 'capaTable-th-n', 'capaTable-th-n','capaTable-th-n', 'capaTable-th-i', 'capaTable-th-m', 'capaTable-th-m', 'capaTable-th-m', 'capaTable-th-m', 'capaTable-th-n'];

    // Class name for the spans used for sorting
    const filterSpanClassList = 'tableFilter';

    // Append header cells to header row
    headers.forEach((text, index) => {
        const th = document.createElement('th');
        th.className = headerClasses[index];
        th.textContent = text;
        th.setAttribute('data-sort-direction', 'asc'); // Initial sort direction

        //  Debug code on sortTable eventlisteners
        th.addEventListener('click', function(e) {
            if (e.target && e.target.nodeName === 'TH') {
                const index = Array.prototype.indexOf.call(thead.children[0].children, e.target);
                let currentDirection = e.target.getAttribute('data-sort-direction') === 'asc' ? 'desc' : 'asc';
                sortTable('actionDisplayTable', index, currentDirection, filterSpanClassList);
                e.target.setAttribute('data-sort-direction', currentDirection);
            }
        });

        headerRow.appendChild(th);
    });

    // Append header row to thead
    thead.appendChild(headerRow);

    // Create tbody element
    const tbody = document.createElement('tbody');

    // Append thead and tbody to table
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}


function getTheActions(filter){
    
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=5000&$filter=" + filter + "&$expand=Assignee,Action_x0020_stakeholders,CAPA_DeptList,Assignee&$select=*,Assignee/FirstName,Assignee/LastName,Action_x0020_stakeholders/EMail,Assignee/EMail,CAPA_DeptList/DepartmentName&$orderby=parentAuditID";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting filtered actions when loading actions\nQUERYURL = " + queryURL);
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
          //  console.log("success laoding " + suc.d.results.length + " actions with queryURL = " + queryURL);
           // console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function makeBullet(type, linkID){
    
    var bullet = document.createElement("div");
        bullet.classList.add("bullet-holder");

    var bulletLeft = document.createElement("div");
    var bulletRight = document.createElement("div");

    switch(type){
        case "audit"    :   bulletLeft.append("Audit ");
                            bulletLeft.classList.add("audit-bullet-left");        
                            bulletRight.append("#" + linkID);
                            bulletRight.classList.add("bullet-status");
                            bullet.append(bulletLeft);
                            bullet.append(bulletRight);
                            break;
        
        case "finding":     //var ex = document.getElementById("holderhighlight" + linkID);
                            //var clone = $(ex).clone()[0];
                            //clone.id = "clonedFinding" + clone.id;
                            bulletLeft.append("Finding");
                            bulletLeft.classList.add("audit-bullet-left");
                            bulletRight.append("#" + linkID);
                            bulletRight.classList.add("bullet-status");
                            bullet.append(bulletLeft);
                            bullet.append(bulletRight);
                            //bullet.append(clone);
                            break;
        
        case "action"   :   //var ac = document.getElementById("dottage" + linkID);
                           // var clone = $(ac).clone()[0];
                           // clone.id = "clonedAction" + clone.id;
                            bulletLeft.append("Action");
                            bulletLeft.classList.add("audit-bullet-left");
                            bulletRight.append("#" + linkID);
                            bulletRight.classList.add("bullet-status");
                            bullet.append(bulletLeft);
                            bullet.append(bulletRight);
                            //bullet.append(clone);
                            break; 

        default         :   break;                                  
    }
    return bullet;
}

function makeEditLink(targetList, targetID){
    var editLink = document.createElement("img");
        $(editLink).addClass("active-icon");
        editLink.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
        editLink.setAttribute("ID", targetList + "xxx" + targetID);
        editLink.setAttribute("target", targetID);
        editLink.setAttribute("list", targetList);
        editLink.addEventListener("click", function(e){
            e.stopPropagation();
            var cURL = document.location.href;
            cURL = cURL.split("&Source=")[0];
            switch($(this).attr("list")){
                case "action"   : cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/CAPA_Actions/EditForm.aspx?ID="                         + $(this).attr("target") + "&Source=" + cURL;   break;
                case "finding"  : cURL = cURL +  "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID="           + $(this).attr("target") + "&Source=" + cURL;   break;
                case "audit"    : cURL = cURL +  "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Audits%20and%reviews/EditForm.aspx?ID=" + $(this).attr("target") + "&Source=" + cURL;   break;
                default         :                                                                                                                                                                                       break;
            }
            window.open(cURL, '_blank');
        });
    return editLink;
}

function prepareLocationsAndDepartments(){
    var deferred = $.Deferred();

    var departments = getDepartments();
    departments.done(function(depts){

        var comboList = [];

        for(var h=0 ; h < depts.d.results.length ; h++){

            var combo = [];
            combo[0] = depts.d.results[h].AuditLocations;
            combo[1] = depts.d.results[h].DepartmentName;
            combo[2] = depts.d.results[h].ID;
            comboList.push(combo);
        }

        var departmentDisplayHeader = document.getElementById("departmentDisplaySubHeader");
        $(departmentDisplayHeader).empty();

        var locations = $("input[id^='AuditLocations_09313']");
        for(var g=0 ; g < locations.length ; g++){
            $(locations[g]).prop("checked",false);
            document.getElementById($(locations[g]).attr("ID")).addEventListener("change", function(e){
                e.stopPropagation();
                if($(this).prop("checked") === true){
                    var locationName =  $(this).closest("span").attr("title");
                    var locationD = $("input[id^='deptRef_" + locationName + "']");
                    for(var d= 0 ; d < locationD.length ; d++){
                        $(locationD[d]).prop("checked", true);
                        $("input[id='locationDepartment_" + $(locationD[d]).attr("location") + "']").prop("checked", true);
                        $("input[id='locationDepartment_" + $(locationD[d]).attr("location") + "']").removeClass();
                    }
                }
                else{
                    var locationName =  $(this).closest("span").attr("title");
                    var locationD = $("input[id^='deptRef_" + locationName + "']");
                    for(var d= 0 ; d < locationD.length ; d++){
                        $(locationD[d]).prop("checked", false);
                        $("input[id='locationDepartment_" + $(locationD[d]).attr("location") + "']").prop("checked", false);
                        $("input[id='locationDepartment_" + $(locationD[d]).attr("location") + "']").removeClass();
                    }
                }
                reworkDepartments();
            });

            document.getElementById($(locations[g]).attr("ID")).setAttribute("style", "margin: 10px;");

            var locDeptsDiv = document.createElement("div");
                locDeptsDiv.setAttribute("ID", "locDepDiv" + $(locations[g]).attr("ID"));
                $(locDeptsDiv).removeClass().addClass("hide-element");
            var locationName = $(locations[g]).closest("span").attr("title");
            
            var selectDepartment = document.createElement("input");
                selectDepartment.type    = "checkbox";
                selectDepartment.checked = true;
                selectDepartment.setAttribute("style", "padding: 40px; margin: 2-px;");
                selectDepartment.id      = "locationDepartment_" + locationName;
                selectDepartment.setAttribute("location", locationName);
                selectDepartment.addEventListener("change", function(e){
                    e.stopPropagation();
                    var locationDepts = $("input[id^='deptRef_" + $(this).attr("location") + "']");
                    if(this.checked){
                        var locationCheckBox = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable'] tbody").find("span[title='" + $(this).attr("location") + "']").find("input").prop("checked", true);
                        $(this).removeClass();
                        for(var d= 0 ; d < locationDepts.length ; d++){
                            $(locationDepts[d]).prop("checked", true);
                        }
                    }
                    else{
                        var locationCheckBox = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable'] tbody").find("span[title='" + $(this).attr("location") + "']").find("input").prop("checked", false);
                        $(this).removeClass();
                        for(var d= 0 ; d < locationDepts.length ; d++){
                            $(locationDepts[d]).prop("checked", false);
                        }
                    }
                });
            
            var label               = document.createElement("label");
            label.htmlFor           = "locationDepartment_" + locationName;
            var description         = document.createTextNode("Select all departments at " + locationName);
            label.appendChild(description);

            $(locDeptsDiv).append(document.createElement("hr"));
            $(locDeptsDiv).append(selectDepartment);
            $(locDeptsDiv).append(label);

           
            var showDepts = document.createElement("img");
                showDepts.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/expand.svg");
                showDepts.setAttribute("style", "height: 15px; margin-left: 20px; margin-right: 5px;");
                showDepts.setAttribute("location", locationName);
                showDepts.setAttribute("id", "showDepts_" + locationName);
                showDepts.addEventListener("click", function(e){
                    e.stopPropagation();
                    if($(this).attr("src") === "/sites/ChangeManager/Exceptions/code/images/expand.svg"){
                        $(this).attr("src", "/sites/ChangeManager/Exceptions/code/images/collapse.svg");
                        var locDepDiv_temp = document.getElementById("locDDiv" + $(this).attr("location"));
                        $(locDepDiv_temp).removeClass().addClass("show-element");
                        $("label[for='" + $(this).attr("id") + "']").html("Hide " + $(this).attr("location") + " departments.");
                    }
                    else{
                        $(this).attr("src", "/sites/ChangeManager/Exceptions/code/images/expand.svg");
                        var locDepDiv_temp = document.getElementById("locDDiv" + $(this).attr("location"));
                        $(locDepDiv_temp).removeClass().addClass("hide-element");
                        $("label[for='" + $(this).attr("id") + "']").html("Show " + $(this).attr("location") + " departments.");
                    }
                });
                $(locDeptsDiv).append(document.createElement("br"));
                $(locDeptsDiv).append(showDepts);

                var lab = document.createElement("label");
                    lab.htmlFor = "showDepts_" + locationName;
                    lab.appendChild(document.createTextNode("Show " + locationName + " departments"));
                $(locDeptsDiv).append(lab);

             /// Create a DIv to hide all of the departments
            var locDDiv = document.createElement("div");
                locDDiv.setAttribute("id", "locDDiv" + locationName);
               $(locDDiv).removeClass().addClass("hide-element");
               $(locDeptsDiv).append(locDDiv);

            
            for(var t=0 ; t < comboList.length ; t++){
                if(comboList[t][0] === locationName){
                    var deptCheckbox = document.createElement("input");
                        deptCheckbox.setAttribute("type", "checkbox");
                        deptCheckbox.checked = true;
                        deptCheckbox.setAttribute("style", "margin-left: 30px; margin-right: 5px;");
                        deptCheckbox.setAttribute("id", "deptRef_" + locationName + "_" + comboList[t][2]);
                        deptCheckbox.setAttribute("location", locationName);
                        deptCheckbox.setAttribute("value", comboList[t][2]);
                        deptCheckbox.addEventListener("change", function(e){
                            e.stopPropagation();
                            var locDeptCount = $("input[id^='deptRef_" + $(this).attr("location") + "']").length;
                            var locDeptChecked = $("input[id^='deptRef_" + $(this).attr("location") + "']:checked").length;
                            if(locDeptCount === locDeptChecked){
                                var temp = document.getElementById("locationDepartment_" + $(this).attr("location"));
                                temp.checked = true;
                                $(temp).removeClass();
                                var locationCheckBox = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable'] tbody").find("span[title='" + $(this).attr("location") + "']").find("input").prop("checked", true);
                            }
                            else if(locDeptChecked > 0 && locDeptChecked < locDeptCount){
                                var temp = document.getElementById("locationDepartment_" + $(this).attr("location"));
                                temp.checked = true;
                                console.log("locDeptChecked === " + locDeptChecked + " out of a total of " + locDeptCount + " departments");
                                $(temp).removeClass().addClass("grey-checkbox");
                                var locationCheckBox = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable'] tbody").find("span[title='" + $(this).attr("location") + "']").find("input").prop("checked", true);
                            }
                            else{
                                var temp = document.getElementById("locationDepartment_" + $(this).attr("location"));
                                temp.checked = false;
                                $(temp).removeClass();
                                console.log("About to try to uncheck Belen");
                                var locationCheckBox = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable'] tbody").find("span[title='" + $(this).attr("location") + "']").find("input").prop("checked", false);
                            }
                        });
                    var deptCheckLabel = document.createElement("label");
                        deptCheckLabel.setAttribute("id", "labelFor")
                        deptCheckLabel.htmlFor = "deptRef_" + locationName + "_" + comboList[t][2];
                        deptCheckLabel.appendChild(document.createTextNode(comboList[t][1]));
                    
                    $(locDDiv).append(deptCheckbox);
                    $(locDDiv).append(deptCheckLabel);
                    $(locDDiv).append(document.createElement("br"));
                                       
                }
            }
            $(departmentDisplayHeader).append(locDeptsDiv);
        }
        deferred.resolve();
    });
    return deferred.promise();
}

function reworkDepartments(){
    var allLocations = $("input[id^='AuditLocations_09313']");

    for(var f=0 ; f < allLocations.length ; f++){
        

        if(allLocations[f].checked){
            var assDiv = document.getElementById("locDepDiv" + $(allLocations[f]).attr("ID"));
            $(assDiv).removeClass().addClass("show-element");
        }
        else{
            var assDiv = document.getElementById("locDepDiv" + $(allLocations[f]).attr("ID"));
            $(assDiv).removeClass().addClass("hide-element");
        }
    }
    
}

function filterPeople(){
    var deferred = $.Deferred();

    var peopleFilter = document.getElementById("peoplepickerCurrentUser");

    //  Start clear all people pickers
    var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker1']");
    var spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    if(spPeoplePicker){ spPeoplePicker.DeleteProcessedUser(); }
    $("input[id='peoplepicker1_f44d807b-b110-4370-b996-dd41dbdde652_$ClientPeoplePicker_EditorInput']").show();
    $("span[id='peoplepicker1_f44d807b-b110-4370-b996-dd41dbdde652_$ClientPeoplePicker_InitialHelpText']").text("");

    peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker2']");
    spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    if(spPeoplePicker){ spPeoplePicker.DeleteProcessedUser(); }
    $("input[id='peoplepicker2_1ae5ba22-712a-4e5d-8bd5-20bb3b2df9d0_$ClientPeoplePicker_EditorInput']").show();
    $("span[id='peoplepicker2_1ae5ba22-712a-4e5d-8bd5-20bb3b2df9d0_$ClientPeoplePicker_InitialHelpText']").text("");

    peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker3']");
    spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    if(spPeoplePicker){ spPeoplePicker.DeleteProcessedUser(); }
    $("input[id='peoplepicker3_478ccab0-e055-4e6a-a58a-042b5ab09c84_$ClientPeoplePicker_EditorInput']").show();
    $("span[id='peoplepicker3_478ccab0-e055-4e6a-a58a-042b5ab09c84_$ClientPeoplePicker_InitialHelpText']").text("");

    peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker4']");
    spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    if(spPeoplePicker){ spPeoplePicker.DeleteProcessedUser(); }
    $("input[id='peoplepicker4_c03d3331-8b38-4a2d-b950-269ef9c594c2_$ClientPeoplePicker_EditorInput']").show();
    $("span[id='peoplepicker4_c03d3331-8b38-4a2d-b950-269ef9c594c2_$ClientPeoplePicker_InitialHelpText']").text("");

    peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker5']");
    spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    if(spPeoplePicker){ spPeoplePicker.DeleteProcessedUser(); }
    $("input[id='peoplepicker5_778566d9-9873-453e-b2de-65e2c943ddb3_$ClientPeoplePicker_EditorInput']").show();
    $("span[id='peoplepicker5_778566d9-9873-453e-b2de-65e2c943ddb3_$ClientPeoplePicker_InitialHelpText']").text("");

    peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker6']");
    spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
    if(spPeoplePicker){ spPeoplePicker.DeleteProcessedUser(); }
    $("input[id='peoplepicker6_e23ad3ea-0d36-4ec2-a812-304a8a3c1a02_$ClientPeoplePicker_EditorInput']").show();
    $("span[id='peoplepicker6_e23ad3ea-0d36-4ec2-a812-304a8a3c1a02_$ClientPeoplePicker_InitialHelpText']").text("");
    //  End clear all people pickers


    deferred.resolve();

    return deferred.promise();
}

function filterDates(){
    var deferred = $.Deferred();

    var dateDisplayHeader       = document.getElementById("dateDisplayHeader");        $(dateDisplayHeader)    .empty()    .append("Optionaly select one or more date ranges.")    .addClass("capa-section-title");
    var dateDisplaySubHeader    = document.getElementById("dateDisplaySubHeader");     $(dateDisplaySubHeader) .empty()    .append("<i>Date filters are applied to start dates</i><br><br><hr>");
    var dateDisplayBody         = document.getElementById("dateDisplayBody");          $(dateDisplayBody)      .empty();

    var auditRangeDisplay    =   document.createElement("div");
        auditRangeDisplay.setAttribute("id", "auditRangeDisplay");
        dateDisplayBody.append(auditRangeDisplay);
        dateDisplayBody.append( document.createElement("br"),   document.createElement("br"));

    var actionRangeDisplay    =   document.createElement("div");
        actionRangeDisplay.setAttribute("id", "actionRangeDisplay");
        dateDisplayBody.append(actionRangeDisplay);
        dateDisplayBody.append( document.createElement("br"),   document.createElement("br"));

    filterAuditRange();
    filterActionRange();
    
    deferred.resolve();

    return deferred.promise();
}

function filterActionStatus(){
    var deferred = $.Deferred();

    var statusFilterDiv = document.getElementById("statusFilter");

    var lateCheckBox = document.createElement("input");
        lateCheckBox.setAttribute("type", "checkbox");
        lateCheckBox.checked = false;
        lateCheckBox.setAttribute("id", "lateCheckBox");
    
    $(statusFilterDiv).empty().append(lateCheckBox);
    $(statusFilterDiv).append(document.createTextNode("Only include audits that have late actions."));
}  

function filterAuditRange(){

    var auditRangeDisplay   = document.getElementById("auditRangeDisplay");
        $(auditRangeDisplay).empty();

    var auditRangeHeader        = document.createElement("span");
        $(auditRangeHeader)     .addClass("capa-section-title");
        $(auditRangeHeader)     .text("Audit or review start date range filter");
        $(auditRangeDisplay)    .append(auditRangeHeader);
        
    
    var auditRangePicker    = document.createElement("input");
        auditRangePicker.setAttribute("id", "auditRangePicker");
        $(auditRangePicker).addClass("capa-wide-input");
        $(auditRangeDisplay).append(auditRangePicker);

    var resetAuditRange     = document.createElement("input");
        resetAuditRange.setAttribute("type", "button");
        resetAuditRange.value = "reset";
        resetAuditRange.addEventListener("click", function(e){
            e.stopPropagation();
            filterAuditRange();
        });
        $(auditRangeDisplay).append(resetAuditRange);

    var auditRange = new easepick.create({
        element:    document.getElementById("auditRangePicker"),
        css:        ["/sites/ChangeManager/Exceptions/code/opensourceScripts/easepick_index.css",],
        zIndex: 10,
        format: "DD MMMM YYYY",
        grid: 2,
        calendars: 4,
        plugins: [
            "RangePlugin"
        ]
    });
}

function filterActionRange(){

    var actionRangeDisplay   = document.getElementById("actionRangeDisplay");
        $(actionRangeDisplay).empty();
      //  actionRangeDisplay.setAttribute("style", "pointer-events : none;");  ///  No mouse events

    var actionRangeHeader        = document.createElement("span");
        $(actionRangeHeader)     .addClass("capa-section-title");
        $(actionRangeHeader)     .text("Action or activity due date range filter");
        $(actionRangeDisplay)    .append(actionRangeHeader);
    
    var actionRangePicker    = document.createElement("input");
        actionRangePicker.setAttribute("id", "actionRangePicker");
        $(actionRangePicker).addClass("capa-wide-input");
        $(actionRangeDisplay).append(actionRangePicker);

    var resetActionRange     = document.createElement("input");
        resetActionRange.setAttribute("type", "button");
        resetActionRange.value = "reset";
        resetActionRange.addEventListener("click", function(e){
            e.stopPropagation();
            filterActionRange();
        });
        $(actionRangeDisplay).append(resetActionRange);

    var actionRange = new easepick.create({
        element:    document.getElementById("actionRangePicker"),
        css:        ["/sites/ChangeManager/Exceptions/code/opensourceScripts/easepick_index.css",],
        zIndex: 10,
        format: "DD MMMM YYYY",
        grid: 2,
        calendars: 4,
        plugins: [
            "RangePlugin"
        ]
    });
}

function checkAuditRestrictions(audit){
        if(audit.auditRestricted){
                //  run checks on access to the audit
                console.log("\n\n******************************************\n\nWe have a restricted audit... run checks to determine if it should be displayed");
                if(isQMA){
                    console.log("The user is a QMA so we will display the audit");
                    return displayAudit(audit);
                }
                else{
                    //  The user is not a QMA and so we do not automatically display the Audit.  We must run some checks to see if the user is associated with the audit
                    //  The checks should establish if the user is named as the Audit Leader, or one of the Audit Stakeholders.
                    let auditShouldBeDisplayed = false;
                    console.log("Audit_x0020_lead : " + audit.Audit_x0020_lead.EMail);
                    if(audit.Audit_x0020_lead.EMail === _spPageContextInfo.userLoginName){
                        console.log("The user is not a QMA but tehy have been identified as teh Audit leader so we can display");
                        return displayAudit(audit);
                    }
                    else{
                        console.log("The user is not a QMA nor are they the Audit lead, so we will now check if they are among the named stakeholders or teh named stakeholder groups");
                    }
                }
            }
        else{
            return displayAudit(audit);
        }
}

async function displayAudit(audit) {
    try {
        if (audit !== null) {

       


            // Define the start date and lead variables
            const startDate = audit.Audit_x0020_start_x0020_date ? universalDate(audit.Audit_x0020_start_x0020_date) : "";
            const auditLead = audit.Audit_x0020_leadId ? audit.Audit_x0020_lead.FirstName.replace("XT-", "") + " " + audit.Audit_x0020_lead.LastName : "";

            // Define and populate the locations variable
            let locations = "";
            if (audit.AuditLocations !== null) {
                const auditLocations = audit.AuditLocations.results;
                locations = auditLocations.join("<br>");
            }

            // Create the table row for the audit
            const buildRow = document.createElement("tr");
            buildRow.setAttribute("id", "row" + audit.ID);
            buildRow.classList.add("blue-background", "data-row");
            const tbody = document.getElementById("auditDisplayTable").querySelector('tbody');
            tbody.appendChild(buildRow);

            

            // Cells content array without stakeholders placeholder
            const cellsContent = [
                `<div id="checkbox${audit.ID}"></div>`,
                `<div id="restricted${audit.ID}"></div>`,
                `<div id="locked${audit.ID}" ></div>`,
                `<div id="edit${audit.ID}" ></div>`,
                audit.ID.toString(),
                `<div id="auditTypeName${audit.ID}"></div>`,
                `<div id="auditTitle${audit.ID}"></div>`,
                audit.Audit_x0020_title,
                locations,
                startDate,
                auditLead,
                "", // Placeholder for audit stakeholders, to be populated later
                `<div id="Findings${audit.ID}"></div>`
            ];

            // Define the classes for each cell
            const classes = [   "capaTable-td-i", 
                                "capaTable-td-i", 
                                "capaTable-td-i", 
                                "capaTable-td-i",
                                "capaTable-td-n", 
                                "capaTable-td-m", 
                                "capaTable-td-m", 
                                "capaTable-td-w",
                                "capaTable-td-m", 
                                "capaTable-td-m", 
                                "capaTable-td-m", 
                                "capaTable-td-w", 
                                "capaTable-td-xw"];

            // Append the content to the row cells
            cellsContent.forEach((content, index) => {
                const td = document.createElement("td");
                td.classList.add(classes[index]);
                td.innerHTML = content;
                buildRow.appendChild(td);
            });

            // Create the checkbox
            const checkboxContainer = document.getElementById(`checkbox${audit.ID}`);
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "loadActions" + audit.ID;
            checkbox.value = audit.ID;
            checkbox.addEventListener("change", function(e){
                e.stopPropagation();
                console.log("The checkbox has changed");
                formatActionsActivities();
            });
            checkboxContainer.append(checkbox);

            // Append stakeholders if present
            if (audit.Audit_x0020_stakeholdersId !== null) {
                const stakeholdersTd = buildRow.children[11]; // Index for stakeholders cell
                const auditStakeholdersFragment = await displayAuditStakeholders(audit);
                stakeholdersTd.appendChild(auditStakeholdersFragment);
            }

            // Append the edit icon
            const editContainer = document.getElementById(`edit${audit.ID}`);
            if (editContainer) {
                const editIcon = document.createElement("img");
                editIcon.src = "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg";
                editIcon.alt = "Edit";
                editIcon.setAttribute("auditID", audit.ID);
                editIcon.addEventListener("click", function(e) {
                    e.stopPropagation();
                    const auditID = this.getAttribute("auditID");
                    window.open(`https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Audits%20and%20reviews/EditForm.aspx?ID=${auditID}&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx`, "_blank");
                });
                editIcon.classList.add("active-icon");
                editContainer.appendChild(editIcon);
            }

            //  Append audit restricted
            const restrictedContainer = document.getElementById(`restricted${audit.ID}`);
            const auditRestricted = audit.auditRestricted;
            if(auditRestricted){
                const restrictedIcon = document.createElement("img");
                restrictedIcon.classList.add("inactive-icon");
                restrictedIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/eyesClosedRed.svg");  
                restrictedIcon.setAttribute("title", "Access to this audit is restricted");    
                restrictedContainer.append(restrictedIcon);
            }

            //  Append auditPadlock
            var auditPadlocked = audit.auditDetailsPadlocked;
            var padlockedContainer = document.getElementById(`locked${audit.ID}`);
            var padlock = document.createElement("img");
            padlock.classList.add("inactive-icon");
            if(auditPadlocked){
                padlock.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/lockedRed.svg");
                padlock.setAttribute("title", "Details of this audit are locked");
            }
            else{
                padlock.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/unlockedGreen.svg");
                padlock.setAttribute("title", "Details of this audit are unlocked");
            }
            padlockedContainer.append(padlock);

            return buildRow;
        }
    } catch (error) {
        console.error('Error in displayAudit:', error);
    }
}

function displayAuditStakeholders(audit) {
    return new Promise((resolve, reject) => {
        if (!audit || !audit.Audit_x0020_stakeholdersId || audit.Audit_x0020_stakeholdersId.results.length === 0) {
            resolve("");
            return;
        }

        let stakeholderPromises = audit.Audit_x0020_stakeholdersId.results.map(stakeholderId => {
            return getPrincipalType(stakeholderId).then(({ type, name }) => {
                if (type === 'User') {
                    return getUserDetails(stakeholderId).then(userDetails => userDetails.Title);
                } else if (type === 'Group') {
                    // Create the group element and return it
                    return createGroupElement(stakeholderId, name);
                }
            });
        });

        Promise.all(stakeholderPromises).then(stakeholderElements => {
            // Once all promises resolve, append all elements to a fragment
            let fragment = document.createDocumentFragment();
            stakeholderElements.forEach(element => {
                if (typeof element === 'string') {
                    // User details are returned as strings, so create text nodes
                    let individualIcon = document.createElement("img");
                    individualIcon.classList.add("individual-icon");
                    individualIcon.src = "/sites/ChangeManager/Exceptions/code/images/individualIcon.svg";
                    
                    fragment.append(individualIcon);
                    fragment.appendChild(document.createTextNode(element));
                    fragment.append(document.createElement("br"));
                } else if (element instanceof HTMLElement) {
                    // Group elements are returned as DOM elements, append them directly
                    fragment.appendChild(element);
                }
            });

            // Resolve the promise with the document fragment
            resolve(fragment);
        }).catch(error => {
            console.error("Error fetching stakeholders details:", error);
            reject(error);
        });
    });
}

function createGroupElement(groupId, groupName) {
    let groupContainer = document.createElement('div');
    groupContainer.classList.add('group-container');

    let groupNameElement = document.createElement('span');
    groupNameElement.classList.add('group-name');

    // Create an img element for the icon
    let icon = document.createElement('img');
    icon.setAttribute('src', '/sites/ChangeManager/Exceptions/code/images/groupIcon.svg'); // Set the path to your SVG icon
    icon.classList.add('individual-icon'); // Add a classList.add( for potential styling

    // Append the icon before the group name
    groupNameElement.appendChild(icon);
    // Set the text for the group name
    let groupNameText = document.createTextNode(groupName);
    groupNameElement.appendChild(groupNameText);

    let groupMembersElement = document.createElement('div');
    groupMembersElement.classList.add('group-members', 'hidden');
    groupContainer.appendChild(groupNameElement);
    groupContainer.appendChild(groupMembersElement);

    // Fetch and populate group members
    getGroupMembersById(groupId).then(groupMembers => {
        let memberList = groupMembers.d.results.map(member => member.Title).join("<br>");
        groupMembersElement.innerHTML = memberList;
    }).catch(error => {
        console.error("Error fetching group members:", error);
    });

    // Return the group container element
    return groupContainer;
}

function displayFinding(Finding) {
    /**
     * Displays an Finding as a visual element on the page.
     * @param {Object} Finding - The Finding object to be displayed.
     * @returns {Promise<number>} - A promise that resolves with the ID of the Finding.
     */
    return new Promise(resolve => {
        // Locate the display area for the Findings based on the parent audit ID
        const disp = document.getElementById("Findings" + Finding.parentAuditID);

        // Create a flex container for the bullet points
        const bullet = document.createElement("div");
        bullet.classList.add("bullet-holder"); 

        // Function to create a bullet point
        const createBullet = (side) => {
            const bullet = document.createElement("div");
            bullet.setAttribute("parentID", Finding.ID);
            bullet.id = `bulletID_${side}*${Finding.ID}`;
            bullet.addEventListener("click", (e) => {
                e.stopPropagation();
                // Construct the URL for editing the Finding
                const cURL = `https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=${Finding.ID}&Source=${document.location.href.split("&Source=")[0]}`;
                // Open the edit form in a new tab
                window.open(cURL, '_blank');
            });
            return bullet;
        };

        // Create the left and right bullet points
        const bulletLeft = createBullet("left");
        const bulletRight = createBullet("right");

        // Highlight the bullets if the Finding ID is marked
        if (markFindingIDs.includes(Finding.ID.toString())) {
            bulletLeft.classList.add("finding-bullet", "finding-bullet-left");
            bulletRight.classList.add("finding-bullet", "finding-bullet-right");
        }

        // Switch based on the Finding type to determine the styling and content
        switch (Finding.Exception_x0020_type) {
            case "Deviation":
                switch (Finding.Exception_x0020_classification) {
                    case "minor":
                        bulletLeft.textContent = "m";
                        bulletLeft.classList.add("base-finding", "minor-finding");
                        bulletRight.textContent = "#" + Finding.ID;
                        bulletRight.classList.add("bullet-status");
                        break;
                    case "Major":
                        bulletLeft.textContent = "M";
                        bulletLeft.classList.add("base-finding", "major-finding");
                        bulletRight.textContent = "#" + Finding.ID;
                        bulletRight.classList.add("bullet-status");
                        break;
                    case "Critical":
                        bulletLeft.textContent = "C";
                        bulletLeft.classList.add("base-finding", "criticalFinding");
                        bulletRight.textContent = "#" + Finding.ID;
                        bulletRight.classList.add("bullet-status");
                        break;
                    default:
                        bulletLeft.textContent = "D";
                        bulletLeft.classList.add("base-finding", "unclassified-finding");
                        bulletRight.textContent = "#" + Finding.ID;
                        bulletRight.classList.add("bullet-status");
                        break;
                }
                break;
            case "Recommendation":
                bulletLeft.textContent = "R";
                bulletLeft.classList.add("base-finding", "recommendation-finding");
                bulletRight.textContent = "#" + Finding.ID;
                bulletRight.classList.add("bullet-status");
                break;
            default:
                bulletLeft.textContent = "?";
                bulletLeft.classList.add("base-finding", "unclassified-finding");
                bulletRight.textContent = "#" + Finding.ID;
                bulletRight.classList.add("bullet-status");
                break;
        }

        // Function to add hover effects to an element
        const addHoverEffect = (element) => {
            element.addEventListener("mouseover", (e) => {
                e.stopPropagation();
                // Show the floating Finding information on hover
                const floating = document.getElementById("floatingFinding" + element.getAttribute("parentID"));
                floating.classList.remove("floating-finding-hide");
                floating.classList.add("floating-finding-show");
            });
            element.addEventListener("mouseout", (e) => {
                e.stopPropagation();
                // Hide the floating Finding information when mouse leaves
                const floating = document.getElementById("floatingFinding" + element.getAttribute("parentID"));
                floating.classList.remove("floating-finding-show");
                floating.classList.add("floating-finding-hide");
            });
        };

        // Add hover effects to bullet points
        addHoverEffect(bulletLeft);
        addHoverEffect(bulletRight);

        // Create the harness (container for the floating Finding information)
        const harness = document.createElement("div");
        harness.setAttribute("parentID", Finding.ID);
        harness.classList.add("dot-floating");
        addHoverEffect(harness);
        harness.appendChild(floatingFinding(Finding));  // Assuming floatingFinding is a function defined elsewhere

        // Create the holder for the bullet points and the harness
        const holder = document.createElement("div");
        holder.classList.add("holder-class");
        holder.id = "holderhighlight" + Finding.ID;

        // Assemble the elements
        bullet.appendChild(bulletLeft);
        bullet.appendChild(bulletRight);
        holder.appendChild(bullet);
        holder.appendChild(harness);
        disp.appendChild(holder);

        // Resolve the promise with the Finding ID
        resolve(Finding.ID);
    });
}

/*
    function displayAction(action) {

    const row = document.createElement("tr");
    row.classList.add("blue-background", "data-row");

    const tdConfig = {
        1:  { classes: ["capaTable-td-n"], id: `audit-bullet${action.ID}`   },
        2:  { classes: ["capaTable-td-n"], id: `finding-bullet${action.ID}` },
        3:  { classes: ["capaTable-td-n"], id: `action-bullet${action.ID}`  },
        4:  { classes: ["capaTable-td-i"], id: `edit-icon${action.ID}`      },
        5:  { classes: ["capaTable-td-n"], id: `action-type${action.ID}`    },
        6:  { classes: ["capaTable-td-m"], id: `action-title${action.ID}`   },
        7:  { classes: ["capaTable-td-m"], id: `location${action.ID}`       },
        8:  { classes: ["capaTable-td-m"], id: `assignee${action.ID}`       },
        9:  { classes: ["capaTable-td-n"], id: `due-date${action.ID}`       }
    };

    for (let i = 1; i <= 9; i++) {
        const td = document.createElement("td");
        td.classList.add(...tdConfig[i].classes);
        td.id = tdConfig[i].id;

        const span = document.createElement("span");
        span.id = `span${i}-${action.ID}`;
        td.appendChild(span);

        const filterKeySpan = document.createElement("span");
        filterKeySpan.classList.add("tableFilter");
        filterKeySpan.id =  `tableFilter-${action.ID}`;
        td.appendChild(filterKeySpan);

        row.appendChild(td);
    }

    const tbody = document.querySelector("#actionDisplayTable tbody");
    tbody.appendChild(row);

    populateActionData(action);
}
*/

function displayAction(action) {

    console.log("displayAction : " + action.ID);

    const row = document.createElement("tr");
    row.classList.add("blue-background", "data-row");

    //  Audit Bullet TD
        const   audBullTd       = document.createElement("td");
                audBullTd       .classList.add("capaTable-td-n");
                audBullTd.id    = `audit-bullet${action.ID}`;
        const   audBullSpan     = document.createElement("span");
                audBullSpan.id  = `spanAud-${action.ID}`;
                audBullTd.appendChild(audBullSpan);
        const   audBullFltr     = document.createElement("span");
                audBullFltr     .classList.add("tableFilter");
                audBullFltr.id  = `tableFltrAud${action.ID}`;
        audBullTd.appendChild(audBullFltr);

    //  Finding Bullet TD
        const   finBullTd       = document.createElement("td");
                finBullTd       .classList.add("capaTable-td-n");
                finBullTd.id    = `finding-bullet${action.ID}`;
        const   finBullSpan     = document.createElement("span");
                finBullSpan.id  = `spanFin-${action.ID}`;
                finBullTd.appendChild(finBullSpan);
        const   finBullFltr     = document.createElement("span");
                finBullFltr     .classList.add("tableFilter");
                finBullFltr.id  = `tableFltrFin${action.ID}`;
        finBullTd.appendChild(finBullFltr);

    //  Action Bullet TD
        const   actBullTd       = document.createElement("td");
                actBullTd       .classList.add("capaTable-td-n");
                actBullTd.id    = `action-bullet${action.ID}`;
        const   actBullSpan     = document.createElement("span");
                actBullSpan.id  = `spanAct-${action.ID}`;
                actBullTd.appendChild(actBullSpan);
        const   actBullFltr     = document.createElement("span");
                actBullFltr     .classList.add("tableFilter");
                actBullFltr.id  = `tableFltrAct${action.ID}`;
        actBullTd.appendChild(actBullFltr);

    //  Edit Icon TD
        const   editIcnTd       = document.createElement("td");
                editIcnTd       .classList.add("capaTable-td-i");
                editIcnTd.id    = `edit-icon${action.ID}`;
        const   editIcnSpan     = document.createElement("span");
                editIcnSpan     .id = `spanEdit-${action.ID}`;
                editIcnTd.appendChild(editIcnSpan);
        const   editIconFltr    = document.createElement("span");
                editIconFltr    .classList.add("tableFilter");
                editIconFltr.id = `tableFltrEdit${action.ID}`;
        editIcnTd.appendChild(editIconFltr);

        ////////////////////////////////////////////////////////////
        //  Action status
        const   statusIcnTd       = document.createElement("td");
                statusIcnTd       .classList.add("capaTable-td-i");
                statusIcnTd.id    = `status-icon${action.ID}`;
        const   statusIcnSpan     = document.createElement("span");
                statusIcnSpan     .id = `spanStatus-${action.ID}`;
                statusIcnTd.appendChild(statusIcnSpan);
        const   statusIconFltr    = document.createElement("span");
                statusIconFltr    .classList.add("tableFilter");
                statusIconFltr.id = `tableFltrStts${action.ID}`;
        statusIcnTd.appendChild(statusIconFltr);
        ////////////////////////////////////////////////////////////
    
    //  Action Type TD
        const   actTypeTd       = document.createElement("td");
                actTypeTd       .classList.add("capaTable-td-n");
                actTypeTd.id    = `action-type${action.ID}`;
        const   actTypeSpan     = document.createElement("span");
                actTypeSpan.id  = `spanType-${action.ID}`;
                actTypeTd.appendChild(actTypeSpan);
        const   actTypeFltr     = document.createElement("span");
                actTypeFltr     .classList.add("tableFilter");
                actTypeFltr.id  = `tableFltrType${action.ID}`;
        actTypeTd.appendChild(actTypeFltr);
        
    //  Action Title TD
        const   actTtleTd       = document.createElement("td");
                actTtleTd       .classList.add("capaTable-td-m");
                actTtleTd.id    = `action-title${action.ID}`;
        const   actTtleSpan     = document.createElement("span");
                actTtleSpan.id  = `spanTtle-${action.ID}`;
                actTtleTd.appendChild(actTtleSpan);
        const   actTtleFltr     = document.createElement("span");
                actTtleFltr     .classList.add("tableFilter");
                actTtleFltr.id  = `tableFltrTtle${action.ID}`;
        actTtleTd.appendChild(actTtleFltr);
    
    //  Location and Department TD
        const   locDeptTd       = document.createElement("td");
                locDeptTd       .classList.add("capaTable-td-m");
                locDeptTd.id    = `location${action.ID}`;
        const   locDeptSpan     = document.createElement("span");
                locDeptSpan.id  = `spanLocDep-${action.ID}`;
                locDeptTd.appendChild(locDeptSpan);
        const   locDeptFltr     = document.createElement("span");
                locDeptFltr     .classList.add("tableFilter");
                locDeptFltr.id  = `tableFltrLocDep${action.ID}`;
        locDeptTd.appendChild(locDeptFltr);
        
    //  Assignee TD
        const   assigneTd       = document.createElement("td");
                assigneTd       .classList.add("capaTable-td-m");
                assigneTd.id    = `assignee${action.ID}`;
        const   assigneSpan     = document.createElement("span");
                assigneSpan.id  = `spanAss-${action.ID}`;
                assigneTd.appendChild(assigneSpan);
        const   assigneFltr     = document.createElement("span");
                assigneFltr     .classList.add("tableFilter");
                assigneFltr.id  = `tableFltrAss${action.ID}`;
        assigneTd.appendChild(assigneFltr);
    
    //  Due Date TD
        const   dueDateTd       = document.createElement("td");
                dueDateTd       .classList.add("capaTable-td-n");
                dueDateTd.id    = `due-date${action.ID}`;
        const   dueDateSpan     = document.createElement("span");
                dueDateSpan.id  = `spanDate-${action.ID}`;
                dueDateTd.appendChild(dueDateSpan);
        const   dueDateFltr     = document.createElement("span");
                dueDateFltr     .classList.add("tableFilter");
                dueDateFltr.id = `tableFltrDate${action.ID}`;
        dueDateTd.appendChild(dueDateFltr);
    //
    
    //  Add the table cells to the table row in the desired order
        row.appendChild(audBullTd);
        row.appendChild(finBullTd);
        row.appendChild(actBullTd);
        row.appendChild(editIcnTd);
        row.appendChild(statusIcnTd);
        row.appendChild(actTypeTd);
        row.appendChild(actTtleTd);
        row.appendChild(locDeptTd);
        row.appendChild(assigneTd);
        row.appendChild(dueDateTd);

    //  Append the completed row to the table body
        const tbody = document.querySelector("#actionDisplayTable tbody");
        tbody.appendChild(row);

    //  Call the function to populate the action data
        populateActionData(action);
}

function populateActionData(action) {

    console.log("action : " + JSON.stringify(action,null,4));

    document.getElementById(`tableFltrAud${action.ID}`)     .append( action.parentAuditID);                        //  Column sort value
    document.getElementById(`spanAud-${action.ID}`)         .append( makeBullet("audit", action.parentAuditID));
    
    document.getElementById(`tableFltrFin${action.ID}`)     .append( action.parentExceptionID);        //  Column sort value
    document.getElementById(`spanFin-${action.ID}`)         .append( makeBullet("finding", action.parentExceptionID));
    
    document.getElementById(`tableFltrAct${action.ID}`)     .append( action.ID);        //  Column sort value
    document.getElementById(`spanAct-${action.ID}`)         .append( makeBullet("action", action.ID));
        
    // there is no sortTable() option for th edit icon
    document.getElementById(`edit-icon${action.ID}`)        .append( makeEditLink("action", action.ID));
    
    document.getElementById(`tableFltrType${action.ID}`)    .append( action.Action_x0020_type);
    document.getElementById(`spanType-${action.ID}`)        .append( action.Action_x0020_type);

    document.getElementById(`tableFltrTtle${action.ID}`)    .append( action.Title);
    document.getElementById(`spanTtle-${action.ID}`)        .append( action.Title);

    document.getElementById(`tableFltrStts${action.ID}`)    .append( action.Action_x0020_status);
    document.getElementById(`spanStatus-${action.ID}`)      .append( action.Action_x0020_status);

    let loc_and_dept = "";
    for(var t=0 ; t < action.CAPA_DeptList.results.length ; t++){
        loc_and_dept = loc_and_dept + action.CAPA_DeptList.results[t].LocationLabel + " ¦ " + action.CAPA_DeptList.results[t].DepartmentName + "\n";
    }
    document.getElementById(`tableFltrLocDep${action.ID}`)  .append(loc_and_dept);
    document.getElementById(`spanLocDep-${action.ID}`)      .append(    loc_and_dept);
    
    
    document.getElementById(`tableFltrAss${action.ID}`)     .append( action.Assignee.LastName);
    document.getElementById(`assignee${action.ID}`)         .append(    action.Assignee.FirstName + " " + action.Assignee.LastName);
    
    if(action.TaskDueDate != null){
        console.log("This is teh format of the date object " + action.TaskDueDate);
        document.getElementById(`tableFltrDate${action.ID}`).append( sortableDate(action.TaskDueDate));
        document.getElementById(`due-date${action.ID}`)     .append(   universalDate(action.TaskDueDate));
    }
    else{
        document.getElementById(`tableFltrDate${action.ID}`).append( "");
        document.getElementById(`due-date${action.ID}`)     .append("---none---");
    }
}

function sortableDate(inputDate){
     // Create a Date object from the input date string
    const date = new Date(inputDate);

    // Get the year, month, and day components
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = date.getDate().toString().padStart(2, '0');

    // Combine the components to form the "YYYYMMDD" format
    const formattedDate = year + month + day;

    return formattedDate;
}

function displayAuditAction(action){

    var deferred = $.Deferred();

    var dot = document.createElement("img");
    $(dot).addClass("active-icon");
    if(filteredMarkActionIDs.includes(action.ID.toString())){
        $(dot).addClass("blue-halo");
        var l = document.getElementById("bulletID_left*" + action.parentExceptionID);
        l.classList.add("finding-bullet", "finding-bullet-left");
        var r = document.getElementById("bulletID_right*" + action.parentExceptionID);
        r.classList.add("finding-bullet", "finding-bullet-right");
    }
    dot.setAttribute("ID", "dottage" + action.ID);
    dot.addEventListener("click", function(e){
        e.stopPropagation();
        var cURL = document.location.href;
        cURL = cURL.split("&Source=");
        cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/CAPA_Actions/EditForm.aspx?ID=" + $(this).attr("ID").replace("dottage","") + "&Source=" + cURL[0];
        window.open(cURL, '_blank');
    });
    
    if(action.Action_x0020_complete === true){
        dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/tickGreenSq.svg");
    }
    else{
        var actStat = getActionStatus(action);
        actStat.done(function(status){
            switch(status){
                case "notSet"   :   switch(action.OData__x0052_){
                                        case "Plan"     : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_amber.svg");   break;
                                        case "Act"      : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_amber.svg");   break;
                                        case "Check"    : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_amber.svg");   break;
                                        case "Do"       : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_amber.svg");   break;
                                        case "Cancelled": dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/grayCross.svg"); break;
                                        default         : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/ambDot.svg");    break;
                                    }
                                    break;
                case "onTime"   :   switch(action.OData__x0052_){
                                        case "Plan"     : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_green.svg");   break;
                                        case "Act"      : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_green.svg");   break;
                                        case "Check"    : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_green.svg");   break;
                                        case "Do"       : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_green.svg");   break;
                                        case "Cancelled": dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/grayCross.svg"); break;
                                        default         : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greDot.svg");    break;
                                    }
                                    break;
                case "late"     :   switch(action.OData__x0052_){
                                        case "Plan"     : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_red.svg");     break;
                                        case "Act"      : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_red.svg");     break;
                                        case "Check"    : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_red.svg");     break;
                                        case "Do"       : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_red.svg");     break;
                                        case "Cancelled": dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/grayCross.svg"); break;
                                        default         : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/redDot.svg");    break;
                                    }
                                    break;
                default         :   break;
            }
        });
    }
            
    var harness = document.createElement("div");
        harness.setAttribute("parentID", action.ID);
        harness.classList.add("dot-floating");

    var holder = document.createElement("div");
        holder.setAttribute("id", "actionHolder" + action.ID);
     //   holder.classList.add("holder-classList.add(");
    
    dot.addEventListener("mouseover", function(e){
        var floater = document.getElementById("floatingAction" + $(this).attr("ID").replace("dottage",""));
        floater.classList.remove("floating-action-hide");
        floater.classList.add("floating-action-show");
    });
    dot.addEventListener("mouseout", function(e){
        var floater = document.getElementById("floatingAction" + $(this).attr("ID").replace("dottage",""));
        floater.classList.remove("floating-action-show");
        floater.classList.add("floating-action-hide");
    });

    harness.addEventListener("mouseover", function(e){
        var floater = document.getElementById("floatingAction" + $(this).attr("parentID"));
        floater.classList.remove("floating-action-hide");
        floater.classList.add("floating-action-show");
    });
    harness.addEventListener("mouseout", function(e){
        var floater = document.getElementById("floatingAction" + $(this).attr("parentID"));
       floater.classList.remove("floating-action-show");
        floater.classList.add("floating-action-hide");
    });
    

    $(harness).append(floatingAction(action));

    $(holder).append(dot);
    $(holder).append(harness);


    switch(action.Action_x0020_type){
        case    "Immediate"     :   var immActs = document.getElementById("actionsImm" + action.parentExceptionID);
                                    $(immActs).append(holder);
                                    break;

        case    "Corrective"    :   var corActs = document.getElementById("actionsCor" + action.parentExceptionID);
                                    $(corActs).append(holder);
                                    break;

        case    "Preventive"    :   var preActs = document.getElementById("actionsPre" + action.parentExceptionID);
                                    $(preActs).append(holder);
                                    break;

        default                 :   break;
    }

    
    deferred.resolve();
    

    return deferred.promise();

}

function createAudit(typeOfAudit){
    
    var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Audits and reviews')/items";
    return jQuery.ajax({
        url: queryURL,
        type: "POST",
        headers: { 
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "POST"
        },
        data:  JSON.stringify(  {"__metadata":    
                                    {
                                        "type": "SP.Data.Audits_x0020_and_x0020_reviewsListItem"
                                    },
                                    "Audit_x0020_type"  : typeOfAudit
                                }),
        contentType: "application/json; odata=verbose",
        error: function(err){
            console.log("Error creating a new Audit from dashboard ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
           //console.log("\n\n***************************************************");
           //console.log("Audit created");
          // console.log(JSON.stringify(suc,null,4));
           //console.log("***************************************************\n\n");
        }
    });
}

function getCustomers(){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Customers')/items";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Customers");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
           // console.log("success getting " + suc.d.results.length + " Customers");
           // console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getSuppliers(){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Suppliers')/items";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Suppliers");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
           // console.log("success getting " + suc.d.results.length + " Customers");
           // console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getActionStatus(action){
    var deferred = $.Deferred();
    var answer;
    var dueDate = action.TaskDueDate;
    if(dueDate != null){    
        dueDate = dueDate.split("-");
        dueDate = new Date(dueDate[0],(dueDate[1]-1),dueDate[2].split("T")[0]); 
    }
    var today   = new Date();
    if(dueDate === null)            { answer = "notSet";    }
    else if(dueDate < today)        { answer = "late";      }
    else                            { answer = "onTime";    }
    deferred.resolve(answer);
    return deferred.promise();
}

function floatingAction(action){

    var floater = document.createElement("div");
        floater.setAttribute("ID", "floatingAction" + action.ID);
        floater.classList.add("floating-action-hide");  // reset this to hide

    var header  = document.createElement("div");
        header.classList.add("floating-action-title");
        header.appendChild(document.createTextNode("Action #" + action.ID));
             
    var data    = document.createElement("div");
        data.classList.add("floating-action-data");
        
    var dTable  = document.createElement("table");
    var dHead   = document.createElement("thead");
    var hR1     = document.createElement("tr");
        var hR1D1   = document.createElement("th");
            hR1     .appendChild(hR1D1);
        var hR1D2   = document.createElement("th");
            hR1     .appendChild(hR1D2);
    dHead   .appendChild(hR1);
    dTable  .appendChild(dHead);

    var dBody   = document.createElement("tbody");
    var dR1         = document.createElement("tr");
        var dR1D1   = document.createElement("td");
            dR1D1   .append(document.createTextNode("Title: "));
            dR1     .appendChild(dR1D1);
        var dR1D2   = document.createElement("td");
            if(action.Title === null){   action.Title = "";   }
            dR1D2   .append(document.createTextNode(action.Title));
            dR1     .appendChild(dR1D2);
        dBody       .appendChild(dR1);

    var dR2         = document.createElement("tr");
        var dR2D1   = document.createElement("td");
            dR2D1   .append(document.createTextNode("Desc: "));
            dR2     .appendChild(dR2D1);
        var dR2D2   = document.createElement("td");
            if(action.Action_x0020_description === null){   action.Action_x0020_description = "";   }
            dR2D2   .append(document.createTextNode(action.Action_x0020_description));
            dR2     .appendChild(dR2D2);
        dBody       .appendChild(dR2);

    var dR3         = document.createElement("tr");
        var dR3D1   = document.createElement("td");
            dR3D1   .append(document.createTextNode("Due: "));
            dR3     .appendChild(dR3D1);
        var dR3D2   = document.createElement("td");
            dR3D2   .append(document.createTextNode(universalDate(action.TaskDueDate)));
            dR3     .appendChild(dR3D2);
        dBody       .appendChild(dR3);

    var dR4         = document.createElement("tr");
        var dR4D1   = document.createElement("td");
            dR4D1   .append(document.createTextNode("Assignee: "));
            dR4     .appendChild(dR4D1);
        var dR4D2   = document.createElement("td");
            if(action.Assignee.FirstName != null)  {action.Assignee.FirstName = action.Assignee.FirstName.replace("XT-","");}
            else                                   {action.Assignee.FirstName = "" ; action.Assignee.LastName = "";}
            dR4D2   .append(document.createTextNode(action.Assignee.FirstName + " " + action.Assignee.LastName));
            dR4     .appendChild(dR4D2);
        dBody       .appendChild(dR4);   
    
    var dR5         = document.createElement("tr");
        var dR5D1   = document.createElement("td");
            dR5D1   .append(document.createTextNode("Status: "));
            dR5     .appendChild(dR5D1);
        var dR5D2   = document.createElement("td");
            dR5D2   .append(document.createTextNode(action.OData__x0052_));
            dR5     .appendChild(dR5D2);
        dBody       .appendChild(dR5);   
        
    dTable.appendChild(dBody);
    data    .append(dTable);

    floater.append(header);
    floater.append(data);

    return floater;
}

function simpleFindingBullet(findingID){

}

function floatingFinding(except){
    var floater = document.createElement("div");
        floater.setAttribute("ID", "floatingFinding" + except.ID);
        floater.classList.add("floating-finding-hide");
    
    var header  = document.createElement("div");
        if(except.Exception_x0020_type === "Deviation")        { 
            switch(except.Exception_x0020_classification){
                case "minor"    :   header.appendChild(document.createTextNode("minor deviation"));
                                    header.classList.add("floating-minor");
                                    break;

                case "Major"    :   header.appendChild(document.createTextNode("Major deviation"));
                                    header.classList.add("floating-major");
                                    break;

                case "Critical" :   header.appendChild(document.createTextNode("Critical deviation"));
                                    header.classList.add("floating-critical");
                                    break;

                default         :   header.appendChild(document.createTextNode("Deviation unknown severity"));
                                    header.classList.add("floating-error");
                                    break;
            }
        }
        else if(except.Exception_x0020_type === "Recommendation")   { 
                                    header.appendChild(document.createTextNode("Recommendation"));
                                    header.classList.add("floating-recommendation");
        }
        else                                                        { 
                                    header.appendChild(document.createTextNode("Unlassified finding"));
                                    header.classList.add("floating-error");
        }
             
    var data    = document.createElement("div");
        data.classList.add("floating-finding-data");
        
    var dTable  = document.createElement("table");
    var dHead   = document.createElement("thead");
    var hR1     = document.createElement("tr");
        var hR1D1   = document.createElement("th");
            hR1     .appendChild(hR1D1);
        var hR1D2   = document.createElement("th");
            hR1     .appendChild(hR1D2);
    dHead   .appendChild(hR1);
    dTable  .appendChild(dHead);

    var dBody   = document.createElement("tbody");
    var dR1         = document.createElement("tr");
        var dR1D1   = document.createElement("td");
            dR1D1   .append(document.createTextNode("Title: "));
            dR1     .appendChild(dR1D1);
        var dR1D2   = document.createElement("td");
            if(except.Exception_x0020_title === null){   except.Exception_x0020_title = "*** No title provided ***";   }
            var tSpan   = document.createElement("span");
            tSpan.classList.add("floating-finding-title");
            tSpan   .append(document.createTextNode(except.Exception_x0020_title),document.createElement("br"),document.createElement("br"));
            dR1D2   .append(tSpan);
            dR1     .appendChild(dR1D2);
        dBody       .appendChild(dR1);

    var dR2         = document.createElement("tr");
        var dR2D1   = document.createElement("td");
            dR2D1   .append(document.createTextNode("Desc: "));
            dR2     .appendChild(dR2D1);
        var dR2D2   = document.createElement("td");
            dR2D2.classList.add("text-wrap-cell");
            if(except.Exception_x0020_description === null){   except.Exception_x0020_description = "";   }
            dR2D2   .innerHTML = except.Exception_x0020_description;
            dR2     .appendChild(dR2D2);
        dBody       .appendChild(dR2);

    var dR4         = document.createElement("tr");
        var dR4D1   = document.createElement("td");
            dR4D1   .append(document.createTextNode("Lead: "));
            dR4     .appendChild(dR4D1);
        var dR4D2   = document.createElement("td");
            if(except.ExceptionLead.FirstName != null) {except.ExceptionLead.FirstName = except.ExceptionLead.FirstName.replace("XT-","");}
            else                                       {except.ExceptionLead.FirstName = "" ; except.ExceptionLead.LastName = "";}
            dR4D2   .append(document.createTextNode(    except.ExceptionLead.FirstName + " " + except.ExceptionLead.LastName));
            dR4     .appendChild(dR4D2);
        dBody       .appendChild(dR4);

    var dR5         = document.createElement("tr");
        dR5.setAttribute("height", "25px");
        var dR5D1   = document.createElement("td");
            dR5D1   .append(document.createTextNode("Immediate: "));
            dR5     .appendChild(dR5D1);
        var dR5D2   = document.createElement("td");
        var actImm = document.createElement("div");
            actImm.classList.add("dot-floating");
            actImm.setAttribute("ID", "actionsImm" + except.ID);
            $(dR5D2)   .append(actImm);
            dR5     .appendChild(dR5D2);
        dBody       .appendChild(dR5);  

    var dR6         = document.createElement("tr");
        dR6.setAttribute("height", "25px");
        var dR6D1   = document.createElement("td");
            dR6D1   .append(document.createTextNode("Corrective: "));
            dR6     .appendChild(dR6D1);
        var dR6D2   = document.createElement("td");
        var actCor = document.createElement("div");
            actCor.classList.add("dot-floating");
            actCor.setAttribute("ID", "actionsCor" + except.ID);
            dR6D2   .append(actCor);
            dR6     .appendChild(dR6D2);
        dBody       .appendChild(dR6);  

     var dR7         = document.createElement("tr");
        dR7.setAttribute("height", "25px");
        var dR7D1   = document.createElement("td");
            dR7D1   .append(document.createTextNode("Preventive: "));
            dR7     .appendChild(dR7D1);
        var dR7D2   = document.createElement("td");
        var actPre = document.createElement("div");
            actPre.classList.add("dot-floating");
            actPre.setAttribute("ID", "actionsPre" + except.ID);
            dR7D2   .append(actPre);
            dR7     .appendChild(dR7D2);
        dBody       .appendChild(dR7);  
        
    dTable.appendChild(dBody);
    data    .append(dTable);

    floater.append(header);
    floater.append(data);
                   
    return floater;
}

function toggleAudits(){  
    var tAudits      = document.getElementById("auditsBody");
    var tAuditsIcon  = document.getElementById("toggleAuditsIcon");
    if(tAudits.style.display === "none"){
        tAudits.style.display = "";
        tAuditsIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/remove.svg");
    }
    else{
        tAudits.style.display = "none";
        tAuditsIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
    }
}

function toggleFindings(){
    var tFindings      = document.getElementById("FindingsBody");
    var tFindingsIcon  = document.getElementById("toggleFindingsIcon");
    if(tFindings.style.display === "none"){
        tFindings.style.display = "";
        tFindingsIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/remove.svg");
    }
    else{
        tFindings.style.display = "none";
        tFindingsIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
    }
}

function universalDate(date){
    var formattedDate = "";

    if(date != null){
        var date = date.toString();
        if(date.indexOf("/") > 0){
            formattedDate = formatDate(date);
        }
        else if(date.indexOf("-") > 0){
            formattedDate = universalDatex(date);
        }
        else{
            formattedDate = date.split(":");
            formattedDate = formattedDate[0] + ":" + formattedDate[1] + " hrs";
            return formattedDate;
        }
    }
    return formattedDate;

    function formatDate(dueDate){
        dueDate     = dueDate.split("/");
        var month = "";
        var monthNum = 100;
        var dayNum;
        switch(dueDate[0]){ 
            case "1"  :   month = "Jan";  monthNum = 0; break;
            case "2"  :   month = "Feb";  monthNum = 1;  break;
            case "3"  :   month = "Mar";  monthNum = 2;  break;
            case "4"  :   month = "Apr";  monthNum = 3;  break;
            case "5"  :   month = "May";  monthNum = 4;  break;
            case "6"  :   month = "Jun";  monthNum = 5;  break;
            case "7"  :   month = "Jul";  monthNum = 6;  break;
            case "8"  :   month = "Aug";  monthNum = 7;  break;
            case "9"  :   month = "Sep";  monthNum = 8;  break;
            case "10" :   month = "Oct";  monthNum = 9;  break;
            case "11" :   month = "Nov";  monthNum = 10;  break;
            case "12" :   month = "Dec";  monthNum = 11;  break;
        }
        switch(dueDate[1]){
            case "1"   : dayNum = 1;   break;
            case "2"   : dayNum = 2;   break;
            case "3"   : dayNum = 3;   break;
            case "4"   : dayNum = 4;   break;
            case "5"   : dayNum = 5;   break;
            case "6"   : dayNum = 6;   break;
            case "7"   : dayNum = 7;   break;
            case "8"   : dayNum = 8;   break;
            case "9"   : dayNum = 9;   break;
            case "10"   : dayNum = 10;   break;
            case "11"   : dayNum = 11;   break;
            case "12"   : dayNum = 12;   break;
            case "13"   : dayNum = 13;   break;
            case "14"   : dayNum = 14;   break;
            case "15"   : dayNum = 15;   break;
            case "16"   : dayNum = 16;   break;
            case "17"   : dayNum = 17;   break;
            case "18"   : dayNum = 18;   break;
            case "19"   : dayNum = 19;   break;
            case "20"   : dayNum = 20;   break;
            case "21"   : dayNum = 21;   break;
            case "22"   : dayNum = 22;   break;
            case "23"   : dayNum = 23;   break;
            case "24"   : dayNum = 24;   break;
            case "25"   : dayNum = 25;   break;
            case "26"   : dayNum = 26;   break;
            case "27"   : dayNum = 27;   break;
            case "28"   : dayNum = 28;   break;
            case "29"   : dayNum = 29;   break;
            case "30"   : dayNum = 30;   break;
            case "31"   : dayNum = 31;   break;
        }
        var day = "";
        var date = new Date(parseInt(dueDate[2]), monthNum , dayNum);
        switch(date.getDay()){
            case 0    : day = "Sun ";  break;
            case 1    : day = "Mon ";  break;
            case 2    : day = "Tue ";  break;
            case 3    : day = "Wed ";  break;
            case 4    : day = "Thu ";  break;
            case 5    : day = "Fri ";  break;
            case 6    : day = "Sat ";  break;
        }
        formattedDate = day + dayNum + " " + month + " " + dueDate[2].split("20")[1];
        return day + dayNum + " " + month + " " + dueDate[2].split("20")[1];
    }

    function universalDatex(dueDate){
        dueDate     = dueDate.split("-");
        var month = "";
        var monthNum;
        var dayNum;
        switch(dueDate[1]){ 
            case "01"  :   month = "Jan";  monthNum = 0; break;
            case "02"  :   month = "Feb";  monthNum = 1;  break;
            case "03"  :   month = "Mar";  monthNum = 2;  break;
            case "04"  :   month = "Apr";  monthNum = 3;  break;
            case "05"  :   month = "May";  monthNum = 4;  break;
            case "06"  :   month = "Jun";  monthNum = 5;  break;
            case "07"  :   month = "Jul";  monthNum = 6;  break;
            case "08"  :   month = "Aug";  monthNum = 7;  break;
            case "09"  :   month = "Sep";  monthNum = 8;  break;
            case "10" :   month = "Oct";  monthNum = 9;  break;
            case "11" :   month = "Nov";  monthNum = 10;  break;
            case "12" :   month = "Dec";  monthNum = 11;  break;
        }
        switch(dueDate[2].split("T")[0]){
            case "01"   : dayNum = 1;   break;
            case "02"   : dayNum = 2;   break;
            case "03"   : dayNum = 3;   break;
            case "04"   : dayNum = 4;   break;
            case "05"   : dayNum = 5;   break;
            case "06"   : dayNum = 6;   break;
            case "07"   : dayNum = 7;   break;
            case "08"   : dayNum = 8;   break;
            case "09"   : dayNum = 9;   break;
            case "10"   : dayNum = 10;   break;
            case "11"   : dayNum = 11;   break;
            case "12"   : dayNum = 12;   break;
            case "13"   : dayNum = 13;   break;
            case "14"   : dayNum = 14;   break;
            case "15"   : dayNum = 15;   break;
            case "16"   : dayNum = 16;   break;
            case "17"   : dayNum = 17;   break;
            case "18"   : dayNum = 18;   break;
            case "19"   : dayNum = 19;   break;
            case "20"   : dayNum = 20;   break;
            case "21"   : dayNum = 21;   break;
            case "22"   : dayNum = 22;   break;
            case "23"   : dayNum = 23;   break;
            case "24"   : dayNum = 24;   break;
            case "25"   : dayNum = 25;   break;
            case "26"   : dayNum = 26;   break;
            case "27"   : dayNum = 27;   break;
            case "28"   : dayNum = 28;   break;
            case "29"   : dayNum = 29;   break;
            case "30"   : dayNum = 30;   break;
            case "31"   : dayNum = 31;   break;
        }
        var day = "";
        var date = new Date(parseInt(dueDate[0]), monthNum , dayNum);
        switch(date.getDay()){
            case 0    : day = "Sun ";  break;
            case 1    : day = "Mon ";  break;
            case 2    : day = "Tue ";  break;
            case 3    : day = "Wed ";  break;
            case 4    : day = "Thu ";  break;
            case 5    : day = "Fri ";  break;
            case 6    : day = "Sat ";  break;
        }
        return day + dayNum + " " + month + " " + dueDate[0].split("20")[1];
    }
}

function addEventListeners(){
    var deferred = $.Deferred();

    var sectionHeaderAudits = document.getElementById("sectionHeaderAudits");
        sectionHeaderAudits.addEventListener("click", function(e){
            e.stopPropagation();
            toggleAudits();
    });

    var sectionHeaderFindings = document.getElementById("sectionHeaderFindings");
        sectionHeaderFindings.addEventListener("click", function(e){
            e.stopPropagation();
            toggleFindings();
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker1']");
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("input[id='peoplepicker1_f44d807b-b110-4370-b996-dd41dbdde652_$ClientPeoplePicker_EditorInput']").hide();     }
            else{                               $("input[id='peoplepicker1_f44d807b-b110-4370-b996-dd41dbdde652_$ClientPeoplePicker_EditorInput']").show();     }
            $("span[id='peoplepicker1_f44d807b-b110-4370-b996-dd41dbdde652_$ClientPeoplePicker_InitialHelpText']").text("");
        }
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker2']");
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("input[id='peoplepicker2_1ae5ba22-712a-4e5d-8bd5-20bb3b2df9d0_$ClientPeoplePicker_EditorInput']").hide();     }
            else{                               $("input[id='peoplepicker2_1ae5ba22-712a-4e5d-8bd5-20bb3b2df9d0_$ClientPeoplePicker_EditorInput']").show();     }
            $("span[id='peoplepicker2_1ae5ba22-712a-4e5d-8bd5-20bb3b2df9d0_$ClientPeoplePicker_InitialHelpText']").text("");
        }
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker3']");
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("input[id='peoplepicker3_478ccab0-e055-4e6a-a58a-042b5ab09c84_$ClientPeoplePicker_EditorInput']").hide();     }
            else{                               $("input[id='peoplepicker3_478ccab0-e055-4e6a-a58a-042b5ab09c84_$ClientPeoplePicker_EditorInput']").show();     }
            $("span[id='peoplepicker3_478ccab0-e055-4e6a-a58a-042b5ab09c84_$ClientPeoplePicker_InitialHelpText']").text("");
        }
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker4']");
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("input[id='peoplepicker4_c03d3331-8b38-4a2d-b950-269ef9c594c2_$ClientPeoplePicker_EditorInput']").hide();     }
            else{                               $("input[id='peoplepicker4_c03d3331-8b38-4a2d-b950-269ef9c594c2_$ClientPeoplePicker_EditorInput']").show();     }
            $("span[id='peoplepicker4_c03d3331-8b38-4a2d-b950-269ef9c594c2_$ClientPeoplePicker_InitialHelpText']").text("");
        }
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker5']");
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("input[id='peoplepicker5_778566d9-9873-453e-b2de-65e2c943ddb3_$ClientPeoplePicker_EditorInput']").hide();     }
            else{                               $("input[id='peoplepicker5_778566d9-9873-453e-b2de-65e2c943ddb3_$ClientPeoplePicker_EditorInput']").show();     }
            $("span[id='peoplepicker5_778566d9-9873-453e-b2de-65e2c943ddb3_$ClientPeoplePicker_InitialHelpText']").text("");
        }
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='peoplepicker6']");
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("input[id='peoplepicker6_e23ad3ea-0d36-4ec2-a812-304a8a3c1a02_$ClientPeoplePicker_EditorInput']").hide();     }
            else{                               $("input[id='peoplepicker6_e23ad3ea-0d36-4ec2-a812-304a8a3c1a02_$ClientPeoplePicker_EditorInput']").show();     }
            $("span[id='peoplepicker6_e23ad3ea-0d36-4ec2-a812-304a8a3c1a02_$ClientPeoplePicker_InitialHelpText']").text("");
        }
    });
    
    deferred.resolve();
    return deferred.promise();
}

function displaySettings(){
    var deferred = $.Deferred(); 
    
    document.getElementById("MSOZoneCell_WebPartctl00_ctl32_g_74b04b84_dc79_4f44_ac66_64fbb5438372")    .style.display      = "none";
    document.getElementById("ctl00_ctl32_g_1ca0e7d3_dba5_4321_9bef_3543de38c25a_ctl00_toolBarTbl")      .style.display      = "none";
    $("div[id='s4-ribbonrow']")             .attr("style", "display: none; height: 0px;");
    $("div[id='s4-titlerow']")              .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaBox']")             .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaRow']")             .attr("style", "display: none; height: 0px;");
    $("div[id='MSOZoneCell_WebPartWPQ6']")  .attr("style", "display: none; height: 0px;");
    $("div[id='s4-bodyContainer']")         .attr("style", "padding: 0px;");
    
    document.title = "CAPA : Dashboard";

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/code/images/capaLogo.png';
    document.getElementsByTagName('head')[0].appendChild(link);
        
        displayBanner().done(function(){
            deferred.resolve();
        });
        
    return deferred.promise();
}

function displayBanner(){
    var deferred = $.Deferred();    
    var headerIcon = $("div[id='headerIcon']");
        headerIcon.empty();
        var capaLogo = document.createElement("img");
            $(capaLogo).addClass("capa-squares-m");
            capaLogo.setAttribute("title", "CAPA dashboard");
            capaLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
            capaLogo.addEventListener("click", function(e){
                e.stopPropagation();
                document.location.href = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
            });
        headerIcon.append(capaLogo);

    var headerTitle = $("div[id='headerTitle']");
        headerTitle.empty();
        headerTitle.addClass("capa-page-title");
        headerTitle.append("CAPA Manager");
    
    var headerSubTitle = $("div[id='headerSubTitle']");
        headerSubTitle.empty();
        headerSubTitle.addClass("capa-page-subtitle");
        headerSubTitle.append("<span style='color: var(--capa-darkgrey);'>Version 1.1</span>");
    
    deferred.resolve();
    return deferred.promise();
}

function getAudits(qFilter) {
    const queryURL = `https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Audits and reviews')/items?$top=5000&$filter=${encodeURIComponent(qFilter)}&$expand=CA_Customer,SA_Supplier,CAPA_DeptList,Audit_x0020_lead,Audit_x0020_stakeholders&$select=*,CAPA_DeptList/DepartmentName,CAPA_DeptList/ID,CA_Customer/Customer_x0020_name,SA_Supplier/Supplier_x0020_name,Audit_x0020_lead/FirstName,Audit_x0020_lead/LastName,Audit_x0020_lead/EMail,Audit_x0020_stakeholders/Id`;

    return fetch(queryURL, {
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data || !data.d || !data.d.results) {
            throw new Error('Audit data is undefined or in an unexpected format.');
        }

        const audits = data.d.results;
        return Promise.all(audits.map(audit => {
            let stakeholderIds = audit.Audit_x0020_stakeholdersId;
            if (stakeholderIds && stakeholderIds.results) {
                return Promise.all(stakeholderIds.results.map(stakeholderId => {
                    return getPrincipalType(stakeholderId).then(principalType => {
                        
                        if (principalType.type === 'User') {
                            return getUserDetails(stakeholderId);
                        } else if (principalType.type === 'Group') {
                            return getGroupMembersById(stakeholderId);
                        } else {
                            throw new Error('Unknown principal type.  It has been returned as : ' + JSON.stringify(principalType, null,4));
                        }
                    });
                }))
                .then(stakeholderDetails => {
                    // Combine user and group emails into a single list
                    const emails = stakeholderDetails.flatMap(detail => {
                        if (Array.isArray(detail)) {
                            // If detail is an array, it's a list of group member details
                            return detail.map(member => member.Email);
                        } else {
                            // If detail is not an array, it's a single user detail object
                            return detail.Email;
                        }
                    });
                    audit.stakeholderEmails = emails;
                    return audit;
                });
            } else {
                audit.stakeholderEmails = []; // No stakeholders, so set an empty array for emails
                return audit;
            }
        }));
    })
    .catch(error => {
        console.error("Error fetching audit data:", error);
        throw error;
    });
}

function getUserDetails(userId) {
    const userUrl = `https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/getuserbyid(${userId})`;
    return fetch(userUrl, {
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose" }
    })
    .then(response => response.json())
    .then(data => {
        //console.log("here is the data " + JSON.stringify(data,null,4));
        if (data && data.d) {
            return {
                Email: data.d.EMail,
                Title: data.d.Title
            };
        } else {
            throw new Error('User details not found');
        }
    });
}

function getPrincipalType(id) {
    const userUrl = `/_api/web/siteusers/getbyid(${id})?$select=PrincipalType,Title`;

    const fullUserUrl = _spPageContextInfo.webAbsoluteUrl + userUrl;
    return fetch(fullUserUrl, {
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose" }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Not a user');
        }
    })
    .then(data => {
        if (data && data.d) {
            return {
                type: 'User',
                name: data.d.Title || ''
            };
        }
    })
    .catch(error => {
        if (error.message === 'Not a user') {
            // If not a user, try checking if it's a group
            const groupUrl = `/_api/web/sitegroups/getbyid(${id})?$select=PrincipalType,Title`;
            const fullGroupUrl = _spPageContextInfo.webAbsoluteUrl + groupUrl;

            return fetch(fullGroupUrl, {
                method: "GET",
                headers: { "Accept": "application/json;odata=verbose" }
            })
            .then(groupResponse => {
                if (groupResponse.ok) {
                    return groupResponse.json();
                } else {
                    throw new Error(`Principal ID ${id} is neither a user nor a group`);
                }
            })
            .then(groupData => {
                if (groupData && groupData.d) {
                    return {
                        type: 'Group',
                        name: groupData.d.Title || ''
                    };
                }
            });
        } else {
            console.error("Error fetching principal type:", error);
            throw error;
        }
    });
}

function getAuditIDs(qFilter){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Audits and reviews')/" + 
                    "items?$top=5000&$filter=" + qFilter + "&$select=ID";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getAuditIDs(qFilter) the query used\n" + queryURL);
            var errMessage = JSON.stringify(err,null,4);
            console.log(errMessage);
            alert("CAPA has encountered an issue retrieving data from the database.\nPlease send the following message to andrew.black@airnov-healthcare.com\n" + queryURL);
        },
        success: function(suc){
            //console.log("success getting " + suc.d.results.length + " with qFilter\n" + queryURL);
            //console.log("QUERYURL : " + queryURL);
            //console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getFindingsByAuditID(parentAuditID){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Exceptions')/items?$top=5000&$filter=parentAuditID eq '" + parentAuditID + "'" +
                    "&$expand=ExceptionLead " + 
                    "&$select=*,ExceptionLead/FirstName, ExceptionLead/LastName";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Findings with query :\n" + FindingQuery);
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            //console.log("success getting " + suc.d.results.length + " Findings (unfiltered)");
            //console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getFindingIDs(FindingQuery){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Exceptions')/items?$top=5000&$filter="+ FindingQuery +
                    "&$select=ID, parentAuditID";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Findings with query :\n" + FindingQuery);
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            //console.log("success getting " + suc.d.results.length + " Findings (unfiltered)");
            // console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getActionsByParentFindingID(parentFindingID){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=5000&$filter=parentExceptionID eq '" + parentFindingID + "'&$expand=Assignee, Action_x0020_stakeholders, CAPA_DeptList &$select=*, CAPA_DeptList/DepartmentName,CAPA_DeptList/LocationLabel,Action_x0020_stakeholders/EMail,Assignee/EMail,Assignee/LastName,Assignee/FirstName";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Actions using parentFindingID");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            // console.log("success getting " + suc.d.results.length + " Actions for parentFindingID = " + parentFindingID);
            // console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getActionIDs(actionQuery){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=5000&$filter=" + actionQuery + "&$select=ID, parentAuditID, TaskDueDate, parentExceptionID";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Actions with query :\n" + actionQuery);
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
        // console.log("success getting " + suc.d.results.length + " Actions for parentFindingID = " + parentFindingID);
        // console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function showHTML() {
    document.getElementById("loadingOverlay").style.display = "none";
}

function hideHTML() {
    document.getElementById("loadingOverlay").style.display = "block";
}

//getListContents();
function getListContents(){
  
   // var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items(235)?$expand=CAPA_DeptList&$select=*,CAPA_DeptList/DepartmentName";
  //  var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Departments')/items";
  //  var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Audits and reviews')/items('2')";

 //  var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Audits and reviews')/" + 
 //                   "items?$top=50&$filter=ID eq 22"
 //                   "&$expand=CA_Customer, SA_Supplier, CAPA_DeptList, Audit_x0020_lead, Audit_x0020_stakeholders"    + 
 //                   "&$select=*,CAPA_DeptList/DepartmentName, CAPA_DeptList/ID, CA_Customer/Customer_x0020_name, SA_Supplier/Supplier_x0020_name, "   +
  //                  "Audit_x0020_lead/FirstName, Audit_x0020_lead/LastName, Audit_x0020_lead/EMail, Audit_x0020_stakeholders/EMail, Audit_x0020_stakeholders/FirstName, Audit_x0020_stakeholders/LastName";

  var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('AuditReviewTypes')/items";

    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error GetByTitle('Exceptions')");
            console.log(JSON.stringify(err,null,4));
            console.log(_spPageContextInfo.webAbsoluteUrl);
        },
        success: function(suc){
            // console.log("success GetByTitle('AuditReviewTypes')");
            //console.log(JSON.stringify(suc,null,4));
        }
    });
}
</script>