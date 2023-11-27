<script type="text/javascript"  src="/sites/ChangeManager/Exceptions/code/opensourceScripts/HillbillyTemplate.js">                     </script>
<script type="text/javascript">

   jQuery(document).ready(function($) {
  
        $().HillbillyTemplate( {genericAlert: false});

   });

</script>

<table style = "width: 60%;">
  <thead></thead>
  <tbody>
    <tr>
      <td colspan="3" width="100%">
        <table style="width: 100%; border-style: none">
          <thead></thead>
          <tbody>
            <tr>
              <td width="60px"><div id="headerIcon"></div></td>
              <td>
                <table>
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <div id="headerTitle"></div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div id="headerSubTitle"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr><td colspan="2">&nbsp</td></tr>
    <tr>
      <td style="width: 30%; display: none;">
        <table style="width: 100%;">
          <thead></thead>
          <tbody>
            <tr>
              <td style="width: 100%;">
                <div id="audits" class="auditSectionBox" >
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="sectionHeaderAudits">
                        <td colspan="2"  class="sectionHeader">
                          <span style="float: left;" id="actionSectionHeader"></span><span style="float: right;" id="toggleAudits"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="auditSectionPadding" id="actionBody">
                    <table style="width: 100%; border-style: none;" border="0">
                      <tbody>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td colspan="2" width="100%"><div id="exceptionTypeHeader" class="exceptionTypeHeader">ss</div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><div id="exceptionType"></div></td>
                          <td width="70%"><div><input type="text" id="exceptionTitle"></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Finding description:</span></td>
                          <td width="70%"><div><textarea id="exceptionDescription" readonly width="100%"></textarea></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td colspan="2">
                            
                          </td>
                        </tr>
                     

                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      
      <td style="width: 70%;">
          <table style="width: 100%;">
          <thead></thead>
          <tbody>
            <tr>
              <td style="width: 100%;">
                <div width="100%">
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="auditHeaderSection">
                        <td colspan="2"  class="headerSubTitleDIV" style="width: 100%;">
                          <div style="display: flex; justify-content: space-between;">
                            <span>Action or activity</span>
                            <span id="headerCurrentStatus">status</span>
                          </div>
                        </td>
                      </tr>
                        <td>
                          <hr class="headerLine2">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="auditSectionPadding" id="exceptionsBody">
                    <table style="width: 100%; border-style: none;" border="0">
                      <tbody>
                        <tr>
                          <td>
                            <div id="exceptionActionsTopSection"></div>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action title:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action name"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action type:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action type"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action status:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action status"></span></div></td>
                        </tr>
                          <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action description:</span><span style="float: right; padding-right: 5px" id="actionDescriptionLock"></span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action description"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr class="spacer">
                          <td colspan="2">
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr id="auditHeaderSection">
                                  <td colspan="2"  class="headerSubTitleDIV" style="width: 100%;">
                                    <div style="display: flex; justify-content: space-between;">
                                      <span>Reporting status</span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"><hr class="headerLine1"></td></tr>
                        <tr>
                          <td width="5%">
                            <div id="siteInputDiv"><span class="hillbillyForm" data-displayname="statusReporting"></span></div>
                          </td>
                          <td width="95%">
                            <div id="locationDisplayHeader">Include this action in the status reporting for this finding.<br><br>Note that the finding itself has to be set for inclusion.</div>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                          <tr class="spacer"><td colspan="2"></td></tr>
                            <tr class="spacer"><td colspan="2"></td></tr>
                        <tr class="spacer">
                          <td colspan="2">
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr id="auditHeaderSection">
                                  <td colspan="2"  class="headerSubTitleDIV" style="width: 100%;">
                                    <div style="display: flex; justify-content: space-between;">
                                      <span>Locations and departments</span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"><hr class="headerLine1"></td></tr>
                        <tr>
                          <td colspan="2">
                            <div id="locationDisplayHeader">Select the location and department for this action from those associated with its parent finding.</div>
                          </td>
                        </tr>
                        <tr>
                          <td width="20%">
                            <table style="width: 100%; border-style: none;" border="0">
                              <thead>
                              </thead>
                              <tbody>
                                <tr class="spacer"><td></td></tr>
                                <tr>
                                  <td width="100%"><span class="elementHeader">Location:</span><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="AuditLocations"></span></div></td>
                                </tr>
                                <tr class="spacer"><td></td></tr>
                              </tbody>
                            </table>
                          </td>
                          <td width="80%">
                            <table style="width: 100%; border-style: none;" border="0">
                              <thead></thead>
                              <tbody>
                                <tr class="spacer"><td></td></tr>
                                <tr>
                                  <td width="100%"><div id="departmentDisplayHeader">Departments:</div></td>
                                </tr>
                                <tr class="spacer"><td></td></tr>
                                <tr>
                                  <td><div id="departmentDisplaySubHeader"></div></td>
                                </tr>
                                <tr class="spacer"><td></td></tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr class="spacer">
                          <td colspan="2">
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr id="auditHeaderSection">
                                  <td colspan="2"  class="headerSubTitleDIV" style="width: 100%;">
                                    <div style="display: flex; justify-content: space-between;">
                                      <span>Details and history</span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"><hr class="headerLine1"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action notes:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action notes"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action assignee:</span><span style="float: right; padding-right: 5px" id="assignButton"></span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Assignee"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action stakeholders:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action stakeholders"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Action approver:</span><span style="float: right; padding-right: 5px" id="approverRequiredLock"></span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Action approver"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Due date:</span><span style="float: right; padding-right: 5px" id="dueDateLock"></span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Due Date"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Completion date:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="hillbillyForm" data-displayname="Completion date"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Action history:</span></td>
                          <td width="70%">
                            <div class="commentaryWrapper" id="commentaryDiv">History goes here</div>
                          </td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="width: 100%;">
                <div id="excpetions">
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="auditHeaderSection">
                        <td colspan="2"  class="headerSubTitleDIV">
                          <span style="float: left;">Documentation</span>
                        </td>
                      </tr>
                        <td>
                          <hr class="headerLine1">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="auditSectionPadding" id="documentationBody">
                    <table style="width: 100%; border-style: none;" border="0">
                      <tbody>
                        <tr>
                          <td>
                          <br>
                            <div id="actionDocumentationTopSection"></div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div id="actionDocumentationBody"></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>





















