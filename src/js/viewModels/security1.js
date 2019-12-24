define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig',
    'viewModels/helpers/fecthandcache_personspouseinfo', 'appController', 'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojbutton',
    'ojs/ojcheckboxset', 'ojs/ojvalidationgroup', 'ojs/ojpagingtabledatasource',
    'ojs/ojpagingcontrol', 'ojs/ojmessages'
  ],
  function (oj, ko, $, ipConfig, spouseInfo, app) {

    function security1ViewModel() {
      var self = this;
      //alert("Spouse Info Creation");
      self.router = oj.Router.rootInstance;

      self.showLoadDialog = ko.observable(false);
      self.nationalIdNum = window.localStorage.getItem('idnumber');
      self.counter = ko.observable(++app.counter);
      self.personaSpouseData = ko.observableArray([]);
      self.clickedIndex = ko.observable("");
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      // self.dataprovider = new oj.ArrayDataProvider(self.personaSpouseData, {keyAttributes: 'idNum', implicitSort: [{attribute: 'fullName', direction: 'ascending'}]});

      //alert("Init Spouse Data Id Numm:" + self.nationalIdNum);


      self.currentRow = null;
      self.tracker = ko.observable();
      self.groupValid = ko.observable();
      self.personalIdentityNumber = ko.observable();
      self.persons = ko.observableArray([]);
      self.security1 = ko.observableArray([]);
      //self.dataprovider = new oj.ArrayDataProvider(self.persons);


      self.dataprovider = new oj.ArrayTableDataSource(self.security1, {
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
          "headerText": "رقم القضية",
          "field": "fullName",
          "resizable": "enabled"
        },
        {
          "headerText": "سنة القضية",
          "field": "idNum",
          "resizable": "enabled"
        },

        {
          "headerText": "نوع القضية",
          "field": "spouseMotherName",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "قسم/ مركز",
          "field": "eventDate",
          "resizable": "enabled"
        },
        {
          "headerText": "الجريمة",
          "field": "spouseBirthDate",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "معلومات",
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

      self.getPersonSpouseData = function () {
        self.persons([]);
        self.openLoadDialog();
        spouseInfo.setIdNumber(self.nationalIdNum);
        spouseInfo.getData().then(function (data) {


          if (typeof data.ResponseSpouseProfile === 'undefined') {
            self.closeLoadDialog();
            self.errorMessages.push({
              severity: "error",
              summary: "خطأ",
              detail: "لا يوجد بيانات الزواج"
            });

            return;
          } else {

            if (Array.isArray(data.ResponseSpouseProfile)) {
              data.ResponseSpouseProfile.sort(function (a, b) {
                if (a.eventDate < b.eventDate) return -1;
                if (a.eventDate > b.eventDate) return 1;
                return 0;
              })
            }


            self.personaSpouseData(JSON.parse(JSON.stringify(data.ResponseSpouseProfile[data.ResponseSpouseProfile.length - 1])));
          }




          self.closeLoadDialog();
          //?must be the last item of the array ?????
          //console.log("Spouse Info Data SUCCESS", data.ResponseSpouseProfile);
          //alert("Spouse Info Data SUCCESS");




          obj = JSON.parse(JSON.stringify(data.ResponseSpouseProfile));

          for (i = 0; i < obj.length; i++) {
            obj[i].spouseType = obj[i].spouseType.trim();
            if (obj[i].spouseType == '1') {
              obj[i].spouseType = 'قائمة';
            } else if (obj[i].spouseType == '2') {
              obj[i].spouseType = 'غير قائمة';
            }
          }
          var ar = [];




          self.persons(obj);






        }).catch(function (error) {
          self.closeLoadDialog();
          self.errorMessages.push({
            severity: "error",
            summary: "خطأ استرجاع بيانات زواج المواطن ",
            detail: error.statusText
          });

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
        //  self.getPersonSpouseData();
      }
      //self.getPersonSpouseData();



      self.cancel = function () {
        self.closeLoadDialog();
      }

      self.refresh = function () {
        //alert("Get Data in Spouse Info")
        self.errorMessages([]);
        self.getPersonSpouseData();
      }


      self.clone = function (obj) {
        var clone = {};
        for (k in obj) {
          if (k == 'idNum')
            clone[k] = Math.floor((Math.random() * 100000000000000) + 1).toString();
          else
            clone[k] = obj[k];
        }

        return clone;
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


      function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
      }

      self.dogo = function () {
        self.router.go('security2');
      }

      self.tableListener = function (context, p) {


        //console.log("SELECTION CHANGED");

        //console.log("SELECTION CHANGED", self.currentRow);

        var table = document.getElementById('table');

        self.router.go('security2');
        var currentStateofviewModel = {
          name: 'security1',
          state: '/security1',
          gridIndex: table.currentRow.rowIndex,
          idNumber: window.localStorage.getItem('idnumber'),
          viewModel: self //map.toJSON(self,mapping)
        }
        //console.log("to JS",currentStateofviewModel.viewModel);

        app.addHistory(currentStateofviewModel);



        if (table.currentRow == null) {
          return;
        }
        self.clickedIndex(table.currentRow.rowIndex);

        //console.log("Current Row", table.currentRow);
        //console.log("ROW KEY", table.currentRow.rowKey);

        self.router = oj.Router.rootInstance;

        window.localStorage.setItem('idnumber', table.currentRow.rowKey[0]);



      }

      self.refresh();


    }


    return security1ViewModel;
  }
);