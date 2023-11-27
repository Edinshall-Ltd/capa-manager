<script type="text/javascript"  src="/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">                       </script>
<link   type="text/css"         rel="stylesheet"    href="/sites/ChangeManager/Exceptions/code/ExceptionCSS.css"                         />
<link   type="text/css"         rel="stylesheet"    href="/sites/ChangeManager/Exceptions/code/opensourceScripts/Roboto.css"             />

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

   
$(document).ready(function () {

    console.log("This page is running the latest script for CAPA Dashboard.\nPUBLISHED 7st December 2022");
     
    displaySettings();
   
});

function displaySettings(){
    $("div[id='s4-ribbonrow']")     .attr("style", "display: none; height: 0px;");
    $("div[id='s4-titlerow']")      .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaBox']")     .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaRow']")     .attr("style", "display: none; height: 0px;");
    $("div[id='MSOZoneCell_WebPartWPQ6']")     .attr("style", "display: none; height: 0px;");
    $("div[id='s4-bodyContainer']")     .attr("style", "padding: 0px;");
 
    document.title = "CAPA Manager : Unauthorised Access";
    
    displayBanner();
    function displayBanner(){
        
        var headerIcon = $("div[id='headerIcon']");
            headerIcon.empty();
            headerIcon.addClass("headerIconDIV");
            var exceptionsLogo = document.createElement("img");
                exceptionsLogo.setAttribute("style", "height: 150px; padding-right: 15px; vertical-align: bottom;");
                $(exceptionsLogo).addClass("rolloverImage");
                exceptionsLogo.setAttribute("title", "CAPA dashboard");
                exceptionsLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
                exceptionsLogo.addEventListener("click", function(e){
                    e.stopPropagation();
                    document.location.href = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/SitePages/dashboard.aspx?";
                });
            headerIcon.append(exceptionsLogo);

        var headerTitle = $("div[id='headerTitle']");
            headerTitle.empty();
            headerTitle.addClass("headerTitleDIV");
            headerTitle.append("<br>");
            headerTitle.append("CAPA manager : Unauthorised access");
      
        var headerSubTitle = $("div[id='headerSubTitle']");
            headerSubTitle.empty();
            headerSubTitle.addClass("headerSubTitleDIV");
            headerSubTitle.append("<br>");
            headerSubTitle.append("<br>");
            headerSubTitle.append("<br>");
            headerSubTitle.append("You do not have the necessary permissions to access.  Please speak with a member of the Quality Team.");
    }
}

</script>



























