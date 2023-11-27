<script type="text/javascript"                      src="/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">   </script>
<link   type="text/css"         rel="stylesheet"    href="/sites/ChangeManager/Exceptions/code/ExceptionCSS.css"                        />
<link   type="text/css"         rel="stylesheet"    href="/sites/ChangeManager/Exceptions/code/opensourceScripts/Roboto.css"            />

<script>

$(document).ready(function (){

   displaySettings();

});

function displaySettings(){
    
    $("td[id='onetidinfoblockV']").closest('table').hide();
    document.title = "CAPA comments and feedback";
    var ribbon = document.getElementById("titleAreaRow");
    ribbon.setAttribute("style", "display: none;");

    var ribbonRow = document.getElementById("s4-titlerow");
    ribbon.setAttribute("height", "0px;");
   
    var titlerow = document.getElementById("globalNavBox");
        titlerow.setAttribute("style", "display: none;");

    $("div[id$='_ChromeTitle']")    .hide(); 
    $("span[class='ms-formdescription']")    .hide();

    var saveButton = document.getElementById("ctl00$ctl32$g_28468aac_ba8b_4a20_8246_dec772aeb898$ctl00$toolBarTbl$RightRptControls$ctl00$ctl00$diidIOSaveItem");
    if(saveButton){
        saveButton.value = "Submit feedback";
        console.log("Name should be changed");
    }
    else{
        console.log("The save button is not rendered.  Please check the order of load of WebParts");
    } 
}

</script>