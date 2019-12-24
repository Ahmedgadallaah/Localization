/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodule-element-utils',
    'viewModels/helpers/ipConfig', 'viewModels/helpers/requests', 'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojinputnumber', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox',
    'ojs/ojrouter', 'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojformlayout',
    'ojs/ojlabel', 'ojs/ojmessages', 'ojs/ojpagingtabledatasource',
    'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol', 'ojs/ojradioset',
  ],
  function (oj, ko, $, moduleUtils, ipConfig, requests) {

    function PassportNumberForeign(type) {
      var self = this;

      //console.log("MAP", map);
      self.currentSearchType = ko.observable(1);
      self.currentSearchType.subscribe(function (val) {
        self.resetVars();
      })

      self.currentType = ko.observable(type)
      self.currentType.subscribe(function (val) {
        self.setPortsComboBox();
      });

      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.scrollPos = ko.observable({
        rowIndex: 1
      });
      self.scrollPosInfo = ko.observable(null);
      self.clickedIndex = ko.observable("");




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




      self.portsdrop = ko.observable('');
      self.redrivedData = ko.observableArray([]);
      self.tableValues = ko.observableArray([]);
      self.selectedTableValue = ko.observable();
      self.theports = ko.observableArray([]);
      self.thenats = ko.observableArray([]);
      self.ports = ko.observableArray([]);
      self.selectedPort = ko.observable('');
      self.portscards = ko.observableArray([]);
      self.selectedPortcard = ko.observable('');






      self.resetVars = function () {

        self.pname('');
        self.pass_no('');
        self.pass_no1('');
        self.natid('');
        self.natid1('');
        self.pissueyear('');
        self.ppasstype('');
        self.pissueplace('');
        self.pbirthdatefrom('');
        self.pbirthdateto('');
        self.pmovement_type('');
        self.pmovementdatefrom('');
        self.pport_id('');
        self.pmovementdateto('');
        self.pnationality('');
        self.pnationaltiyid('');

      }

      self.getPortsUrl = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/getAllPortsForRestService';
      self.getPorts = function () {

        $.ajax({
          url: self.getPortsUrl,
          type: 'GET',

        }).done(function (data) {

          self.ports(data.LkpPortsForPorts.map(function (item) {
            return {
              value: item.portId.toString(),
              label: item.portName
            }
          }));
          self.ports.unshift({
            value: '',
            label: "الجميع"
          });
          //console.log('PORTS: ', self.ports());
          self.setPortsComboBox();
        }).fail(function (error) {



          //console.log(error);
        });
      };

      self.getPorts();




      // self.getNatUrl = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/ExitEntryEgy_SBProject/getAllPortsForRestService';
      // self.getcardPorts = function () {

      //   $.ajax({
      //     url: self.getPortsUrlcard,
      //     type: 'GET',

      //   }).done(function (data) {

      //     self.portscards(data.LkpExitForGeo.map(function (item) {
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



      self.getPortsUrlcard = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/ExitEntryEgy_SBProject/getAllPortsForRestService';
      self.getcardPorts = function () {

        $.ajax({
          url: self.getPortsUrlcard,
          type: 'GET',

        }).done(function (data) {

          self.portscards(data.LkpExitForGeo.map(function (item) {
            return {
              value: item.geoId.toString(),
              label: item.geoName
            }
          }));
          self.portscards.unshift({
            value: '',
            label: "الجميع"
          });
          //console.log('PORTS: ', self.portscards());
          self.setPortsComboBox();
        }).fail(function (error) {
          //console.log(error);
        });
      };

      self.getcardPorts();

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


      self.moduleConfig = ko.observable({
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



      self.setPostData = function () {
        self.postDataPorts = requests.createForeignPortsInfoRequest();

        self.postDataPorts.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no();
        self.postDataPorts.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no();
        self.postDataPorts.pname = self.pname();
        self.postDataPorts.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom());
        self.postDataPorts.pbirthdateto = self.dateToNumber(self.pbirthdateto());
        self.postDataPorts.pport_id = self.pport_id();
        self.postDataPorts.pmovement_type = self.pmovement_type();
        self.postDataPorts.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom());
        self.postDataPorts.pmovementdateto = self.dateToNumber(self.pmovementdateto());
        self.postDataPorts.pnationaltiyid = self.pnationaltiyid();

        self.postDataCards = requests.createForeignCardsInfoRequest();

        self.postDataCards.pass_no = self.pass_no().length == 0 ? ' ' : self.pass_no();
        self.postDataCards.pass_no1 = self.pass_no().length == 0 ? ' ' : self.pass_no();
        self.postDataCards.pname = self.pname();
        self.postDataCards.pbirthdatefrom = self.dateToNumber(self.pbirthdatefrom());
        self.postDataCards.pbirthdateto = self.dateToNumber(self.pbirthdateto());
        self.postDataCards.pport_id = self.pport_id();
        self.postDataCards.pmovement_type = self.pmovement_type();
        self.postDataCards.pmovementdatefrom = self.dateToNumber(self.pmovementdatefrom());
        self.postDataCards.pmovementdateto = self.dateToNumber(self.pmovementdateto());
        self.postDataCards.pnationality = self.pnationality();
        self.postDataCards.ppasstype = self.ppasstype();


      }



      self.leadingZero = function (num) {

        var numAsStr = num.toString();
        if (numAsStr.length == 2) return numAsStr;
        return "0" + numAsStr;
      }

      self.dateToNumber = function (dt) {

        if (dt == null || dt.length == 0) return "";
        var d = new Date(dt),
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
      self.setPortsComboBox = function () {
        if (self.currentType() == 1) {
          self.theports(self.portscards());
        } else if (self.currentType() == 2) {
          self.theports(self.ports());
        }
      }
      self.doSearch = function () {
        if (self.currentType() == 1) self.doSearchCards();
        else if (self.currentType() == 2) self.doSearchPorts();
      }
      self.doSearchPorts = function () {
        self.redrivedData([]);
        self.errorMessages([]);
        // document.getElementById("load").style.visibility = "visible";
        // document.getElementById("loader").style.visibility = "visible";

        self.setPostData();
        //console.log('Passport Number Foreign Post Data Ports', self.postDataPorts);

        self.refreshModule("foreignports", self.postDataPorts);
      }


      self.doSearchCards = function () {
        self.redrivedData([]);
        self.errorMessages([]);
        // document.getElementById("load").style.visibility = "visible";
        // document.getElementById("loader").style.visibility = "visible";
        //console.log('Post Data:', self.postData);
        self.setPostData();
        //console.log('Passport Number Foreign Post Data Cards', self.postDataCards);
        self.refreshModule("foreigncards", self.postDataCards).catch(function (error) {
          //console.log("ERROR", error);
        });
      }


      self.refreshModule = function (moduleName, postData) {
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
            self.moduleConfig({
              'view': values[0],
              'viewModel': vModel
            });
          }
        ); //---then


      } //====setModuleConfig






      self.tableListener = function () {
        var table = document.getElementById('table');
      }
    }

    return PassportNumberForeign;
  }
);