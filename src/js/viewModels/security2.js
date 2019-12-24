define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig', 'viewModels/helpers/fetchandcache_persondetails', 'viewModels/helpers/fecthandcache_personspouseinfo',
    'ojs/ojformlayout',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojmessages'
  ],
  function (oj, ko, $, ipConfig, detailsInfo, spouseInfo) {

    function security2ViewModel() {
      var self = this;

      self.nationalIdNum = window.localStorage.getItem('idnumber');
      self.showLoadDialog = ko.observable(false);
      //alert("Init Person Details Data Id Numm:" + self.nationalIdNum);
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.personalDetailsData = ko.observableArray([]);
      self.security2 = ko.observableArray([]);
      self.personaSpouseData = ko.observableArray([]);
      self.dataprovider = new oj.ArrayDataProvider(self.security2, {
        keyAttributes: 'idNum',
        implicitSort: [{
          attribute: 'fullName',
          direction: 'ascending'
        }]
      });



      self.openLoadDialog = function () {
        // $("#loadPanel").show();
        self.showLoadDialog(true);
      }


      self.closeLoadDialog = function () {
        // $("#loadPanel").hide();
        self.showLoadDialog(false);

      }





      self.getPersonData = function () {
        self.personalDetailsData([]);
        //alert("Refresh Id Number :"+self.nationalIdNum);
        self.openLoadDialog();
        //alert("Now get Person Details " + " ID Num:" + self.nationalIdNum);
        detailsInfo.setIdNumber(self.nationalIdNum);
        detailsInfo.getData().then(function (data) {

          if (typeof data === 'undefined') {
            self.closeLoadDialog();
            self.errorMessages.push({
              severity: "error",
              summary: "خطأ",
              detail: "لاتوجد بيانات المواطن الاساسيه"
            });

            return;
          }
          //console.log("Person Info Details DATA SUCCESS", data);
          //alert("Person Info Details SUCCESS");
          self.personalDetailsData(data);

          self.closeLoadDialog();

        }).catch(function (error) {

          //console.log("Person Info Details ERROR", error);
          self.closeLoadDialog();
          self.errorMessages.push({
            severity: "error",
            summary: "خطأ استرجاع بيانات المواطن الاساسيه",
            detail: error.statusText
          });

        });
      };
      //self.getPersonData();
      //////////////// spouse Info///////////////////////

      self.liveOrDie = function () {
        //self.personalDetailsData().status == '1' ? 'لا' : 'نعم'
        //console.log("Live or Die", self.personalDetailsData().status)
        if (self.personalDetailsData().status == 'نعم') return "نعم";
        else if (self.personalDetailsData().status == 'لا') return "لا";
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
        self.closeLoadDialog();
      }

      self.refresh = function () {
        //location.reload();
        self.errorMessages([]);
        self.getPersonData();
        self.getPersonSpouseData();
      }
      self.personSpouseRequest = {
        "requestType": "62",
        "idNum": self.nationalIdNum,
        "CSOHeader": {
          "OrganizationCode": "10-10",
          "UserName": "AZEID",
          "UserIdnum": "27508122700611",
          "TransactionNumber": "1010",
          "RequestTimeStamp": "2019-06-02 10:10:10.000000",
          "ResponseTimeStamp": ""
        }
      }

      self.connected = function () {

      }


      self.getPersonSpouseData = function () {
        self.personaSpouseData([]);
        spouseInfo.setIdNumber(self.nationalIdNum);
        spouseInfo.getData().then(function (data) {
          //console.log("Person Info Spouse DATA SUCCESS", data);
          if (typeof data.ResponseSpouseProfile === 'undefined') {
            self.errorMessages.push({
              severity: "error",
              summary: "خطأ",
              detail: "لا يوجد بيانات الزواج"
            });
          } else {
            self.personaSpouseData(JSON.parse(JSON.stringify(data.ResponseSpouseProfile[data.ResponseSpouseProfile.length - 1])));
          }
        }).catch(function (error) {
          self.errorMessages.push({
            severity: "error",
            summary: "خطأ استرجاع بيانات الزواج",
            detail: error.statusText
          });
        });
      };

      //self.getPersonSpouseData();
      self.refresh();
    }

    return security2ViewModel;
  }
);