<script type="text/javascript"                          src  = "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">                    </script>
<link   type="text/css"         rel="stylesheet"        href = "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-ui.min.css"                       />
<link   type="text/css"         rel="stylesheet"        href = "/sites/ChangeManager/Exceptions/code/ExceptionCSS.css"                                          />
<script type="text/javascript"                          src  = "/sites/ChangeManager/Exceptions/code/opensourceScripts/messagebox.min.js">                      </script>
<script type="text/javascript"                          src  = "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.cookie.min.js">                   </script>
<script type="text/javascript"                          src  = "/_layouts/15/clientpeoplepicker.js">                                                            </script>
<link   type="text/css"         rel="stylesheet"        href = "/sites/ChangeManager/Exceptions/code/opensourceScripts/messagebox.min.css"                      />
<script type="text/javascript"                          src  = "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.simple-gallery.js">               </script>
<script type="text/javascript"                          src  = "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.tablesorter.combined.min.js">     </script>
<link   type="text/css"         rel="stylesheet"        href = "/sites/ChangeManager/Exceptions/code/opensourceScripts/Roboto.css"                              />

<script>
'use strict';
//  Variables
    var isQMKeyholder;
    var exceptionType;
    var typeOfAudit;
    var customer;
    var supplier;
    var parentAuditID;
    var exceptionID;
    var restricted;
    var auditTitle;
    var comboList;
    var availableLocations;
    var availableDepartments;
//
   
$(document).ready(function () {

    console.log("This page is running the latest script for Exceptions.\nPUBLISHED 9th June 2023");

 //   $("input[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbltop_RightRptControls_ctl02_ctl00_diidIOGoBack']").closest('table').hide();
 //   $("input[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").hide();

    exceptionType   = $("select[id='Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice']").val();
    parentAuditID   = document.getElementById("parentAuditID_0079efa2-54c0-4c49-b4fc-5bb8b505152e_$TextField").value;
    exceptionID     = getQuerystring("ID"); 
    hideHTML();

    window.addEventListener('popstate', function(event) {
    // Get the current state object from the event
    var state = event.state;

    // Perform any additional operations you need, based on the current state object
    console.log('New state: ' + JSON.stringify(state));
    });

    var populateAuditDetails = getParentAudit();
        populateAuditDetails.done(function(){
            var keyholderCheck = isMemberOfGroup("Quality Managers");
                keyholderCheck.done(function(answer){
                    isQMKeyholder = answer;
                    if(restricted && !isQMKeyholder){
                        document.location.href = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/SitePages/accessdenied.aspx";
                    }
                    else{
                        displaySettings();
                        addEventListeners();
                        formatExceptionDetails();
                        formatDocumentsSection();
                        formatImagesSection();
                        formatActions();
                        showHTML();
                    }
                });
        });
});

function setRequiredFields(){
    var requiredFields  = new Array();
    var requiredMulti   = new Array();
    var requiredDrop    = new Array();

    //  Set universally required fields
        //  Required Text Inputs
            requiredFields.push("Exception_x0020_title_ef707ff7-a1eb-4a1c-96f6-642503897365_$TextField");
            requiredFields.push("Exception_x0020_description_f9dc25ed-e8c8-4f3d-9ee9-3cc52006c13d_$TextField");
            requiredFields.push("Exception_x0020_status_41f440ac-a496-41d1-8375-097a6c350528_$DropDownChoice");
            requiredFields.push("Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice");

        
        //  Required Multiselect fields
            requiredMulti.push("AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable");

    //

    //  Switch based on AuditType
    //


    //  Process requiredFields
        for(var t=0 ; t < requiredFields.length ; t++){
            var element = document.getElementById(requiredFields[t]);
            if($(element).val().trim() === ""){
                $(element).addClass("required");
            }
            else{
                $(element).removeClass("required");
            }
            element.removeEventListener("change", setRequiredFields);
            element.addEventListener("change", setRequiredFields);
        }

    //  Process requiredMulti
        //  This code expects only the Location to be included in the required multi array.
        //  A slicker so.ution is not required at this stage of development.  If additional required multis are used in the future then this code wil have to be updated.
        for(var r=0 ; r < requiredMulti.length ; r++){
            var table   = document.getElementById(requiredMulti[r]);
            var _locations   = $("input[id^='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceOption_']");
            var _hasLocation = false;
            for (var i = 0; i < _locations.length; i++) {
                
                _locations[i].addEventListener("change", setRequiredFields);
                
                var locationN = $(_locations[i]).next("label").text();
                var depsDiv = document.getElementById("locDDiv" + locationN);
                var deps = $("input[id^='deptRef_" + locationN + "_']");
                if (_locations[i].checked) {
                    _hasLocation = true;
                    var _hasDepts = false;
                    for(var t=0 ; t < deps.length ; t++){
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
                        deps[t].addEventListener("change", setRequiredFields);
                        deps[t].checked = false;
                        $(depsDiv).removeClass("required");
                    }
                }

                if(_hasLocation){
                    $(table).removeClass("required");
                }
                else{
                    $(table).addClass("required");
                }
        }
    }
}


function getParentAudit(){
    var deferred = $.Deferred();
    
    var auditDetails = getAuditDetails();
    auditDetails.done(function(details){

        typeOfAudit = details.d.Audit_x0020_type;
        if(details.d.CA_Customer != null){
            customer    = details.d.CA_Customer.Customer_x0020_name;
        }
        else{
            customer = "";
        }
        if(details.d.SA_Supplier != null){
            supplier    = details.d.SA_Supplier.Supplier_x0020_name;
        }
        else{
            supplier = "";
        }
        restricted  = details.d.auditRestricted;
        auditTitle  = details.d.Audit_x0020_type;

        availableLocations = details.d.AuditLocations.results;
        availableDepartments = details.d.CAPA_DeptListId.results;

        deferred.resolve();
    });

    return deferred.promise();
}

function addEventListeners(){

    console.log("adding the event listeners");
    
    var exType = document.getElementById("Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice");
        exType.addEventListener("change", function(e){
            e.stopPropagation();
            updateHeader();
        });

    var exClass = document.getElementById("Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice");
        exClass.addEventListener("change", function(e){
            e.stopPropagation();
            updateHeader();
        });

    var exTitle = document.getElementById("Exception_x0020_title_ef707ff7-a1eb-4a1c-96f6-642503897365_$TextField");
        exTitle.addEventListener("change", function(e){
            e.stopPropagation();
            displayBanner();
        });

    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var pickerId = "ExceptionLead_6717c41e-57ae-4286-a894-4954c66344f7_$ClientPeoplePicker";
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerId];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            console.log("The deviation lead has been modified");
            if(selectedUsersInfo.length > 0){   $("div[id='" + pickerId + "']").removeClass("required");   console.log("we have a name");}
            else                            {   $("div[id='" + pickerId + "']").addClass("required");      }
            setRequiredFields();
        }
        var users = picker.GetAllUserInfo();
        if (users.length === 0) {
            $("div[id='" + pickerId + "']").addClass("required");
        } else {
            $("div[id='" + pickerId + "']").removeClass("required");
        }
    });

    $(function(){   
        $("input[id='Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDate']").get(0).onvaluesetfrompicker = DatePickerChanged;
        function DatePickerChanged(e) {
            console.log("the date did change but the listener failed");
            var newRaised = document.getElementById("newRaised");
            console.log("The newRaised field is of type " + typeof newRiased);
            $(newRaised).empty().append(universalDate($("input[id='Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDate']").val()));            
        }
    });
}

function updateHeader(){
    var hText = document.getElementById("Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice").value;
    exceptionType = hText;
    var cla     = document.getElementById("Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice");
    var clav    = $(cla).val();
    var exSecHeader = document.getElementById("exceptionSectionHeader");
    var rootCau = document.getElementById("rootCauseAnalysisSection");
    
    var exBg = document.getElementById("exceptionHeaderBg");
    if(     hText === "Deviation"   && clav === "minor")    {   $(exBg).addClass("sectionHeaderDeviation-Minor");     
                                                                exSecHeader.innerHTML = "Deviation - minor";    
                                                                $(cla).closest("tr").show().next("tr").show();                      
                                                                $(rootCau).closest("tr").show().next("tr").show().next("tr").show().next("tr").show().next("tr").show();
                                                            }
    else if(hText === "Deviation"   && clav === "Major")    {   $(exBg).addClass("sectionHeaderDeviation-Major");     
                                                                exSecHeader.innerHTML = "Deviation - Major";    
                                                                $(cla).closest("tr").show().next("tr").show();                      
                                                                $(rootCau).closest("tr").show().next("tr").show().next("tr").show().next("tr").show().next("tr").show();
                                                            }
    else if(hText === "Deviation"   && clav === "Critical") {   $(exBg).addClass("sectionHeaderDeviation-Critical");
                                                                exSecHeader.innerHTML = "Deviation - Critical";    
                                                                $(cla).closest("tr").show().next("tr").show();
                                                                $(rootCau).closest("tr").show().next("tr").show().next("tr").show().next("tr").show().next("tr").show();
                                                            }
    else if(hText === "Deviation")                          {   $(exBg).addClass("sectionHeaderDeviation");           
                                                                exSecHeader.innerHTML = "Deviation";                
                                                                $(cla).closest("tr").show().next("tr").show();                      
                                                                $(rootCau).closest("tr").show().next("tr").show().next("tr").show().next("tr").show().next("tr").show();
                                                            }
    else if(hText === "Recommendation")                     {   $(exBg).addClass("sectionHeaderRecommendation");      
                                                                exSecHeader.innerHTML = "Recommendation";       
                                                                $(cla).closest("tr").hide().next("tr").hide();                      
                                                                $(rootCau).closest("tr").hide().next("tr").hide().next("tr").hide().next("tr").hide().next("tr").hide();                                   
                                                                $(cla).val("");
                                                            }
    displayBanner();
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

function applyExceptionLocks(){

    console.log("running applyExceptionLocks");
  
    var exceptionDetailsPadlocked   = document.getElementById("exceptionDetailsPadlocked_60acee6e-eb78-4ff7-9ff0-635f869c6065_$BooleanField");
        exceptionDetailsPadlocked.focus();

    var exceptionDetailsSpan        = document.getElementById("exceptionDetailsPadlock");
    var exceptionDetailsPadlock     = document.createElement("img");
        if(exceptionDetailsPadlocked.checked)   {   exceptionDetailsPadlock         .setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/lockedRed.svg");   
                                                lockDetails();  }
        else                                {   exceptionDetailsPadlock         .setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/unlockedGreen.svg");
                                                unlockDetails();}
        exceptionDetailsPadlock         .setAttribute("style", "height : 20px; padding-right: 5px;");
        $(exceptionDetailsPadlock)      .addClass("rolloverImage");
        if(isQMKeyholder){
            exceptionDetailsPadlock         .addEventListener("click", function(e){
                e.stopPropagation();
                if(document.getElementById("exceptionDetailsPadlocked_60acee6e-eb78-4ff7-9ff0-635f869c6065_$BooleanField").checked){
                    document.getElementById("exceptionDetailsPadlocked_60acee6e-eb78-4ff7-9ff0-635f869c6065_$BooleanField").checked = false;
                }
                else{
                    document.getElementById("exceptionDetailsPadlocked_60acee6e-eb78-4ff7-9ff0-635f869c6065_$BooleanField").checked = true;
                }
                applyExceptionLocks();
            });
        }
        $(exceptionDetailsSpan).empty().append(exceptionDetailsPadlock);
}

function lockDetails(){
    console.log("Locking the details");
    var title = document.getElementById("Exception_x0020_title_ef707ff7-a1eb-4a1c-96f6-642503897365_$TextField");
        title.setAttribute("readonly", true);
        title.setAttribute("style", "pointer-events: none;");

    var type = document.getElementById("Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice");
        type.setAttribute("readonly", true);
        type.setAttribute("style", "pointer-events: none;");
    //      
    console.log("lockLeads() called");
    var peoplePickerDiv = $("[id^='ExceptionLead_6717c41e-57ae-4286-a894-4954c66344f7_']");
    var peoplePickerTopId = peoplePickerDiv.attr('id');
    var instances = SPClientPeoplePicker.SPClientPeoplePickerDict;
    var peoplePicker = instances[peoplePickerTopId];
    peoplePicker.SetEnabledState(false);
    peoplePickerDiv.find('.sp-peoplepicker-delImage').hide();
    var editorInput = peoplePickerDiv.find('.sp-peoplepicker-editorInput');
    editorInput.attr('contenteditable', false);
    peoplePickerDiv.on('click', function(e) {
        e.stopPropagation();
    });

    console.log("lockShareholders() called");
    var peoplePicker1Div = $("[id^='ExceptionStakeholders_fcd9e172-983a-4e3f-848a-01e72d1fb526_']");
    var peoplePicker1TopId = peoplePicker1Div.attr('id');
    var instances1 = SPClientPeoplePicker.SPClientPeoplePickerDict;
    var peoplePicker1 = instances1[peoplePicker1TopId];
    peoplePicker1.SetEnabledState(false);
    peoplePicker1Div.find('.sp-peoplepicker-delImage').hide();
    var editorInput1 = peoplePicker1Div.find('.sp-peoplepicker-editorInput');
    editorInput1.attr('contenteditable', false);
    peoplePicker1Div.on('click', function(e) {
        e.stopPropagation();
    });
    //  

    /*
    var raised = document.getElementById("Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDate");
        raised.setAttribute("readonly", true);
        raised.setAttribute("style", "pointer-events: none;");
    var exRaised = document.getElementById("Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDateDatePickerImage");
        exRaised.setAttribute("readonly", true);
        $(exRaised).closest("a").attr("style", "pointer-events: none;"); 
    */

    var status = document.getElementById("Exception_x0020_status_41f440ac-a496-41d1-8375-097a6c350528_$DropDownChoice");
        status.setAttribute("readonly", true);
        status.setAttribute("style", "pointer-events: none;");

    var classi = document.getElementById("Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice")
        classi.setAttribute("readonly", true);
        classi.setAttribute("style", "pointer-events: none;");

    var description = document.getElementById("Exception_x0020_description_f9dc25ed-e8c8-4f3d-9ee9-3cc52006c13d_$TextField");
        description.setAttribute("readonly", true);
        description.setAttribute("style", "pointer-events: none;");

    var locate = document.getElementById("Exception_x0020_specific_x0020_l_c5a4d63d-78d7-4bf8-85e7-caaa443b03e3_$TextField");
        locate.setAttribute("readonly", true);
        locate.setAttribute("style", "pointer-events: none;");
    
    console.log("locking departments");
    var depaRtments = $("div[id^='locDDiv']");
    console.log("There are " + depaRtments.length + " department Divs to process");
    depaRtments.attr("readonly", true);
    depaRtments.attr("style", "pointer-events: none;");
    console.log("Departmetns should be locked");
}

function unlockDetails(){
    console.log("unlocking the details");
    
    var title = document.getElementById("Exception_x0020_title_ef707ff7-a1eb-4a1c-96f6-642503897365_$TextField");
        title.removeAttribute("readonly");
        title.removeAttribute("style");

    var type = document.getElementById("Exception_x0020_type_15b95c50-6588-49e7-a531-c5b445c9bca9_$DropDownChoice");
        type.removeAttribute("readonly", true);
        type.removeAttribute("style");
    
    ////////////////////    PeoplePickers
    console.log("unlockApprover() called");
    var peoplePicker1Div = $("[id^='ExceptionLead_6717c41e-57ae-4286-a894-4954c66344f7_']");
    var peoplePicker1TopId = peoplePicker1Div.attr('id');
    var instances1 = SPClientPeoplePicker.SPClientPeoplePickerDict;
    var peoplePicker1 = instances1[peoplePicker1TopId];
    peoplePicker1.SetEnabledState(true);
    peoplePicker1Div.find('.sp-peoplepicker-delImage').show();
    var editorInput1 = peoplePicker1Div.find('.sp-peoplepicker-editorInput');
    editorInput1.attr('contenteditable', true);
    peoplePicker1Div.off('click');
    
    ////////////////////    PeoplePickers
    console.log("unlockApprover() called");
    var peoplePickerDiv = $("[id^='ExceptionStakeholders_fcd9e172-983a-4e3f-848a-01e72d1fb526_']");
    var peoplePickerTopId = peoplePickerDiv.attr('id');
    var instances = SPClientPeoplePicker.SPClientPeoplePickerDict;
    var peoplePicker = instances[peoplePickerTopId];
    peoplePicker.SetEnabledState(true);
    peoplePickerDiv.find('.sp-peoplepicker-delImage').show();
    var editorInput = peoplePickerDiv.find('.sp-peoplepicker-editorInput');
    editorInput.attr('contenteditable', true);
    peoplePickerDiv.off('click');
    //////


    /*
    var raised = document.getElementById("Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDate");
        raised.removeAttribute("readonly", true);
        raised.removeAttribute("style");
    var exRaised = document.getElementById("Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDateDatePickerImage");
        exRaised.removeAttribute("readonly");
        $(exRaised).closest("a").attr("style", ""); 
    */

    var status = document.getElementById("Exception_x0020_status_41f440ac-a496-41d1-8375-097a6c350528_$DropDownChoice");
        status.removeAttribute("readonly");
        status.removeAttribute("style");

    var classi = document.getElementById("Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice")
        classi.removeAttribute("readonly");
        classi.removeAttribute("style");

    var description = document.getElementById("Exception_x0020_description_f9dc25ed-e8c8-4f3d-9ee9-3cc52006c13d_$TextField");
        description.removeAttribute("readonly");
        description.removeAttribute("style");

    var locate = document.getElementById("Exception_x0020_specific_x0020_l_c5a4d63d-78d7-4bf8-85e7-caaa443b03e3_$TextField");
        locate.removeAttribute("readonly");
        locate.removeAttribute("style");

    var departments = $("div[id^='locDDiv']");
    departments.attr("readonly", false);
    departments.attr("style", "");
}

function displaySettings(){

    var deferred = $.Deferred();

    $("table[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbl']").closest('table').hide();

    document.getElementById("MSOZoneCell_WebPartctl00_ctl32_g_a0e6bc67_a8f8_4d7e_b962_c000ee8add80").style.display      = "none";
    $("div[id='s4-ribbonrow']")     .attr("style", "display: none; height: 0px;");
    $("div[id='s4-titlerow']")      .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaBox']")     .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaRow']")     .attr("style", "display: none; height: 0px;");
    $("div[id='MSOZoneCell_WebPartWPQ4']")     .attr("style", "display: none; height: 0px;");
    $("div[id='MSOZoneCell_WebPartWPQ5']")     .attr("style", "display: none; height: 0px;");
    
    document.title = "CAPA : Finding #" + getQuerystring("ID") + " : Au#" + parentAuditID;

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/code/images/capaLogo.png';
    document.getElementsByTagName('head')[0].appendChild(link);

   $("textarea[id='rootCauseAnalysis_c0840eb0-a18f-48b1-a265-82ac0402f479_$TextField']").removeAttr("cols").addClass("textarea100");

    $("span[id='ctl00_ctl32_g_c2a253eb_3dce_4f28_ab5c_f8b3bea23b1c_ctl00_toolBarTbl_RptControls_ctl00_ctl00_ctl02']").closest("table").hide();

   // $("input[id='Exception_x0020_raised_x0020_on_d7678c61-9585-48f0-a6a5-04be38501416_$DateTimeFieldDate']").closest("tr").hide();
    
    var exceptionSectionHeader = document.getElementById('exceptionSectionHeader');
    exceptionSectionHeader.innerHTML = exceptionType;

    //  If the current user is a keyholder then archiveException
    if(isQMKeyholder){
        
        hasActiveActions().done(function(answer){

            if(answer === "hasActiveActions"){
                var bin = document.createElement("img");
                bin.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/trash.svg");
                $(bin).addClass("binClassHasActive");
                bin.setAttribute("title", "Finding has active Actions and cannot be deleted.");
                var binHolder = document.getElementById("archiveException");
                $(binHolder).empty().append(bin);
            }
            else{
                var bin = document.createElement("img");
                bin.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/trash.svg");
                $(bin).addClass("binClass");
                bin.setAttribute("title", "Delete this Finding.");  
                bin.addEventListener("click", function(e){
                    e.stopPropagation();
                    if(confirm("This will remove the Finding and its associated actions.\n\nDo you wish to continue?")){
                        var findingID = getQuerystring("ID");
                        removeFinding(findingID);
                        removeActions(findingID).done(function(d){
                        document.getElementById("AUDITRETURNBUTTON").click();
                        });
                    }
                });
            
                var binHolder = document.getElementById("archiveException");

                $(binHolder).empty().append(bin);
            }
        });     
        
    }

    //  Swap out the type of the status report
    var statusReportType = typeOfAudit;
    if(statusReportType != "customer" && statusReportType != "supplier"){
        statusReportType = "filtered";
    }
    $("span[id='typeOfStatusReport']").html(statusReportType);
    
      
    displayBanner().done(function(){
        deferred.resolve();
    });

    return deferred.promise();
}

function removeFinding(findingID){
    document.getElementById("parentAuditID_0079efa2-54c0-4c49-b4fc-5bb8b505152e_$TextField").value = "ARCHIVE" + parentAuditID;
    
}

function removeActions(findingID){
    var deferred = $.Deferred();

    getActions(findingID).done(function(theActions){
        updateActions(theActions);
        function updateActions(theActions){
            if(theActions.d.results.length > 0){
                var poppedAction = theActions.d.results.pop();
                console.log("We have an action to update " + poppedAction);
                updateActions(theActions);
            }
            else{
                deferred.resolve();
            }
        }
    });

    return deferred.promise();
}


function hasActiveActions(){
    var deferred = $.Deferred();

    getActiveActions(getQuerystring("ID")).done(function(acts){
        if(acts.d.results.length > 0){
            deferred.resolve("hasActiveActions");
        }
        else{
            deferred.resolve("hasNoActiveActions");
        }
    });

    
    return deferred.promise();
}

function displayBanner(){

    var deferred = $.Deferred();

    var headerIcon = $("div[id='headerIcon']");
    headerIcon.empty();
    headerIcon.addClass("headerIconDIV");
    var exceptionsLogo = document.createElement("img");
        exceptionsLogo.setAttribute("style", "height: 50px; padding-right: 15px; vertical-align: bottom;");
        $(exceptionsLogo).addClass("rolloverImage");
        exceptionsLogo.setAttribute("title", "CAPA manager dashboard");
        exceptionsLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
        exceptionsLogo.addEventListener("click", function(e){
            e.stopPropagation();
            checkForRequiredFields("no target").done(function(answer){
                if(answer === "complete"){
                    var cURL = document.location.href;
                    cURL = cURL.split("&Source=")[0];
                    cURL = cURL + "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
                    var newState = { data: 'redirect to dashboard' };
                    window.history.replaceState(newState,null,cURL);
                    console.log("windows history updated");
                    $("input[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                }
            });
        });
    headerIcon.append(exceptionsLogo);
    
    var headerTitle = $("div[id='headerTitle']");
        headerTitle.empty();
        headerTitle.addClass("headerTitleDIV");
        headerTitle.append("CAPA manager");

    var headerSubTitle = $("div[id='headerSubTitle']");
        headerSubTitle.empty();
        headerSubTitle.addClass("headerSubTitleDIV");
        var exceptionTitle = $("input[id='Exception_x0020_title_ef707ff7-a1eb-4a1c-96f6-642503897365_$TextField']").val();
        var auditDisplayID = parentAuditID;
        while(auditDisplayID.length < 4) {   auditDisplayID = "0" + auditDisplayID;    }
        var reference = exceptionID;
        while(reference.length < 4) {   reference = "0" + reference;    }
        
        var returnToAudit = document.createElement("img");
        returnToAudit.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
        $(returnToAudit).addClass("openLink");
        returnToAudit.setAttribute("title", "Return to audit #" + parentAuditID);
        returnToAudit.setAttribute("ID", "AUDITRETURNBUTTON");
        returnToAudit.addEventListener("click",function(e){
            e.stopPropagation();
            
             checkForRequiredFields("no target").done(function(answer){
                if(answer === "complete"){
                    var cURL = document.location.href;
                    cURL = cURL.split("&Source=")[0];
                    cURL = cURL + "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Audits%20and%20reviews/EditForm.aspx?ID=" + parentAuditID;
                    var newState = { data: 'redirect to dashboard' };
                    window.history.replaceState(newState,null,cURL);
                   $("input[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                }
            });
        });
        $(headerSubTitle).append(returnToAudit);

        switch(typeOfAudit){
            case "Customer audit"   :   headerSubTitle.append("Customer audit #" + auditDisplayID + "  :  " + customer + " : " + auditTitle + "<br>" + exceptionType + " #" + reference + "  :  " + exceptionTitle);
                                        break;

            case "Supplier audit"   :   headerSubTitle.append("Supplier audit #" + auditDisplayID + "  :  " + supplier + " : " + auditTitle + "<br>" + exceptionType + " #" + reference + "  :  " + exceptionTitle);
                                        break;

            default                 :   headerSubTitle.append(typeOfAudit + "  #" + auditDisplayID + " : " + auditTitle + "<br>" + exceptionType + " #" + reference + "  :  " + exceptionTitle);
                                        break;
        }

        deferred.resolve();

        return deferred.promise();
}

//  START Locations and departments
    function onlyDisplayParentActiveLocations(){
        var deferred = $.Deferred();

        var locationOptions = $("label[for^='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceOption']");
        if(locationOptions === null){
            deferred.resolve();
        }
        for(var d=0 ; d < locationOptions.length ; d++){
            var thisIsToBeHidden = true;
            for(var e=0 ; e < availableLocations.length ; e++)  {
                if($(locationOptions[d]).text() === availableLocations[e]){
                    thisIsToBeHidden = false;
                }
            }
            if(thisIsToBeHidden === true){
                $(locationOptions[d]).closest("tr").hide();
            }
            if((d+1) === locationOptions.length){
                deferred.resolve();
            }
        }

        return deferred.promise();
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
            //    console.log("success with getDepartments.  THe query returned " + suc.d.results.length + " departments");
            // console.log(JSON.stringify(suc,null,4));
            }
        });
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
                    reworkDepartments();
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
                            $(deptCheckbox).prop("checked", false);
                            deptCheckbox.setAttribute("style", "margin-left: 30px; margin-right: 5px;");
                            deptCheckbox.setAttribute("id", "deptRef_" + locationName + "_" + comboList[t][2]);
                            deptCheckbox.setAttribute("departmentid" , comboList[t][2]);
                            deptCheckbox.setAttribute("departmentName", comboList[t][1]);
                            deptCheckbox.setAttribute("location", locationName);
                            deptCheckbox.addEventListener("change", function(e){
                                e.stopPropagation();

                                if(this.checked){
                                    var candidates = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_SelectCandidate").options;
                                    for(var t=0 ; t < candidates.length ; t++){
                                        if(candidates[t].value === $(this).attr("departmentid")){
                                            candidates[t].selected = true;
                                        }
                                        else{
                                            candidates[t].selected = false;
                                        }
                                    }

                                    var addButton = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_AddButton");
                                    addButton.disabled = false;
                                    addButton.click();

                                    deselectDeparmentOptions();
                                }
                                else{
                                    var results = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_SelectResult").options;
                                    for(var t=0 ; t < results.length ; t++){
                                        if(results[t].value === $(this).attr("departmentid")){
                                            results[t].selected = true;
                                        }
                                        else{
                                            results[t].selected = false;
                                        }
                                    }

                                    var removeButton = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_RemoveButton");
                                    removeButton.disabled = false;
                                    removeButton.click();
                                    $("input[id='CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_RemoveButton']").click();

                                    deselectDeparmentOptions();
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
        var candidates = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_SelectCandidate").options;
        for(var t=0 ; t < candidates.length ; t++){
            candidates[t].selected = false;
        }

        //  Deselect all results
        var results = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_SelectResult").options;
        for(var t=0 ; t < results.length ; t++){
            results[t].selected = false;
        }
    }

    function reworkDepartments(){

        deselectDeparmentOptions();

        var allLocations = $("input[id^='AuditLocations_09313']");
        for(var f=0 ; f < allLocations.length ; f++){

            if(allLocations[f].checked){
                var assDiv = document.getElementById("locDepDiv" + $(allLocations[f]).attr("ID"));
                $(assDiv).removeClass().addClass("showDepartments");
            }
            else{
                var assDiv = document.getElementById("locDepDiv" + $(allLocations[f]).attr("ID"));
                $(assDiv).removeClass().addClass("hideDepartments");
            }
        }
    }

    function highlightSelectedDepartments(){
        var deferred = $.Deferred();

        var selectedDeptMulti = $("input[id='CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_MultiLookup']");
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
//  END Locations and departments

function formatExceptionDetails(){
    if(!isQMKeyholder){
        $("select[id='Exception_x0020_status_41f440ac-a496-41d1-8375-097a6c350528_$DropDownChoice'] option[value='rejected']").hide();
    }

    switch(typeOfAudit){
        case "Customer audit"   :   break;

        case "Supplier audit"   :   $("select[id='Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice'] option[value='Critical']").hide();
                                    break;

        default                 :   $("select[id='Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice'] option[value='Critical']").hide();
                                    break;
    }

    switch(exceptionType){
        case "Deviation"        :   $("select[id='Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice']").closest("tr").show().next("tr").show();
                                    var rootCauseSection = document.getElementById("rootCauseAnalysisSection");
                                    $(rootCauseSection).show().next("tr").show();
                                    var rootCauseIconSpan   = document.getElementById("rootCauseIconSpan");
                                        $(rootCauseIconSpan).empty();
                                    var rootCauseIcon = document.createElement("img");
                                        rootCauseIcon.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/rootCause.svg");
                                        rootCauseIcon.setAttribute("style", "height : 15px; padding-right: 5px;");
                                        $(rootCauseIconSpan).append(rootCauseIcon);
                                    break;

        case "Recommendation"   :   $("select[id='Exception_x0020_classification_0682ed7f-fdd4-49ad-971c-90baf2365900_$DropDownChoice']").val("").closest("tr").hide().next("tr").hide();
                                    var rootCauseSection = document.getElementById("rootCauseAnalysisSection");
                                    $(rootCauseSection).hide().next("tr").hide();
                                    break;
    }

     prepareLocationsAndDepartments().done(function(e){
        onlyDisplayParentActiveLocations().done(function(){
             highlightSelectedDepartments().done(function(){
                 applyExceptionLocks();
                 setRequiredFields();
             });
        });
    });

    updateHeader();
}

function showHTML(){
    document.getElementsByTagName("html")[0]     .style.visibility   = "visible";
    document.getElementById("waitingGIF")        .style.visibility   = "hidden";
}

function hideHTML(){
    document.getElementsByTagName("html")[0].style.visibility   = "hidden";
    document.getElementById("waitingGIF").style.visibility      = "visible";
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

//  START   Images

    function formatImagesSection(){

        exceptionImageUpload();
        displayExceptionImages();
    }

    function displayExceptionImages(){
        $("div[id='exceptionGallery']").remove();

        //  create the gallery
        var ga = document.createElement("div");
            ga.setAttribute("id", "exceptionGallery");
            ga.setAttribute("data-gallery", "simple");
        $("div[id='exceptionImageDisplay']").empty().append(ga);
        $.fn.gallery.defaults.loop = false;
        $("div[id='exceptionGallery']").append("<nav id='navHolder'></nav>");
        var evDetImages = getExceptionImages(exceptionID);
        evDetImages.done(function(imgs){
            if(imgs.d.results.length === 0){
                var blank = document.createElement("img");
                    blank.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/pictureFrame.svg");
                    blank.setAttribute("style", "width: 300px;"); // was 350px;
                    $(blank).removeClass();
                $("div[id='exceptionGallery']").empty().append(blank);
            }
            else{
                for(var i=0 ; i < imgs.d.results.length ; i++){
                    var im = document.createElement('a');
                        im.setAttribute("href", "#image" + i);
                        var th = document.createElement('img');
                            th.setAttribute("style" , "max-height: 50px; padding: 4px;");
                            th.setAttribute("src" , imgs.d.results[i].File.ServerRelativeUrl);
                        im.appendChild(th);
                    $("#navHolder").append(im);
                }
                for(var i=0 ; i < imgs.d.results.length ; i++){
                    var fig = document.createElement('figure');
                        fig.setAttribute("id", "image" + i);
                        var figim = document.createElement('img');
                            figim.setAttribute("src", imgs.d.results[i].File.ServerRelativeUrl);
                            figim.setAttribute("style", "width: 400px;");
                            var fileName = imgs.d.results[i].File.ServerRelativeUrl.split("/");
                            fileName = fileName[fileName.length-1].split(".")[0];
                            figim.setAttribute("title", fileName);
                        fig.appendChild(figim);
                    $("div[id='exceptionGallery']").append(fig);
                }
                $("div[id='exceptionGallery']").gallery();
            }
        });
    }

    function getExceptionImages(exceptionID){
        var queryURL = _spPageContextInfo.webAbsoluteUrl 
                        + "/_api/web/lists/GetByTitle('CapaDocumentation')/items?$filter=exceptionID eq '" + exceptionID + "'&$expand=File&$select=*,File/Name,File/ServerRelativeUrl";
        return $.ajax({
            url: queryURL,
            type: "GET",
            headers: { Accept: "application/json;odata=verbose" },
            error: function(err){
                console.log("error getting exceptionImages");
                console.log(JSON.stringify(err,null,4));
            },
            success: function(suc){
                //console.log("Sucessfully retrieved " + suc.d.results.length + " images where exceptionID eq  " + exceptionID);
                // console.log(JSON.stringify(suc,null,4));
            }
        });
    }

    function exceptionImageUpload(){

        var imageUpload = $("div[id='exceptionImageUpload']");
        imageUpload.empty();

        imageUpload.append(document.createElement("br"));

        var fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("id", "uploadExceptionImage");
            fileInput.setAttribute("title", "Choose an image to add to Event details");
            fileInput.setAttribute("style", "border-radius: 5px; padding-right: 10px;");
        imageUpload.append(fileInput);

        var uploadImage = document.createElement("input");
            uploadImage.setAttribute("type", "button");
            uploadImage.setAttribute("value", "Upload image");
            uploadImage.setAttribute("style", "padding-left: 10px; margin-bottom: 20px;");
            uploadImage.addEventListener("click", function(e){
                e.stopPropagation();
                uploadDetailsImage();
            });
        imageUpload.append(uploadImage);

        imageUpload.append(document.createElement("br"));
    }

    function uploadDetailsImage(){
        var folderName = "CapaDocumentation/audit" + parentAuditID
        var checkIfEventFolderExists = doesFolderExist(folderName);
        checkIfEventFolderExists.done(function(answer){
            if(!answer.d.Exists){
                var create = createFolder("CapaDocumentation/audit" + parentAuditID);
                create.done(function(){
                    uploadDetailsImage();
                });
            }
            else{
                var checkIfFolderExists = doesFolderExist("CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID);
                checkIfFolderExists.done(function(answer){
                    if(!answer.d.Exists){
                        var create = createFolder("CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID);
                        create.done(function(){
                            uploadDetailsImage();
                        });
                    }
                    else{
                        ///
                        var checkIfFolderExists2 = doesFolderExist("CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID + "/exceptionImages");
                        checkIfFolderExists2.done(function(answer){
                            if(!answer.d.Exists){
                                var create = createFolder("CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID + "/exceptionImages");
                                create.done(function(){
                                    uploadDetailsImage();
                                });
                            }
                            else{
                                doTheImageUpload();
                            }
                        });
                        ///
                    }
                });
            }
        });

    }

    function doTheImageUpload(){
        var serverRelativeUrlToFolder = "CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID + "/exceptionImages";
        var fileInput   = $("input[id='uploadExceptionImage']");
        var serverUrl   = _spPageContextInfo.webAbsoluteUrl;
        var getFile = getFileBuffer();
        getFile.done(function (arrayBuffer) {
            var addFile = addFileToFolder(arrayBuffer);
            addFile.done(function (file, status, xhr) {
                var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
                getItem.done(function (listItem, status, xhr) {
                    var changeItem = updateListItem(listItem.d.__metadata);
                    changeItem.done(function (data, status, xhr) {
                        formatImagesSection();
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
            var body = String.format("{{'__metadata':{{'type':'{0}'}}, 'auditID':'{1}', 'exceptionID':'{2}'}}",
                itemMetadata.type, 
                parentAuditID,
                exceptionID);
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

//  END Images

function getAuditDetails(){
    var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Audits and reviews')/items(" + parentAuditID + ")?$expand=CA_Customer,SA_Supplier&$select=*,CA_Customer/Customer_x0020_name,SA_Supplier/Supplier_x0020_name";
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
           // console.log("success GetByTitle('Audits and reviews')");
           // console.log(JSON.stringify(suc,null,4));
        }
    });
}

function formatActions(){
    
    createActionsTables();
    var sActions = getActions(exceptionID);
    sActions.done(function(actions){
        for(var g=0 ; g < actions.d.results.length ; g++){

            actions.d.results[g].Assignee.FirstName =   typeof actions.d.results[g].Assignee.FirstName 
                                                    === "undefined" 
                                                    ? actions.d.results[g].Assignee.FirstName   = ""
                                                    : actions.d.results[g].Assignee.FirstName.replace("XT-",""); 
            if(actions.d.results[g].Assignee.FirstName === "Frederic"){ actions.d.results[g].Assignee.FirstName = "Frédéric"; }
            if(typeof actions.d.results[g].Assignee.LastName    === "undefined"){ actions.d.results[g].Assignee.LastName    = "";    }
            var row =   "<tr class='blueBackground dataRow'>"
                    +       "<td class='actionTableStandard'><div id='statusReport" + actions.d.results[g].ID                   + "'></div></td>"
                    +       "<td class='actionTableStandard'><div id='edit"         + actions.d.results[g].ID                   + "'></div></td>"
                    +       "<td class='actionTableStandard'><div id='statusIcon"   + actions.d.results[g].ID                   + "'></div></td>"
                    +       "<td class='actionTableStandard'><div id='actionBullet" + actions.d.results[g].ID                   + "'></div></td>"
                    +       "<td class='actionTableExtraWide'>"                     + actions.d.results[g].Title                + "</td>"
                    +       "<td class='actionTableExtraWide'><div id='ldDIV"       + actions.d.results[g].ID                   + "'></div></td>"
                    +       "<td class='actionTableStandard'>"                      + actions.d.results[g].Assignee.FirstName   + " " + actions.d.results[g].Assignee.LastName +  "</td>"
                    +       "<td class='actionTableStandard'><div id='comDate"      + actions.d.results[g].ID                   + "'></div></td>"
                    +       "<td class='actionTableStandard'><div id='dueDate"      + actions.d.results[g].ID                   + "'></div></td>"
                    +   "</tr>";

            switch(actions.d.results[g].Action_x0020_type){

                case    "Immediate"     :   var immTable = $("table[id='immediateTable']");
                                            $(immTable).show();
                                            $(immTable).find("tbody:first").append(row);
                                            break;

                case    "Corrective"    :   var corrTable = $("table[id='correctiveTable']");
                                            $(corrTable).show();
                                            $(corrTable).find("tbody:first").append(row);
                                            break;

                case    "Preventive"    :   var preTable = $("table[id='preventiveTable']");
                                            $(preTable).show();
                                            $(preTable).find("tbody:first").append(row);
                                            break;

                default                 :   break;
            }

            var dueDateDiv = document.getElementById("dueDate" + actions.d.results[g].ID);
            if(actions.d.results[g].TaskDueDate  === null){
                var warning = document.createElement("img");
                    warning.setAttribute("style", "height: 15px;");
                    warning.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/amberWarning.svg");
                    warning.setAttribute("title", "Due date not set");
                $(dueDateDiv).empty().append(warning);
                
            }
            else{
                $(dueDateDiv).empty().append(universalDate(actions.d.results[g].TaskDueDate));
            }

            var comDateDiv = document.getElementById("comDate" + actions.d.results[g].ID);
            if(actions.d.results[g].Completion_x0020_date  != null){
                $(comDateDiv).empty().append(universalDate(actions.d.results[g].Completion_x0020_date));
            }

            var editAction = document.createElement("img");
                $(editAction).addClass("editIcon");
                editAction.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
                editAction.setAttribute("editID", actions.d.results[g].ID);
                editAction.addEventListener("click", function(e){
                    e.stopPropagation();
                    var cURL = document.location.href;
                    cURL = cURL.split("&Source=")[0];
                    cURL = cURL +  "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/CAPA_Actions/EditForm.aspx?ID=" + $(this).attr("editID");
                    window.history.replaceState(null,null,cURL);
                    $("input[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
                });
            var editCell = document.getElementById("edit" + actions.d.results[g].ID);
                $(editCell).empty().append(editAction);

            //
            if(actions.d.results[g].statusReporting === true){
                var statusRpt = document.createElement("img");
                    statusRpt.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/statusReport.svg");
                    $(statusRpt).addClass("statusIcon");
                var stIcon = document.getElementById("statusReport"   + actions.d.results[g].ID);
                $(stIcon).empty().append(statusRpt);
            }
            //

            var dot = document.createElement("img");
                $(dot).addClass("statusIcon");
                
            if(actions.d.results[g].Action_x0020_complete === true){
                dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/tickGreenSq.svg");
                var stIcon = document.getElementById("statusIcon"   + actions.d.results[g].ID);
                $(stIcon).empty().append(dot);
            }
            else{
                var actStat = getActionStatus(actions.d.results[g].TaskDueDate);
                actStat.done(function(status){
                    switch(status){
                        case "notSet"   :   switch(actions.d.results[g].OData__x0052_){
                                                case "Plan"         : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_amber.svg");   break;
                                                case "Act"          : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_amber.svg");   break;
                                                case "Check"        : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_amber.svg");   break;
                                                case "Do"           : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_amber.svg");   break;
                                                case "Cancelled"    : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/grayCross.svg"); break;
                                                default             : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/ambDot.svg");    break;
                                            }
                                            break;
                        case "onTime"   :   switch(actions.d.results[g].OData__x0052_){
                                                case "Plan"         : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_green.svg");   break;
                                                case "Act"          : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_green.svg");   break;
                                                case "Check"        : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_green.svg");   break;
                                                case "Do"           : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_green.svg");   break;
                                                case "Cancelled"    : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/grayCross.svg"); break;
                                                default             : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greDot.svg");    break;
                                            }
                                            break;
                        case "late"     :   switch(actions.d.results[g].OData__x0052_){
                                                case "Plan"         : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_red.svg");     break;
                                                case "Act"          : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_red.svg");     break;
                                                case "Check"        : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_red.svg");     break;
                                                case "Do"           : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_red.svg");     break;
                                                case "Cancelled"    : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/grayCross.svg"); break;
                                                default             : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/redDot.svg");    break;
                                            }
                                            break;
                        default         :   break;
                    }
                    var stIcon = document.getElementById("statusIcon"   + actions.d.results[g].ID);
                    $(stIcon).empty().append(dot);
                });
            }

            var actionBullet = document.getElementById("actionBullet" + actions.d.results[g].ID);
            $(actionBullet).append(makeBullet("action", actions.d.results[g].ID));

            var ldDIV = document.getElementById("ldDIV" + actions.d.results[g].ID);

            var ldTable = document.createElement("table");
            ldTable.setAttribute("ID", "pactionLocDep_" + actions.d.results[g].ID);
            var th = document.createElement("thead");
            var thr = document.createElement("tr");
            var thc1 = document.createElement("th");
                thc1.setAttribute("style", "display:none;");
                thc1.append(document.createTextNode("location"));
            var thc2 = document.createElement("th");
                thc2.setAttribute("style", "display:none;");
                thc2.append(document.createTextNode("department"));
                thr.append(thc1);
                thr.append(thc2);
                th.append(thr);
            ldTable.append(th);
            var tb = document.createElement("tbody");
            ldTable.append(tb);
            $(ldTable).addClass("tablesorter");
            $(ldTable).tablesorter({ sortList: [[0,0],[1,0]]});
         
            ldDIV.append(ldTable);

            if(actions.d.results[g].CAPA_DeptList.results.length === 0){
                
                
            }
            else{
                for(var k=0 ; k < actions.d.results[g].CAPA_DeptList.results.length ; k++){
                    console.log("Action status : " + actions.d.results[g].OData__x0052_ );
                    if(actions.d.results[g].OData__x0052_ != "Cancelled"){
                        var locationTable = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable']");
                        $(locationTable).find("span[title='" + actions.d.results[g].CAPA_DeptList.results[k].LocationLabel + "']").find("input").removeClass().addClass("lockedCheckbox");

                        //  Start   belt and braces : For additional robustness we will ensure all of the actions departments are selected for the finding
                            var candidates = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_SelectCandidate").options;
                            for(var t=0 ; t < candidates.length ; t++){
                            
                                if(candidates[t].value === actions.d.results[g].CAPA_DeptList.results[k].ID.toString()){
                                    candidates[t].selected = true;
                                }
                                else{
                                    candidates[t].selected = false;
                                }
                            }

                            var addButton = document.getElementById("CapaDepartment_61905935-ef01-4b37-8d0d-f2875cda7625_AddButton");
                            addButton.disabled = false;
                            addButton.click();

                        var ld_row = document.createElement("tr");
                        var ld_loc = document.createElement("td");
                            ld_loc.setAttribute("style", "width: 60px;");
                            ld_loc.append(document.createTextNode(actions.d.results[g].CAPA_DeptList.results[k].LocationLabel));
                        var ld_dep = document.createElement("td");
                            ld_dep.append(document.createTextNode(actions.d.results[g].CAPA_DeptList.results[k].DepartmentName));

                        $(ld_row).append($(ld_loc));
                        $(ld_row).append($(ld_dep));

                        var tbody = $("table[ID='pactionLocDep_" + actions.d.results[g].ID + "']").find("tbody").append($(ld_row)).trigger("addRows", [$(ld_row), true]);
                    
                        var deptcheck = $("input[departmentid='" + actions.d.results[g].CAPA_DeptList.results[k].ID + "']");
                        $(deptcheck).prop("checked", true);
                        $(deptcheck).removeClass().addClass("lockedCheckbox");

                        deselectDeparmentOptions();
                    }
                }
            }
        }
        $("table[id='immediateTable']")     .tablesorter();
        $("table[id='correctiveTable']")    .tablesorter();
        $("table[id='preventiveTable']")    .tablesorter();
    });
    

    var actionsAdd = document.getElementById("actionsAdd");
    var addActions = document.createElement("img");
        addActions.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
        addActions.setAttribute("style", "height: 20px; padding-top: 5px; padding-left: 5px; padding-right: 5px; vertical-align: bottom;");
        addActions.setAttribute("id", "addActions");
        $(addActions).addClass("linkIcon");
        addActions.addEventListener("click", function(e){
            e.stopPropagation();
            checkForRequiredFields("no target").done(function(answer, target){
                if(answer === "complete"){
                    createNewAction();
                }
            })
        });
    var addActionsText = document.createTextNode("Add new action or activity");
    $(actionsAdd).empty().append(addActions, addActionsText);
}

function getActionStatus(actionDueDate){
    var deferred = $.Deferred();
    var answer;
    var dueDate = actionDueDate;
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

function getActions(parentExceptionID){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=100&$filter=(parentExceptionID eq '" + parentExceptionID + "') and (OData__x0052_ ne 'Archive action') &$expand=Assignee,CAPA_DeptList&$select=*,CAPA_DeptList/DepartmentName,CAPA_DeptList/LocationLabel,CAPA_DeptList/ID,Assignee/FirstName,Assignee/LastName";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Actions and activities ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
           // console.log("success getting " + suc.d.results.length + " Actions (unfiltered)");
          //  console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function getActiveActions(parentExceptionID){
    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=100&$filter=(parentExceptionID eq '" + parentExceptionID + "') and (OData__x0052_ ne 'Cancelled')";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Actions and activities ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
           console.log("success getting " + suc.d.results.length + " Actions (unfiltered)");
            console.log(JSON.stringify(suc,null,4));
        }   
    });
}

function createActionsTables(){
    var immediateActions = document.getElementById("immediateActions");
        var immediateTable = "<table id='immediateTable' width='100%'><thead>" +
                "<tr class='actionTableHeaderRow'>" +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableBullet'>           </th>"  +
                    "<th class='actionTableExtraWide'>Title     </th>"  +
                    "<th class='actionTableWide'>Location and department</th>"  +
                    "<th class='actionTableStandard'>Assignee   </th>"  +
                    "<th class='actionTableStandard'>Completed </th>"  +
                    "<th class='actionTableStandard'>Due date   </th>"  +
                "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
            "</table>";
    $(immediateActions).empty().append(immediateTable);
    var immTable = $("table[id='immediateTable']").hide();

    var correctiveActions = document.getElementById("correctiveActions");
        var correctiveTable = "<table id='correctiveTable' width='100%'><thead>" +
                 "<tr class='actionTableHeaderRow'>" +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableBullet'>           </th>"  +
                    "<th class='actionTableExtraWide'>Title     </th>"  +
                    "<th class='actionTableWide'>Location and department</th>"  +
                    "<th class='actionTableStandard'>Assignee   </th>"  +
                    "<th class='actionTableStandard'>Completed </th>"  +
                    "<th class='actionTableStandard'>Due date   </th>"  +
                "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
            "</table>";
    $(correctiveActions).empty().append(correctiveTable);
    var corrTable = $("table[id='correctiveTable']").hide();

    var preventiveActions = document.getElementById("preventiveActions");
        var preventiveTable = "<table id='preventiveTable' width='100%'><thead>" +
                "<tr class='actionTableHeaderRow'>" +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableStandard'>           </th>"  +
                    "<th class='actionTableBullet'>           </th>"  +
                    "<th class='actionTableExtraWide'>Title     </th>"  +
                    "<th class='actionTableWide'>Location and department</th>"  +
                    "<th class='actionTableStandard'>Assignee   </th>"  +
                    "<th class='actionTableStandard'>Completed </th>"  +
                    "<th class='actionTableStandard'>Due date   </th>"  +
                "</tr>" +
            "</thead>" +
            "<tbody></tbody>" +
            "</table>";
    $(preventiveActions).empty().append(preventiveTable);
    var preTable = $("table[id='preventiveTable']").hide();
}

function createNewAction(){

    var actCreated = createAction();
        actCreated.done(function(act){
            var cURL = document.location.href;
            cURL = cURL.split("&Source=")[0];
            cURL = cURL +  "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/CAPA_Actions/EditForm.aspx?ID=" + act.d.ID;
            window.history.replaceState(null,null,cURL);
            $("input[id='ctl00_ctl32_g_2acb4cc7_9ce1_4e52_ad80_0b47bb545b36_ctl00_toolBarTbltop_RightRptControls_ctl01_ctl00_diidIOSaveItem']").click();
        });
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

function createAction(){
    var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('CAPA_Actions')/items";
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
                                        "type": "SP.Data.CAPA_x005f_ActionsListItem"
                                    },
                                "parentAuditID"     : parentAuditID,
                                "parentExceptionID" : exceptionID,
                                }),
        contentType: "application/json; odata=verbose",
        error: function(err){
            console.log("Error creating a new Impact ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            console.log("Exception created");
           // console.log(JSON.stringify(suc,null,4));
        }
    });
}

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

//  Documentation : START

    function formatDocumentsSection(){
        /*
        var addFile = document.createElement("img");
            addFile.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
            addFile.setAttribute("title", "Upload a new document");
            addFile.setAttribute("id"   , "newDocumentButton");
            addFile.setAttribute("height", "20px");
            addFile.addEventListener("click", function(){
                uploadDocument();
            });          
            
        document.getElementById("exceptionDocumentationTopSection").innerHTML = "<input id='getFile' type='file'/><div id='addFileDIV' style='white-space: nowrap;'></div>";
        var fUp = document.getElementById("addFileDIV");
        $(fUp).empty().append(addFile);


        createDocumentTable().done(function(e){
            loadDocuments();
        });
        */

        var docUpload = $("div[id='exceptionDocumentationTopSection']");
        docUpload.empty();
        var fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("id", "getFile");
            fileInput.setAttribute("title", "Choose a document to upload");
            fileInput.setAttribute("style", "border-radius: 5px; padding-right: 10px;");
        docUpload.append(fileInput);

        var uploadFile = document.createElement("input");
            uploadFile.setAttribute("type", "button");
            uploadFile.setAttribute("value", "Upload document");
            uploadFile.setAttribute("style", "padding-left: 10px;");
            uploadFile.addEventListener("click", function(e){
                e.stopPropagation();
                uploadDocument();
            });
        docUpload.append(uploadFile);

        createDocumentTable().done(function(e){
            loadDocuments();
        });
    }

    function createDocumentTable(){
        var deferred = $.Deferred();

        var table =  "<table id='documentDisplayTable' class='displayTableData' width='100%'>"               +
                        "<thead>"                                               +
                            "<tr class='actionTableHeaderRow'>"                 +
                                "<th class='actionTableNarrow'></th>"           +
                                "<th class='actionTableExtraWide'>Title</th>"   +
                                "<th class='actionTableNarrow'>Editor</th>"     +
                                "<th class='actionTableBullet'>Modified</th>"   +
                                "<th class='actionTableStandard'>Document</th>" +
                                "<th class='actionTableStandard'>Action</th>"   +
                            "</tr>"                                             +
                        "</thead>"                                              +
                        "<tbody>"                                               +
                        "</tbody>"                                              +
                    "</table>";

        var actionDocumentationBody = document.getElementById("exceptionDocumentationBody");
        $(actionDocumentationBody).empty().append(table);

        deferred.resolve();

        return deferred.promise();
    }

    function displayDocument(doc){
        
        var row = document.createElement("tr");
        
 /*
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
            console.log("The actionID = " + doc.actionID);
            if(doc.actionID != null){
                var td3d = document.createElement("div");
                    td3d.setAttribute("ID", "actionLink" + doc.ID);
                    td3d.append(makeBullet("action", doc.actionID));
                td3.append(td3d);
            }
        
        var td3b = document.createElement("td");
            $(td3b).addClass("documentMiddle");
            var td3bd = document.createElement("div");
                td3bd.setAttribute("ID", "documentBullet" + doc.ID);
                td3bd.append(makeBullet("document", doc.ID));
            td3b.append(td3bd);

        var td4 = document.createElement("td");
            $(td4).addClass("documentNarrow");
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
            var firstName = doc.Editor.FirstName;
            if(firstName.indexOf("XT-") != -1){
                firstName = firstName.split("XT-")[1];
            }
            td6.append(document.createTextNode(firstName + " " + doc.Editor.LastName));
        
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
    */

       console.log("adding a line to the documentation section");

        var actionLink = document.createElement("td");
            $(actionLink).addClass("documentBullet");
            if(doc.actionID != null){
                var actionLinkd = document.createElement("div");
                    actionLinkd.setAttribute("ID", "actionLink" + doc.ID);
                    actionLinkd.append(makeBullet("action", doc.actionID));
                actionLink.append(actionLinkd);
            }
        
        var docBullet = document.createElement("td");
            $(docBullet).addClass("documentBullet");
            var docBulletd = document.createElement("div");
                docBulletd.setAttribute("ID", "documentBullet" + doc.ID);
                docBulletd.append(makeBullet("document", doc.ID));
            docBullet.append(docBulletd);

        var docOpen = document.createElement("td");
            $(docOpen).addClass("documentNarrow");
            var openLink = document.createElement("a");
                var appPrefix = getAppPrefix(doc.File.Name);
                openLink.setAttribute("target", "_blank");
                openLink.setAttribute("href", appPrefix 
                        + "https://airnovhcp.sharepoint.com/" + doc.File.ServerRelativeUrl + "?readonly=1");
            var openIcon = document.createElement("img");
                openIcon.setAttribute("height", "18px");
                openIcon.setAttribute("style", "padding-right: 10px;");
                openIcon.setAttribute("title", "Open the document: '" + doc.File.Name + "'");
                openIcon.setAttribute("src" , "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
            openLink.appendChild(openIcon);
            docOpen.append(openLink);
        
        var docTitle = document.createElement("td");
            $(docTitle).addClass("documentTitle");
            docTitle.append(document.createTextNode(doc.File.Name));

        var docEditor = document.createElement("td");
            $(docEditor).addClass("documentStandard");
            docEditor.append(document.createTextNode(doc.Editor.FirstName + " " + doc.Editor.LastName));
        
        var docModified = document.createElement("td");
            $(docModified).addClass("documentStandard");
            docModified.append(document.createTextNode(universalDate(doc.Created)));


        
        row.appendChild(docOpen);
        row.appendChild(docTitle);
        row.appendChild(docEditor);
        row.appendChild(docModified);
        row.appendChild(docBullet);
        row.appendChild(actionLink);

        var tbody = document.getElementById("documentDisplayTable").getElementsByTagName('tbody')[0];
        tbody.appendChild(row);
    }

    function makeBullet(type, linkID){
        var bullet = document.createElement("div");
        bullet.setAttribute("targetID", linkID);
        bullet.setAttribute("bulletType", type);
        switch(type){
         //   case "audit"    :   $(bullet).addClass("simpleLinkIcon");   
         //                       bullet.append("Aud#" + linkID);
         //                       $(bullet).addClass("auditBullet");
         //                       break;
         //   case "exception":   bullet.append("Dev#" + linkID); 
         //                       break;
         //   case "action"   :   bullet.append("#" + linkID);
         //                       $(bullet).addClass("actionBullet");
         //                       break;
         //   case "document" :                                           bullet.append("Doc#" + linkID); break;
            case "audit"    :                                               bullet.append("#" + linkID);    break;
            case "exception":   $(bullet).addClass("genericBulletLink");    bullet.append("#" + linkID);    break;
            case "action"   :   $(bullet).addClass("genericBulletLink");    bullet.append("#" + linkID);    break; 
            case "document" :   $(bullet).addClass("genericBullet");        bullet.append("#" + linkID);    break;
            default         :                                                                           break;                                  
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
                case "action"       :   cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Capa_Actions/EditForm.aspx?ID=" + $(this).attr("targetID") + "&Source=" + cURL[0];
                                        document.location.href = cURL;
                                        break;
                default             :   break;          
            }
        });
        
        return bullet;
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
        var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CapaDocumentation')/items?$filter=exceptionID eq '" + exceptionID + "'&$expand=File,Editor&$select=*,File/Name,File/ServerRelativeUrl,Editor/FirstName,Editor/LastName";
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
             //   console.log("success GetByTitle('CapaDocumentation') we returned " + suc.d.results.length + " documents");
            //  console.log(JSON.stringify(suc,null,4));
            }
        });
    }

    function onError(error) {
        alert("Error on file upload " + error.responseText);
    }

    function uploadDocument(){

        var folderName = "CapaDocumentation/audit" + parentAuditID
        var checkIfEventFolderExists = doesFolderExist(folderName);
        checkIfEventFolderExists.done(function(answer){
            if(!answer.d.Exists){
                console.log("There is no CapaDocumentation/audit" + parentAuditID + " folder so we create it...");
                var create = createFolder("CapaDocumentation/audit" + parentAuditID);
                create.done(function(){
                    uploadDocument();
                });
            }
            else{
                console.log("There is a CapaDocumentation/audit" + parentAuditID + " folder");
                var checkExceptionFolderExists = doesFolderExist("CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID);
                checkExceptionFolderExists.done(function(answer){
                    if(!answer.d.Exists){
                        console.log("There is no CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID + " folder so we create it...");
                        var create = createFolder("CapaDocumentation/audit" + parentAuditID + "/exception" + exceptionID);
                        create.done(function(){
                            uploadDocument();
                        });
                    }
                    else{
                        doTheDocumentUpload(parentAuditID, exceptionID);
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
    
        var serverRelativeUrlToFolder = "CapaDocumentation/audit" + auditID + "/exception" + exceptionID;
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
            var body = String.format("{{'__metadata':{{'type':'{0}'}}, 'auditID':'{1}', 'exceptionID':'{2}'}}",
                itemMetadata.type, 
                auditID,
                exceptionID);
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

//  Documentation : END

//getListContents();
function getListContents(){
    var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CAPA_Actions')/items?$top=5";
    return $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error GetByTitle('Audits and reviews')");
            console.log(JSON.stringify(err,null,4));
            console.log(_spPageContextInfo.webAbsoluteUrl);
        },
        success: function(suc){
            console.log("success GetByTitle('Audits and reviews')");
            console.log(JSON.stringify(suc,null,4));
        }
    });
}
</script>



























