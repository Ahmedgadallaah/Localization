/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery',
    'viewModels/helpers/ipConfig', 'viewModels/helpers/fetchandcache_alldata', 'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojinputnumber', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox',
    'ojs/ojrouter', 'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojformlayout',
    'ojs/ojlabel', 'ojs/ojmessages', 'ojs/ojpagingtabledatasource',
    'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol'
  ],
  function (oj, ko, $, ipConfig, fetchAllDataClass) {

    function ForeignPorts() {
      var self = this;



      self.fetchAllData = new fetchAllDataClass();

      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.scrollPos = ko.observable({
        rowIndex: 1
      });
      self.scrollPosInfo = ko.observable(null);
      self.clickedIndex = ko.observable("");


      self.redrivedData = ko.observableArray([]);
      self.tableValues = ko.observableArray([]);
      self.selectedTableValue = ko.observable()

      self.columns = [{
          "headerText": "م",
          "field": "",
          "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
        },
        {
          "headerText": "الاسم الكامل",
          "field": "PERSON_NAME",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "رقم الجواز",
          "field": "PASS_NO",
          "resizable": "enabled"
        },
        {
          "headerText": "الجهة",
          "field": "COME_FROM",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "المنفذ/ الميناء",
          "field": "PORT_NAME",
          "resizable": "enabled"
        },
        {
          "headerText": "تاريخ الحركة",
          "field": "MOVEMENT_DATE",
          "resizable": "enabled"
        },
        {
          "headerText": "رقم الرحلة",
          "field": "TRIP_NO",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "الجنسية",
          "field": "NATIONALITY_NAME",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "نوع الحركة",
          "field": "MOVEMENT_TYPE_ID",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        }
      ];



      self.dataprovider = new oj.ArrayTableDataSource(self.redrivedData);


      // {
      //   idAttribute: 'PASS_NO',
      //   sortCriteria: {
      //     key: 'PASS_NO',
      //     direction: 'ascending'
      //   }
      // }

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
      self.pagingDataProvider = new oj.PagingTableDataSource(self.dataprovider);

      self.moduleConfig = ko.observable({
        'view': [],
        'viewModel': null
      });





      //   self.url = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/PortsForRestService';




      self.cellData = function (cell) {
        //console.log("CELL DATA", cell);
        return cell.data;
      }



      self.postData = {};
      self.setPostData = function (data) {
        self.postData = data;
      }

      //console.log(self.url);

      // self.getData = function () {
      //   console.log("POST DATA", self.postData);

      //   return new Promise(function (resolve, reject) {
      //     $.ajax({
      //       url: self.url,
      //       type: 'POST',
      //       data: JSON.stringify(self.postData),
      //       contentType: 'application/json;charset=UTF-8',
      //       dataType: 'json',
      //       success: function (data) {
      //         console.log('success data: ', data);
      //         resolve(data);
      //       },
      //       error: function (error) {
      //         reject(error);
      //         console.log('Error: ', error);
      //       }

      //     });

      //   })
      // };

      self.doSearch = function () {
        self.redrivedData([]);
        self.errorMessages([]);

        //console.log('Post Data:', self.postData);
        self.fetchAllData.fillWhat = [{
          name: 'foreignPortsInfo',
          postData: self.postData
        }];
        self.fetchAllData.getData(self.errorMessages).then(function (values) {
          //console.log('The Data OTHERS', data.portsForMovsOutput);
          var info = values[0];
          if (info.isOK) self.redrivedData(info.data.portsForMovsOutput);
        });
      }

      self.connected = function () {
        //console.log("URL Service Foreign Ports", self.url)
        self.doSearch();
      }





      self.tableListener = function () {
        var table = document.getElementById('table');


      }
    }

    return ForeignPorts;
  }
);