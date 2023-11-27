<script type="text/javascript" src="/sites/ChangeManager/Exceptions/code/edinshall_utilities.js"></script>

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
    <tr><td colspan="2">&nbsp;</td></tr>
    <tr>
      <td>
        <table>
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <div>
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr id="sectionHeaderAudits">
                        <td colspan="2">
                          <div>
                            <div style="float: left;"  id="auditHeaderText" class="headerSubTitleDIV"></div>
                            <div style="float: right;">
                              <div id="auditRestrictedDiv"></div>
                              <div id="auditDetailsPadlock"></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <hr class="headerLine2">
                  <div class="auditSectionPadding" id="auditsBody">
                    <table style=" border-style: none;">
                      <tbody>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Title:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="Audit title"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr class="customerData">
                          <td width="20%"><span class="elementHeader">Customer:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="CA_Customer"></span></div></td>
                        </tr>
                        <tr class="spacer customerData"><td colspan="2"></td></tr>
                        <tr class="customerData">
                          <td width="20%"><span class="elementHeader">Cust. lead:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="customerLead"></span></div></td>
                        </tr>
                        <tr class="customerData spacer"><td colspan="2"></td></tr>
                        <tr class="customerData">
                          <td width="20%"><span class="elementHeader">Cust. ref.:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="customerReference"></span></div></td>
                        </tr>
                        <tr class="customerData spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Airnov lead:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="Audit lead"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr class="supplierData">
                          <td width="20%"><span class="elementHeader">Supplier:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="SA_Supplier"></span></div></td>
                        </tr>
                        <tr class="supplierData spacer"><td colspan="2"></td></tr>
                        <tr class="supplierData">
                          <td width="20%"><span class="elementHeader">Sup. lead:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="supplierLead"></span></div></td>
                        </tr>
                        <tr class="supplierData spacer"><td colspan="2"></td></tr>
                        <tr class="supplierData">
                          <td width="20%"><span class="elementHeader">Sup. ref.:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="supplierReference"></span></div></td>
                        </tr>
                        <tr class="supplierData spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Start:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="Audit start date"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">End:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="Audit end date"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Stakeholders:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="Audit stakeholders"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td width="20%"><span class="elementHeader">Notes:</span></td>
                          <td width="80%"><div id="siteInputDiv"><span class="capa-element" data-displayname="Audit notes"></span></div></td>
                        </tr>
                        <tr class="spacer"><td colspan="2"></td></tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>


            <tr class="spacer"><td colspan="2"></td></tr>
            <tr class="spacer"><td colspan="2"></td></tr>
            <tr class="spacer"><td colspan="2"></td></tr>
            <tr>
              <td colspan="2">
                <div id="statusDisplayHeader">
                  <span class="headerSubTitleDIV">Status reporting</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <hr class="headerLine2">
              </td>
            </tr>
            <tr>
              <td>
                <div id="statusReportingDisplayArea">
                  <table>
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td colspan="2">
                          <div class="auditSectionPadding" id="statusReportButtonsHeader"></div>
                        </td>
                      </tr>
                      
                      <tr>
                        <td width="20%">
                            <div class="auditSectionPadding" id="statusReportButtonsFiltered"></div>
                        </td>
                        <td>
                          <div class="auditSectionPadding" id="statusReportButtonsFilteredText">filtered text</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan=2>
                          <div class="auditSectionPadding">
                            <hr class="headerLine1">
                            <br>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td width="20%">
                          <div class="auditSectionPadding" id="statusReportButtonsUnfiltered"></div>
                        </td>
                        <td>
                          <div class="auditSectionPadding" id="statusReportButtonsUnfilteredText">unfiltered text</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            <tr>






             <tr class="spacer"><td colspan="2"></td></tr>
             <tr class="spacer"><td colspan="2"></td></tr>
             <tr class="spacer"><td colspan="2"></td></tr>
                        <tr>
                          <td colspan="2">
                            <div id="locationDisplayHeader">
                              <span class="headerSubTitleDIV">Locations</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <hr class="headerLine2">
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="auditSectionPadding"> <br>Select one or more locations covered by this audit or review.<br><br><img src="/sites/ChangeManager/Exceptions/code/images/yellowtick.svg" style="height: 15px;"> Locations highlighted with yellow are associated with one or more finding and cannot be deselected.<br><br><img src="/sites/ChangeManager/Exceptions/code/images/bluetick.svg" style="height: 15px;"> Locations highlighted with blue are available to be associated with findings.
                            </div>
                          </td>
                        </tr>
                       <tr>
                          <td colspan="2"><div class="auditSectionPadding"><hr class="headerLine1"></div></td>
                        </tr>
                        <tr>
                          <td colspan="2"><div class="auditSectionPadding"><div class="auditSectionPadding"><div id="siteInputDiv"><span class="capa-element" data-displayname="AuditLocations"></span></div></div></div></td>
                        </tr>

          </tbody>
        </table>
      </td>
      
      <td style="width: 80%;">
          <table style="width: 100%;">
          <thead></thead>
          <tbody>
            <tr>
              <td style="width: 100%;">
                <div class="auditSectionPadding">
                  <table style="width: 100%; border-style: none;">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td style="width: 100%;">
                          <div>
                            <table style="width: 100%; border-style: none;">
                              <thead></thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <span class="headerSubTitleDIV">Findings</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <hr class="headerLine2">
                            <div class="auditSectionPadding">
                              <table style="width: 100%; border-style: none;" border="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <div id="exceptionsAdd"></div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div id="exceptionHeader"></div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div id="exceptionsTableDIV"></div>
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
              </td>
            </tr>
            <tr class="spacer"><td><br></td></tr>
            <tr class="spacer"><td><br></td></tr>
            <tr>
              <td style="width: 100%;">
                <div class="auditSectionPadding" id="documentationBody">
                  <table style="width: 100%; border-style: none;" border="0">
                    <tbody>
                      <tr>
                        <td>
                          <span class="headerSubTitleDIV">Documentation</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <hr class="headerLine2">
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div id="auditDocumentationTopSection" class="auditSectionPadding"></div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div id="auditDocumentationBody" class="auditSectionPadding"></div>
                        </td>
                      </tr>
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






















