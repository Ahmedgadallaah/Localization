define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig',
    'viewModels/helpers/fetchandcache_alldata', 'appController',
    'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojinputnumber',
    'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojrouter', 'ojs/ojmodule-element-utils',
    'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojmessages',
    'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource',
    'ojs/ojpagingcontrol', , 'ojs/ojrouter', 'ojs/ojcollectiontabledatasource',
    'ojs/ojarraydataprovider', 'ojs/ojtable',
    'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojbutton',
    'ojs/ojselectcombobox',
  ],
  // , detailsInfo, spouseInfo
  function (oj, ko, $, ipConfig, fetchCaheAllDataClass, app) {

    function personInfo() {
      var self = this;




      var childRouter = oj.Router.rootInstance.getChildRouter('persondetails');
      self.isCurrent = childRouter.getState("personInfo").isCurrent();

      self.nationalIdNum = window.localStorage.getItem('idnumber');
      self.showLoadDialog = ko.observable(false);
      //alert("Init Person Details Data Id Numm:" + self.nationalIdNum);
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.personalDetailsData = ko.observableArray([]);
      self.personaSpouseData = ko.observableArray([]);
      self.errorMessages = ko.observableArray([]);
      self.redrivedData = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.currentSearchType = ko.observable(1);
      self.fetchCaheAllData = new fetchCaheAllDataClass();
      self.tracker = ko.observable();
      self.groupValid = ko.observable();
      self.idValue = ko.observable('');

      self.dataprovider = new oj.ArrayDataProvider(self.personalDetailsData, {
        keyAttributes: 'idNum',
        implicitSort: [{
          attribute: 'fullName',
          direction: 'ascending'
        }]
      });


      self.getData = function () {
        self.personalDetailsData([]);
        self.personaSpouseData([]);

        self.fetchCaheAllData.setIdNumber(self.nationalIdNum);
        self.fetchCaheAllData.fillWhat = ['detailsInfo', 'spouseInfo']
        self.fetchCaheAllData.getData(self.errorMessages, 'personInfo_loader').
        then(function (values) {
          var detailsInfo = values[0];
          var spouseInfo = values[1];
          if (detailsInfo.isOK) self.personalDetailsData(detailsInfo.data);
          if (spouseInfo.isOK) self.personaSpouseData(
            spouseInfo.data.ResponseSpouseProfile[spouseInfo.data.ResponseSpouseProfile.length - 1]);
        })
      };
      //self.getPersonData();
      //////////////// spouse Info///////////////////////
      self.liveOrDie = function () {
        //self.personalDetailsData().status == '1' ? 'لا' : 'نعم'
        //console.log("Live or Die", self.personalDetailsData().status)
        if (self.personalDetailsData().status == '1') return "نعم";
        else if (self.personalDetailsData().status == '2') return "لا";
        return "";
      }
      self.maleOrFemale = function () {
        // personalDetailsData().gender== '1' ? 'ذكر' : 'أنثي'
        //console.log("Male Or Female", self.personalDetailsData().gender)
        if (self.personalDetailsData().gender == '1') return 'ذكر';
        else if (self.personalDetailsData().gender == '2') return "انثى";
        return '';
      }

      self.cancel = function () {
        //self.closeLoadDialog();
      }

      self.refresh = function () {
        //location.reload();
        self.errorMessages([]);
        self.getData();
      }
      self.connected = function () {

      }

      self.motherdoSearch = function () {
        var motherIdNum = self.personalDetailsData().motherIdNum;
        var currentStateofviewModel = {
          name: 'personinfo',
          state: '/personDetails/personinfo',
          gridIndex: -1,
          idNumber: window.localStorage.getItem('idnumber'),
          viewModel: self //map.toJSON(self,mapping)
        }
        //console.log("to JS", currentStateofviewModel.viewModel);
        app.addHistory(currentStateofviewModel);

        self.router = oj.Router.rootInstance;
        window.localStorage.setItem('idnumber', motherIdNum);
        //app.refreshModule("personDetails");
        self.router.go("personDetails/temp").then(function () {
          self.router.go("personDetails");
        })
      }
      self.fatherdoSearch = function () {
        var fatherIdnum = self.personalDetailsData().fatherIdNum;
        var currentStateofviewModel = {
          name: 'personinfo',
          state: '/personDetails/personinfo',
          gridIndex: -1,
          idNumber: window.localStorage.getItem('idnumber'),
          viewModel: self //map.toJSON(self,mapping)
        }
        //console.log("to JS", currentStateofviewModel.viewModel);
        app.addHistory(currentStateofviewModel);


        self.router = oj.Router.rootInstance;
        window.localStorage.setItem('idnumber', fatherIdnum);

        //app.refreshModule("personDetails");
        self.router.go("personDetails/temp").then(function () {
          self.router.go("personDetails");
        })

      }


      if (self.isCurrent) self.refresh();
    }
    return personInfo;
  }
);