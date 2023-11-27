<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">                   </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/ExceptionCSS.css"                                            />
<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/messagebox.min.js">                     </script>
<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.cookie.min.js">                  </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/messagebox.min.css"                     />   
<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery.tablesorter.combined.min.js">    </script>
<script type="text/javascript"                      src =   "/_layouts/15/clientpeoplepicker.js">                                                           </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/Roboto.css"                             />

<style>
    div[id='O365_SuiteBranding_container']{
        display: none;
    }
        div[id='HeaderButtonRegion']{
        display: none;
    }
</style>

<script>
'use strict';
//  Declare global $tring variables
    var isQMKeyholder   = false;
    var isAuthorised    = false;
    let isAuthorisedToRestrict = false;
    var auditID;
    var customer;
    var supplier;
    var typeOfAudit;    
//

/*
* NEW : Declare global variables to manage authorisation and restrictions
*/
    let isKeyholder       = false;
    let isQM              = false;     
    let isQMA             = true;
    let canRestrict       = false;
    let verifiedUser      = false;
    let hasEditPermission = false;
    let restrictedAudit   = false;

//  end of new declatartions

$(document).ready(function () {
 
    hideHTML();

    console.log("This page is running a script for Audit.\nPUBLISHED 21 November 2023");

    // Setup PreSaveAction
    if (typeof window.PreSaveAction === 'function') {
        var originalPreSaveAction = window.PreSaveAction;

        PreSaveAction = function() {
            var originalResult = originalPreSaveAction();
            if (originalResult === false) {
                return false;
            }

            return customPreSaveAction();
        };
    }
    else {
        window.PreSaveAction = customPreSaveAction;
    }

    initializeGlobalVariables();

    /*
    *   The following block will prevent users other than the named user from running the function permissionsCheck()
    */
    if( _spPageContextInfo.userLoginName === "andrew.black@airnov-healthcare.com"){ 
        console.log("\n*********************** The current user is Andrew ***********************\n");
    
        /*
        permissionsCheck().then(message => {
            console.log("\n*********************** PERMISSIONS CHECK RESULTS ***********************\n");
            console.log("Message : " + message);
            logGlobalsVariables();
        }).catch(error => {
            console.log("There was an error with permissionsCheck()", error);
        });
        */
    }
    //  End ths permissions check

    // Authorisation and content setup
    CapaElementPlacement()
        .then(checkUserAuthorization)
            .then(setupPageContent)
                .catch(handleError);

});

function initializeGlobalVariables() {
    // Set global variables
    auditID = getQuerystring("ID");
    customer = $("select[id='CA_Customer_93d5b56d-0c9e-41a8-b7d5-32703771e51e_$LookupField'] option:selected").text();
    supplier = $("select[id='SA_Supplier_cebab6ff-0da1-46af-b29d-f573a16cdb53_$LookupField'] option:selected").text();
    typeOfAudit = $("select[id='Audit_x0020_type_222e3ad7-d6f0-482f-b17c-95b0d9f6d526_$DropDownChoice']").val();
    document.title = "CAPA : Audit #" + auditID;
    setFavicon('https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/code/images/capaLogo.png');
}

function setupPageContent(isQMKeyholder) {
    console.log("Inside setupPageContent() and isAuthorised : " + isAuthorised);

    return setRequiredFields()
        .then(() => {
            console.log("\n1/8 ****************  setRequiredFields done");
            return displaySettings();
        })
        .then(() => {
            console.log("\n2/8 ****************  displaySettings done");
            return formatAuditDetails();
        })
        .then(() => {
            console.log("\n3/8 ****************  formatAuditDetails done");
            return formatExceptionSection();
        })
        .then(() => {
            console.log("\n4/8 ****************  formatExceptionSection done");
            return loadExceptions();
        })
        .then(() => {
            console.log("\n5/8 ****************  loadExceptions done");
            return formatDocumentsSection();
        })
        .then(() => {
            console.log("\n6/8 ****************  formatDocumentsSection done");
            return addEventListeners();
        })
        .then(() => {
            console.log("\n7/8 ****************  addEventListeners done");
            return applyAuditLocks();
        })
        .then(() => {
            console.log("\n8/8 ****************  applyAuditLocks done");
            showHTML();
            console.log("\n****************  showHTML done");
        })
        .catch(error => {
            console.error('Error in setupPageContent:', error);
        });
}



/**
 * START of block of code dealing with the new permissions structure.
 */

    /**
     * Main function to check user permissions.
     * It first checks static permissions and then dynamic permissions.
     * If any error occurs during these checks, it returns false and shows an alert.
     * @returns {Promise<boolean>} A promise that resolves to true if all checks pass, otherwise false.
     */
    function permissionsCheck() {
        console.log("\n*********************** PERMISSIONS CHECK UNDERWAY ***********************\n");
        return checkStaticPermissions().then(() => {
            return checkDynamicPermissions();
        }).then(() => {
            console.log("\n*********************** PERMISSIONS CHECK COMPLETE ***********************\n");
            return true;
        }).catch(error => {
            console.error('An error occurred during permissions check:', error);
            alert("It has not been possible to check your authorisation in Capa Manager. Please contact support.");
            return false;
        });
    }

    /**
     * Checks static permissions based on user group membership.
     * It sequentially checks if the user is a member of various groups.
     * @returns {Promise<void>} A promise that resolves when all static checks are completed.
     */
    function checkStaticPermissions() {
        console.log("\n*********************** STATIC PERMISSIONS CHECK UNDERWAY ***********************\n");
        return isMemberOfGroup("Quality Manager keyholders").then(result => {
            isKeyholder = true;     //   Set to be the output of isMemebrOfGroup
            return isMemberOfGroup("Quality Managers");
        }).then(result => {
            isQM = true;        //   Set to be the output of isMemebrOfGroup
            return isMemberOfGroup("Quality Manager Admins");
        }).then(result => {
            isQMA = true;       //   Set to be the output of isMemebrOfGroup
            console.log("\n*********************** STATIC PERMISSIONS CHECK COMPLETE ***********************\n");
        }).catch(error => {
            console.error('An error occurred during static permissions check:', error);
            alert("Error checking static authorisation. Please contact support.");
        });
    }

    /**
     * Checks dynamic permissions related to the current audit.
     * This includes checking if the current audit is restricted and user's read or edit permissions.
     * @returns {Promise<void>} A promise that resolves when all dynamic checks are completed.
     */
    function checkDynamicPermissions() {
        console.log("\n*********************** DYNAMIC PERMISSIONS CHECK UNDERWAY ***********************\n");

        // Create a namedAuditUsers array to hold the usernames of those included in the audit 
        let namedAuditUsers = [];

        // Create a assocAuditUsers array to hold the usernames of those associated with the audit
        let assocAuditUsers = [];

        //  First let's check if the audit is retricted access
        restrictedAudit = document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField").checked;

        return setAuditLeader().then(auditleader => {
            return setAuditStakeholders();
        }).then(auditstakeholders => {
            return canEditAudit();
        }).then(editResult => {
            hasEditPermission = editResult;
            console.log("\n*********************** DYNAMIC PERMISSIONS CHECK COMPLETE ***********************\n");
        }).catch(error => {
            console.error('An error occurred during dynamic permissions check:', error);
            alert("Error checking dynamic authorisation. Please contact support.");
        });
    }

    function setAuditLeader(){
        return new Promise((resolve, reject) => {
            console.log("\n** Getting the auditleader email address\n");
            if(isAppointed("Audit lead")){
                namedAuditUsers.push()
            };
            resolve(result);
        });
    }

    function setAuditStakeholders(){
        return new Promise((resolve, reject) => {
            console.log("\n** Getting the auditstakeholder email address\n");
            //  this process requires also getting any group members.
            const result = true; // Placeholder logic; replace with actual restriction logic
            resolve(result);
        });
    }

    /**
     * Checks if the current user can set restrictions.
     * @returns {Promise<boolean>} A promise that resolves to true if the user can set restrictions.
     */
    function canSetRestrictions() {
        return new Promise((resolve, reject) => {
            console.log("\n** Checking if the current user can restrict audit access\n");
            const result = true; // Placeholder logic; replace with actual restriction logic
            canRestrict = result;
            resolve(result);
        });
    }

    /**
     * Checks if the current user can read the audit.
     * @returns {Promise<boolean>} A promise that resolves to true if the user can read the audit.
     */
    function canReadAudit() {
        return new Promise((resolve, reject) => {
            console.log("\n** Checking if the current user can read the audit\n");
            const result = true; // Placeholder logic; replace with actual read permission logic
            verifiedUser = result;
            resolve(result);
        });
    }

    /**
     * Checks if the current user has edit access to the audit.
     * @returns {Promise<boolean>} A promise that resolves to true if the user has edit access.
     */
    function canEditAudit() {
        return new Promise((resolve, reject) => {
            console.log("\n** Checking if the current user has edit access to this audit\n");
            const result = true; // Placeholder logic; replace with actual edit permission logic
            verifiedUser = result;
            resolve(result);
        });
    }

    /**
     * Utility function to log the status of global variables for debugging purposes.
     */
        function logGlobalsVariables() {
            console.log("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            console.log("isKeyholder        : " + isKeyholder);
            console.log("isQM               : " + isQM);
            console.log("canRestrict        : " + canRestrict);
            console.log("verifiedUser       : " + verifiedUser);
            console.log("hasEditPermission  : " + hasEditPermission);
            console.log("restrictedAudit    : " + restrictedAudit);
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n");
        }


//  The following code is required by production

    function checkGroupMembership(groups, currentUser, index, resolve, reject) {
        if (index >= groups.length) {
            console.log("User is not in any stakeholder group, not authorized.");
            resolve(false);
            return;
        }

        console.log(`Checking membership in group: ${groups[index]}`);
        isMemberOfGroup(groups[index]).then(isMember => {
            if (isMember) {
                console.log(`User is a member of group: ${groups[index]}`);
                isAuthorised = true;
                resolve(true);
            } else {
                console.log(`User is not a member of group: ${groups[index]}`);
                checkGroupMembership(groups, currentUser, index + 1, resolve, reject);
            }
        }).catch(error => {
            console.error("Error in checking group membership:", error);
            reject(error);
        });
    }

    function isMemberOfGroup(groupName) {
        return new Promise((resolve, reject) => {
            getGroupMembers(groupName).then(members => {
                var currentUser = _spPageContextInfo.userLoginName;
                var isMember = members.d.results.some(member => member.Email.toLowerCase() === currentUser.toLowerCase());
                resolve(isMember);
            }).catch(error => {
                reject(error);
            });
        });
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

    function isAppointed(peoplePicker){
        var currentUser = _spPageContextInfo.userLoginName;
        var isInc = $("div[title='" + peoplePicker +"']").find('.sp-peoplepicker-userSpan');
        if(isInc.length > 0){
            isInc = $(isInc).attr('sid');
            isInc = isInc.split("|")[2];
            if(isInc.toLowerCase() === currentUser.toLowerCase()){
                return true;
            }
        }
        else{
            return false;
        }
    }

/**
 * END of the block of code dealing with the new permissions model.
 */


function checkUserAuthorization() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            checkIfAuthorised()
                .then(isAuthorized => { // Using the response from checkIfAuthorised
                    if (!isAuthorized) {
                        isAuthorised = false;
                        alert("You do not have access to this restricted audit.\n\nIf you think this is in error please contact the audit leader {audit leader email}.");
                        //document.location.href = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/SitePages/accessdenied.aspx";
                        //reject("User is not authorised"); // Reject the promise if not authorized
                    } else {
                        isAuthorised = true;
                        resolve(); // Resolve the promise when authorized
                    }
                })
                .catch(error => {
                    console.error("Error in authorization check:", error);
                    reject(error); // Reject the promise on error
                });
        }, 2000); // Delay for 2 seconds before checking authorization
    });
}

function setupTableSorter() {
    var exceptionsTable = document.getElementById("exceptionsTable");
    $(exceptionsTable).tablesorter();
    console.log("The findings table should now be a tablesorter");
}

function updateTableSorter() {
    var exceptionsTable = $("#exceptionsTable");
    if (exceptionsTable.hasClass("tablesorter")) {
        exceptionsTable.trigger("update");
        console.log("tablesorter updated with new data");
    } else {
        exceptionsTable.tablesorter();
        console.log("tablesorter initialized");
    }
}

function handleError(error) {
    console.error('Error during page setup:', error);
    // Additional error handling logic as needed
}

function customPreSaveAction() {
    var deferred = $.Deferred();

    checkForRequiredFields().then(function(answer) {
        if (answer.status === "complete") {
            deferred.resolve();
        } else {
            deferred.reject();
        }
    });

    return deferred.promise();
}

function checkIfAuthorised() {
    return new Promise((resolve, reject) => {
        var privateAudit = document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField").checked;
        var currentUser = _spPageContextInfo.userLoginName;
        console.log("Private audit:", privateAudit, "| Current user:", currentUser);


        console.log("isQMA during checkifauthorised is : " + isQMA);
        if (isQMA) {
            console.log("Current user is a Quality Manager Admin (QMA). Authorized.");
            resolve(true);
            return;
        }


        if (!privateAudit) {
            console.log("Audit is public. User doesnot require to be authorised.");
            resolve(true);
            return;
        }
        else{
            console.log("We have a restricted audit and will check to see if the user is authorised");
            // Parse the JSON data from the hidden input field
            let vvvvvvvv = $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_HiddenInput']").val();
            var stakeholdersJSON = [];
            if(vvvvvvvv.length > 0){
                stakeholdersJSON = JSON.parse(vvvvvvvv);
            } 
            var users = [];
            var groups = [];

            stakeholdersJSON.forEach(function(entity) {
                console.log("the stakeholder entity is " + JSON.stringify(entity,null,4)); //sssssssssssssssssssssssssssssssssssssssssssssssssss
                if (entity.EntityData.SIPAddress != null) {
                    console.log("the stakeholder entry has been identified as a User and not a Group (Check done on entity.EntityData.SIPAddress : " + entity.EntityData.SIPAddress);
                    users.push(entity.Key.split("membership|")[1]); // Assuming Key is the user identifier
                } else {
                    console.log("all things point to the stakehodler being a group as entity.EntityData.SIPAddress = " + entity.EntityData.SIPAddress );
                    groups.push(entity.Key); // Assuming Key is the group identifier
                }
            });

            console.log("Individual stakeholders:", users, "| Groups:", groups);

            if (users.includes(currentUser)) {
                console.log("Current user is directly listed as a stakeholder.");
                isAuthorised = true;
                resolve(true);
                return;
            }
            else{
                console.log("Checking group membership for current user.");
                checkGroupMembership(groups, currentUser, 0, resolve, reject);
            }
        }
    });
}

/*
function checkIfAuthorised() {
    return new Promise((resolve, reject) => {
        var privateAudit = document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField").checked;
        var currentUser = _spPageContextInfo.userLoginName;
        console.log("Private audit:", privateAudit, "| Current user:", currentUser);

        if (!privateAudit) {
            console.log("Audit is public. User does not require to be authorised.");
            resolve(true);
            return;
        } else {
            console.log("We have a restricted audit and will check to see if the user is authorised");
            
            var stakeholdersJSONString = $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_HiddenInput']").val();
            if (!stakeholdersJSONString) {
                console.error("No stakeholders JSON data found.");
                resolve(false);
                return;
            }

            try {
                var stakeholdersJSON = JSON.parse(stakeholdersJSONString);
                var users = [];
                var groups = [];

                stakeholdersJSON.forEach(function(entity) {
                    console.log("the stakeholder entity is " + JSON.stringify(entity, null, 4));
                    if (entity.EntityData.SIPAddress != null) {
                        console.log("the stakeholder entry has been identified as a User and not a Group (Check done on entity.EntityData.SIPAddress : " + entity.EntityData.SIPAddress);
                        users.push(entity.Key.split("membership|")[1]); // Assuming Key is the user identifier
                    } else {
                        console.log("all things point to the stakeholder being a group as entity.EntityData.SIPAddress = " + entity.EntityData.SIPAddress);
                        groups.push(entity.Key); // Assuming Key is the group identifier
                    }
                });

                console.log("Individual stakeholders:", users, "| Groups:", groups);

                if (users.includes(currentUser)) {
                    console.log("Current user is directly listed as a stakeholder.");
                    isAuthorised = true;
                    resolve(true);
                    return;
                } else {
                    console.log("Checking group membership for current user.");
                    checkGroupMembership(groups, currentUser, 0, resolve, reject);
                }
            } catch (error) {
                console.error("Error parsing stakeholders JSON:", error);
                reject(error);
            }
        }
    });
}
*/
/////////////////////////

function applyAuditLocks(){


    console.log("Applying the audit locks for a user for whom isAuthorised : " + isAuthorised);

    var auditRestricted       = document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField");
        auditRestricted.focus();
    var auditRestrictedDiv = document.getElementById("auditRestrictedDiv");
    auditRestrictedDiv.classList.add("audit-details-icon-container");
    var auditRestricedIcon  = document.createElement("img");
        if(auditRestricted.checked) {   auditRestricedIcon.setAttribute("src",      "/sites/ChangeManager/Exceptions/code/images/eyesClosedRed.svg");
                                        auditRestricedIcon.setAttribute("title",    "Restricted access");                                                  }
        else                        {   auditRestricedIcon.setAttribute("src",      "/sites/ChangeManager/Exceptions/code/images/eyesOpenGreen.svg");    
                                        auditRestricedIcon.setAttribute("title",    "Unrestricted access");                                                 }
        if(isAuthorised){
            console.log("User is authorised to see an active icon");
            auditRestricedIcon.classList.add("active-icon");
            
            var currentUser =  _spPageContextInfo.userLoginName;

            
            /*
                //  This block of code will check if the current user is Andrew
                //  It is for debug checking of the authorisation function
                if(currentUser === "andrew.black@airnov-healthcare.com" ){
                    alert("hello andrew");
                }
            */
            
            
            auditRestricedIcon.addEventListener("click", function(e){
                e.stopPropagation();
                /*  Adding code here to wrap the restricted toggle in a cofirm method to warn uses that the functionality is not yet operational */
                let text = "Please click 'Cancel' on this pop-up.\n\nThe functionality to restrict access to audits will be available by teh end of November.\n\n*** If you click 'Ok' and find you are denied access to the restricted audit message andrew.black@airnov-healthcare.com to have the restrictions lifted.\n\nDoing this will not harm the data or Capa Manager, it will just restrict access until switched back on in the database. ***";
                if(confirm(text)){
                    //  Code block to remove from confirm()
                        if( document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField").checked){
                            document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField").checked = false;  
                        }
                        else{   
                            document.getElementById("auditRestricted_ddd1490b-1237-499f-b73c-1ae1c431b2f1_$BooleanField").checked = true;   
                        }
                        applyAuditLocks();
                    //  End of code block to remove from confirm()
                }
                else{
                    text = "Thank you!";
                }
            });
            $(auditRestrictedDiv).empty().append(auditRestricedIcon);
        }
        else{
            alert("User should not be here!  Soft error");
            console.log("Current user not authorised to access this restricted audit");
            auditRestricedIcon.classList.add("inactive-icon");
            $(auditRestrictedDiv).empty().append(auditRestricedIcon);
        }
  
        var auditDetailsPadlocked       = document.getElementById("auditDetailsPadlocked_29856ce6-4e3b-418b-ab85-f4067cab97e7_$BooleanField");
            auditDetailsPadlocked.focus(); 
        var auditDetailsDiv    = document.getElementById("auditDetailsPadlock");
        auditDetailsDiv.classList.add("audit-details-icon-container");
        var auditDetailsPadlock = document.createElement("img");
        if(auditDetailsPadlocked.checked)   {   auditDetailsPadlock         .setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/lockedRed.svg");   
                                                lockDetails();  }
        else                                {   auditDetailsPadlock         .setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/unlockedGreen.svg");
                                                unlockDetails();}
        if(isQMKeyholder){  // actually this should be restricted to keyholders and the audit leader
            auditDetailsPadlock.classList.add("active-icon");
            auditDetailsPadlock.addEventListener("click", function(e){
                e.stopPropagation();
                if(document.getElementById("auditDetailsPadlocked_29856ce6-4e3b-418b-ab85-f4067cab97e7_$BooleanField").checked){
                    document.getElementById("auditDetailsPadlocked_29856ce6-4e3b-418b-ab85-f4067cab97e7_$BooleanField").checked = false;
                }
                else{
                    document.getElementById("auditDetailsPadlocked_29856ce6-4e3b-418b-ab85-f4067cab97e7_$BooleanField").checked = true;
                }
                applyAuditLocks();
            });
        }
        else{
            auditDetailsPadlock.classList.add("inactive-icon");
        }
        $(auditDetailsDiv).empty().append(auditDetailsPadlock);

    function lockDetails(){

        var title = document.getElementById("Audit_x0020_title_2134a6b1-450a-427d-ab0d-a6b8e76a727e_$TextField");
            title.setAttribute("readonly", true);
            title.setAttribute("style", "pointer-events: none;");

        var lead = $("div[id='Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker']");
            lead.attr("style", "pointer-events: none;");
        $("div[title='Audit lead']").find("input").attr("disabled", true);
        $("span[id='Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker_InitialHelpText']").text("");
        $("div[title='Audit lead']").find("a[class='sp-peoplepicker-delImage']").show();
        var isAuditLead = isAppointed("Audit lead");
        if(isAuditLead){   $("input[id='Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker_EditorInput']").hide();  }
        else{              $("input[id='Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker_EditorInput']").show();  }
     
        var custName = document.getElementById("CA_Customer_93d5b56d-0c9e-41a8-b7d5-32703771e51e_$LookupField");
            custName.setAttribute("readonly", true);
            custName.setAttribute("style", "pointer-events: none;");
        
        var custLead = document.getElementById("customerLead_f6832630-4f7a-477e-8f9b-72e8936fffa9_$TextField");
            custLead.setAttribute("readonly", true);
            custLead.setAttribute("style", "pointer-events: none;");

        var custRef = document.getElementById("customerReference_738518ca-e5ca-4b46-907c-785454126ecc_$TextField");
            custRef.setAttribute("readonly", true);
            custRef.setAttribute("style", "pointer-events: none;");

        var locate = document.getElementById("AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable");
            locate.setAttribute("readonly", true);
            locate.setAttribute("style", "pointer-events: none;");

        var start = document.getElementById("Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDate");
            start.setAttribute("readonly", true);
            start.setAttribute("style", "pointer-events: none;");
        var startCal = document.getElementById("Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDateDatePickerImage");
            startCal.setAttribute("readonly", true);
            $(startCal).closest("a").attr("style", "pointer-events: none;");
            
        var end = document.getElementById("Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDate");
            end.setAttribute("readonly", true);
            end.setAttribute("style", "pointer-events: none;");
        var endCal = document.getElementById("Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDateDatePickerImage");
            endCal.setAttribute("readonly", true);
            $(endCal).closest("a").attr("style", "pointer-events: none;");
        
        $("div[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker']").attr("style", "pointer-events: none;");
        $("div[title='Audit stakeholders']").find("input").attr("disabled", true);
        $("span[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_InitialHelpText']").text("");
        $("span[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_ResolvedList']").find("a[class='sp-peoplepicker-delImage']").removeAttr("disabled");
        var _hiddenInput = $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_HiddenInput']").val().length;
        if( _hiddenInput === 2 | _hiddenInput === 0){
            $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_EditorInput']").show();
        }
        else{
            $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_EditorInput']").show();
        }
        
        var notes = document.getElementById("Audit_x0020_notes_11199613-525a-4799-8c24-bdf3b0c18b9f_$TextField");
            notes.setAttribute("readonly", true);
            notes.setAttribute("style", "pointer-events: none; width: 275px;");
    }

    function unlockDetails(){

        var title = document.getElementById("Audit_x0020_title_2134a6b1-450a-427d-ab0d-a6b8e76a727e_$TextField");
            title.removeAttribute("readonly");
            title.removeAttribute("style");

        var lead = $("div[id='Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker']");
            lead.removeAttr("style");
        $("div[title='Audit lead']").find("input").removeAttr("disabled");
        $("span[id='Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker_InitialHelpText']").text("");
        $("div[title='Audit lead']").find("a[class='sp-peoplepicker-delImage']").show();

        var custName = document.getElementById("CA_Customer_93d5b56d-0c9e-41a8-b7d5-32703771e51e_$LookupField");
            custName.removeAttribute("readonly");
            custName.removeAttribute("style");
        
        var custLead = document.getElementById("customerLead_f6832630-4f7a-477e-8f9b-72e8936fffa9_$TextField");
            custLead.removeAttribute("readonly");
            custLead.removeAttribute("style");

        var custRef = document.getElementById("customerReference_738518ca-e5ca-4b46-907c-785454126ecc_$TextField");
            custRef.removeAttribute("readonly");
            custRef.removeAttribute("style");

        var locate = document.getElementById("AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable");
            locate.removeAttribute("readonly");
            locate.removeAttribute("style");

        var start = document.getElementById("Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDate");
            start.removeAttribute("readonly");
            start.removeAttribute("style");
        var startCal = document.getElementById("Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDateDatePickerImage");
            startCal.removeAttribute("readonly");
            $(startCal).closest("a").removeAttr("style"); 
            
        var end = document.getElementById("Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDate");
            end.removeAttribute("readonly");
            end.removeAttribute("style");
        var endCal = document.getElementById("Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDateDatePickerImage");
            endCal.removeAttribute("readonly");
            $(endCal).closest("a").removeAttr("style");
        
        $("div[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker']").removeAttr("style");
        $("div[title='Audit stakeholders']").find("input").removeAttr("disabled");
        $("span[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_InitialHelpText']").text("");
        $("span[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_ResolvedList']").find("a[class='sp-peoplepicker-delImage']").removeAttr("disabled");
        var _hiddenInput = $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_HiddenInput']").val().length;
        if( _hiddenInput === 2 | _hiddenInput === 0){
            $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_EditorInput']").show();
        }
        else{
            $("input[id='Audit_x0020_stakeholders_7a5943cd-24d3-41e9-8fb9-5a4ccc343cee_$ClientPeoplePicker_EditorInput']").show();
        }
        
        var notes = document.getElementById("Audit_x0020_notes_11199613-525a-4799-8c24-bdf3b0c18b9f_$TextField");
            notes.removeAttribute("readonly");
            notes.setAttribute("style", "width: 275px;");
    }
}

function setRequiredFields(){
    var deferred = $.Deferred();
    var requiredFields  = new Array();
    var requiredMulti   = new Array();

    //  Set universally required fields
        //  Required Text Inputs
            requiredFields.push("Audit_x0020_title_2134a6b1-450a-427d-ab0d-a6b8e76a727e_$TextField");
        
        //  Required Multiselect fields
            requiredMulti.push("AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable");

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
            element.addEventListener("change", function(e){
                e.stopPropagation();
                setRequiredFields();
            });
        }

    //  Process requiredMulti
        for(var r=0 ; r < requiredMulti.length ; r++){
            var table   = document.getElementById(requiredMulti[r]);
            var boxes   = table.querySelectorAll("input[type=checkbox]");
            var isChecked = false;
            for (var i = 0; i < boxes.length; i++) {
                if (boxes[i].checked) {
                    isChecked = true;
                    break;
                }
            }
            if(isChecked){
                $(table).removeClass("required");
            }
            else{
                $(table).addClass("required");
            }
            for(var i = 0 ; i < boxes.length ; i++){
                var box = document.getElementById(boxes[i].id);
                
                
                box.addEventListener("change", function(e){
                    e.stopPropagation();
                    setRequiredFields();
                });
            }
        }
    deferred.resolve();
    return deferred.promise();
}

function createNewException(auditID){
    
    checkForRequiredFields().then(function(answer){
        console.log("The required fields status is " + answer.status);
        switch(answer.status){
            case "incomplete"   :   break;
            case "complete"     :   var ex = createException(auditID);
                                        ex.done(function(excep){
                                            var cURL = document.location.href;
                                            cURL = cURL.split("&Source=")[0];
                                            cURL = cURL +  "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=" + excep.d.ID;
                                            window.history.replaceState(null,null,cURL);
                                            $("input[id='ctl00_ctl32_g_c2a253eb_3dce_4f28_ab5c_f8b3bea23b1c_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem']").click();
                                        });
                                    break;
            default             :   break;
        }
    });
}

function checkForRequiredFields(target) {
    return new Promise((resolve, reject) => {
        var requiredElements = $(".required");

        if (requiredElements.length === 0) {
            console.log("All required fields have values so returning [complete] and [" + target + "]");
            resolve({ status: "complete", target: target});
        } else {
            console.log("Required fields have no values so returning [incomplete] and [" + target + "]");
            resolve({ status: "incomplete", target: target});
        }
    });
}

function formatExceptionSection(){

    var deferred = $.Deferred();

    var auditExceptionsTopSection = document.getElementById("exceptionsAdd");
    
    var addException = document.createElement("img");
        addException.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
        addException.setAttribute("style", "height: 20px; padding-top: 5px; padding-left: 5px; padding-right: 5px; vertical-align: bottom;");
        addException.setAttribute("id", "addException");
        $(addException).addClass("linkIcon");
        addException.addEventListener("click", function(e){
            e.stopPropagation();
            createNewException(auditID);
        });
    var addExceptionText = document.createTextNode("Add new finding");
    $(auditExceptionsTopSection).empty().append(addException, addExceptionText);

 /*   var includeClosed = document.createElement("input");
        includeClosed.setAttribute("type", "checkbox");
        includeClosed.setAttribute("style", "margin-left: 70px;");
        includeClosed.setAttribute("id", "includeClosed");
        includeClosed.checked = false;
        includeClosed.addEventListener("change", loadExceptions);
    var includeClosedText = document.createTextNode("Include closed");
    //$(auditExceptionsTopSection).append(includeClosed, includeClosedText);

    var includeRejected = document.createElement("input");
        includeRejected.setAttribute("type", "checkbox");
        includeRejected.setAttribute("style", "margin-left: 70px;");
        includeRejected.setAttribute("id", "includeRejected");
        includeRejected.checked = false;
        includeRejected.addEventListener("change", loadExceptions);
    var includeRejectedText = document.createTextNode("Include rejected");  */
    //$(auditExceptionsTopSection).append(includeRejected, includeRejectedText);

    $(auditExceptionsTopSection).append("<br>");
    $(auditExceptionsTopSection).append("<br>");

    deferred.resolve();
    return deferred.promise();
}

function createExceptionsTable(){
    var deferred = $.Deferred();

    var exceptionsTableDIV = document.getElementById("exceptionsTableDIV");
    var exceptionTable = "<table id='exceptionsTable' class='exceptionTableStyle displayTableData' width='100%'>"
                        +   "<thead>"
                        +      "<tr class='actionTableHeaderRow'>"
                        +          "<th class='actionIconNarrow'></th>"
                        +          "<th class='actionIconNarrow'>   <img src='/sites/ChangeManager/Exceptions/code/images/sort.svg' style='height: 16px; vertical-align: bottom;'></th>"
                        +          "<th class='actionIconNarrow'>   <img src='/sites/ChangeManager/Exceptions/code/images/sort.svg' style='height: 16px; vertical-align: bottom;'></th>"
                        +          "<th class='actionIconNarrow'><img src='/sites/ChangeManager/Exceptions/code/images/sort.svg' style='height: 16px; vertical-align: bottom;'></th>"
                        +          "<th class='actionTableNarrow'><div style='display: flex; align-items: center; justify-content: center;'>   <img src='/sites/ChangeManager/Exceptions/code/images/sort.svg' style='height: 16px; vertical-align: bottom;'></div></th>"
                        +          "<th class='actionTableExtraWide'>Title</th>"
                        +          "<th class='actionTableExtraWide'>Locations and departments</th>"
                        +          "<th class='actionTableStandard'>Lead</th>"
                        +          "<th class='actionTableStandard'>Completion</th>"
                        +          "<th class='actionTableStandard'>Immediate</th>"
                        +          "<th class='actionTableStandard'>Corrective</th>"
                        +          "<th class='actionTableStandard'>Preventive</th>"
                        +      "</tr>"
                        +   "</thead>"
                        +   "<tbody></tbody>"
                        +"</table>";
    $(exceptionsTableDIV).empty().append(exceptionTable);
    setupTableSorter();
    deferred.resolve();
    return deferred.promise();
}

function createException(auditID){
    var queryURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Exceptions')/items";
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
                                        "type": "SP.Data.ExceptionsListItem"
                                    },
                                "parentAuditID" : auditID,
                                }),
        contentType: "application/json; odata=verbose",
        error: function(err){
            console.log("Error creating a new Impact ");
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
           // console.log("Exception created");
           // //// // console.log(JSON.stringify(suc,null,4));
        }
    });
}

function loadExceptions(){

    var deferred = $.Deferred();

    createExceptionsTable().then(function(){
        //  Debug and force the showHTML which is otherwise failing
            console.log("Findings table created and now about to just force showHTML()");
            showHTML();
        //  end debug
        var exceptions = getExceptions();
        exceptions.then(function(excepts){
            if(excepts != null){
                var exceptionsTBody = $("table[id='exceptionsTable'] tbody");
                
                //  Clear all associated departments.  These will be reloaded exception by exception
                var oldSelected = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_SelectResult").options;
                for(var t=0 ; t < oldSelected.length ; t++){
                    oldSelected[t].selected = true;
                   // console.log("Marking " + oldSelected[t].value + " for removal from the audit department ready for reload");
                }
                var rejectButton = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_RemoveButton");
                    rejectButton.disabled = false;
                    rejectButton.click();
                            

                for(var h=0 ; h < excepts.d.results.length ; h++){

                    switch(excepts.d.results[h].Exception_x0020_status){
                    //    case "closed"   :   if(includeClosed)   {   displayException(excepts.d.results[h]);         }
                        case "closed"   :   displayException(excepts.d.results[h]);
                                            break;
                        case "rejected" :   displayException(excepts.d.results[h]);         
                                            break;
                        default         :   displayException(excepts.d.results[h]);
                                            break;
                    }

                    function displayException(except){

                        var exceptionLead = "";
                        if(except.ExceptionLeadId != null)                      { exceptionLead = except.ExceptionLead.FirstName.replace("XT-","") + " " + except.ExceptionLead.LastName;}
                        if(except.Exception_x0020_raised_x0020_on   === null)   { except.Exception_x0020_raised_x0020_on    = "";   }
                        else                                                    { except.Exception_x0020_raised_x0020_on    = universalDate(except.Exception_x0020_raised_x0020_on);}
                        if(except.Exception_x0020_classification    === null)   { except.Exception_x0020_classification     = "";   }
                        if(except.Exception_x0020_status            === null)   { except.Exception_x0020_status             = "";   }
                        if(except.Exception_x0020_type              === null)   { except.Exception_x0020_type               = "";   }
                        if(except.Exception_x0020_title             === null)   { except.Exception_x0020_title              = "";   }
                                    
                    
                        
                    

                        var locations = "";
                        if(except.AuditLocations                   != null)   {
                            for(var t=0 ; t < except.AuditLocations.results.length ; t++){
                                var locationSpan = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable']").find("span[title='" + except.AuditLocations.results[t] + "']");
                                var tempCheckbox = $(locationSpan).find("input");
                                $(locationSpan).find("input").addClass("lockedCheckbox");
                                $(locationSpan).find("label").addClass("lockedCheckboxLabel");
                                $(locationSpan).attr("title", "This location is used by a deviation or recommendation.\nRemove the dependency before unchecking this location.");

                                locations += except.AuditLocations.results[t];
                                if((t+1) < except.AuditLocations.results.length){    locations += "<br>";}
                            }
                        }

                        var row = "<tr class='blueBackground dataRow'>"
                                + "<td class='actionIconNarrow'><span id='editDiv"       + except.ID                     + "'></span></td>"
                                + "<td class='actionIconNarrow'><span id='complete"       + except.ID                     + "'></span></td>"
                                + "<td class='actionIconNarrow'><div id='statusReport"  + except.ID                     + "'></div></td>"
                                + "<td class='actionIconNarrow'><div id='lockedDiv"      + except.ID                     + "'></div></td>"
                                + "<td class='actionTableNarrow'>"
                                +   "<div class='bulletHolder'>"
                                +       "<div id='bulletType"                               + except.ID                     + "'></div>"
                                +       "<div id='bulletStatus"                             + except.ID                     + "'></div>"
                                +   "</div>"
                                +   "</td>"
                                
                                + "<td class='actionTableStandard'>"                        + except.Exception_x0020_title  + "</td>"
                                + "<td class='actionTableXXLWide'><div id='locdevTableDiv" + except.ID                     + "'>table goes here</div></td>"
                                + "<td class='actionTableStandard'>"                        + exceptionLead                 + "</td>"
                                + "<td class='actionTableStandard'><div id='projected"      + except.ID                     + "'></div></td>"
                                + "<td class='actionTableStandard'><div id='immActions"     + except.ID                     + "'></div></td>"
                                + "<td class='actionTableStandard'><div id='corActions"     + except.ID                     + "'></div></td>"
                                + "<td class='actionTableStandard'><div id='preActions"     + except.ID                     + "'></div></td>"
                                + "</tr>";
                        
                        exceptionsTBody.append(row);

                        var bulletLeft  = document.getElementById("bulletType"   + except.ID);
                        var bulletRight = document.getElementById("bulletStatus" + except.ID);

                        switch(except.Exception_x0020_type){

                            case "Deviation"        :   switch(except.Exception_x0020_classification){
                                                            case "minor"    :   $(bulletLeft).append("m")   .addClass("minorFinding");        
                                                                                $(bulletRight).append("#" + except.ID).addClass("bulletStatus");
                                                                                break;
                                                            case "Major"    :   $(bulletLeft).append("M")   .addClass("majorFinding");        
                                                                                $(bulletRight).append("#" + except.ID).addClass("bulletStatus"); 
                                                                                break;
                                                            case "Critical" :   $(bulletLeft).append("C")   .addClass("criticalFinding");     
                                                                                $(bulletRight).append("#" + except.ID).addClass("bulletStatus");
                                                                                break;
                                                            default         :   $(bulletLeft).append("?")   .addClass("unclassifiedFinding"); 
                                                                                $(bulletRight).append("#" + except.ID).addClass("bulletStatus"); 
                                                                                break;
                                                        }
                                                        break;
                            case "Recommendation"   :   $(bulletLeft)   .append("R")                .addClass("recommendationFinding");                       
                                                        $(bulletRight)  .append("#" + except.ID)    .addClass("bulletStatus"); 
                                                        break;
                            default                 :   $(bulletLeft)   .append("?")                .addClass("unclassifiedFinding"); 
                                                        $(bulletRight)  .append("#" + except.ID)    .addClass("bulletStatus"); 
                                                        break;
                        }

                       
                        var editEx = document.createElement("img");
                        editEx.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greenOpen.svg");
                        editEx.setAttribute("style", "height: 18px; padding-right: 5px; vertical-align: bottom;");
                        editEx.setAttribute("title", "Open this finding");
                        editEx.setAttribute("ID", except.ID);
                        $(editEx).addClass("rolloverImage");
                        editEx.addEventListener("click", function(e){
                            e.stopPropagation();
                            checkForRequiredFields($(this).attr("ID")).then(function(answer){
                                console.log("answer : " + answer.status + "\ntypeof " + typeof answer.status);
                                console.log("target : " + answer.target + "\ntypeof " + typeof answer.target);
                                if(answer.status === "complete"){

                                    var cURL = document.location.href;
                                    cURL = cURL.split("&Source=")[0];
                                    cURL = cURL +  "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=" + answer.target;
                                    window.history.replaceState(null,null,cURL);
                                    $("input[id='ctl00_ctl32_g_c2a253eb_3dce_4f28_ab5c_f8b3bea23b1c_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem']").click();
                                }
                                else if(answer.status =="incomplete"){
                                    alert("Please ensure all required audit fields have values before opening this finding");
                                }
                            });
                            
                        });
                        var editDiv = document.getElementById("editDiv" + except.ID);
                        $(editDiv).append(editEx);

                        if(except.Exception_x0020_status === "closed"){
                            var findingStatus = document.createElement("img");
                            findingStatus.setAttribute("style", "height: 18px; padding-right: 5px; vertical-align: bottom;");
                            findingStatus.setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/greenTick.svg");
                            findingStatus.setAttribute("title", "Finding is closed");
                            var findingStatusDiv = document.getElementById("complete" + except.ID);
                            $(findingStatusDiv).empty().append(findingStatus);
                        }
                        else if(except.Exception_x0020_status === "verify"){
                            var findingStatus = document.createElement("img");
                            findingStatus.setAttribute("style", "height: 18px; padding-right: 5px; vertical-align: bottom;");
                            findingStatus.setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/amberQuestion.svg");
                            findingStatus.setAttribute("title", "Verification required");
                            var findingStatusDiv = document.getElementById("complete" + except.ID);
                            $(findingStatusDiv).empty().append(findingStatus);
                        }
                        
                        if(except.includeInFilteredStatusReport === true){
                            var reporting = document.createElement("img");
                            reporting.setAttribute("style", "height: 18px; vertical-align: bottom;");
                            reporting.setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/statusReport.svg");
                            reporting.setAttribute("title", "Included in status report");
                            var srtDiv = document.createElement("div");
                                $(srtDiv).addClass("hiddenSortValue");
                                $(srtDiv).append("0");
                            var reportingDiv = document.getElementById("statusReport" + except.ID);
                            $(reportingDiv).empty().append(srtDiv, reporting);
                        }
                        else{
                            var srtDiv = document.createElement("div");
                                $(srtDiv).addClass("hiddenSortValue");
                                $(srtDiv).append("1");
                            var reportingDiv = document.getElementById("statusReport" + except.ID);
                            $(reportingDiv).empty().append(srtDiv);
                        }

                        var padlocked = except.exceptionDetailsPadlocked;
                        var padlock = document.createElement("img");
                            padlock.setAttribute("style", "height: 18px; vertical-align: bottom;");
                        if(padlocked){ 
                            padlock.setAttribute("src",    "/sites/ChangeManager/Exceptions/code/images/lockedRed.svg");
                            padlock.setAttribute("title", "Finding details are locked");
                            var srtDiv = document.createElement("div");
                                $(srtDiv).addClass("hiddenSortValue");
                                $(srtDiv).append("0");
                                var lockedDiv = document.getElementById("lockedDiv" + except.ID);
                            $(lockedDiv).empty().append(srtDiv, padlock);
                        }
                        else{
                            padlock.setAttribute("display",    "none");
                            var srtDiv = document.createElement("div");
                                $(srtDiv).addClass("hiddenSortValue");
                                $(srtDiv).append("1");
                            var lockedDiv = document.getElementById("lockedDiv" + except.ID);
                            $(lockedDiv).empty().append(srtDiv, padlock);
                        }
                        

                        var ldDIV = document.getElementById("locdevTableDiv" + except.ID);
                            $(ldDIV).empty();

                        var ldTable = document.createElement("table");
                        ldTable.setAttribute("ID", "pactionLocDep_" + except.ID);
                        ldTable.setAttribute("width", "100%");
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
                            tb.setAttribute("ID", "tbody_actionID_" + except.ID);
                        ldTable.append(tb);
                            $(ldTable).addClass("tablesorter");
                            $(ldTable).tablesorter({ sortList: [[0,0],[1,0]]});
                    
                        ldDIV.append(ldTable);

                        if(except.CapaDepartment                   != null)   {
                            for(var k=0 ; k < except.CapaDepartment.results.length ; k++){
                            
                                var candidates = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_SelectCandidate").options;
                                for(var t=0 ; t < candidates.length ; t++){
                                    if(candidates[t].value === except.CapaDepartment.results[k].ID.toString()){
                                        candidates[t].selected = true;
                                    }
                                    else{
                                        candidates[t].selected = false;
                                    }
                                }

                                var addButton = document.getElementById("CAPA_DeptList_b9ed51f5-5f34-4648-bb34-d580f904187a_AddButton");
                                addButton.disabled = false;
                                addButton.click();
                                
                                var locationTable = $("table[id='AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable']");
                                $(locationTable).find("span[title='" + except.CapaDepartment.results[k].LocationLabel + "']").find("input").prop("checked", true).removeClass().addClass("lockedCheckbox");

                                var ld_row = document.createElement("tr");
                                var ld_loc = document.createElement("td");
                                    ld_loc.setAttribute("style", "padding-right: 5px; width: 70px; border-right-style: solid; border-right-width: 1px; border-right-color: grey;");
                                    ld_loc.append(document.createTextNode(except.CapaDepartment.results[k].LocationLabel));
                                var ld_dep = document.createElement("td");
                                    ld_dep.append(document.createTextNode(except.CapaDepartment.results[k].DepartmentName));
                                    ld_dep.setAttribute("style", "padding-left: 5px; width: 120px;");
                                    

                                $(ld_row).append($(ld_loc));
                                $(ld_row).append($(ld_dep));

                                var tbody = $("table[ID='pactionLocDep_" + except.ID + "']").find("tbody").append($(ld_row)).trigger("addRows", [$(ld_row), true]);
                            }
                        }    
                        populateActions(except.ID);
                    }

                    if((h+1) === excepts.d.results.length){
                        updateTableSorter();
                        deferred.resolve();
                    }
                }
            }
            else{
                $("table[id='exceptionsTable']").hide();
            }
                
        });
    });
    return deferred.promise();
}

function getDepartmentLocation(departmentID, exceptID, departmentName){
    var deferred = $.Deferred();

    var queryURL =  "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Departments')/items(" + departmentID + ")";
    var temp = $.ajax({
        url: queryURL,
        type: "GET",
        headers: { Accept: "application/json;odata=verbose" },
        error: function(err){
            console.log("error getting Departments with the departmentID : " + departmentID);
            console.log(JSON.stringify(err,null,4));
        },
        success: function(suc){
            deferred.resolve(suc, exceptID, departmentName);
        }   
    });
    return deferred.promise();
}

function populateActions(parentExceptionID){
    var actions = getActions(parentExceptionID);
    actions.done(function(acts){
        var projectedCompletion = new Date(1970, 7, 28);
        var projectionPartial   = false;

        for(var t=0 ; t < acts.d.results.length ; t++){

                

            if(acts.d.results[t].TaskDueDate != null){
                var dueDate = acts.d.results[t].TaskDueDate;
                    dueDate = dueDate.split("-");
                    dueDate = new Date(dueDate[0],(dueDate[1]-1),dueDate[2].split("T")[0]);
                if(dueDate > projectedCompletion) { projectedCompletion = dueDate;  } 
            }

            var dot = document.createElement("img");
                $(dot).addClass("dotLinkLarge");
                dot.addEventListener("click", function(e){
                    e.stopPropagation();
                    
                    checkForRequiredFields($(this).attr("ID")).then(function(answer){
                        if(answer.status === "complete"){
                            var cURL = document.location.href;
                            cURL = cURL.split("&Source=");
                            cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/CAPA_Actions/EditForm.aspx?ID=" + answer.target + "&Source=" + cURL[0];
                            document.location.href = cURL;
                        }
                        else{
                            alert("Please ensure all required fields have valyues before navigationg away from this page");
                        }
                    });
                });
            
            if(acts.d.results[t].Action_x0020_complete === true){
                dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/tickGreenSq.svg");
            }
            else{
                var actStat = getActionStatus(acts.d.results[t]);
                actStat.done(function(status){
                    switch(status){
                        case "notSet"   :   switch(acts.d.results[t].OData__x0052_){
                                                case "Plan" : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_amber.svg");  break;
                                                case "Act"  : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_amber.svg");  break;
                                                case "Check": dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_amber.svg");  break;
                                                case "Do"   : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_amber.svg");  break;
                                                default     : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/ambDot.svg");  break;
                                            }
                                            break;
                        case "onTime"   :   switch(acts.d.results[t].OData__x0052_){
                                                case "Plan" : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_green.svg");  break;
                                                case "Act"  : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_green.svg");  break;
                                                case "Check": dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_green.svg");  break;
                                                case "Do"   : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_green.svg");  break;
                                                default     : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/greDot.svg");  break;
                                            }
                                            break;
                        case "late"     :   switch(acts.d.results[t].OData__x0052_){
                                                case "Plan" : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/P_red.svg");  break;
                                                case "Act"  : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/A_red.svg");  break;
                                                case "Check": dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/C_red.svg");  break;
                                                case "Do"   : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/D_red.svg");  break;
                                                default     : dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/redDot.svg");  break;
                                            }
                                            break;
                        default         :   dot.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/redDot.svg");  break;
                    }
                });
            }
                    
                dot.setAttribute("ID", acts.d.results[t].ID);
                
                var harness = document.createElement("div");
                    harness.setAttribute("parentID", acts.d.results[t].ID);
                    $(harness).addClass("dotFloating");

                var holder = document.createElement("div");
                    $(holder).addClass("holderClass");

                
                dot.addEventListener("mouseover", function(e){
                    e.stopPropagation();
                    var floater = document.getElementById("floatingAction" + $(this).attr("ID"));
                    $(floater).removeClass().addClass("floatingActionShow");
                });
                dot.addEventListener("mouseout", function(e){
                    e.stopPropagation();
                    var floating = document.getElementById("floatingAction" + $(this).attr("ID"));
                    $(floating).removeClass().addClass("floatingActionHide");
                });

                harness.addEventListener("mouseover", function(e){
                    e.stopPropagation();
                    var floater = document.getElementById("floatingAction" + $(this).attr("parentID"));
                    $(floater).removeClass().addClass("floatingActionShow");
                });
                harness.addEventListener("mouseout", function(e){
                    e.stopPropagation();
                    var floating = document.getElementById("floatingAction" + $(this).attr("parentID"));
                    $(floating).removeClass().addClass("floatingActionHide");
                });

                var actionPanel = floatingAction(acts.d.results[t]);
               
                $(harness).append(actionPanel);

                $(holder).append(dot);
                $(holder).append(harness);
               
            switch(acts.d.results[t].Action_x0020_type){
                case    "Immediate"     :   var immActs = document.getElementById("immActions" + acts.d.results[t].parentExceptionID);
                                            $(immActs).append(holder);
                                            break;

                case    "Corrective"    :   var corActs = document.getElementById("corActions" + acts.d.results[t].parentExceptionID);
                                            $(corActs).append(holder);
                                            break;

                case    "Preventive"    :   var preActs = document.getElementById("preActions" + acts.d.results[t].parentExceptionID);
                                            $(preActs).append(holder);
                                            break;

                default                 :   break;
            }
        }
        var projectedDiv = document.getElementById("projected" + parentExceptionID);
     //   if(projectedCompletion < new Date()){   projectedDiv.setAttribute("style", "color: red;");  }
        projectedCompletion = projectedCompletion.toString().split(" 00:00")[0];
        projectedCompletion = projectedCompletion.split(" ");
        projectedCompletion = projectedCompletion[0] + " " + projectedCompletion[2] + " " + projectedCompletion[1] + " " + projectedCompletion[3].slice(-2);
        if(projectedCompletion != "Fri 28 Aug 70")  {   $(projectedDiv).empty().append(projectedCompletion); }
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
        $(floater).addClass("floatingActionHide");  // reset this to hide

    var header  = document.createElement("div");
        $(header).addClass("floatingActionHeader");
        header.appendChild(document.createTextNode("Action #" + action.ID));
             
    var data    = document.createElement("div");
        $(data).addClass("floatingActionData");
        
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

function universalDate(date) {
    /**
     * Converts a given date string to a formatted date string.
     * Supports date strings in the format 'MM/DD/YYYY' or 'YYYY-MM-DD'.
     * 
     * @param {string} date - The date string to be formatted.
     * @returns {string} A formatted date string in the format 'Day DD Mon YY' (e.g., 'Mon 01 Jan 21').
     */

    if (!date) {
        //console.log("No date provided!");
        return "";
    }

    // Determine the format of the input date and process accordingly
    if (date.includes("/")) {
        return formatDate(date);
    } else if (date.includes("-")) {
        return formatDbDate(date);
    } else {
        console.log("Invalid date format!");
        return "";
    }

    /**
     * Formats a date string from 'MM/DD/YYYY' format to 'Day DD Mon YY' format.
     * 
     * @param {string} dateString - Date string in 'MM/DD/YYYY' format.
     * @returns {string} Formatted date string.
     */
    function formatDate(dateString) {
        const parts = dateString.split("/");
        const year = parts[2];
        const month = getMonthName(parseInt(parts[0], 10));
        const day = parseInt(parts[1], 10);
        const dayOfWeek = getDayOfWeek(new Date(year, parts[0] - 1, day));
        
        return `${dayOfWeek} ${day} ${month} ${year.substring(2)}`;
    }

    /**
     * Formats a date string from 'YYYY-MM-DD' format to 'Day DD Mon YY' format.
     * 
     * @param {string} dateString - Date string in 'YYYY-MM-DD' format.
     * @returns {string} Formatted date string.
     */
    function formatDbDate(dateString) {
        const parts = dateString.split("-");
        const year = parts[0];
        const month = getMonthName(parseInt(parts[1], 10));
        const day = parseInt(parts[2], 10);
        const dayOfWeek = getDayOfWeek(new Date(year, parts[1] - 1, day));

        return `${dayOfWeek} ${day} ${month} ${year.substring(2)}`;
    }

    /**
     * Returns the abbreviated name of the month.
     * 
     * @param {number} monthIndex - Month index (1-12).
     * @returns {string} Abbreviated month name.
     */
    function getMonthName(monthIndex) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[monthIndex - 1];
    }

    /**
     * Returns the abbreviated day of the week.
     * 
     * @param {Date} date - Date object.
     * @returns {string} Abbreviated day of the week.
     */
    function getDayOfWeek(date) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[date.getDay()];
    }
}

function getExceptions() {
    var siteUrl = _spPageContextInfo.webAbsoluteUrl;
    var queryURL = `${siteUrl}/_api/web/lists/GetByTitle('Exceptions')/items?$top=5000&$filter=parentAuditID eq '${auditID}'&$expand=CapaDepartment,ExceptionLead&$select=*,CapaDepartment/ID,CapaDepartment/DepartmentName,CapaDepartment/LocationLabel,ExceptionLead/FirstName,ExceptionLead/LastName`;
    return fetch(queryURL, {
        method: 'GET',
        headers: { 'Accept': 'application/json;odata=verbose' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON data
    })
    .then(data => {
        return data; // Return the data for further processing
    })
    .catch(error => {
        console.error('Error getting Exceptions:', error);
    });
}

function addEventListeners(){

    document.getElementById('AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable').width = "100%";
    
    SP.SOD.executeFunc('/_layouts/15/clientpeoplepicker.js', 'SPClientPeoplePicker', function() {
        var pickerId = "Audit_x0020_lead_dd8e34d9-38ef-41a4-a704-781bfd3defd6_$ClientPeoplePicker";
        var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerId];
        picker.OnUserResolvedClientScript = function(peoplePickerId, selectedUsersInfo) {
            if(selectedUsersInfo.length > 0){   $("div[id='" + pickerId + "']").removeClass("required");   }
            else                            {   $("div[id='" + pickerId + "']").addClass("required");      }
            setRequiredFields();
        }
        var users = picker.GetAllUserInfo();
        if (users.length === 0) {
            $("div[id='" + pickerId + "']").addClass("required");
        } 
        else {
            $("div[id='" + pickerId + "']").removeClass("required");
        }
    });

    var customerSelect = document.getElementById("CA_Customer_93d5b56d-0c9e-41a8-b7d5-32703771e51e_$LookupField");
        customerSelect.addEventListener("change", function(e){
            e.stopPropagation();
            customer = $("select[id='CA_Customer_93d5b56d-0c9e-41a8-b7d5-32703771e51e_$LookupField'] option:selected").text();
            displayBanner();
            formatAuditDetails();
    });

    
    $(function(){   
        $("input[id='Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDate']").get(0).onvaluesetfrompicker = DatePickerChanged;
        function DatePickerChanged(e) {
            //console.log("about to process a start date change from " + $("input[id='Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDate']").val());
            var newStart = document.getElementById("newStart");
                $(newStart).val(universalDate($("input[id='Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDate']").val()));            
        }
    });

    $(function(){   
        $("input[id='Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDate']").get(0).onvaluesetfrompicker = DatePickerChanged;
        function DatePickerChanged(e) {
            //console.log("about to process a start date change from " + $("input[id='Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDate']").val());
            var newEnd = document.getElementById("newEnd");
                $(newEnd).val(universalDate($("input[id='Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDate']").val()));            
        }
    });
   

}

function displaySettings(){
    
    return new Promise((resolve, reject) => {
      //  document.getElementById("MSOZoneCell_WebPartctl00_ctl32_g_1c0e2414_af2f_4baa_9a18_1d7f5c64b2ec").style.display      = "none";
        $("div[id='s4-ribbonrow']")     .attr("style", "display: none; height: 0px;");
        $("div[id='s4-titlerow']")      .attr("style", "display: none; height: 0px;");
        $("div[id='titleAreaBox']")     .attr("style", "display: none; height: 0px;");
        $("div[id='titleAreaRow']")     .attr("style", "display: none; height: 0px;");
        $("div[id='MSOZoneCell_WebPartWPQ6']")     .attr("style", "display: none; height: 0px;");
        $("div[id='MSOZoneCell_WebPartWPQ4']").hide();

        document.title = "CAPA : Audit #" + auditID;  //getQuerystring("ID");
        setFavicon('https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/code/images/capaLogo.png');

      //  document.getElementById("AuditLocations_09313028-49b2-40d4-9ae7-7434c7ae4a0b_MultiChoiceTable").style.width = "100%";

        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = 'https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/code/images/capaLogo.png';
        document.getElementsByTagName('head')[0].appendChild(link);
        
        $("span[id='ctl00_ctl32_g_c2a253eb_3dce_4f28_ab5c_f8b3bea23b1c_ctl00_toolBarTbl_RptControls_ctl00_ctl00_ctl02']").closest("table").hide();

        $("input[id='customerLead_f6832630-4f7a-477e-8f9b-72e8936fffa9_$TextField']").addClass("detailsInput");
        displayBanner();

        resolve();
    });
}

function setFavicon(href) {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
}

function displayBanner() {
    /**
     * Function to display the banner at the top of the page.
     * It creates and populates elements for the banner, including a logo, title, and subtitle.
     * The logo is interactive and triggers specific actions on click.
     */

    // Clear existing content and set up the header icon (logo).
    var headerIcon = $("#headerIcon");
    headerIcon.empty();

    var exceptionsLogo = document.createElement("img");
    exceptionsLogo.setAttribute("style", "height: 50px; padding-right: 15px; vertical-align: bottom;");
    exceptionsLogo.classList.add("rolloverImage");
    exceptionsLogo.setAttribute("title", "CAPA manager dashboard");
    exceptionsLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
    exceptionsLogo.addEventListener("click", function(e) {
        e.stopPropagation();
        checkForRequiredFields().then(function(answer) {
            if (answer.status === "complete") {
                handleLogoClick();
            }
        });
    });
    headerIcon.append(exceptionsLogo);

    // Set up the header title.
    var headerTitle = $("#headerTitle");
    headerTitle.empty();
    headerTitle.addClass("headerTitleDIV");
    headerTitle.append(document.createTextNode("CAPA manager"));

    // Set up the header subtitle.
    var headerSubTitle = $("#headerSubTitle");
    headerSubTitle.empty();
    headerSubTitle.addClass("headerSubTitleDIV");

    // Format the audit reference number to ensure it has leading zeros.
    var formattedReference = formatAuditReference(auditID);

    // Conditional logic for setting the subtitle and header text based on the type of audit.
    switch (typeOfAudit) {
        case "Customer audit":
            headerSubTitle.append("Customer audit #" + formattedReference + "  :  " + customer);
            document.getElementById("auditHeaderText").innerText = "Customer audit details";
            break;
        case "Supplier audit":
            headerSubTitle.append("Supplier audit #" + formattedReference + "  :  " + supplier);
            document.getElementById("auditHeaderText").innerText = "Supplier audit details";
            break;
        default:
            headerSubTitle.append(typeOfAudit + " #" + formattedReference);
            document.getElementById("auditHeaderText").innerText = typeOfAudit + " details";
            break;
    }
}

function formatAuditReference(reference) {
    /**
     * Formats the audit reference number to include leading zeros.
     * @param {string} reference - The audit reference number.
     * @return {string} - The formatted reference number.
     */
    while (reference.length < 4) {
        reference = "0" + reference;
    }
    return reference;
}

function handleLogoClick() {
    /**
     * Handles the actions to be performed when the logo is clicked.
     * It updates the current URL and triggers a save operation.
     */
    var cURL = document.location.href.split("&Source=")[0];
    cURL += "&Source=https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
    window.history.replaceState(null, null, cURL);
    setTimeout(function() {
        //console.log("About to save the item: check URL");
        $("#ctl00_ctl32_g_c2a253eb_3dce_4f28_ab5c_f8b3bea23b1c_ctl00_toolBarTbl_RightRptControls_ctl00_ctl00_diidIOSaveItem").click();
    }, 500);
}

function formatAuditDetails(){
    var deferred = $.Deferred();

    //  statusReportingDisplayArea
    var statusReportButtonsHeader = document.getElementById("statusReportButtonsHeader");
                                    $(statusReportButtonsHeader).empty();

    var statusReportingDisplayArea = document.getElementById("statusReportingDisplayArea");
        $(statusReportingDisplayArea).addClass("statusReportingDisplayAreaLocked");


    switch(typeOfAudit){
        case "Customer audit"   :   $(".supplierData").attr("style", "display: none;");
                                    
                                    var pwrLogo = document.createElement("img");
                                        pwrLogo.setAttribute("class", "statusIcon");
                                        pwrLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/PowerAutomateIcon.svg");

                                    var rptLogo = document.createElement("img");
                                        rptLogo.setAttribute("class", "statusIcon");
                                        rptLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/statusReport.svg");

                                    statusReportButtonsHeader.append(
                                        document.createElement("br"),
                                        "The following options use  ",
                                        pwrLogo,
                                        " Power Automate to generate reports and send them as attachments to the current user: " + _spPageContextInfo.userLoginName + ".",
                                        document.createElement("br"),
                                        document.createElement("br"));
                                    
                                    var statusReportButtonsUnfiltered = document.getElementById("statusReportButtonsUnfiltered");
                                    $(statusReportButtonsUnfiltered).empty();
                                    var internalReport = document.createElement("input");
                                        internalReport.setAttribute("type", "button");
                                        $(internalReport).addClass("statusReportButton");
                                        internalReport.setAttribute("value", "Extended report");
                                        internalReport.setAttribute("id", "internalReport");
                                        internalReport.setAttribute("auditID", auditID);
                                        internalReport.addEventListener("click", function(e){
                                            e.stopPropagation();
                                            var currentUser = _spPageContextInfo.userLoginName; 
                                            alert("The report is being prepared and once ready will be sent to " + currentUser + ".   This can take 10 minutes.");
                                            document.getElementById("internalReport_31286221-fbb0-4881-9c60-677179e3f305_$TextField").value = currentUser.toLowerCase();
                                            var flowUrl = "https://prod-73.westus.logic.azure.com:443/workflows/7e38387cee0945e6ab90432d41bd49a9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9I8r5yHl1mc5bt-jo3KtJZaQOadQYVnOpKBSahIgldM";
                                            var input = JSON.stringify({
                                                "emailaddress": currentUser,
                                                "auditID" : $(this).attr("auditID"),
                                                "reportType" : "unfiltered"
                                            });
                                            var req = new XMLHttpRequest();
                                            req.open("POST", flowUrl, true);
                                            req.setRequestHeader('Content-Type', 'application/json');
                                            req.send(input);
                                        });
                                        statusReportButtonsUnfiltered.append(internalReport); 

                                    var statusReportButtonsUnfilteredText = document.getElementById("statusReportButtonsUnfilteredText");
                                        $(statusReportButtonsUnfilteredText).empty().append("A report including audit details and extended to include all findings and actions regardless of preferences."); 
                                    
                                    var statusReportButtonsFiltered = document.getElementById("statusReportButtonsFiltered");
                                    $(statusReportButtonsFiltered).empty();
                                    var filteredReport = document.createElement("input");
                                        filteredReport.setAttribute("type", "button");
                                        $(filteredReport).addClass("statusReportButton");
                                        filteredReport.setAttribute("value", "Status report");
                                        filteredReport.setAttribute("id", "filteredReport");
                                        filteredReport.setAttribute("auditID", auditID);
                                        filteredReport.addEventListener("click", function(e){
                                            e.stopPropagation();
                                            var currentUser = _spPageContextInfo.userLoginName; 
                                            alert("The report is being prepared and once ready will be sent to " + currentUser + ".");
                                            var flowUrl = "https://prod-73.westus.logic.azure.com:443/workflows/7e38387cee0945e6ab90432d41bd49a9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9I8r5yHl1mc5bt-jo3KtJZaQOadQYVnOpKBSahIgldM";
                                            var input = JSON.stringify({
                                                "emailaddress": currentUser,
                                                "auditID" : $(this).attr("auditID"),
                                                "reportType" : "customer"
                                            });
                                            var req = new XMLHttpRequest();
                                            req.open("POST", flowUrl, true);
                                            req.setRequestHeader('Content-Type', 'application/json');
                                            req.send(input);
                                            alert("********************************************************/n" + input);
                                        });
                                        statusReportButtonsFiltered.append(filteredReport);
                                    
                                    var statusReportButtonsFilteredText = document.getElementById("statusReportButtonsFilteredText");
                                        $(statusReportButtonsFilteredText).empty().append("A report including audit details and the findings and actions indicated with the  ",
                                                                                rptLogo,
                                                                                " icon."); 
                                    
                                    break;

        case "Supplier audit"   :   $(".customerData").attr("style", "display: none;");

                                    var pwrLogo = document.createElement("img");
                                        pwrLogo.setAttribute("class", "statusIcon");
                                        pwrLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/PowerAutomateIcon.svg");

                                    var rptLogo = document.createElement("img");
                                        rptLogo.setAttribute("class", "statusIcon");
                                        rptLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/statusReport.svg");

                                    statusReportButtonsHeader.append(
                                        document.createElement("br"),
                                        "The following options use  ",
                                        pwrLogo,
                                        " Power Automate to generate reports and send them as attachments to the current user: " + _spPageContextInfo.userLoginName + ".",
                                        document.createElement("br"),
                                        document.createElement("br"));
                                    
                                    var statusReportButtonsUnfiltered = document.getElementById("statusReportButtonsUnfiltered");
                                    $(statusReportButtonsUnfiltered).empty();
                                    var internalReport = document.createElement("input");
                                        internalReport.setAttribute("type", "button");
                                        $(internalReport).addClass("statusReportButton");
                                        internalReport.setAttribute("value", "Extended report");
                                        internalReport.setAttribute("id", "internalReport");
                                        internalReport.setAttribute("auditID", auditID);
                                        internalReport.addEventListener("click", function(e){
                                            e.stopPropagation();
                                            var currentUser = _spPageContextInfo.userLoginName; 
                                            alert("The report is being prepared and once ready will be sent to " + currentUser + ".   This can take 10 minutes.");
                                            document.getElementById("internalReport_31286221-fbb0-4881-9c60-677179e3f305_$TextField").value = currentUser.toLowerCase();
                                            var flowUrl = "https://prod-73.westus.logic.azure.com:443/workflows/7e38387cee0945e6ab90432d41bd49a9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9I8r5yHl1mc5bt-jo3KtJZaQOadQYVnOpKBSahIgldM";
                                            var input = JSON.stringify({
                                                "emailaddress": currentUser,
                                                "auditID" : $(this).attr("auditID"),
                                                "reportType" : "unfiltered"
                                            });
                                            var req = new XMLHttpRequest();
                                            req.open("POST", flowUrl, true);
                                            req.setRequestHeader('Content-Type', 'application/json');
                                            req.send(input);
                                        });
                                        statusReportButtonsUnfiltered.append(internalReport); 

                                    var statusReportButtonsUnfilteredText = document.getElementById("statusReportButtonsUnfilteredText");
                                        $(statusReportButtonsUnfilteredText).empty().append("A report including audit details and extended to include all findings and actions regardless of preferences."); 
                                    
                                    var statusReportButtonsFiltered = document.getElementById("statusReportButtonsFiltered");
                                        $(statusReportButtonsFiltered).empty();
                                    var filteredReport = document.createElement("input");
                                        filteredReport.setAttribute("type", "button");
                                        $(filteredReport).addClass("statusReportButton");
                                        filteredReport.setAttribute("value", "Status report");
                                        filteredReport.setAttribute("id", "filteredReport");
                                        filteredReport.setAttribute("auditID", auditID);
                                        filteredReport.addEventListener("click", function(e){
                                            e.stopPropagation();
                                            var currentUser = _spPageContextInfo.userLoginName; 
                                            alert("The report is being prepared and once ready will be sent to " + currentUser + ".");
                                            var flowUrl = "https://prod-73.westus.logic.azure.com:443/workflows/7e38387cee0945e6ab90432d41bd49a9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9I8r5yHl1mc5bt-jo3KtJZaQOadQYVnOpKBSahIgldM";
                                            var input = JSON.stringify({
                                                "emailaddress": currentUser,
                                                "auditID" : $(this).attr("auditID"),
                                                "reportType" : "supplier"
                                            });
                                            var req = new XMLHttpRequest();
                                            req.open("POST", flowUrl, true);
                                            req.setRequestHeader('Content-Type', 'application/json');
                                            req.send(input);
                                            alert("********************************************************/n" + input);
                                        });
                                        statusReportButtonsFiltered.append(filteredReport);
                                    
                                    var statusReportButtonsFilteredText = document.getElementById("statusReportButtonsFilteredText");
                                        $(statusReportButtonsFilteredText).empty().append("A report including audit details and the findings and actions indicated with the  ",
                                                                                rptLogo,
                                                                                " icon."); 
                                    
                                    break;

        default                 :   $(".supplierData").attr("style", "display: none;");
                                    $(".customerData").attr("style", "display: none;");
                                    
                                    var pwrLogo = document.createElement("img");
                                        pwrLogo.setAttribute("class", "statusIcon");
                                        pwrLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/PowerAutomateIcon.svg");

                                    var rptLogo = document.createElement("img");
                                        rptLogo.setAttribute("class", "statusIcon");
                                        rptLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/statusReport.svg");

                                    statusReportButtonsHeader.append(
                                        document.createElement("br"),
                                        "The following options use  ",
                                        pwrLogo,
                                        " Power Automate to generate reports and send them as attachments to the current user: " + _spPageContextInfo.userLoginName + ".",
                                        document.createElement("br"),
                                        document.createElement("br"));
                                    
                                    var statusReportButtonsUnfiltered = document.getElementById("statusReportButtonsUnfiltered");
                                    $(statusReportButtonsUnfiltered).empty();
                                    var internalReport = document.createElement("input");
                                        internalReport.setAttribute("type", "button");
                                        $(internalReport).addClass("statusReportButton");
                                        internalReport.setAttribute("value", "Extended report");
                                        internalReport.setAttribute("id", "internalReport");
                                        internalReport.setAttribute("auditID", auditID);
                                        internalReport.addEventListener("click", function(e){
                                            e.stopPropagation();
                                            var currentUser = _spPageContextInfo.userLoginName; 
                                            document.getElementById("internalReport_31286221-fbb0-4881-9c60-677179e3f305_$TextField").value = currentUser.toLowerCase();
                                            var flowUrl = "https://prod-73.westus.logic.azure.com:443/workflows/7e38387cee0945e6ab90432d41bd49a9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9I8r5yHl1mc5bt-jo3KtJZaQOadQYVnOpKBSahIgldM";
                                            var input = JSON.stringify({
                                                "emailaddress": currentUser,
                                                "auditID" : $(this).attr("auditID"),
                                                "reportType" : "unfiltered"
                                            });
                                            var req = new XMLHttpRequest();
                                            req.open("POST", flowUrl, true);
                                            req.setRequestHeader('Content-Type', 'application/json');
                                            req.send(input);
                                        });
                                        statusReportButtonsUnfiltered.append(internalReport); 

                                    var statusReportButtonsUnfilteredText = document.getElementById("statusReportButtonsUnfilteredText");
                                        $(statusReportButtonsUnfilteredText).empty().append("A report including audit details and extended to include all findings and actions regardless of preferences."); 
                                    
                                    var statusReportButtonsFiltered = document.getElementById("statusReportButtonsFiltered");
                                    $(statusReportButtonsFiltered).empty();
                                    var filteredReport = document.createElement("input");
                                        filteredReport.setAttribute("type", "button");
                                        $(filteredReport).addClass("statusReportButton");
                                        filteredReport.setAttribute("value", "Status report");
                                        filteredReport.setAttribute("id", "filteredReport");
                                        filteredReport.setAttribute("auditID", auditID);
                                        filteredReport.addEventListener("click", function(e){
                                            e.stopPropagation();
                                            var currentUser = _spPageContextInfo.userLoginName; 
                                            alert("The report is being prepared and once ready will be sent to " + currentUser + ".");
                                            var flowUrl = "https://prod-73.westus.logic.azure.com:443/workflows/7e38387cee0945e6ab90432d41bd49a9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9I8r5yHl1mc5bt-jo3KtJZaQOadQYVnOpKBSahIgldM";
                                            var input = JSON.stringify({
                                                "emailaddress": currentUser,
                                                "auditID" : $(this).attr("auditID"),
                                                "reportType" : "filtered"
                                            });
                                            var req = new XMLHttpRequest();
                                            req.open("POST", flowUrl, true);
                                            req.setRequestHeader('Content-Type', 'application/json');
                                            req.send(input);
                                            alert("********************************************************/n" + input);
                                        });
                                        statusReportButtonsFiltered.append(filteredReport);
                                    
                                    var statusReportButtonsFilteredText = document.getElementById("statusReportButtonsFilteredText");
                                        $(statusReportButtonsFilteredText).empty().append("A report including audit details and the findings and actions indicated with the  ",
                                                                                rptLogo,
                                                                                " icon."); 
                                    
                                    break;
    }

    var rawStart = document.getElementById("Audit_x0020_start_x0020_date_836186bc-55a0-4db4-8cc9-0fae14755de8_$DateTimeFieldDate");
        $(rawStart).closest("td").hide();
    var newStart = document.createElement("input");
        newStart.setAttribute("type", "text");
        newStart.setAttribute("ID", "newStart");
        newStart.setAttribute("readonly", true);
        if($(rawStart).val().length > 0){   newStart.setAttribute("value", universalDate($(rawStart).val())); }
        $(rawStart).closest("td").after("<td>", newStart,"</td>");
    
    var rawEnd = document.getElementById("Audit_x0020_end_x0020_date_451b476b-958d-4a76-b1fc-fc72524b8879_$DateTimeFieldDate");
        $(rawEnd).closest("td").hide();
    var newEnd = document.createElement("input");
        newEnd.setAttribute("type", "text");
        newEnd.setAttribute("ID", "newEnd");
        newEnd.setAttribute("readonly", true);
        if($(rawEnd).val().length > 0){ newEnd.setAttribute("value", universalDate($(rawEnd).val())); }
        $(rawEnd).closest("td").after("<td>", newEnd,"</td>");

    deferred.resolve();
    return deferred.promise();
}

function showHTML() {
    document.getElementById("loadingOverlay").style.display = "none";
}

function hideHTML() {
    document.getElementById("loadingOverlay").style.display = "block";
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

/*  DOCUMENTATION SECTION START
     * 
     * This section of the code handles the uploading of documents to a SharePoint library
     * and the subsequent display of these documents in a structured format. It includes functions 
     * for creating the user interface for uploads, handling the upload process, and rendering 
     * the list of uploaded documents.
     * 
     * Functions:
     * 1. formatDocumentsSection: Initializes the UI elements for document upload. 
     *    It creates an upload button and a file input element, sets up event listeners, and 
     *    calls createDocumentTable to prepare the document display table.
     *
     * 2. createDocumentTable: Constructs the HTML table structure for displaying uploaded documents. 
     *    Once the table is created, it invokes loadDocuments to fetch and display existing documents.
     *
     * 3. displayDocument: Renders individual document entries in the document table. 
     *    Each document is displayed with associated metadata and interactive elements like links and bullets.
     *
     * 4. makeBullet: Utility function for creating bullet elements, used within displayDocument 
     *    to generate interactive bullets for each document entry.
     *
     * 5. getAppPrefix: Determines the appropriate application prefix based on the file's extension. 
     *    This function is essential for creating correct links to open documents.
     *
     * 6. loadDocuments: Calls getDocuments to retrieve the list of documents and then uses 
     *    displayDocument to add each document to the display table.
     *
     * 7. getDocuments: Makes an AJAX call to fetch documents from the SharePoint library, 
     *    filtered by a specific auditID.
     *
     * 8. onError: A generic error handling function to display error messages. 
     *    It can be used in AJAX calls or other asynchronous operations.
     *
     * 9. uploadDocument: Tied to the upload button's click event, this function starts 
     *    the document upload process. It checks for folder existence, creates a folder if necessary, 
     *    and then calls performDocumentUpload to handle the file upload.
     *
     * 10. checkAndCreateFolder: Checks if the specified folder exists in the SharePoint library. 
     *     If the folder does not exist, it triggers createFolder to make a new folder.
     *
     * 11. performDocumentUpload: Manages the actual upload of the document. 
     *     It handles file reading, making the POST request to add the file, and updating the list item.
     *
     * 12. getFileBuffer, addFileToFolder, getListItem, updateListItem, doesFolderExist, createFolder: 
     *     These functions collectively perform various tasks in the file upload process, such as 
     *     reading file data, sending the file to the server, and updating metadata.
     *
     * Workflow:
     * - User initiates document upload via the UI.
     * - uploadDocument is triggered, leading to folder checks and file upload.
     * - Upon successful upload, the document table is refreshed to include the new document.
     * - Each document is interactively displayed with options to view, edit, and link to related items.        */


    function formatDocumentsSection(){

        var deferred = $.Deferred();
        
        var addFile = document.createElement("img");
            addFile.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/add.svg");
            addFile.setAttribute("title", "Upload a new document");
            addFile.setAttribute("id"   , "newDocumentButton");
            addFile.setAttribute("height", "20px");
            addFile.setAttribute("style", "align: bottom;");
            addFile.addEventListener("click", function(){
                uploadDocument();
            });          

        var fileIn = document.createElement("input");
            fileIn.setAttribute("type", "file");
            fileIn.setAttribute("id", "getFile");
            $(fileIn).addClass("fileInputClass");

        var holderSpan = document.createElement("span");
            holderSpan.setAttribute("style", "white-space: nowrap;");

        var domLocation = document.getElementById("auditDocumentationTopSection");
        
        holderSpan.append(fileIn);
        holderSpan.append(addFile);


        $(domLocation).empty().append(holderSpan);
        domLocation.append(document.createElement("br"));
        domLocation.append(document.createElement("br"));
       
        createDocumentTable().done(function(e){
            loadDocuments().done(function(){
                deferred.resolve();
            });
        });

        return deferred.promise();
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
                                "<th class='actionTableBullet'>Finding</th>"    +
                                "<th class='actionTableStandard'>Action</th>"   +
                                
                            "</tr>"                                             +
                        "</thead>"                                              +
                        "<tbody>"                                               +
                        "</tbody>"                                              +
                    "</table>";

        var actionDocumentationBody = document.getElementById("auditDocumentationBody");
        $(actionDocumentationBody).empty().append(table);

        deferred.resolve();

        return deferred.promise();
    }

    function displayDocument(doc){
        //console.log("About to load the document DocID:" + doc.ID);
        //  console.log(JSON.stringify(doc,null,4));

        var row = document.createElement("tr");
        
        var findingLink = document.createElement("td");
            $(findingLink).addClass("documentBullet");
            if(doc.exceptionID != null){
                var findingLinkd = document.createElement("div");
                    findingLinkd.setAttribute("ID", "exceptionLink" + doc.ID);
                    findingLinkd.append(makeBullet("exception", doc.exceptionID));
                findingLink.append(findingLinkd);
            }

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
        row.appendChild(findingLink);
        row.appendChild(actionLink);
        

        var tbody = document.getElementById("documentDisplayTable").getElementsByTagName('tbody')[0];
        tbody.appendChild(row);
    }

    function makeBullet(type, linkID){
        var bullet = document.createElement("div");
        bullet.setAttribute("targetID", linkID);
        bullet.setAttribute("bulletType", type);
        switch(type){
            //case "audit"    :                                           bullet.append("Audit #" + linkID);      break;
            //case "exception":   $(bullet).addClass("simpleLinkIcon");   bullet.append("Deviation #" + linkID);  break;
            //case "action"   :   $(bullet).addClass("simpleLinkIcon");   bullet.append("Action #" + linkID);     break; 
            //case "document" :                                           bullet.append("Document #" + linkID);   break;
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
                case "exception"    :   cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Exceptions/EditForm.aspx?ID=" + $(this).attr("targetID") + "&Source=" + cURL[0];
                                        document.location.href = cURL;
                                        break;
                case "action"       :   cURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/Capa_Actions/EditForm.aspx?ID=" + $(this).attr("targetID") + "&Source=" + cURL[0];
                                        document.location.href = cURL;
                                        break;
                default             :   break;          
            }
        });
        //$(bullet).addClass("genericBullet");
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
        var deferred = $.Deferred();
        var theDocs = getDocuments();
        theDocs.done(function(docs){
            for(var t=0 ; t < docs.d.results.length ; t++){
                displayDocument(docs.d.results[t]);
            }
            var documentDisplayTable = document.getElementById("documentDisplayTable");
            $(documentDisplayTable).tablesorter();
            deferred.resolve();
        });
        return deferred.promise();
    }

    function getDocuments(){
        var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('CapaDocumentation')/items?$filter=auditID eq '" + auditID + "'&$expand=File,Editor&$select=*,File/Name,File/ServerRelativeUrl,Editor/FirstName,Editor/LastName";
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
            //    console.log("success GetByTitle('CapaDocumentation') we returned " + suc.d.results.length + " documents");
            //  console.log(JSON.stringify(suc,null,4));
            }
        });
    }

    function onError(error) {
        alert("Error on file upload " + error.responseText);
    }

    function uploadDocument() {
        //const auditID = getAuditID(); // Assuming getAuditID() is a function to retrieve the audit ID.
        const folderName = `CapaDocumentation/audit${auditID}`;
        
        checkAndCreateFolder(folderName)
            .then(() => performDocumentUpload(auditID))
            .catch(error => console.error('Error in upload process:', error));
    }

    function checkAndCreateFolder(folderName) {
        return doesFolderExist(folderName)
            .then(exists => {
                if (!exists) {
                    return createFolder(folderName);
                }
            });
    }

    function performDocumentUpload() {
        const serverRelativeUrlToFolder = `CapaDocumentation/audit${auditID}`;
        const fileInput = document.getElementById('getFile');

        if (!fileInput.files.length) {
            console.error('No file selected for upload');
            return;
        }

        getFileBuffer(fileInput.files[0])
            .then(arrayBuffer => addFileToFolder(arrayBuffer, serverRelativeUrlToFolder, fileInput.files[0].name))
            .then(fileResponse => {
                //console.log('File Response:', fileResponse); // Log the raw fileResponse
                if (!fileResponse.ok) {
                    throw new Error(`HTTP error! Status: ${fileResponse.status}`);
                }
                if (!fileResponse.headers.get("Content-Type").includes("application/json")) {
                    console.error("Expected JSON response, received:", fileResponse.headers.get("Content-Type"));
                    return;
                }
                return fileResponse.json(); // Parse JSON here
            })
            .then(fileJson => {
                const listItemUri = fileJson.d.ListItemAllFields.__deferred.uri;
                return getListItem(listItemUri);
            })
            .then(listItemResponse => {
                //console.log('ListItem Response:', listItemResponse); // Debugging log
                if (!listItemResponse || !listItemResponse.d || !listItemResponse.d.__metadata) {
                    throw new Error('Invalid listItemResponse structure');
                }
                return updateListItem(listItemResponse.d.__metadata); // Adjusted to access __metadata correctly
            })
            .then(() => {
               // console.log('Document upload and update successful');
                formatDocumentsSection();
            })
            .catch(error => console.error('Document upload error:', error));
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = e => resolve(e.target.result);
            reader.onerror = e => reject(e.target.error);
            reader.readAsArrayBuffer(file);
        });
    }

    function addFileToFolder(arrayBuffer, folderUrl, fileName) {
        const fileCollectionEndpoint = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/getfolderbyserverrelativeurl('${folderUrl}')/files/add(overwrite=true, url='${fileName}')`;
        
        return fetch(fileCollectionEndpoint, {
            method: "POST",
            body: arrayBuffer,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value
            }
        });
    }

    function getListItem(listItemUri) {
        return fetch(listItemUri, {
            method: "GET",
            headers: { "Accept": "application/json;odata=verbose" }
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();  // Convert to JSON first
        }).then(jsonResponse => {
            //console.log("Output from getListItem()", jsonResponse);  // Log the JSON response
            return jsonResponse;
        });
    }

    function updateListItem(itemMetadata) {
        const body = JSON.stringify({
            '__metadata': { 'type': itemMetadata.type }, 
            'auditID': auditID
        });

        return fetch(itemMetadata.uri, {
            method: "POST",
            body: body,
            headers: {
                "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                "content-type": "application/json;odata=verbose",
                "IF-MATCH": itemMetadata.etag,
                "X-HTTP-Method": "MERGE"
            }
        }).then(response => {
            //console.log('Update List Item Response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                //console.log("Update operation successful, but no JSON response.");
                return response.text(); // or simply return if no further processing is needed
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
                //console.log("Success creating folder [" + folderName +"]");
            }
        });
    }

//  DOCUMENTATION SECTION END

//getListContents();
function getListContents(){
    var queryURL = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/_api/web/lists/GetByTitle('Exceptions')/items?$top=5000&$expand=CapaDepartment&$select=*,CapaDepartment/DepartmentName,CapaDepartment/LocationLabel,CapaDepartment/ID";
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
            console.log("success GetByTitle('Exceptions')");
            console.log(JSON.stringify(suc,null,4));
        }
    });
}
</script>



























