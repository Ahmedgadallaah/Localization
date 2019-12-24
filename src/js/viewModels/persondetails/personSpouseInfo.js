define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig',
    'viewModels/helpers/fetchandcache_alldata', 'appController', 'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojbutton',
    'ojs/ojcheckboxset', 'ojs/ojvalidationgroup', 'ojs/ojpagingtabledatasource',
    'ojs/ojpagingcontrol', 'ojs/ojmessages'
  ],
  function (oj, ko, $, ipConfig, fetchAllDataClass, app) {

    function personSpouseInfo() {
      var self = this;
      var childRouter = oj.Router.rootInstance.getChildRouter('persondetails');
      self.isCurrent = childRouter.getState("personSpouseInfo").isCurrent();

      //alert("Spouse Info Creation");
      self.showLoadDialog = ko.observable(false);
      self.nationalIdNum = window.localStorage.getItem('idnumber');
      self.counter = ko.observable(++app.counter);
      self.personaSpouseData = ko.observableArray([]);
      self.clickedIndex = ko.observable("");
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      // self.dataprovider = new oj.ArrayDataProvider(self.personaSpouseData, {keyAttributes: 'idNum', implicitSort: [{attribute: 'fullName', direction: 'ascending'}]});
      self.fetchAllData = new fetchAllDataClass();
      //alert("Init Spouse Data Id Numm:" + self.nationalIdNum);


      self.currentRow = null;
      self.tracker = ko.observable();
      self.groupValid = ko.observable();
      self.personalIdentityNumber = ko.observable();
      self.persons = ko.observableArray([]);
      //self.dataprovider = new oj.ArrayDataProvider(self.persons);


      self.dataprovider = new oj.ArrayTableDataSource(self.persons, {
        sortCriteria: {
          key: 'idNum',
          direction: 'ascending'
        }
      });

      self.dataprovider.sort({
        key: 'eventDate',
        direction: 'ascending'
      });


      self.pagingDataProvider =
        new oj.PagingTableDataSource(self.dataprovider);

      //console.log("ARRAY DATAPROVIDER", self.dataprovider);

      self.tableColumns = [{
          "headerText": "",
          "field": "idNum",
          "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
        },
        {
          "headerText": "الاسم",
          "field": "fullName",
          "resizable": "enabled"
        },
        {
          "headerText": "رقم الهوية",
          "field": "idNum",
          "resizable": "enabled"
        },

        {
          "headerText": "اسم الام",
          "field": "spouseMotherName",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "تاريخ الزواج/الطلاق",
          "field": "eventDate",
          "resizable": "enabled"
        },
        {
          "headerText": "تاريخ الميلاد",
          "field": "spouseBirthDate",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "حالة الزواج",
          "field": "spouseType",
          "resizable": "enabled"
        }
      ];


      self.getMarStatus = function () {
        //self.personaSpouseData().spouseType ==  1 ?  : 
        if (self.personaSpouseData().spouseType == "2") return 'غير قائم';
        else if (self.personaSpouseData().spouseType == "1") return 'قائمة';
        return "";
      }

      self.openLoadDialog = function () {
        // $("#loadPanel").show();
        self.showLoadDialog(true);
      }


      self.closeLoadDialog = function () {
        // $("#loadPanel").hide();
        self.showLoadDialog(false);
      }

      self.beforeCurrentRow = function (event) {
        //console.log("BEFORE CURRENT ROW", event);
        self.currentRow = event.detail.currentRow;
      }

      self.getData = function () {
        self.persons([]);
        //self.openLoadDialog();
        self.fetchAllData.setIdNumber(self.nationalIdNum);
        self.fetchAllData.fillWhat = [{
          name: 'spouseInfo',
          loader: "personSpouseInfo_loader"
        }];
        self.fetchAllData.getData(self.errorMessages).then(function (values) {
          var info = values[0];

          if (info.isOK) {
            self.personaSpouseData(info.data.ResponseSpouseProfile[info.data.ResponseSpouseProfile.length - 1]);

            obj = info.data.ResponseSpouseProfile;
            self.persons(obj);
          }
        });
      };

      self.connected = function () {

        var currentIdNumber = window.localStorage.getItem('idnumber');

        if (false && self.nationalIdNum !== currentIdNumber) {

          //  alert("LastIdNum: " + self.nationalIdNum + " Current: " + currentIdNumber);
          //alert("We Must Refresh Because stored idNumber changed");
          self.nationalIdNum = currentIdNumber;
          self.refresh();
        }

        //  self.nationalIdNum = window.localStorage.getItem('idnumber');
        //alert("Get Spouse Data" + " Id Numm:" + self.nationalIdNum);
        //  self.getData();
      }
      //self.getData();



      self.cancel = function () {
        self.closeLoadDialog();
      }

      self.refresh = function () {
        //alert("Get Data in Spouse Info")
        self.errorMessages([]);
        self.getData();
      }



      self.transitionCompleted = function () {


        if (self.clickedIndex() !== '') {

          self.selectRowIndex(self.clickedIndex());

        }
      }
      self.selectRowIndex = function (index) {
        table = document.getElementById("table");
        table.selection = [{
          startIndex: {
            "row": index
          },
          endIndex: {
            "row": index
          }
        }];
      }

      self.tableListener = function (context, p) {

        //console.log("SELECTION CHANGED");

        //console.log("SELECTION CHANGED", self.currentRow);

        var table = document.getElementById('table');


        var currentStateofviewModel = {
          name: 'personSpouseInfo',
          state: '/personDetails/personSpouseInfo',
          gridIndex: table.currentRow.rowIndex,
          idNumber: window.localStorage.getItem('idnumber'),
          viewModel: self //map.toJSON(self,mapping)
        }
        //console.log("to JS", currentStateofviewModel.viewModel);

        app.addHistory(currentStateofviewModel);



        if (table.currentRow == null) {
          return;
        }
        self.clickedIndex(table.currentRow.rowIndex);

        //console.log("Current Row", table.currentRow);
        //console.log("ROW KEY", table.currentRow.rowKey);

        self.router = oj.Router.rootInstance;

        window.localStorage.setItem('idnumber', table.currentRow.rowKey[0]);


        self.router.go('personDetails');
      }

      if (self.isCurrent) self.refresh();


    }


    return personSpouseInfo;
  }
);