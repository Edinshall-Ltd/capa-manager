<div id="loadingOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255, 255, 255, 1); z-index:9999;">
    <img id="waitingGIF" src="/sites/ChangeManager/Exceptions/code/images/waitingWaves.gif" alt="Loading..." class="loadingGIF">
</div>

<table style = "width: 100%;">
  <thead></thead>
  <tbody>
    <tr>
      <td colspan="2" width="100%">
        <table style="width: 100%; border-style: none">
          <thead></thead>
          <tbody>
            <tr>
              <td width="2%" valign="top" ><div id="headerIcon"></div></td>
              <td width="75%">
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
              <td width="20%">
                <table width="675px">
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <div id="filterToggle" class="control-menu"></div>
                      </td>
                    </tr>
                    <tr><td>&nbsp</td></tr>
                    <tr>
                      <td>
                        <table>
                          <thead>
                          </thead>
                          <tbody>                          
                            <tr><td colspan="4">&nbsp;</td></tr>
                            <tr>
                              <td>
                                <div id="legendMenu"></div>
                              </td>
                              <td>
                                <div id="settingsMenu"></div>
                              </td>
                              <td>
                                <div id="createMenu"></div>
                              </td>
                              <td>                         
                                <div id="filterMenu">
                                  <table style="width: 100%; border-style: none;" border="0">
                                    <thead></thead>
                                    <tbody>
                                      <tr class="spacer"><td><hr></td></tr>
                                      <tr>
                                        <td>
                                          <div id="filterCats">
                                            <ul>
                                              <li><a href="#auditFilter">Audits</a></li>
                                              <li><a href="#locationFilter">Location</a></li>
                                              <li><a href="#dateFilter">Dates</a></li>
                                              <li><a href="#peopleFilter">People</a></li>
                                              <li><a href="#statusFilter">Action status</a></li>
                                            </ul>
                                            <div id="auditFilter">
                                              <table style="width: 100%; border-style: none;" border="0">
                                                <thead></thead>
                                                <tbody>
                                                  <tr class="spacer"><td></td></tr>
                                                  <tr>
                                                    <td width="100%"><div id="auditDisplayHeader"></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td></tr>
                                                  <tr>
                                                    <td><div id="auditDisplaySubHeader"></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td></tr>
                                                </tbody>
                                              </table>
                                            </div>

                                            <div id="dateFilter">
                                              <table style="width: 100%; border-style: none;" border="0">
                                                <thead></thead>
                                                <tbody>
                                                  <tr class="spacer"><td></td></tr>
                                                  <tr>
                                                    <td width="100%"><div id="dateDisplayHeader">dateDisplayHeader</div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td></tr>
                                                  <tr>
                                                    <td><div id="dateDisplaySubHeader">dateDisplaySubHeader</div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td></tr>
                                                  <tr>
                                                    <td><div id="dateDisplayBody">dateDisplayBody</div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td></tr>
                                                </tbody>
                                              </table>
                                            </div>

                                            <div id="peopleFilter">
                                              <table style="width: 100%; border-style: none;" border="0">
                                                <tbody>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td colspan="2"><div id="peoplepickerCurrentUser"></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="35%"><span class="element-header">Audit lead:</span></td>
                                                    <td width="65%"><div id="siteInputDiv"><span class="capa-element" data-displayname="peoplepicker1"></span></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td><td></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="35%"><span class="element-header">Audit stakeholder:</span></td>
                                                    <td width="65%"><div id="siteInputDiv"><span class="capa-element" data-displayname="peoplepicker2"></span></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td><td></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="35%"><span class="element-header">Finding lead:</span></td>
                                                    <td width="65%"><div id="siteInputDiv"><span class="capa-element" data-displayname="peoplepicker3"></span></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td><td></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="35%"><span class="element-header">Finding stakeholder:</span></td>
                                                    <td width="65%"><div id="siteInputDiv"><span class="capa-element" data-displayname="peoplepicker4"></span></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td><td></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="35%"><span class="element-header">Action assignee:</span></td>
                                                    <td width="65%"><div id="siteInputDiv"><span class="capa-element" data-displayname="peoplepicker5"></span></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td></td><td></td></tr>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="35%"><span class="element-header">Action stakeholder:</span></td>
                                                    <td width="65%"><div id="siteInputDiv"><span class="capa-element" data-displayname="peoplepicker6"></span></div></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>

                                            <div id="locationFilter">
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
                                                            <td width="100%"><div id="locationDisplayHeader"></div></td>
                                                          </tr>
                                                          <tr class="spacer"><td></td></tr>
                                                          <tr>
                                                            <td width="100%"><div id="locationDisplaySubHeader"></div></td>
                                                          </tr>
                                                          <tr class="spacer"><td></td></tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td width="30%">
                                                      <table style="width: 100%; border-style: none;" border="0">
                                                        <thead>
                                                        </thead>
                                                        <tbody>
                                                          <tr class="spacer"><td></td></tr>
                                                          <tr>
                                                            <td width="100%"><span class="element-header">Location:</span><div id="siteInputDiv"><span class="capa-element" data-displayname="AuditLocations"></span></div></td>
                                                          </tr>
                                                          <tr class="spacer"><td></td></tr>
                                                        </tbody>
                                                      </table>
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
                                            </div>
                                            <div id="statusFilter">
                                              <table style="width: 100%; border-style: none;" border="0">
                                                <tbody>
                                                  <tr class="spacer"><td colspan="2"></td></tr>
                                                  <tr>
                                                    <td width="30%"><span class="element-header"></span></td>
                                                    <td width="70%"><div id="siteInputDiv"><span class="capa-element" data-displayname="R"></span></div></td>
                                                  </tr>
                                                  <tr class="spacer"><td colspan="2"><div id="statusFilter">statusFilter</div></td></tr>
                                                </tbody>
                                              </table>
                                            </div>

                                          </div>
                                        </td>
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
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="5" style="width: 100%;">
        <table style="width: 100%;">
          <thead></thead>
          <tbody>
            <tr>
              <td style="width: 100%;">
                <div id="audits" class="section-box" >
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="sectionHeaderAudits">
                        <td colspan="2"  class="section-header">
                          <span style="float: left;">Audits, reviews, and internal deviations</span><span style="float: right;" id="toggleAudits"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="section-padding" id="auditsBody">
                    <table style="border-style: none;" border="0">
                      <tbody>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr><td colspan="2"><div id="auditDisplayAddHeader"></div></td></tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                      </tbody>
                    </table>
                    <table style="width: 100%; border-style: none;" border="0">
                      <tbody>
                        <tr><td><div id="auditDisplayBody"></div></td></tr>
                        <tr class="spacer"><td></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="spacer"><td></td></tr>
            <tr>
              <td style="width: 100%;">
                <div id="Findings" class="section-box" >
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="sectionHeaderFindings">
                        <td colspan="2"  class="section-header">
                          <span style="float: left;">Actions</span><span style="float: right;" id="toggleFindings"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="section-padding" id="FindingsBody">
                    <table style="width: 100%; border-style: none;" border="0">
                      <tbody>
                        <tr class="spacer"><td></td></tr>
                        <tr><td><div id="actionActivitiesHeader"><hr></div></td></tr>
                        <tr class="spacer"><td></td></tr>
                        <tr><td><div id="actionActivitiesDisplay"></div></td></tr>
                        <tr class="spacer"><td></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="spacer"><td></td></tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>





















