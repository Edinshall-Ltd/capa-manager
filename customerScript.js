<script type="text/javascript"                      src =   "/sites/ChangeManager/Exceptions/code/opensourceScripts/jquery-3.6.0.min.js">                       </script>
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/ExceptionCSS.css"                                             />
<link   type="text/css"         rel="stylesheet"    href=   "/sites/ChangeManager/Exceptions/code/opensourceScripts/Roboto.css"                                 />
 

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

    
        console.log("\n\n******************************************************************************************************************\n" +
        "This page is running the latest script for CAPA Dashboard.\nPUBLISHED 14th June\nUNOBFUSCATED Human readable version\n"+
        "(Obfuscated version to be produced for golive using https://javascriptobfuscator.com/Javascript-Obfuscator.aspx" +
        "\n******************************************************************************************************************\n");
   
    $("div[id='MSOZoneCell_WebPartWPQ4']").hide();

        displaySettings().done(function(){
        console.log("All loaded without error");
    })
    

});


function displaySettings(){
    var deferred = $.Deferred(); 
    
    $("div[id='s4-ribbonrow']")     .attr("style", "display: none; height: 0px;");
    $("div[id='s4-titlerow']")      .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaBox']")     .attr("style", "display: none; height: 0px;");
    $("div[id='titleAreaRow']")     .attr("style", "display: none; height: 0px;");
   // $("div[id='MSOZoneCell_WebPartWPQ6']")     .attr("style", "display: none; height: 0px;");
    $("div[id='s4-bodyContainer']")     .attr("style", "padding: 0px;");

    
    document.title = "CAPA Manager";
    
    displayBanner().done(function(){
        deferred.resolve();
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
            exceptionsLogo.setAttribute("title", "CAPA dashboard");
            exceptionsLogo.setAttribute("src", "/sites/ChangeManager/Exceptions/code/images/airnov4square.svg");
            exceptionsLogo.addEventListener("click", function(e){
                e.stopPropagation();
                document.location.href = "https://airnovhcp.sharepoint.com/sites/ChangeManager/Exceptions/Lists/SearchFunctions/NewForm.aspx";
            });
        headerIcon.append(exceptionsLogo);

    var headerTitle = $("div[id='headerTitle']");
        headerTitle.empty();
        headerTitle.addClass("headerTitleDIV");
        headerTitle.append("CAPA manager");
    
    var headerSubTitle = $("div[id='headerSubTitle']");
        headerSubTitle.empty();
        headerSubTitle.addClass("headerSubTitleDIV");
        headerSubTitle.append("Dashboard   :   Version 0.1.0");
    
    deferred.resolve();
    return deferred.promise();
}
</script>