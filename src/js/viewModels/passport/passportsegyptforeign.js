/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodule-element-utils',
    'viewModels/helpers/ipConfig', 'viewModels/helpers/requests', 'appController', 'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojinputnumber', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox',
    'ojs/ojrouter', 'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojformlayout',
    'ojs/ojlabel', 'ojs/ojmessages', 'ojs/ojpagingtabledatasource',
    'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol', 'ojs/ojradioset',

  ],
  function (oj, ko, $, moduleUtils, ipConfig, requests, app) {

    function PassportEgyptForeign(type) {
      var self = this;

      const EGYPT_CARDS = 1;
      const EGYPT_PORTS = 2;
      const FOREIGN_CARDS = 3;
      const FOREIGN_PORTS = 4;


      self.sec = app.securityData;

      self.currentType = ko.observable(type);
      self.currentType.subscribe(function (val) {

      });
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.scrollPos = ko.observable({
        rowIndex: 1
      });
      self.scrollPosInfo = ko.observable(null);
      self.clickedIndex = ko.observable("");

      self.currentSearchType = ko.observable(1);
      // self.currentSearchType.subscribe(function (val) {
      //   self.resetVars();
      // })
      self.identityNumMessages = ko.observableArray([]);
      self.NameMessages = ko.observableArray([]);

      self.redrivedData = ko.observableArray([]);
      self.tableValues = ko.observableArray([]);
      self.selectedTableValue = ko.observable();
      self.theports = ko.observableArray([]);

      self.ports = ko.observableArray([]);
      self.selectedPort = ko.observable('');

      self.portscards = ko.observableArray([]);
      self.selectedPortcard = ko.observable('');;

      self.showPassportNo = ko.observable(false);
      self.showNationalId = ko.observable(false);
      self.showOthers = ko.observable(false);
      self.showBirthDate = ko.observable(false);
      self.showTransDate = ko.observable(false);

      self.isPassNoButtonDisabled = ko.observable(true);
      self.isNationalIdButtonDisabled = ko.observable(true);
      self.isOthersButtonDisabled = ko.observable(true);


      self.showEgyptCardsTable = ko.observable(false)
      self.showEgyptPortsTable = ko.observable(false)
      self.showForeignCardsTable = ko.observable(false)
      self.showForeignPortsTable = ko.observable(false)

      self.showHideControls = function () {

        var sec = self.sec;
        self.showNationalId(sec.passports.NationalId.visible);
        self.showPassportNo(sec.passports.PassportNo.visible)
        self.showOthers(sec.passports.Others.visible)
        self.showBirthDate(sec.passports.Others.BirthDate.visible);
        self.showTransDate(sec.passports.Others.TransDate.visible);
      }

      self.showHideControls();





      self.resetVars = function () {
        self.pname = ko.observable('');
        self.pass_no = ko.observable('');
        self.pass_no1 = ko.observable('');
        self.natid = ko.observable('');
        self.natid1 = ko.observable('');
        self.pissueyear = ko.observable('');
        self.ppasstype = ko.observable('');
        self.pissueplace = ko.observable('');
        self.pbirthdatefrom = ko.observable('');
        self.pbirthdateto = ko.observable('');
        self.pmovement_type = ko.observable('');
        self.pmovementdatefrom = ko.observable('');
        self.pport_id = ko.observable('');
        self.pmovementdateto = ko.observable('');
        self.pnationality = ko.observable('');
        self.pnationaltiyid = ko.observable('');
      }

      self.resetVars();

      // self.getPortsUrl = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/getAllPortEgyRestService';
      // self.getPorts = function () {

      //   $.ajax({
      //     url: self.getPortsUrl,
      //     type: 'GET',

      //   }).done(function (data) {

      //     self.ports(data.LkpPortsEgyPorts.map(function (item) {
      //       return {
      //         value: item.portId.toString(),
      //         label: item.portName
      //       }
      //     }));
      //     self.ports.unshift({
      //       value: '',
      //       label: "الجميع"
      //     });
      //     console.log('PORTS: ', self.ports());
      //     self.setPortsComboBox();
      //   }).fail(function (error) {
      //     console.log(error);
      //   });
      // };

      // self.getPorts();


      self.setPortsComboBox = function () {
        // if (self.currentType() == 1) {
        //   self.theports(self.portscards());
        // } else if (self.currentType() == 2) {
        //   self.theports(self.ports());
        // }
      }

      // self.getPortsUrlcard = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/ExitEntryEgy_SBProject/getAllPortsEgyRestService';
      // self.getcardPorts = function () {

      //   $.ajax({
      //     url: self.getPortsUrlcard,
      //     type: 'GET',

      //   }).done(function (data) {

      //     self.portscards(data.LkpExitEgyGeo.map(function (item) {
      //       return {
      //         value: item.geoId.toString(),
      //         label: item.geoName
      //       }
      //     }));
      //     self.portscards.unshift({
      //       value: '',
      //       label: "الجميع"
      //     });
      //     console.log('PORTS: ', self.portscards());
      //     self.setPortsComboBox();
      //   }).fail(function (error) {
      //     console.log(error);
      //   });
      // };

      // self.getcardPorts();


      self.tableValues = [{
          id: '1',
          label: 'منافذ'
        },
        {
          id: '2',
          label: 'كروت'
        }
      ];

      // observable bound to the Buttonset:
      self.selectedTableValue = ko.observable(1);


      self.moduleConfigEgyptCards = ko.observable({
        'view': [],
        'viewModel': null
      });

      self.moduleConfigEgyptPorts = ko.observable({
        'view': [],
        'viewModel': null
      });

      self.moduleConfigForeignCards = ko.observable({
        'view': [],
        'viewModel': null
      });


      self.moduleConfigForeignPorts = ko.observable({
        'view': [],
        'viewModel': null
      });
      self.cellData = function (cell) {
        //console.log("CELL DATA", cell);
        return cell.data;
      }

      self.postDataPorts = {

      }


      self.postDataCards = {

      }

      self.hideAllTables = function () {
        self.showEgyptCardsTable(false);
        self.showEgyptPortsTable(false);
        self.showForeignCardsTable(false);
        self.showForeignPortsTable(false);
      }

      self.searchByOthers = {

        doSearch: function () {

          self.hideAllTables();
          var sec = self.sec;
          var req
          if (sec.passports.Others.SearchEgypt) {
            self.showEgyptCardsTable(true);
            self.showEgyptPortsTable(true);

            req = self.getRequestData(EGYPT_CARDS);
            self.refreshModule("egyptcards", req, EGYPT_CARDS);

            req = self.getRequestData(EGYPT_PORTS);
            self.refreshModule("egyptports", req, EGYPT_PORTS);
          }

          if (sec.passports.Others.SearchForeign) {
            self.showForeignCardsTable(true);
            self.showForeignPortsTable(true);
            req = self.getRequestData(FOREIGN_CARDS);
            self.refreshModule("foreigncards", req, FOREIGN_CARDS);

            req = self.getRequestData(FOREIGN_PORTS);
            self.refreshModule("foreignports", req, FOREIGN_PORTS);
          }
        }
      }
      self.searchByPassportNo = {


        doSearch: function () {

          var sec = self.sec;
          var req
          self.hideAllTables();
          if (sec.passports.PassportNo.SearchEgypt) {
            self.showEgyptCardsTable(true);
            self.showEgyptPortsTable(true);
            req = self.getRequestData(EGYPT_CARDS);
            self.refreshModule("egyptcards", req, EGYPT_CARDS);

            req = self.getRequestData(EGYPT_PORTS);
            self.refreshModule("egyptports", req, EGYPT_PORTS);
          }

          if (sec.passports.PassportNo.SearchForeign) {
            self.showForeignCardsTable(true);
            self.showForeignPortsTable(true);
            req = self.getRequestData(FOREIGN_CARDS);
            self.refreshModule("foreigncards", req, FOREIGN_CARDS);

            req = self.getRequestData(FOREIGN_PORTS);
            self.refreshModule("foreignports", req, FOREIGN_PORTS);
          }


        }
      }
      self.searchByNationalId = {
        doSearch: function () {
          self.hideAllTables();
          self.showEgyptCardsTable(true);
          var req = self.getRequestData(EGYPT_CARDS);
          self.refreshModule("egyptcards", req, EGYPT_CARDS);
        }
      }


      self.getRequestData = function (type) {
          var req;
          switch (type) {
            case EGYPT_CARDS:
              req = requests.createEgyptCardsInfoRequest();
              req.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no(),
                req.natid = self.natid().length == 0 ? ' ' : self.natid(),
                req.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no(),
                req.natid1 = self.natid().length == 0 ? ' ' : self.natid(),
                req.pname = self.pname(),
                req.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom()),
                req.pbirthdateto = self.dateToNumber(self.pbirthdateto()),
                req.pport_id = self.pport_id(),
                req.pmovement_type = self.pmovement_type(),
                req.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom()),
                req.pmovementdateto = self.dateToNumber(self.pmovementdateto()),
                req.pissueyear = self.pissueyear(),
                req.ppasstype = self.ppasstype(),
                req.pissueplace = self.pissueplace()
              break;
            case EGYPT_PORTS:

              req = requests.createEgyptPortsInfoRequest();

              req.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no();
              req.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no();
              req.pname = self.pname();
              req.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom());
              req.pbirthdateto = self.dateToNumber(self.pbirthdateto());
              req.pport_id = self.pport_id();
              req.pmovement_type = self.pmovement_type();
              req.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom());
              req.pmovementdateto = self.dateToNumber(self.pmovementdateto());
              break;

            case FOREIGN_CARDS:
              req = requests.createForeignCardsInfoRequest();

              req.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no();
              req.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no();
              req.pname = self.pname();
              req.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom());
              req.pbirthdateto = self.dateToNumber(self.pbirthdateto());
              req.pport_id = self.pport_id();
              req.pmovement_type = self.pmovement_type();
              req.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom());
              req.pmovementdateto = self.dateToNumber(self.pmovementdateto());
              req.pnationality = self.pnationality();
              req.ppasstype = self.ppasstype();

              break;

            case FOREIGN_PORTS:
              req = requests.createForeignPortsInfoRequest();

              req.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no();
              req.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no();
              req.pname = self.pname();
              req.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom());
              req.pbirthdateto = self.dateToNumber(self.pbirthdateto());
              req.pport_id = self.pport_id();
              req.pmovement_type = self.pmovement_type();
              req.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom());
              req.pmovementdateto = self.dateToNumber(self.pmovementdateto());
              req.pnationaltiyid = self.pnationaltiyid();
              break;
          }
          return req;
        },

        self.setPostData = function () {
          self.postDataPorts = requests.createEgyptPortsInfoRequest();

          self.postDataPorts.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no(),
            self.postDataPorts.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no(),
            self.postDataPorts.pname = self.pname(),
            self.postDataPorts.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom()),
            self.postDataPorts.pbirthdateto = self.dateToNumber(self.pbirthdateto()),
            self.postDataPorts.pport_id = self.pport_id(),
            self.postDataPorts.pmovement_type = self.pmovement_type(),
            self.postDataPorts.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom()),
            self.postDataPorts.pmovementdateto = self.dateToNumber(self.pmovementdateto()),



            self.postDataCards = requests.createEgyptCardsInfoRequest();

          self.postDataCards.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no(),
            self.postDataCards.natid = self.natid().length == 0 ? ' ' : self.natid(),
            self.postDataCards.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no(),
            self.postDataCards.natid1 = self.natid().length == 0 ? ' ' : self.natid(),
            self.postDataCards.pname = self.pname(),
            self.postDataCards.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom()),
            self.postDataCards.pbirthdateto = self.dateToNumber(self.pbirthdateto()),
            self.postDataCards.pport_id = self.pport_id(),
            self.postDataCards.pmovement_type = self.pmovement_type(),
            self.postDataCards.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom()),
            self.postDataCards.pmovementdateto = self.dateToNumber(self.pmovementdateto()),
            self.postDataCards.pissueyear = self.pissueyear(),
            self.postDataCards.ppasstype = self.ppasstype(),
            self.postDataCards.pissueplace = self.pissueplace()

        }

      self.leadingZero = function (num) {
        var numAsStr = num.toString();
        if (numAsStr.length == 2) return numAsStr;
        return "0" + numAsStr;
      }

      self.dateToNumber = function (dt) {

        if (dt == null || dt.length == 0) return "";
        var d = new Date(dt);
        month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2)
          month = '0' + month;
        if (day.length < 2)
          day = '0' + day;

        return [year, month, day].join('');

      }

      //console.log(self.url);
      self.setortsComboBox = function () {
        // if (self.currentType() == 1) {
        //   self.theports(self.portscards());
        // } else if (self.currentType() == 2) {
        //   self.theports(self.ports());
        // }
      }
      self.doSearch = function () {
        if (self.currentSearchType() == 2)
          self.searchByNationalId.doSearch();
        else if (self.currentSearchType() == 1)
          self.searchByPassportNo.doSearch();
        else if (self.currentSearchType() == 3)
          self.searchByOthers.doSearch();
      }
      self.doSearchPorts = function () {
        self.redrivedData([]);
        self.errorMessages([]);

        self.setPostData();
        //console.log('Passport Number Egypt Post Data Ports', self.postDataPorts);

        self.refreshModule("egyptports", self.postDataPorts);
      }


      self.doSearchCards = function () {
        self.redrivedData([]);
        self.errorMessages([]);

        self.setPostData();
        //console.log('Passport Number Egypt Post Data Cards', self.postDataCards);
        self.refreshModule("egyptcards", self.postDataCards);
      }


      self.refreshModule = function (moduleName, postData, type) {
        var viewPath = 'views/passport/' + moduleName + '.html';
        var modelPath = 'viewModels/passport/' + moduleName;
        var masterPromise = Promise.all([
          moduleUtils.createView({
            'viewPath': viewPath
          }),
          moduleUtils.createViewModel({
            'viewModelPath': modelPath
          })
        ]);
        return masterPromise.then(
          function (values) {
            //console.log("VALUES", values);
            var vModel = values[1];

            //console.log("View Model", vModel);

            vModel = new values[1]();

            vModel.setPostData(postData);

            var finalViewModel = values[1];


            var modConfig = {
              'view': values[0],
              'viewModel': vModel
            }
            switch (type) {
              case EGYPT_CARDS:
                self.moduleConfigEgyptCards(modConfig);
                break;
              case EGYPT_PORTS:
                self.moduleConfigEgyptPorts(modConfig);
                break;
              case FOREIGN_CARDS:
                self.moduleConfigForeignCards(modConfig);
                break;
              case FOREIGN_PORTS:
                self.moduleConfigForeignPorts(modConfig);
                break;
            }


          }
        ); //---then
      } //====setModuleConfig



      self.isPassNoButtonDisabled = ko.observable(true);
      self.isNationalIdButtonDisabled = ko.observable(true);
      self.isOthersButtonDisabled = ko.observable(true);



      self.currentSearchType.subscribe(function (val) {
        self.isPassNoButtonDisabled(false)
        self.isNationalIdButtonDisabled(false);
        self.isOthersButtonDisabled(false);

        self.isPassNoValid();
        self.isNatIdValid();
        self.isPnameValid();
      });


      self.pass_no.subscribe(function (val) {
        self.isPassNoButtonDisabled(false);
        self.isPassNoValid();
      })

      self.natid.subscribe(function (val) {
        self.isNationalIdButtonDisabled(false);
        self.isNatIdValid();
      })
      self.pname.subscribe(function (val) {
        self.isOthersButtonDisabled(false);
        self.isPnameValid();
      })



      self.isPassNoValid = function () {
        var val = self.pass_no();
        if (self.currentSearchType() != 1) {
          self.isPassNoButtonDisabled(true);
          return;
        }
        if (val.length == 0) {

          self.isPassNoButtonDisabled(true);
        } else {
          self.isPassNoButtonDisabled(false);
        }
      }

      self.isNatIdValid = function () {
        self.identityNumMessages([]);
        var val = self.natid();
        if (self.currentSearchType() != 2) {
          self.isNationalIdButtonDisabled(true);
          return;
        } else if ((val.length != 14) || isNaN(val)) {
          self.isNationalIdButtonDisabled(true);
          self.identityNumMessages.push({
            severity: "warning",
            summary: "الصيغة غير صحيحة",
            detail: "يجب أن يتم إدخال أرقام ويكون الرقم مكون من 14 رقم فقط"
          });
        } else {
          self.isNationalIdButtonDisabled(false);
        }

      }

      self.isPnameValid = function () {

        var val = self.pname();
        if (self.currentSearchType() != 3) {
          self.isOthersButtonDisabled(true);
          return;
        }
        if (val.length > 0) {
          self.isOthersButtonDisabled(false);

        } else {
          self.isOthersButtonDisabled(true);
        }
      }

      self.tableListener = function () {
        var table = document.getElementById('table');
      }
    }

    return PassportEgyptForeign;
  }
);