<script type="text/javascript"  src=    "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">                       </script>
<script type="text/javascript"  src=    "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-ui.min.js">                          </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-ui.min.css"      />
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/ExceptionCSS.css"                         />
<script type="text/javascript"  src=    "/sites/ChangeManager/Exceptions/code/opensourceScripts/messagebox.min.js">                         </script>
<script type="text/javascript"  src=    "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.cookie.min.js">                      </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/messagebox.min.css"     />   
<script type="text/javascript"  src=    "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.tablesorter.combined.min.js">        </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/Roboto.css"             />
<script type="text/javascript"  src=    "/_layouts/15/clientpeoplepicker.js">                                                               </script>

<style>
    div[id='HeaderButtonRegion']{
        display: none;
    }
    div[id='O365_SuiteBranding_container']{
        display: none;
    }
</style>

<script>
'use strict';
//  Variables
    var parentExceptionTitle;
    var parentExceptionType;
    var parentExceptionID;
    var parentExceptionObject;
    var parentAuditObject;
    var parentAuditID;
    var isQMKeyholder;
    var actionID;
    var initialStatus;
    var currentStatus;
    var previouStatus;
    var initialDueDate;
    var hasAssignee;
    var hasApprover;

    var availableDepartments;
    var availableLocations;
    var comboList;
//

//  ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem
//  ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl02_ctl00_diidIOGoBack

$(document).ready(function () {

    console.log("This page is running the latest script for Actions PUBLISHED 17 November 2023 : Unobvuscated (you can read it :-))");
   
    hideHTML();

    actionID = getQuerystring("ID");
    initialStatus = $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice']").val();
    initialDueDate = $("input[id='TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldDate']").val();

    isApprover();

    var keyHolderCheck = isMemberOfGroup("Quality Manager Keyholders");
    keyHolderCheck.done(function(answer){
        isQMKeyholder = answer;
        parentExceptionID = document.getElementById("parentExceptionID_472a539a-422d-4008-ada7-61ecb43bd568_$TextField").value;
        var parentException = getParentException();
        parentException                 .done(function(parentExe){
            parentExceptionObject   = parentExe.d;
            parentAuditID           = parentExe.d.parentAuditID;
            availableLocations      = parentExe.d.AuditLocations.results;
            availableDepartments    = parentExe.d.CapaDepartmentId.results;
            getParentAudit()                    .done(function(pa){
                parentAuditObject = pa.d;
                applyEventListener()                .done(function(){
                    prepareLocationsAndDepartments()    .done(function(){
                        onlyDisplayParentActiveLocations()  .done(function(){
                            onlyDisplayParentActiveDepartments()    .done(function(){
                                setRequiredFields()                 .done(function(){
                                    document.getElementById("exceptionTitle").value             = parentExe.d.Exception_x0020_title;
                                    document.getElementById("exceptionType").innerHTML          = parentExe.d.Exception_x0020_type + ":&nbsp;&nbsp;";
                                    document.getElementById("exceptionDescription").value       = parentExe.d.Exception_x0020_description;
                                    var exceptionTypeHeader = document.getElementById("exceptionTypeHeader");
                                        exceptionTypeHeader.innerHTML    = parentExe.d.Exception_x0020_type;
                                        if(parentExe.d.Exception_x0020_type === "Deviation")    {   $(exceptionTypeHeader).removeClass().addClass("exceptionTypeHeaderDeviation");      }
                                        else                                                    {   $(exceptionTypeHeader).removeClass().addClass("exceptionTypeHeaderRecommendation"); }
                                    displaySettings();
                                    getCommentary();
                                    formatDocumentsSection();
                                    setStatus(initialStatus).done(function(e){
                                        console.log("Everything complete and set status has completed");
                                        showHTML();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

function setStatus(initialStatus){

    var deferred = $.Deferred();

    console.log("initialStatus === " + initialStatus);

    if(initialStatus === "Cancelled"){
        setCancelledFunctionality();
        document.getElementById("headerCurrentStatus").innerText = "Cancelled";
        deferred.resolve();
    }
    else if(initialStatus === "Act"){
        setActFunctionality();
        document.getElementById("headerCurrentStatus").innerText = "Act";
        deferred.resolve();
    }
    else if(initialStatus === "Plan"){
        setPlanFunctionality();
        document.getElementById("headerCurrentStatus").innerText = "Plan";
        deferred.resolve();
    }
    else if(initialStatus === "Do"){
        setDoFunctionality();
        document.getElementById("headerCurrentStatus").innerText = "Do";
        deferred.resolve();
    }
    else if(initialStatus === "Check"){
        setCheckFunctionality();
        document.getElementById("headerCurrentStatus").innerText = "Check";
        deferred.resolve();
        
    }
    else{
        unlockEverything();
        deferred.resolve();
    }

    return deferred.promise();
}

function setRequiredFields(){
    
    var deferred = $.Deferred();

    var requiredFields  = [];
        requiredFields.push("Title_fa564e0f-0c70-4ab9-b863-0177e6ddd247_$TextField");
        requiredFields.push("Action_x0020_type_ef9b6d34-0261-4761-9f20-0389c4673a25_$DropDownChoice");
        requiredFields.push("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
        //                   _x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice
        requiredFields.push("Action_x0020_description_4a4130a0-87d5-4e7a-9f98-4e03ae02bf7e_$TextField");
    for(var t=0 ; t < requiredFields.length ; t++){
        var element = document.getElementById(requiredFields[t]);
        console.log("Required field : " + requiredFields[t] + " and the val() = " + $(element).val());
        if($(element).val() === null){
            var actOptionValue = $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").val();
            if(actOptionValue === "Act"){
                $(element).removeClass("required");
            }
            else{
                $(element).addClass("required");
            }
        }
        else{
            $(element).removeClass("required");
        }
        element.addEventListener("change", function(e){
            e.stopPropagation();
            setRequiredFields();
        });
    }
     
    var _table          = document.getElementById("AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable");
    var _locations      = $("input[id^='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceOption_']");
    var _hasLocation    = false;
    
    for(var i = 0; i < _locations.length; i++) {
        if($(_locations[i]).attr("ishidden") === "no"){
            var locationN = $(_locations[i]).next("label").text();
            var depsDiv = document.getElementById("locDDiv" + locationN);
            var deps = $("input[id^='deptRef_" + locationN + "_']");
            if (document.getElementById(_locations[i].getAttribute("id")).checked) {
                _hasLocation = true;
                var _hasDepts = false;
                for(var t=0 ; t < deps.length ; t++){
                    deps[t] = deps[t].cloneNode();
                    deps[t].addEventListener("change", setRequiredFields); 
                    if(deps[t].checked){
                        _hasDepts = true;
                    }
                }
                if(_hasDepts){
                    $(depsDiv).removeClass("required");
                }
                else{
                    $(depsDiv).addClass("required");
                }
            }
            else{
                for(var t=0 ; t < deps.length ; t++){
                    deps[t].selected = false; // ("checked",false);
                    $("input[id='CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_MultiChoiceOption_" + $(deps[t]).val() + "']").prop("checked", false);
                    $(depsDiv).removeClass("required");
                }
                deselectDeparmentOptions();
            }

            if(_hasLocation){
                $(_table).removeClass("required");
            }
            else{
                $(_table).addClass("required");
            }
        }
    }
    
    deferred.resolve();

    return deferred.promise();
}

function checkForRequiredFields(target){
    var deferred = $.Deferred();

    console.log("Checking for required fields");

    var requiredElements = $(".required");

    if(requiredElements.length ===0){
        console.log("All required fields have values");
        deferred.resolve("complete", target);
    }
    else{
        alert("There are " + requiredElements.length + " required fields which do not have data.");
        deferred.resolve("incomplete", target);
    }
    return deferred.promise();
}

function onlyDisplayParentActiveLocations(){
    
    var deferred = $.Deferred();

    var locationOptions = $("input[id^='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceOption']");
    for(var d=0 ; d < locationOptions.length ; d++){
        $(locationOptions[d]).closest("tr").hide();
        locationOptions[d].setAttribute("ishidden", "yes");
    }
    for(var x=0 ; x < availableLocations.length ; x++){
        for(var s=0 ; s < locationOptions.length ; s++){
            if($(locationOptions[s]).closest("span").attr("title") === availableLocations[x]){
                $(locationOptions[s]).closest("tr").show();
                locationOptions[s].setAttribute("ishidden", "no");
            }
        }
    }
    
    deferred.resolve();

    return deferred.promise();
}

function onlyDisplayParentActiveDepartments(){
    
    var deferred = $.Deferred();
    
    var allLocationLabels = $("label[for^='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceOption']");
    for(var g=0 ; g < allLocationLabels.length ; g++){
        var thelocation = $(allLocationLabels[g]).text();
        var departmentOptions = $("input[id^='deptRef_" + thelocation + "']");
        for(var a=0 ; a < departmentOptions.length ; a++){
            var hideThis = true;
            for(var s=0 ; s < availableDepartments.length ; s++){
                if($(departmentOptions[a]).attr("id").split("_")[2] === availableDepartments[s].toString()){
                    hideThis = false;
                }
            }
            if(hideThis){
                $(departmentOptions[a]).hide();
                departmentOptions[a].checked = false;
                $("label[for='" + departmentOptions[a].id + "']").hide();
                $("label[for='" + departmentOptions[a].id + "']").next("br").hide();
            }           
        }
    }
    
    //  Load the currently selected departments.
    var selectedDeptMulti = $("input[id='CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_MultiLookup']");

    var temp = selectedDeptMulti.attr("value");
    temp = temp.split("|t");
    for(var x=0 ; x < temp.length ; x = x + 2){
        if(temp[x].length > 0){
            document.getElementById($("input[departmentid='" + temp[x] + "']").attr("id")).checked = true;
        }
    }
    deferred.resolve();
    return deferred.promise();
}

function prepareLocationsAndDepartments(){
    
    var deferred = $.Deferred();
    
    var departments = getDepartments();
        departments.done(function(depts){
            comboList = new Array();
            for(var h=0 ; h < depts.d.results.length ; h++){

                var combo = new Array();
                combo[0] = depts.d.results[h].AuditLocations;
                combo[1] = depts.d.results[h].DepartmentName;
                combo[2] = depts.d.results[h].ID;
                comboList.push(combo);
            }

            var departmentDisplayHeader = document.getElementById("departmentDisplaySubHeader");
            $(departmentDisplayHeader).empty();
        
            var locations = $("input[id^='AuditLocations_09313']");
            for(var g=0 ; g < locations.length ; g++){
                document.getElementById($(locations[g]).attr("ID")).addEventListener("change", function(e){
                    e.stopPropagation();
                    setRequiredFields().done(function(){
                        reworkDepartments();
                        //setRequiredFields();
                    });
                });
                
                document.getElementById($(locations[g]).attr("ID")).setAttribute("style", "margin: 10px;");

                var locDeptsDiv = document.createElement("div");
                    locDeptsDiv.setAttribute("ID", "locDepDiv" + $(locations[g]).attr("ID"));
                    if(locations[g].checked)    { $(locDeptsDiv).removeClass().addClass("showDepartments");   }
                    else                        { $(locDeptsDiv).removeClass().addClass("hideDepartments");   }
                var locationName = $(locations[g]).closest("span").attr("title");
                
                var showDepts = document.createElement("img");
                    showDepts.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/collapse.svg");
                    showDepts.setAttribute("style", "height: 15px; margin-right: 5px;");
                    showDepts.setAttribute("location", locationName);
                    showDepts.setAttribute("id", "showDepts_" + locationName);
                    showDepts.addEventListener("click", function(e){
                        e.stopPropagation();
                        if($(this).attr("src") === "/sites/ChangeManager/Exceptions/code/images/expand.svg"){
                            $(this).attr("src", "/sites/ChangeManager/Exceptions/code/images/collapse.svg");
                            var locDepDiv_temp = document.getElementById("locDDiv" + $(this).attr("location"));
                            $(locDepDiv_temp).removeClass().addClass("showDepartments");
                            $("label[for='" + $(this).attr("id") + "']").html("Hide " + $(this).attr("location") + " departments.");
                        }
                        else{
                            $(this).attr("src", "/sites/ChangeManager/Exceptions/code/images/expand.svg");
                            var locDepDiv_temp = document.getElementById("locDDiv" + $(this).attr("location"));
                            $(locDepDiv_temp).removeClass().addClass("hideDepartments");
                            $("label[for='" + $(this).attr("id") + "']").html("Show " + $(this).attr("location") + " departments.");
                        }
                    });
                    $(locDeptsDiv).append(showDepts);

                var lab = document.createElement("label");
                    lab.htmlFor = "showDepts_" + locationName;
                    lab.appendChild(document.createTextNode("Hide " + locationName + " departments"));
                $(locDeptsDiv).append(lab);

                var locDDiv = document.createElement("div");
                    locDDiv.setAttribute("id", "locDDiv" + locationName);
                $(locDDiv).removeClass().addClass("showDepartments");
                $(locDeptsDiv).append(locDDiv);


                for(var t=0 ; t < comboList.length ; t++){
                    if(comboList[t][0] === locationName){
                        var deptCheckbox = document.createElement("input");
                            deptCheckbox.setAttribute("type", "checkbox");
                            deptCheckbox.checked = false;
                            deptCheckbox.setAttribute("style", "margin-left: 30px; margin-right: 5px;");
                            deptCheckbox.setAttribute("id", "deptRef_" + locationName + "_" + comboList[t][2]);
                            deptCheckbox.setAttribute("departmentid" , comboList[t][2]);
                            deptCheckbox.setAttribute("departmentName", comboList[t][1]);
                            deptCheckbox.setAttribute("location", locationName);
                            deptCheckbox.addEventListener("change", function(e){
                                e.stopPropagation();
                                if(this.checked){
                                    console.log("checkbox has been checked " + this.getAttribute("location"));
                                    document.getElementById("locDDiv" + this.getAttribute("location")).classList.remove("required");
                                    var candidates = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_SelectCandidate").options;
                                    for(var t=0 ; t < candidates.length ; t++){
                                        if(candidates[t].value === $(this).attr("departmentid")){
                                            candidates[t].selected = true;
                                        }
                                        else{
                                            candidates[t].selected = false;
                                        }
                                    }
                                    var addButton = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_AddButton");
                                    addButton.disabled = false;
                                    addButton.click();
                                    reworkDepartments();
                                    //setRequiredFields();
                                }
                                else{
                                    var lastManStanding = $("input[type='checkbox'][id^='deptRef_" + this.getAttribute("location") + "']:checked");
                                    if(lastManStanding.length === 0){
                                        document.getElementById("locDDiv" + this.getAttribute("location")).classList.add("required");
                                    }


                                    var results = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_SelectResult").options;
                                    for(var t=0 ; t < results.length ; t++){
                                        if(results[t].value === $(this).attr("departmentid")){
                                            results[t].selected = true;
                                        }
                                        else{
                                            results[t].selected = false;
                                        }
                                    }
                                    var removeButton = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_RemoveButton");
                                    removeButton.disabled = false;
                                    removeButton.click();
                                    $("input[id='CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_RemoveButton']").click();
                                    reworkDepartments();
                                    //setRequiredFields();
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

function deselectDeparmentOptions(){
    //  Deselect all candidates
    var candidates = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_SelectCandidate").options;
    for(var t=0 ; t < candidates.length ; t++){
        candidates[t].selected = false;
    }

    //  Deselect all results
    var results = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_SelectResult").options;
    for(var t=0 ; t < results.length ; t++){
        results[t].selected = false;
    }
}

function reworkDepartments(){

    var deferred = $.Deferred();
    
    var allLocations = $("input[id^='AuditLocations_09313']");
    for(var f=0 ; f < allLocations.length ; f++){
        if($(allLocations[f]).attr("ishidden") === "no"){
            var locationsDiv = document.getElementById("locDepDiv" + $(allLocations[f]).attr("ID"));
            if(allLocations[f].checked){
                $(locationsDiv).removeClass().addClass("showDepartments");
            }
            else{
                $(locationsDiv).removeClass().addClass("hideDepartments");
                deselectDeparmentOptions();
                $(locationsDiv).find("input[type='checkbox']").each(function(){
                    this.checked = false;
                });

            }
        }
    }

    deferred.resolve();

    return deferred.promise();
}

function getParentAudit(){
    
    var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Audits and reviews')/items(" + parentAuditID + ")?$expand=CA_Customer,SA_Supplier&$select=*,CA_Customer/Customer_x0020_name,SA_Supplier/Supplier_x0020_name";
    
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Audit or review");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            //console.log("success getting audit or review #" + parentAuditID);
        }   
    });
}

function getParentException(){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Exceptions')/items(" + parentExceptionID + ")";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Exception");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            console.log("success getting exception #" + parentExceptionID);
            //console.log("The parentException is \n" + JSON.stringify(suc,null,4));
        }   
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
            console.log("success with getDepartments.  THe query returned " + suc.d.results.length + " departments");
           // console.log(JSON.stringify(suc,null,4));
        }
    });
}

function refreshCommentary(){
    var cURL = document.location.href;
    cURL = cURL.split("&Source");
    cURL = cURL[0] + "&Source=" + cURL[0];
    window.history.replaceState(null,null,cURL);
    console.log(document.location.href);
    $("input[id='ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
}

function getCommentary(){

    $("#commentaryDiv").empty();
    
    var commentaryHistory = getCommentaryHistory();
    commentaryHistory.done(function(comments){
        var data = JSON.parse(comments.d.RenderExtendedListFormData);
       
        var commentaryComments = data.actionCommentary;

        if(typeof commentaryComments != "undefined"){
            for(var i = 0 ; i < commentaryComments.length  ; i++){
                var commChanges = document.createElement("div");
                    commChanges.setAttribute("class", "commentBox");
                    commChanges.setAttribute("readonly", "readonly");
                    commChanges.setAttribute("id", "comment" + i);
                var commComments = document.getElementById("commentaryDiv");
                $(commComments).append(commChanges);
                $(commComments).append("<br>");
                
                var t = document.getElementById("comment" + i);
                var commentItem     = commentaryComments[i].value;
                var commentDate     = commentItem.slice(commentItem.search("&lt;date&gt;") + 12,commentItem.search("&lt;/date&gt;"));
                var commentComment  = commentItem.slice(commentItem.search("&lt;comment&gt;") + 15,commentItem.search("&lt;/comment&gt;"));
                commentComment = commentComment.replace(/\n/g,"<br>");
                
                var commHeader = document.createElement("div");
                    commHeader.setAttribute("class", "commentHeader");
                    commHeader.setAttribute("id", "commHeader" + i);
                t.append(commHeader);
                commHeader = document.getElementById("commHeader" + i);
                $(commHeader).html(commentaryComments[i].createdTitle);

                var commDate = document.createElement("div");
                    commDate.setAttribute("class", "commentDate");
                    commDate.setAttribute("id", "commDate" + i);
                t.append(commDate);
                commDate = document.getElementById("commDate" + i);
                $(commDate).text(commentDate);
                
                var commComm = document.createElement("div");
                    commComm.setAttribute("class", "commentComment");
                    commComm.setAttribute("id", "commComm" + i);
                t.append(commComm);
                commComm = document.getElementById("commComm" + i);
                $(commComm).html(commentComment);
            }
        }
        else{
            console.log("there is no commentary for this action");
        }    
    });
}

function getCommentaryHistory(){
    var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('CAPA_Actions')/RenderExtendedListFormData(itemId=" + actionID +",formId='editform',mode='2',options=47,cutoffVersion=0)";
    return $.ajax({
        url: queryURL,
        type: "POST",
        headers: {  "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                   },
        error: function(err){
            console.log("error getting action commentary hisory");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            console.log("Success retrieving action commentary RenderExtendedListFormData");
        }
    });
}

function statusChangeCommentary(optional){
    var deferred = $.Deferred();
    if(optional === "notRequired"){
        $.MessageBox({  input:  {   reason  : { type : "textarea",  rows: 6,    resize: true    }},
                                    message     : "Please provide justification.",
                                    buttonDone  : "Comment",
                                    buttonFail  : "No comment"
                    }).done(function(data){     
                        if(data.reason.length > 0){
                            var today = new Date();
                            today = today.toString();
                            today = today.slice(0,15) + " at " + today.slice(16,21) + "hrs ("  + today.slice(25,33) + ")";
                            var commentaryEntry = "<date>" + today + "</date><comment>" + data.reason + "</comment>";
                            $("textarea[id='actionCommentary_a834abe4-e680-4c38-9ec2-cb41568b74b3_$TextField']").val(commentaryEntry);
                            deferred.resolve("commented");
                        }
                        else{
                            deferred.resolve("no comment");
                        }
                    }).fail(function(){
                        deferred.resolve("no comment");
                    });
    }
    else{
        $.MessageBox({  input:  {   reason  : { type : "textarea",  rows: 6,    resize: true    }},
                                    message     : "Please provide justification.",
                                    buttonDone  : "Comment",
                                    buttonFail  : "Cancel"
                    }).done(function(data){     
                        if(data.reason.length > 0){
                            var today = new Date();
                            today = today.toString();
                            today = today.slice(0,15) + " at " + today.slice(16,21) + "hrs ("  + today.slice(25,33) + ")";
                            var commentaryEntry = "<date>" + today + "</date><comment>" + data.reason + "</comment>";
                            $("textarea[id='actionCommentary_a834abe4-e680-4c38-9ec2-cb41568b74b3_$TextField']").val(commentaryEntry);
                            deferred.resolve("commented");
                        }
                        else{
                            deferred.resolve("no comment");
                        }
                    }).fail(function(){
                        deferred.resolve("no comment");
                    });
    }
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
    var queryURL = "/_api/Web/SiteGroups/GetByName('" + groupName + "')/users?$select=Email, Title";
    return $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + queryURL,
        type: "GET",
        headers: {
            "accept":  "application/json;odata=verbose"
        },
        success: function (suc) {  
           //console.log("Success on returning members of " + groupName);
           //console.log(JSON.stringify(suc, null, 4));   
        },
        error: function (err)   {   
            console.log("Error on returning members of " + groupName + "\n" + JSON.stringify(err, null, 4));
        }
    });
}

function displaySettings(){

    document.getElementById("MSOZoneCell_WebPartctl00_ctl32_g_1e670f1b_c1f6_43fe_b8ee_12d04f3fdbd9").style.display      = "none";
    $("div[id='s4-ribbonrow']")             .attr("style", "display: none; height: 0px;");
    $("div[id='s4-titlerow']")              .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaBox']")             .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaRow']")             .attr("style", "display: none; height: 0px;");
    $("div[id='MSOZoneCell_WebPartWPQ4']")  .attr("style", "display: none; height: 0px;"); 
    $("div[id='MSOZoneCell_WebPartWPQ6']")  .attr("style", "display: none; height: 0px;");  

    document.getElementById("ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbl").style.display = "none";
    
    document.title = "CAPA Action #" + getQuerystring("ID") + " : F#" + parentExceptionID + " : Au#" + parentAuditID;

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/code/images/capaLogo.png';
    document.getElementsByTagName('head')[0].appendChild(link);

    $("img[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDateDatePickerImage']").hide();
    $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").attr("readonly", true);

    var actionStatus = document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
    $(actionStatus).attr("title", "Action status");

    var approver = document.getElementById("Action_x0020_approver_33bc65c0-5a0f-436d-b0ff-b9cd73f45896_$ClientPeoplePicker_InitialHelpText");
    $(approver).empty().text("Leave blank if no approval required for this action or activity.");

    var stakeholders = document.getElementById("Action_x0020_stakeholders_c34520ab-52cb-4714-a0fc-272bc6c52806_$ClientPeoplePicker_InitialHelpText");
    $(stakeholders).empty().text("Enter stakeholders who will receive action or activity notifications.");

    var assignee = document.getElementById("Assignee_16b0f4c5-707d-4c6d-9b76-ddc1e851d3ce_$ClientPeoplePicker_InitialHelpText");
    $(assignee).empty().text("Enter an assignee for this action or activity.");    

    var dueDateDisplay = document.createElement("INPUT");
        dueDateDisplay.setAttribute("width", "250px;");
        dueDateDisplay.setAttribute("ID", "dueDateDisplay");
        $(dueDateDisplay).attr("readonly", true);
    $("input[id='TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldDate']")
        .hide()
        .after(dueDateDisplay);

    //  Archive actions
    if(isQMKeyholder){
         $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Cancelled']").removeClass().addClass("archiveAction");
    }
    else{
        $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Cancelled']").hide();

    }

    //  Set to Act
    if(isQMKeyholder){
        $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").removeClass().addClass("actionStatusActOption");
    }
    else{
        $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").addClass("actionStatusNoOption");
    }
    

   dueDateDisplay = document.getElementById("dueDateDisplay");
   var dueDate = $("input[id='TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldDate']").val();
   if(dueDate != null){ $(dueDateDisplay).val(universalDate(dueDate));}


    //  Format the completion date:
    var completionDateDisplay = document.createElement("INPUT");
        completionDateDisplay.setAttribute("width", "250px;");
        completionDateDisplay.setAttribute("ID", "completionDateDisplay");
        $(completionDateDisplay).attr("readonly", true);
    $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']")
        .hide()
        .after(completionDateDisplay);

    completionDateDisplay = document.getElementById("completionDateDisplay");
    var completionDate = $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").val();
    console.log("completion date : " + completionDate);
    if(completionDate != null){ $(completionDateDisplay).val(universalDate(completionDate));}



    displayBanner();

    applyApproverLocks();
    applyDueDateLocks();
   // applyDescriptionLock();
}

////    START     /// PADLOCKS
    function lockApprover() {
        console.log("lockApprover() called");
        
        // Get the people picker instance
        var peoplePickerDiv = $("[id^='Action_x0020_approver_33bc65c0-5a0f-436d-b0ff-b9cd73f45896']");

        // Get the people picker top ID
        var peoplePickerTopId = peoplePickerDiv.attr('id');

        // Get all the instances of the people picker.
        var instances = SPClientPeoplePicker.SPClientPeoplePickerDict;

        // Retrieve the instance of the people picker.
        var peoplePicker = instances[peoplePickerTopId];

        // Disallow adding more users
        peoplePicker.SetEnabledState(false);

        // Hide delete/remove button for already added users
        peoplePickerDiv.find('.sp-peoplepicker-delImage').hide();

        // Disallow editing of existing users
        var editorInput = peoplePickerDiv.find('.sp-peoplepicker-editorInput');
        editorInput.attr('contenteditable', false);

        // Prevent click on People Picker
        peoplePickerDiv.on('click', function(e) {
            e.stopPropagation();
        });
    }

    function unlockApprover() {
        console.log("unlockApprover() called");
        
        // Get the people picker instance
        var peoplePickerDiv = $("[id^='Action_x0020_approver_33bc65c0-5a0f-436d-b0ff-b9cd73f45896']");

        // Get the people picker top ID
        var peoplePickerTopId = peoplePickerDiv.attr('id');

        // Get all the instances of the people picker.
        var instances = SPClientPeoplePicker.SPClientPeoplePickerDict;

        // Retrieve the instance of the people picker.
        var peoplePicker = instances[peoplePickerTopId];

        // Allow adding more users
        peoplePicker.SetEnabledState(true);

        // Show delete/remove button for already added users
        peoplePickerDiv.find('.sp-peoplepicker-delImage').show();

        // Allow editing of existing users
        var editorInput = peoplePickerDiv.find('.sp-peoplepicker-editorInput');
        editorInput.attr('contenteditable', true);

        // Allow click on People Picker
        peoplePickerDiv.off('click');
    }

    function applyApproverLocks(){
        var approverPadlockation    = document.getElementById("approverRequiredLock");
        var approverPadlockBoolean  = document.getElementById("actionApproverLocked_6f6764ba-564c-45d1-8b39-ff04f42e5503_$BooleanField");
        var approverPadlock         = document.createElement("img");
            if(approverPadlockBoolean.checked)   {   approverPadlock         .setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/lockedRed.svg");   
                                                    lockApprover();  }
            else                                {   approverPadlock         .setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/unlockedGreen.svg");
                                                    unlockApprover();}
            approverPadlock         .setAttribute("style", "height : 20px; padding-right: 5px;");
            $(approverPadlock)      .addClass("rolloverImage");
            $(approverPadlock)      .addClass("fadeToPadlock");
            if(isQMKeyholder){
                approverPadlock         .addEventListener("click", function(e){
                    e.stopPropagation();
                    if(document.getElementById("actionApproverLocked_6f6764ba-564c-45d1-8b39-ff04f42e5503_$BooleanField").checked){
                        document.getElementById("actionApproverLocked_6f6764ba-564c-45d1-8b39-ff04f42e5503_$BooleanField").checked = false;
                    }
                    else{
                        document.getElementById("actionApproverLocked_6f6764ba-564c-45d1-8b39-ff04f42e5503_$BooleanField").checked = true;
                    }
                    applyApproverLocks();
                });
            }
            $(approverPadlockation).empty().append(approverPadlock);
    }

    function lockDueDate(){
        console.log("Lock the due date");
        var dateEntry = document.getElementById("TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldTopTable");
        $(dateEntry).attr("style", "pointer-events: none;");
    }

    function unlockDueDate(){
        console.log("Unlock the due date");
        var dateEntry = document.getElementById("TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldTopTable");
        $(dateEntry).attr("style", "pointer-events: ;");
    }

    function applyDueDateLocks(){
        var dueDatelockation    = document.getElementById("dueDateLock");
        var dueDatelockBoolean  = document.getElementById("dueDateLocked_bb3b2e7c-9e2f-42a9-8839-2098cca8534b_$BooleanField");
        var dueDatelock         = document.createElement("img");
            if(dueDatelockBoolean.checked)  {   dueDatelock.setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/lockedRed.svg");   
                                                lockDueDate();  }
            else                            {   dueDatelock.setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/unlockedGreen.svg");
                                                unlockDueDate();}
            dueDatelock.setAttribute("style", "height : 20px; padding-right: 5px;");
            $(dueDatelock).addClass("rolloverImage");
            $(dueDatelock).addClass("fadeToPadlock");
            if(isQMKeyholder){
                dueDatelock.addEventListener("click", function(e){
                    e.stopPropagation();
                    if( document.getElementById("dueDateLocked_bb3b2e7c-9e2f-42a9-8839-2098cca8534b_$BooleanField").checked){
                        document.getElementById("dueDateLocked_bb3b2e7c-9e2f-42a9-8839-2098cca8534b_$BooleanField").checked = false;
                    }
                    else{
                        document.getElementById("dueDateLocked_bb3b2e7c-9e2f-42a9-8839-2098cca8534b_$BooleanField").checked = true;
                    }
                    applyDueDateLocks();
                });
            }
            $(dueDatelockation).empty().append(dueDatelock);
    }

////    END       /// PADLOCKS

function formatDataEntryDate(date){
    
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    console.log("The completion date we are trying to post is " + "[" + m + "/" + d + "/" + y +"]");

    return m + "/" + d + "/" + y;
}

function setPlanFunctionality(){
    console.log("setPlanFunctionality");
    
    //  Creat the assign button and display it if the Assignee is not populated then set it as .fadeToGray
    var assignButton = document.createElement("input");
        assignButton.setAttribute("type", "button");
        assignButton.setAttribute("value", "Notify assignee");

    var notify = document.getElementById("notify_fd95c5b2-0d39-477c-ae26-1d62c63cca56_$TextField").value;

    if(hasAssignee && notify != 1){
        $(assignButton).removeClass("fadeToGray").addClass("brightButton");
    }
    else{
        $(assignButton).removeClass("brightButton").addClass("fadeToGray");
    }

    assignButton.addEventListener("click", function(e){
        e.stopPropagation();
        document.getElementById("notify_fd95c5b2-0d39-477c-ae26-1d62c63cca56_$TextField").value = "1";
        setPlanFunctionality();
    });

    var displayNode = document.getElementById("assignButton");
    $(displayNode).empty().append(assignButton);
}

function setDoFunctionality(){
    console.log("setDoFunctionality");
    document.getElementById("notify_fd95c5b2-0d39-477c-ae26-1d62c63cca56_$TextField").value = "0";
    var displayNode = document.getElementById("assignButton");
    $(displayNode).empty();

    //  Lock the status of the action
    $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice']").prop("readonly", true).removeClass("fadeToGray").addClass("readOnlyAction");

    if(isQMKeyholder | isAssignee()){
        console.log("Current user is a keyholder or the Assignee");
        $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice']").prop("readonly", false).removeClass("readOnlyAction");
    }
    else{
        $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice']").prop("readonly", true).removeClass("fadeToGray").addClass("readOnlyAction");
    }
}

function setCheckFunctionality(){
    console.log("setCheckFunctionality");

    $("input")                      .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $("select")                     .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $("textarea")                   .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $(".sp-peoplepicker-topLevel")  .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $(".fadeToPadlock")             .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    
    var displayNode = document.getElementById("assignButton");
    $(displayNode).empty();
    
    if(isQMKeyholder | isApprover()){
        console.log("Current user is a keyholder or the Approver");
        var s= document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
        $(s).prop("readonly", false);
        $(s).prop("disabled", false);
        $(s).removeClass("readOnlyAction");
        var sOp = $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option");
        for(var t=0 ; t < sOp.length ; t++){
            $(sOp[t]).prop("disabled", false);
            $(sOp[t]).removeClass("readOnlyAction");
        }
    }

}

function setActFunctionality(){
    console.log("setActFunctionality");

    //  As this Action is set to Act we will prevent any changes at all

    $("input")                      .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $("select")                     .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $("textarea")                   .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $(".sp-peoplepicker-topLevel")  .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $(".fadeToPadlock")             .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");

    var displayNode = document.getElementById("assignButton");
    $(displayNode).empty();

    //  If the current user is a QMK then we will configure the options accordingly:
    //  Mix of disabled and readonly with CSS locks
    if(isQMKeyholder){
        console.log("Current user is a keyholder");
        var s= document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
        $(s).prop("readonly", false);
        $(s).prop("disabled", false);
        $(s).removeClass("readOnlyAction");
        var sOp = $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option");
        for(var t=0 ; t < sOp.length ; t++){
            $(sOp[t]).prop("disabled", false);
            $(sOp[t]).removeClass("readOnlyAction");
        }
    }
}

function setCancelledFunctionality(){
    console.log("setCancelledFunctionality");

    $("input")                      .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $("select")                     .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $("textarea")                   .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $(".sp-peoplepicker-topLevel")  .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");
    $(".fadeToPadlock")             .prop("readonly", true) .removeClass("fadeToGray").addClass("readOnlyAction");

    var displayNode = document.getElementById("assignButton");
    $(displayNode).empty();

    if(isQMKeyholder){
        console.log("Current user is a keyholder");
        var s= document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
        $(s).prop("readonly", false);
        $(s).prop("disabled", false);
        $(s).removeClass("readOnlyAction");
        var sOp = $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option");
        for(var t=0 ; t < sOp.length ; t++){
            $(sOp[t]).prop("disabled", false);
            $(sOp[t]).removeClass("readOnlyAction");
        }
    }
}

function unlockEverything(){
    $(".fadeToGray")             .removeClass("fadeToGray");
}

function applyEventListener(){
    
    var deferred = $.Deferred();

    $(function(){   // ActionDueDate
        $("input[id='TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldDate']").get(0).onvaluesetfrompicker = DatePickerChanged;
        function DatePickerChanged(e) {
            console.log("Initial due date = " + initialDueDate + " which is a typeof " + typeof initialDueDate);
            if(initialDueDate != ""){
                var justified = statusChangeCommentary("required");
                justified.done(function(commentProvided){
                    if(commentProvided === "commented"){
                        var dueDateDisplay = document.getElementById("dueDateDisplay");
                        var dueDate = $("input[id='TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldDate']").val();
                        $(dueDateDisplay).val(universalDate(dueDate));
                        var cURL = document.location.href;
                        cURL = cURL.split("&Source=")[0];
                        cURL = cURL + "&Source=" +  cURL; //"&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=" + excep.d.ID;
                        console.log("cURL : " + cURL);
                        window.history.replaceState(null,null,cURL);
                        $("input[id='ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                    }
                    else{
                        alert("A justification is requried for a date change");
                    }
                });
            }
            else{
                var dueDateDisplay = document.getElementById("dueDateDisplay");
                var dueDate = $("input[id='TaskDueDate_cd21b4c2-6841-4f9e-a23a-738a65f99889_$DateTimeFieldDate']").val();
                $(dueDateDisplay).val(universalDate(dueDate));
                console.log("no need to ask for a reason as the action had no due date");
            }
        }
    });

    document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice").addEventListener("change",function(e){
        e.stopPropagation();
        var newStatus = $(this).val();
        if(newStatus === "Cancelled"){
            if(confirm("The action assignee, approver, and any stakeholders will receive a notification that this action has been cancelled.\n\nDo you wish to continue?")){
                var reasonProvided = statusChangeCommentary("required");
                reasonProvided.done(function(commentProvided){
                    if(commentProvided === "no comment"){
                        alert("A cancellation reason is required.\n\nThe status has not been changed");
                        document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice").value = initialStatus;
                    }
                    else{
                        setCancelledFunctionality();
                        document.getElementById("Action_x0020_complete_e63c23ba-a627-49b8-a405-a94b7b429c33_$BooleanField").checked = false;
                        $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").val("").trigger("change");
                        refreshCommentary();
                    }
                });
            }
            else{
                $(this).val(initialStatus);
            }
        }
        else if(newStatus === "Act"){
            var message = "Updating the status to Act will set it as complete.";
            if(confirm(message)){
                var commented = statusChangeCommentary("required");
                commented.done(function(answer){
                    if(answer == "no comment"){
                        alert("Justification for setting the status to Act is required.\n\nThe status has not been changed");
                        document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice").value = initialStatus;
                    }
                    else{
                        setActFunctionality();
                        document.getElementById("Action_x0020_complete_e63c23ba-a627-49b8-a405-a94b7b429c33_$BooleanField").checked = true;
                        var now = formatDataEntryDate(new Date());
                        console.log("New status is Act and so about to set Completion_ to : " + now);
                        $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").val(now).trigger("change");
                        refreshCommentary();
                    }
                });
                
            }
            else{
                $(this).val(initialStatus);
            }
        }
        else if(newStatus === "Plan"){
            var commented = statusChangeCommentary("required");
            commented.done(function(answer){
                if(answer == "no comment"){
                    alert("Justification for setting the status to Planning stage is required.\n\nThe status has not been changed");
                    document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice").value = initialStatus;
                }
                else{
                    setPlanFunctionality();
                    document.getElementById("Action_x0020_complete_e63c23ba-a627-49b8-a405-a94b7b429c33_$BooleanField").checked = false;
                    $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").val("").trigger("change");
                    refreshCommentary();
                }
            });
            
            //
            
        }
        else if(newStatus === "Do"){
            var commented = statusChangeCommentary("required");
            commented.done(function(answer){
                if(answer == "no comment"){
                    alert("Justification for setting the status to Do is required.\n\nThe status has not been changed");
                    document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice").value = initialStatus;
                }
                else{
                    setDoFunctionality();
                    document.getElementById("Action_x0020_complete_e63c23ba-a627-49b8-a405-a94b7b429c33_$BooleanField").checked = false;
                    $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").val("").trigger("change");
                    refreshCommentary();
                }
            });
        }
        else if(newStatus === "Check"){
            var commented = statusChangeCommentary("required");
            commented.done(function(answer){
                if(answer == "no comment"){
                    alert("Justification for setting the status to Check is required.\n\nThe status has not been changed");
                    document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice").value = initialStatus;
                }
                else{
                    setCheckFunctionality();
                    document.getElementById("Action_x0020_complete_e63c23ba-a627-49b8-a405-a94b7b429c33_$BooleanField").checked = false;
                    $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").val("").trigger("change");
                    refreshCommentary();
                }
            });
        }
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var pickerId = "Assignee_16b0f4c5-707d-4c6d-9b76-ddc1e851d3ce_$ClientPeoplePicker";
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerId];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            var curStatus = document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
            if(curStatus.value === "Do" | curStatus.value === "Check" | curStatus.value === "Ack"){
                if(selectedUsersInfo.length > 0){   $("div[id='" + pickerId + "']").removeClass("required");    }
                else                            {   $("div[id='" + pickerId + "']").addClass("required");       }
                setRequiredFields();
            }
            else if(curStatus.value === "Plan"){
                if(selectedUsersInfo.length > 0){  hasAssignee = true;     setPlanFunctionality();}
                else{
                    document.getElementById("notify_fd95c5b2-0d39-477c-ae26-1d62c63cca56_$TextField").value = "0";
                }
                setRequiredFields();
            }
        }
        var users = picker.GetAllUserInfo();
        if (users.length === 0) {
            var curStatus = document.getElementById("_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice");
            document.getElementById("notify_fd95c5b2-0d39-477c-ae26-1d62c63cca56_$TextField").value = "0";
            if(curStatus.value === "Do" | curStatus.value === "Check" | curStatus.value === "Ack"){
                $("div[id='" + pickerId + "']").addClass("required");       
                setRequiredFields();
            }
        } 
        else {
            hasAssignee = true;
            setPlanFunctionality();
            $("div[id='" + pickerId + "']").removeClass("required");
        }
        
    });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var pickerId = "Action_x0020_approver_33bc65c0-5a0f-436d-b0ff-b9cd73f45896_$ClientPeoplePicker";
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerId];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            isApprover();
        }
        var users = picker.GetAllUserInfo();
        if (users.length === 0) {
            console.log("there is an")
            hasApprover = false;
            isApprover();
        } 
        else {
           hasApprover = true;
           isApprover();
        }
        
    });

    $(function(){   // ActionDueDate
        $("input[id='Completion_x0020_date_8632326e-83a0-4ba5-b6c8-3c00d7ec2640_$DateTimeFieldDate']").get(0).onvaluesetfrompicker = CompleteDatePickerChanged;
        function CompleteDatePickerChanged(e) {
            console.log("Completion date has changed");
            var displayCompletionDate = document.getElementById("completionDateDisplay");
            $(displayCompletionDate).val(universalDate($(this).val()));
            $(displayCompletionDate).trigger("change");
        }
    });

    deferred.resolve();

   return deferred.promise();
}

function isAssignee(){
    var currentUser = _spPageContextInfo.userLoginName;
    var isAS = $("div[title='Action assignee']").find('.sp-peoplepicker-userSpan');
    if(isAS.length > 0){
        isAS = $(isAS).attr('sid');
        isAS = isAS.split("|")[2];
        if(isAS.toLowerCase() === currentUser.toLowerCase()){
            console.log("CURRENT USER IS THE ASSIGNEE");
          //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option").prop("disabled", true);
          //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").prop("disabled", false);
            return true;
        }
    }
    else{
      //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option").prop("disabled", false);
      //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").prop("disabled", true);
        return false;
    }
}

function isApprover(){
    var currentUser = _spPageContextInfo.userLoginName;
    var isAS = $("div[title='Action approver']").find('.sp-peoplepicker-userSpan');
    if(isAS.length > 0){
        isAS = $(isAS).attr('sid');
        isAS = isAS.split("|")[2];
        if(isAS.toLowerCase() === currentUser.toLowerCase()){
            console.log("CURRENT USER IS THE APPROVER");
          //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option").prop("disabled", true);
          //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").prop("disabled", false);
            return true;
        }
    }
    else{
      //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option").prop("disabled", false);
      //  $("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] option[value='Act']").prop("disabled", true);
        return false;
    }
}

function displayBanner(){

    var actionSectionHeader = document.getElementById('actionSectionHeader');
    var exType = document.getElementById("Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice");
    actionSectionHeader.innerHTML = "<strong>Finding</strong> for this action or activity";
    displayTheBanner();
    function displayTheBanner(){
        var headerIcon = $("div[id='headerIcon']");
        headerIcon.empty();
        headerIcon.addClass("headerIconDIV");
        var exceptionsLogo = document.createElement("img");
            exceptionsLogo.setAttribute("style", "height: 50px; padding-right: 15px; vertical-align: bottom;");
            exceptionsLogo.setAttribute("title", "Dashboard");
            exceptionsLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
            exceptionsLogo.addEventListener("click", function(e){
                e.stopPropagation();
                ////////////////////////////
                checkForRequiredFields($(this).attr("ref")).done(function(answer, target){
                    if(answer === "complete"){
                        console.log("The required fields are all present:  returning to dashboard");
                        var cURL = document.location.href;
                        cURL = cURL.split("&Source=");
                        cURL = cURL[0] + "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                        window.history.replaceState(null,null,cURL);
                        console.log("not sure why this does not fire as expexcted");
                        $("input[id='ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                    }
                    else{
                        console.log("the answer was : " + answer);
                    }
                });
            });
        headerIcon.append(exceptionsLogo);

        var headerTitle = $("div[id='headerTitle']");
        headerTitle.empty();
        headerTitle.addClass("headerTitleDIV");
        headerTitle.append("<span style='float: left;'>CAPA manager");
    //  Need to add the details for navigation back to the audit, the exception
        
        var headerSubTitle = $("div[id='headerSubTitle']");
        $(headerSubTitle).addClass("headerSubTitleDIV");
        var exceptionTitle = parentExceptionObject.Exception_x0020_title;
        var auditDisplayID = parentExceptionObject.parentAuditID;
        while(auditDisplayID.length < 4) {   auditDisplayID = "0" + auditDisplayID;    }
        var reference = parentExceptionObject.ID;
        while(reference.length < 4) {   reference = "0" + reference;    }
        
        var returnToAudit = document.createElement("img");
        returnToAudit.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
        $(returnToAudit).addClass("openLink");
        returnToAudit.setAttribute("title", "Return to audit #" + parentExceptionObject.parentAuditID);
        returnToAudit.addEventListener("click",function(e){
            e.stopPropagation();
            checkForRequiredFields($(this).attr("ref")).done(function(answer, target){
                if(answer === "complete"){
                    console.log("The requried fields are all present:  returning to exception");
                    var cURL = document.location.href;
                    cURL = cURL.split("&Source=");
                    cURL = cURL[0] + "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Audits%20and%20reviews/EditForm.aspx?ID=" + parentExceptionObject.parentAuditID;
                    window.history.replaceState(null,null,cURL);
                    $("input[id='ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                }
                else{
                    alert("Certain required fields do not have values");
                }
            });
        });
        $(headerSubTitle).append(returnToAudit);

        switch(parentAuditObject.Audit_x0020_type){
            case "Customer audit"   :   headerSubTitle.append("Customer audit #" + auditDisplayID + "  :  " + parentAuditObject.CA_Customer.Customer_x0020_name + " : " + parentAuditObject.Audit_x0020_title);
                                        break;
            case "Supplier audit"   :   headerSubTitle.append("Supplier audit #" + auditDisplayID + "  :  " + parentAuditObject.SA_Supplier.Supplier_x0020_name + " : " + parentAuditObject.Audit_x0020_title); 
                                        break;
            default                 :   headerSubTitle.append(parentAuditObject.Audit_x0020_type + "  #" + auditDisplayID + " : " + parentAuditObject.Audit_x0020_title); 
                                        break;
        }


        //  Now for teh link and the exception details
        var returnToException = document.createElement("img");
        returnToException.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
        $(returnToException).addClass("openLink");
        returnToException.setAttribute("title", "Return to finding #" + parentExceptionObject.ID);
        returnToException.setAttribute("ref", parentExceptionObject.ID);
        returnToException.addEventListener("click",function(e){
            e.stopPropagation();
            
            checkForRequiredFields($(this).attr("ref")).done(function(answer, target){
                if(answer === "complete"){
                    console.log("The requried fields are all present:  returning to exception");
                    var cURL = document.location.href;
                    cURL = cURL.split("&Source=");
                    cURL = cURL[0] + "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=" + target;
                    window.history.replaceState(null,null,cURL);
                    $("input[id='ctl00_ctl32_g_b2e9ab22_e5f9_461d_a24e_674a663f853d_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                }
                else{
                    console.log("the answer was : " + answer);
                }
            });
            
            
          
        });
        $(headerSubTitle).append(document.createElement("br"));
        $(headerSubTitle).append(returnToException);
        $(headerSubTitle).append(parentExceptionObject.Exception_x0020_type + " #" + parentExceptionObject.ID + "  :  " + parentExceptionObject.Exception_x0020_title);
        /////////////

        if($("select[id='_x0052__b5d64391-5036-4f89-a857-a7f30d5e9c9e_$DropDownChoice'] :selected").val() === "Cancelled"){
            headerSubTitle.append("<br><br><span style='color: red;'>This action has been cancelled.</span>");
        }


        var reference = parentExceptionID;
        while(reference.length < 4) {   reference = "0" + reference;    }
       /* switch(typeOfAudit){
            case "Customer audit"   :   headerSubTitle.append("Exception #" + reference);
                                        document.getElementById("auditHeaderText").innerText = "Customer audit details";
                                        break;
            case "Supplier audit"   :   headerSubTitle.append("Supplier audit #" + reference);
                                        document.getElementById("auditHeaderText").innerText = "Supplier audit details";
                                        break;
            default                 :   break;
        }
        */


    }
}

////    START       /// DOCUMENTATION : FILE UPLOAD

    function formatDocumentsSection(){
        var addFile = document.createElement("img");
            addFile.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
            addFile.setAttribute("title", "Upload a new document");
            addFile.setAttribute("id"   , "newDocumentButton");
            addFile.setAttribute("height", "20px");
            addFile.addEventListener("click", function(){
                uploadDocument();
            });          
            
        document.getElementById("actionDocumentationTopSection").innerHTML = "<input id='getFile' type='file'/><div id='addFileDIV' style='white-space: nowrap;'></div>";
        var fUp = document.getElementById("addFileDIV");
        $(fUp).empty().append(addFile);


        createDocumentTable().done(function(e){
            loadDocuments();
        });
        }

    function createDocumentTable(){
        var deferred = $.Deferred();

        var table =  "<table id='documentDisplayTable' width='100%'><thead>"    +
                        "<tr class='actionTableHeaderRow'>"                     +
                            "<th class='actionTableBullet'>Audit        </th>"  +
                            "<th class='actionTableBullet'>Finding      </th>"  +
                            "<th class='actionTableBullet'>Action       </th>"  +
                            "<th class='actionTableStandard'>Document   </th>"  +
                            "<th class='actionTableStandard'>Open       </th>"  +
                            "<th class='actionTableStandard'>Title      </th>"  +
                            "<th class='actionTableStandard'>Editor     </th>"  +
                            "<th class='actionTableStandard'>Modified   </th>"  +
                        "</tr>" +
                    "</thead>" +
                    "<tbody></tbody>" +
                    "</table>";

        var actionDocumentationBody = document.getElementById("actionDocumentationBody");
        $(actionDocumentationBody).empty().append(table);

        deferred.resolve();

        return deferred.promise();
        }

    function displayDocument(doc){
       // console.log("About to load the document DocID:" + doc.ID);
       // console.log(JSON.stringify(doc,null,4));

        var row = document.createElement("tr");
        
        var td1 = document.createElement("td");
            $(td1).addClass("documentLeft");
            var td1d = document.createElement("div");
                td1d.setAttribute("ID", "auditLink" + doc.ID);
                td1d.append(makeBullet("audit", doc.auditID));
            td1.append(td1d);
        
        var td2 = document.createElement("td");
            $(td2).addClass("documentMiddle");
            var td2d = document.createElement("div");
                td2d.setAttribute("ID", "exceptionLink" + doc.ID);
                td2d.append(makeBullet("exception", doc.exceptionID));
            td2.append(td2d);

        var td3 = document.createElement("td");
            $(td3).addClass("documentMiddle");
            var td3d = document.createElement("div");
                td3d.setAttribute("ID", "actionLink" + doc.ID);
                td3d.append(makeBullet("action", doc.actionID));
            td3.append(td3d);
        
        var td3b = document.createElement("td");
            $(td3b).addClass("documentMiddle");
            var td3bd = document.createElement("div");
                td3bd.setAttribute("ID", "documentBullet" + doc.ID);
                td3bd.append(makeBullet("document", doc.ID));
            td3b.append(td3bd);

        var td4 = document.createElement("td");
            $(td4).addClass("documentMiddle");
            var openLink = document.createElement("a");
                var appPrefix = getAppPrefix(doc.File.Name);
                openLink.setAttribute("target", "_blank");
                openLink.setAttribute("href", appPrefix 
                        + "https://airnovhcp.sharepoint.com/" + doc.File.ServerRelativeUrl);
            var openIcon = document.createElement("img");
                openIcon.setAttribute("height", "20px");
                openIcon.setAttribute("style", "padding-right: 10px;");
                openIcon.setAttribute("title", "Open the document: '" + doc.File.Name + "'");
                openIcon.setAttribute("src" , "/sites/ChangeManager/Exceptions/code/images/greenDocument.svg");
            openLink.appendChild(openIcon);
            td4.append(openLink);
        
        var td5 = document.createElement("td");
            $(td5).addClass("documentTitle");
            td5.append(document.createTextNode(doc.File.Name));

        var td6 = document.createElement("td");
            $(td6).addClass("documentStandard");
            td6.append(document.createTextNode(doc.Editor.FirstName + " " + doc.Editor.LastName));
        
        var td7 = document.createElement("td");
            $(td7).addClass("documentStandard");
            td7.append(document.createTextNode(universalDate(doc.Created)));


        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td3b);
        row.appendChild(td4);
        row.appendChild(td5);
        row.appendChild(td6);
        row.appendChild(td7);

        var tbody = document.getElementById("documentDisplayTable").getElementsByTagName('tbody')[0];
        tbody.appendChild(row);
        }

    function getAppPrefix(fName){
        var fName = fName.split('.');
        var extension = fName[fName.length - 1];
        var prefix;
        switch(extension){
            case "doc"  : 
            case "dot"  : 
            case "wbk"  :
            case "docx" :
            case "dotx" :
            case "dotm" :
            case "docb" :
            case "wll"  :
            case "wwl"  : prefix = "ms-word:ofv|u|";  break;
            case "xls"  :
            case "xlt"  :
            case "xlm"  :
            case "xlsx" :
            case "csv"  :
            case "xlsm" :
            case "xltx" :
            case "xltm" : prefix = "ms-excel:ofv|u|";   break;
            case "ppt"  :
            case "pot"  :
            case "pps"  :
            case "ppa"  :
            case "ppam" :
            case "pptx" :
            case "potx" :
            case "potm" :
            case "ppam" :
            case "ppsx" :
            case "ppsm" :
            case "sldx" :
            case "sldm" : prefix = "ms-powerpoint:ofv|u|";   break;
            default     : prefix = "";
        }
        return prefix;
        }   

    function loadDocuments(){
        var theDocs = getDocuments();
        theDocs.done(function(docs){
            for(var t=0 ; t < docs.d.results.length ; t++){
                displayDocument(docs.d.results[t]);
            }
            var documentDisplayTable = document.getElementById("documentDisplayTable");
            $(documentDisplayTable).tablesorter();
        });
        }

    function getDocuments(){
        var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CapaDocumentation')/items?$filter=actionID eq '" + actionID + "'&$expand=File,Editor&$select=*,File/Name,File/ServerRelativeUrl,Editor/FirstName,Editor/LastName";
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
                console.log("success GetByTitle('CapaDocumentation') we returned " + suc.d.results.length + " documents");
            //  console.log(JSON.stringify(suc,null,4));
            }
        });
        }

    function onError(error) {
        alert("Error on file upload " + error.responseText);
        }

    function uploadDocument(){

        var actionID    = getQuerystring("ID");
        var exceptionID = document.getElementById("parentExceptionID_472a539a-422d-4008-ada7-61ecb43bd568_$TextField");
            exceptionID = $(exceptionID).val();
        var auditID     = document.getElementById("parentAuditID_ede5b4bd-00a4-4903-8e3c-c9632e4f2e93_$TextField");
            auditID     = $(auditID).val();
            
        console.log("Inside the uploadDocument code and we have auditID:" + auditID + "  exceptionID:" + exceptionID + "  actionID:" + actionID);
        
        var folderName = "CapaDocumentation/audit" + auditID
        var checkIfEventFolderExists = doesFolderExist(folderName);
        checkIfEventFolderExists.done(function(answer){
            if(!answer.d.Exists){
                var create = createFolder("CapaDocumentation/audit" + auditID);
                create.done(function(){
                    uploadDocument();
                });
            }
            else{
                console.log("There is a CapaDocumentation/audit" + auditID + " folder");
                var checkExceptionFolderExists = doesFolderExist("CapaDocumentation/audit" + auditID + "/exception" + exceptionID);
                checkExceptionFolderExists.done(function(answer){
                    if(!answer.d.Exists){
                        var create = createFolder("CapaDocumentation/audit" + auditID + "/exception" + exceptionID);
                        create.done(function(){
                            uploadDocument();
                        });
                    }
                    else{
                        console.log("There is a CapaDocumentation/audit" + auditID + "/exception" + exceptionID + " folder");
                        var checkActionFolderExists = doesFolderExist("CapaDocumentation/audit" + auditID + "/exception" + exceptionID + "/action" + actionID);
                        checkActionFolderExists.done(function(answer){
                            if(!answer.d.Exists){
                                var create = createFolder("CapaDocumentation/audit" + auditID + "/exception" + exceptionID + "/action" + actionID);
                                create.done(function(){
                                    uploadDocument();
                                });
                            }
                            else{
                                doTheDocumentUpload(auditID, exceptionID);
                            }
                        });
                    }
                });
            }
        });

        }

    function doesFolderExist(folderName){
        var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/GetFolderByServerRelativeUrl('" + folderName +"')/Exists";
        return $.ajax({
            method: "GET",
            headers: { 
                "accept": "application/json;odata=verbose"
            },
            url: queryURL,
            error: function(err){
                console.log("Error is checking if folder " + folderName + " exisits\n" + JSON.stringify(err,null,4));
            }
        });
        }

    function doTheDocumentUpload(auditID, exceptionID){
    
        var serverRelativeUrlToFolder = "CapaDocumentation/audit" + auditID + "/exception" + exceptionID + "/action" + actionID;
        var fileInput   = $("input[id='getFile']");
        var serverUrl   = _spPageContextInfo.webAbsoluteUrl;
        var getFile = getFileBuffer();
        getFile.done(function (arrayBuffer) {
            var addFile = addFileToFolder(arrayBuffer);
            addFile.done(function (file, status, xhr) {
                var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
                getItem.done(function (listItem, status, xhr) {
                    var changeItem = updateListItem(listItem.d.__metadata);
                    changeItem.done(function (data, status, xhr) {
                        formatDocumentsSection();
                    });
                    changeItem.fail(onError);
                });
                getItem.fail(onError);
            });
            addFile.fail(onError);
        });
        getFile.fail(onError); 

        function getFileBuffer() {
            var deferred = $.Deferred();
            var reader = new FileReader();
            reader.onloadend = function (e) {
                deferred.resolve(e.target.result);
            }
            reader.onerror = function (e) {
                deferred.reject(e.target.error);
            }
            reader.readAsArrayBuffer(fileInput[0].files[0]);
            return deferred.promise();
        }

        function addFileToFolder(arrayBuffer) {
            var parts = fileInput[0].value.split('\\');
            var fileName = parts[parts.length - 1];
            var fileCollectionEndpoint = String.format(
            "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
            "/add(overwrite=true, url='{2}')",
            serverUrl, serverRelativeUrlToFolder, fileName);
            return $.ajax({
                url: fileCollectionEndpoint,
                type: "POST",
                data: arrayBuffer,
                processData: false,
                headers: {
                    "accept"            : "application/json;odata=verbose",
                    "X-RequestDigest"   : jQuery("#__REQUESTDIGEST").val()          
                },
                error: function(err){
                    console.log("Error in addFileToFolder(arrayBuffer) : " + JSON.stringify(err,null,4));
                },
                success: function(suc){
                    console.log("Success adding the file to the folder");
                }
            });
        }

        function getListItem(fileListItemUri) {
            return $.ajax({
                url: fileListItemUri,
                type: "GET",
                headers: { 
                    "accept": "application/json;odata=verbose"
                }
            });
        }

        function updateListItem(itemMetadata) {
            var body = String.format("{{'__metadata':{{'type':'{0}'}}, 'auditID':'{1}', 'exceptionID':'{2}', 'actionID' : '{3}'}}",
                itemMetadata.type, 
                auditID,
                exceptionID,
                actionID);
            return $.ajax({
                url: itemMetadata.uri,
                type: "POST",
                data: body,
                headers: {
                    "X-RequestDigest"   : $("#__REQUESTDIGEST").val(),
                    "content-type"      : "application/json;odata=verbose",
                    "IF-MATCH"          : itemMetadata.etag,
                    "X-HTTP-Method"     : "MERGE"
                },
                error: function(err){
                    console.log("Error on updateListItem() : " + JSON.stringify(err,null,4));
                }
            });
        }
        }

    function createFolder(folderName){
        var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Folders/add('" + folderName + "')";
        return $.ajax({
            url: queryURL,
            type: "POST",
            headers: { 
                "accept": "application/json;odata=verbose",
                "X-RequestDigest"   : jQuery("#__REQUESTDIGEST").val()         
            },
            error: function(err){
                console.log("Error creating folder " + folderName);
                console.log(JSON.stringify(err,null,4));
            },
            success: function(suc){
                console.log("Success creating folder [" + folderName +"]");
            }
        });
        }

    function getActionDocuments(){
        var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('CapaDocumentation')/items?$filter=actionID eq '" + actionID + "'&$expand=File&$select=*,File/Name,File/ServerRelativeUrl";
        return $.ajax({
            url: queryURL,
            type: "GET",
            headers: { Accept: "application/json;odata=verbose" },
            error: function(err){
                console.log("error getting DOCUMENTS");
                console.log(JSON.stringify(err,null,4));
            },
            success: function(suc){
                console.log("Success getting the documents for this action " + actionID);
            // console.log(JSON.stringify(suc,null,4));
            }
        });
        }
////    END         /// DOCUMENTATION : FILE UPLOAD

function makeBullet(type, linkID){
    var bullet = document.createElement("div");
    bullet.setAttribute("targetID", linkID);
    bullet.setAttribute("bulletType", type);
    switch(type){
        case "audit"    :   $(bullet).addClass("simpleLinkIcon");   bullet.append("Audit #" + linkID);      break;
        case "exception":   $(bullet).addClass("simpleLinkIcon");   bullet.append("Deviation #" + linkID);  break;
        case "action"   :                                           bullet.append("Action #" + linkID);     break; 
        case "document" :                                           bullet.append("Document #" + linkID);   break;
        default         :                                                                                   break;                                  
    }
    bullet.addEventListener("click", function(e){
        e.stopPropagation();
        var cURL = document.location.href;
        cURL = cURL.split("&Source=");
        var bulletType = $(this).attr("bulletType");
        switch(bulletType){
            case "audit"        :   cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Audits%20and%20reviews/EditForm.aspx?ID=" + $(this).attr("targetID") + "&Source=" + cURL[0];
                                    document.location.href = cURL;
                                    break;
            case "exception"    :   cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=" + $(this).attr("targetID") + "&Source=" + cURL[0];
                                    document.location.href = cURL;
                                    break;
            default             :   break;          
        }
    });
    $(bullet).addClass("genericBullet");
    return bullet;
}

////    START       UTILITY FUNCTIONS
    function universalDate(date){
        var formattedDate = "";

        if(date != null){
            var date = date.toString();
            if(date.indexOf("/") > 0){
                formattedDate = formatDate(date);
            }
            else if(date.indexOf("-") > 0){
                formattedDate = universalDate(date);
            }
            else{
                console.log("no dates found here!");
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

        function universalDate(dueDate){
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

    function showHTML(){
        document.getElementsByTagName("html")[0]     .style.visibility   = "visible";
        document.getElementById("waitingGIF")        .style.visibility   = "hidden";
        console.log("HTML visible");
    }

    function hideHTML(){
        document.getElementsByTagName("html")[0].style.visibility   = "hidden";
        document.getElementById("waitingGIF").style.visibility      = "visible";
        console.log("HTML hidden");
    }

    function getQuerystring(parameter) {
        var url = window.location.search.substring(1);
        var pairs = url.split("&");
        for (var i=0;i<pairs.length;i++) {
            var paramPairs = pairs[i].split("=");
            if (paramPairs[0] == parameter) {
                return paramPairs[1];
            }
        }
    }

    //getListContents();
    function getListContents(){
        var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items(177)";
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
                console.log("success with ther test getListContents");
                console.log(JSON.stringify(suc,null,4));
            }
        });
    }
////    END         UTILITY FUNCTIONS
</script>



























