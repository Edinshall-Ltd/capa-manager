<script type="text/javascript"  src="/sites/ChangeManager/Exceptions/code/opensourceScripts/HillbillyTemplate.js">  </script>
<script type="text/javascript">

   jQuery(document).ready(function($) {
  
        $().HillbillyTemplate();

   });

</script>

<table style = "width: 100%;">
  <thead></thead>
  <tbody>
    <tr>
      <td colspan="3">
        <table style="border-style: none">
          <thead></thead>
          <tbody>
            <tr>
              <td width="60px"><div id="headerIcon"></div></td>
              <td>
                <table width="700px">
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
    <tr><td colspan="3">&nbsp</td></tr>
    <tr>
      <td width = "25%">
        <table>
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <div>
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="sectionHeaderAudits" width="100%">
                        <td colspan="2" width="100%">
                            <div style="display: flex; justify-content: space-between; width: 100%;">
                              <div id="exceptionSectionHeader" class="headerSubTitleDIV"></div>
                              <div style="float: right;">
                                <span id="exceptionDetailsPadlock"></span>
                                <span id="archiveException"></span>
                              </div>
                            </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <hr class="headerLine2">
                  <div class="auditSectionPadding" id="auditsBody">
                    <table style="border-style: none;">
                      <tbody>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Title:</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="Exception title"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Type:</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="Exception type"></span></div></td>
                        </tr>
                        
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Finding lead:</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="ExceptionLead"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Stakeholders:&nbsp;</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="ExceptionStakeholders"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Status:</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="Exception status"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Classification:</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="Exception classification"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="30%"><span class="elementHeader">Description:</span></td>
                          <td width="70%"><div><span class="hillbillyForm" data-displayname="Exception description"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        
                        <tr class="spacer"><td colspan="2"></td></tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr class="spacer"><td colspan="2"></td></tr>
              <tr>
                <td colspan="2">
                  <table style="width: 100%; border-style: none;" border="0">
                    <thead>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="2">
                          <table style="width: 100%; border-style: none;" border="0">
                            <thead>
                            </thead>
                            <tbody>
                              <tr>
                                <td width="100%"><div id="locationDisplayHeader"><span class="headerSubTitleDIV">Status reporting</span></div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <hr class="headerLine2">
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div class="auditSectionPadding"><br>Check the box to include this finding in the <span id="typeOfStatusReport">{{__STATUS REPORT TYPE__}}</span> status report.<br><br>Please note that actions associated with this finding must be individually selected for inclusion in the <span id="typeOfStatusReport">{{__STATUS REPORT TYPE__}}</span> status report.<br><br>Included actions are marked with a <img src="/sites/ChangeManager/Exceptions/code/images/statusReport.svg" class="editIcon"></div></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td width="30%">
                          <div class="auditSectionPadding">
                            <table style="width: 100%; border-style: none;" border="0">
                              <thead>
                              </thead>
                              <tbody>
                                <tr class="spacer"><td></td></tr>
                                <tr>
                                  <td width="5%"><div id="siteInputDiv" style="whitespace: nowrap;"><span class="hillbillyForm" data-displayname="includeInFilteredStatusReport"></span></td><td width="95%"><span class="elementHeader">Include in <span id="typeOfStatusReport" >{{__STATUS REPORT TYPE__}}</span> status report:</span></div></td>
                                </tr>
                                <tr class="spacer"><td></td></tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>  
                        
              <tr class="spacer"><td colspan="2"></td></tr>
              <tr>
                <td colspan="2">
                  <table style="width: 100%; border-style: none;" border="0">
                    <thead>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="2">
                          <table style="width: 100%; border-style: none;" border="0">
                            <thead>
                            </thead>
                            <tbody>
                              <tr>
                                <td width="100%"><div id="locationDisplayHeader"><span class="headerSubTitleDIV">Locations and departments</span></div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <hr class="headerLine2">
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div class="auditSectionPadding"><br>Select one or more locations impacted by this finding.  The available locations for this deviation are determined by the scope of its audit or review.<br><br>Select the departments impacted by this deviation or recommendation.<br><br><img src="/sites/ChangeManager/Exceptions/code/images/yellowtick.svg" style="height: 15px;"> Locations and departments highlighted with yellow are associated with one or more actions and cannot be deselected.<br><br><img src="/sites/ChangeManager/Exceptions/code/images/bluetick.svg" style="height: 15px;"> Locations and departments highlighted with blue are available to be associated with actions and activities.</div></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr><td colspan="2"><div class="auditSectionPadding"><hr class="headerLine1"></div></td></tr>
                      <tr>
                        <td width="30%">
                          <div class="auditSectionPadding">
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
                          </div>
                        </td>
                        <td width="70%">
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
                    </tbody>
                  </table>
                </td>
              </tr>           
                        
                        
                        
                        
                  </div>
                </div>
              
              </td>
            </tr>
            <tr><td></td></tr>
          </tbody>
        </table>
      </td>
      <td width="3%"></td>
      <td width = "72%">
          <table>
          <thead></thead>
          <tbody>
            <tr id="rootCauseAnalysisSection" style="display: none;">
              <td>
                <span class="headerSubTitleDIV" width="100%">Root cause analysis</span>
              </td>
            </tr>
            <tr>
              <td>
                <hr class="headerLine2">
              <td>
            </tr>
            <tr>
              <td>
                <div class="auditSectionPadding" >
                  <table style="width: 100%; border-style: none;" border="0">
                    <tbody>
                      <tr class="spacer"><td colspan="2"></td></tr>
                      <tr>
                        <td colspan="2">
                          <div id="exceptionRootCauseHeader">Root cause analysis textual explanation here...</div>
                        </td>
                      </tr>
                      <tr class="spacer"><td colspan="2"></td></tr>
                      <tr>
                        <td width="10%"><span class="elementHeader">Root cause analysis:</span></td>
                        <td width="90%"><div><span class="hillbillyForm" data-displayname="rootCauseAnalysis"></span></div></td>
                      </tr>
                      <tr class="spacer"><td colspan="2"></td></tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            <tr style="display: none;">
              <td>
                &nbsp;
              </td>
            </tr>
            <tr style="display: none;">
              <td>
                &nbsp;
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%">
                  <thead></thead>
                  <tbody>
                    <tr width="100%">
                      <td width="100%">
                        <span class="headerSubTitleDIV" width="100%">Actions</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <hr class="headerLine2">
                      <td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <div class="auditSectionPadding" >
                  <table style="width: 100%; border-style: none;" border="0">
                    <tbody>
                      <tr>
                        <td>
                          <div id="actionsAdd">actions add</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 100%;">
                          <div>
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <br>
                                    <span class="headerSubTitleDIV">Immediate actions</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div>
                              <table style="width: 100%; border-style: none;" border="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <div id="immediateActionsHeader"></div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div id="immediateActions"></div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <br><br><br>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 100%;">
                          <div>
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <span class="headerSubTitleDIV">Corrective actions</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div>
                              <table style="width: 100%; border-style: none;" border="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <div id="correctiveActionsHeader"></div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div id="correctiveActions"></div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <br><br><br>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 100%;">
                          <div>
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <span class="headerSubTitleDIV">Preventive actions</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div>
                              <table style="width: 100%; border-style: none;" border="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <div id="preventiveActionsHeader"></div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div id="preventiveActions"></div>
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
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%">
                <thead></thead>
                <tbody>
                  <tr width="100%">
                    <td width="100%">
                      <span class="headerSubTitleDIV" width="100%">Documentation</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <hr class="headerLine2">
                    <td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <div class="auditSectionPadding" id="documentationBody">
                <table style="width: 100%; border-style: none;" border="0">
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <div id="exceptionDocumentationTopSection"></div>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div id="exceptionDocumentationBody"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          <tr class="spacer"><td colspan="2"><br></td></tr>
          <tr class="spacer"><td colspan="2"><br><br></td></tr>
          <tr>
                          <td colspan="2" width="100%">
                            <table style="width: 100%; border-style: none;" border="0">
                              <thead></thead>
                              <tbody>
                                <tr><td><div id="locationDisplayHeader"><span class="headerSubTitleDIV">Images</span></div></td></tr>
                                <tr><td><hr class="headerLine2"></td></tr>
                                <tr><td><div class="auditSectionPadding" id="exceptionImageUpload"></div></td></tr>
                                <tr><td><div class="auditSectionPadding" id="exceptionImageDisplay"></div></td></tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

          </tbody>
        </table>
      </td>
    </tr>
                       
  </tbody>
</table>





















