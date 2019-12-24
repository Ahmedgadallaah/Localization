define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig',
    'viewModels/helpers/fetchandcache_alldata', 'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojbutton', 'ojs/ojmessages'
  ],
  function (oj, ko, $, ipConfig, fetchAllDataClass) {

    function personDeathInfo() {
      var self = this;
      var childRouter = oj.Router.rootInstance.getChildRouter('persondetails');
      self.isCurrent = childRouter.getState("personDeathInfo").isCurrent();


      self.showLoadDialog = ko.observable(false);
      self.nationalIdNum = window.localStorage.getItem('idnumber');
      self.personalDeathData = ko.observableArray(['']);
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.fetchAllData = new fetchAllDataClass();



      self.openLoadDialog = function () {
        //$("#loadPanel").show();
        self.showLoadDialog(true);
      }
      self.closeLoadDialog = function () {
        //    $("#loadPanel").hide();
        self.showLoadDialog(false);

      }

      self.maleOrFemale = function () {
        // personalDetailsData().gender== '1' ? 'ذكر' : 'أنثي'
        //console.log("Male Or Female", self.personalDeathData().gender)
        if (self.personalDeathData().gender == '1') return 'ذكر';
        else if (self.personalDeathData().gender == '2') return "انثى";
        return '';
      }


      self.cancel = function () {
        self.closeLoadDialog();
      }

      self.refresh = function () {
        //location.reload();
        self.errorMessages([]);
        self.getData();
      }

      self.getData = function () {
        self.openLoadDialog();
        self.fetchAllData.setIdNumber(self.nationalIdNum);
        self.fetchAllData.fillWhat = ['deathInfo'];
        self.fetchAllData.getData(self.errorMessages, 'personDeathInfo_loader').then(function (values) {
          var info = values[0];

          if (info.isOK)
            self.personalDeathData(JSON.parse(JSON.stringify(info.data)));

        });

      };


      // self.getData();
      if (self.isCurrent) self.refresh();
    }

    return personDeathInfo;
  }
);