define(['ojs/ojcore', 'knockout', 'jquery',
    'viewModels/helpers/ipConfig', 'viewModels/helpers/fetchandcache_alldata',
    'appController', 'viewModels/helpers/requests',
    'ojs/ojformlayout', , 'ojs/ojselectcombobox',
    'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
    'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol',
    'ojs/ojvalidationgroup', 'ojs/ojarraydataprovider', 'ojs/ojtable', 'ojs/ojmessages', 'ojs/ojradioset'
  ],
  function (oj, ko, $, ipConfig, fetchAllDataClass, app, requests) {

    function securityViewModel() {


      var self = this;
      self.nationalIdNum = window.localStorage.getItem('idnumber');

      self.fetchAllData = new fetchAllDataClass();
      self.tracker = ko.observable();
      self.carID = ko.observable();
      self.clickedIndex = ko.observable("");
      self.groupValid = ko.observable();
      self.identityNum = ko.observable('');
      self.vechils = ko.observableArray([]);
      self.drives = ko.observableArray([]);
      self.plateNumber = ko.observable('');
      self.chaissNum = ko.observable('');
      self.motorNum = ko.observable('');
      self.caseNum = ko.observable('');
      self.year = ko.observable('');
      self.plateNum = ko.observable('');
      self.plateNum1 = ko.observable('');
      self.plateNum2 = ko.observable('');
      self.plateNum3 = ko.observable('');
      self.plateNum4 = ko.observable('');
      self.plateNum5 = ko.observable('');
      self.plateNum6 = ko.observable('');
      self.plateNum7 = ko.observable('');
      self.plateNum8 = ko.observable('');
      self.currentSearchType = ko.observable(1);
      self.currentplateSearchType = ko.observable();
      self.selectedGov = ko.observable('');
      self.govs = ko.observableArray([]);
      self.selectedType = ko.observable('');
      self.types = ko.observableArray([]);

      self.status = ko.observable(0);
      self.errorMessages = ko.observableArray([]);
      self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
      self.identityNumMessages = ko.observableArray([]);
      self.plateNumAlphaNumMessages = ko.observableArray([]);
      self.plateNumMessages = ko.observableArray([]);

      self.showDriveLicenseTable = ko.observable(false);
      self.showCarsTable = ko.observable(false);
      self.clickSearch = ko.observable(false);
      self.identityNumPassport = ko.observable('');

      self.identityNumDocument = ko.observable('');

      self.plateNumAlpha = ko.observable('');

      self.isPLateNumButtonDisabled = ko.observable(true);
      self.isPLateNumAlphaButtonDisabled = ko.observable(true);
      self.isIdNumButtonDisabled = ko.observable(true);



      // self.identityNum.subscribe(function(val){

      // });

      // self.plateNumAlpha.subscribe(function(val))


      self.carDataProvider = new oj.ArrayTableDataSource(self.vechils, {
        idAttribute: 'ID',
      });

      self.carPagingDataProvider =
        new oj.PagingTableDataSource(self.carDataProvider);

      self.driveDataProvider = new oj.ArrayTableDataSource(self.drives, {
        idAttribute: 'LNUM',

      });

      self.drivePagingDataProvider =
        new oj.PagingTableDataSource(self.driveDataProvider);

      self.clearData = function () {
        self.vechils([]);
        self.drives([]);
      }






      self.driveTableColumns = [{
          "headerText": "",
          "field": "LNUM",
          "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
        },
        {
          "headerText": "إسم المواطن",
          "field": "FULLNAME",
          "resizable": "enabled"
        },
        {
          "headerText": "رقم الرخصة",
          "field": "LNUM",
          "resizable": "enabled"
        },
        {
          "headerText": "وحدة المرور",
          "field": "ISSUEPLACENAME",
          "resizable": "enabled"
        },
        {
          "headerText": "نوع الرخصة",
          "field": "TYPENAME",
          "resizable": "enabled"
        },

        {
          "headerText": "تاريخ الإصدار",
          "field": "ISSUEDATE",
          "resizable": "enabled"
        },
        {
          "headerText": "نهاية الرخصة",
          "field": "EXPIRYDATE",
          "resizable": "enabled"
        }
      ];

      self.carTableColumns = [{
          "headerText": "",
          "field": "idNum",
          "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
        },
        {
          "headerText": "رقم اللوحة",
          "field": "PLATENUM",
          "resizable": "enabled"
        },
        {
          "headerText": "وحدة المرور",
          "field": "ISSUEPLACENAME",
          "resizable": "enabled"
        },

        {
          "headerText": "نوع اللوحة",
          "field": "PLATETYPENAME",
          "resizable": "enabled"
        },
        {
          "headerText": "الماركة",
          "field": "MAKENAME"
        },
        {
          "headerText": "الموديل ",
          "field": "MODELNAME",
          "resizable": "enabled"
        },
        {
          "headerText": "النوع ",
          "field": "FORMNAME",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "اللون",
          "field": "COLORNAME",
          "headerClassName": "oj-sm-only-hide",
          "className": "oj-sm-only-hide",
          "resizable": "enabled"
        },
        {
          "headerText": "المحافظة",
          "field": "GOVNAME",
          "resizable": "enabled"
        },
      ];


      self.setTableColumns = function () {

      }
      self.isSearchButtonDisabled = ko.observable(true);
      self.identityNumMessages = ko.observableArray([]);

      self.currentSearchType.subscribe(function (val) {
        self.isSearchButtonDisabled(false);

        self.isIdentityNumValid();
        self.isPlatNumValid();
        self.isPlateNumAlphaValid();
      });

      self.identityNum.subscribe(function (val) {
        self.isIdentityNumValid();
      });

      self.plateNum.subscribe(function (val) {
        self.isPlatNumValid();
      });

      self.plateNumAlpha.subscribe(function (val) {
        self.isPlateNumAlphaValid();
      })


      self.isPlatNumValid = function () {
        var val = self.plateNum();
        self.plateNumMessages([]);

        // self.isSearchButtonDisabled(false);
        if (self.currentSearchType() != 2) {
          self.isPLateNumButtonDisabled(true);
          return;
        }

        //console.log("Is Valid", isNaN(val));
        if (((val.length > 7)) || isNaN(val)) {
          self.isPLateNumButtonDisabled(true);
          self.plateNumMessages.push({
            severity: "warning",
            summary: "الصيغة غير صحيحة",
            detail: "يجب أن يتم إدخال أرقام ويكون الرقم مكون من 1-7 ارقام فقط"
          });
        } else if (val.length == 0) {
          self.isPLateNumAlphaButtonDisabled(true);
        } else {
          self.isPLateNumButtonDisabled(false);
        }
      }



      self.isPlateNumAlphaValid = function () {
        var val = self.plateNumAlpha();
        self.plateNumAlphaNumMessages([]);

        // self.isSearchButtonDisabled(false);
        if (self.currentSearchType() != 3) {
          self.isPLateNumAlphaButtonDisabled(true);
          return;
        }

        //console.log("Is Valid", isNaN(val));
        if ((val.length > 7)) {
          self.isPLateNumAlphaButtonDisabled(true);
          self.plateNumAlphaNumMessages.push({
            severity: "warning",
            summary: "الصيغة غير صحيحة",
            detail: "يجب أن يتم إدخال أرقام وحروف ويكون التكوين من 1-7 فقط"
          });

          //console.log("identityNumMessages", self.identityNumMessages())
        } else if (val.length == 0) {
          self.isPLateNumAlphaButtonDisabled(true);
        } else {
          self.isPLateNumAlphaButtonDisabled(false);
        }
      }

      self.showHideControls = function () {
        var sec = app.securityData;
        //sec.cars.NationalId.has_66 = false;
        //console.log("AHWAL ", sec);
        self.showCarsTable(sec.cars.NationalId.visible &&
          (sec.cars.NationalId.has_60 || sec.cars.PlateAplhaNum.has_61 || sec.cars.PlateNum.has_62));
        self.showDriveLicenseTable(sec.cars.NationalId.visible && sec.cars.NationalId.has_66);
      }
      self.isIdentityNumValid = function () {
        var val = self.identityNum();
        self.identityNumMessages([]);
        //  self.isSearchButtonDisabled(false);
        if (self.currentSearchType() != 1) {
          self.isIdNumButtonDisabled(true);
          return;
        }
        //console.log("Is Valid", isNaN(val));
        if (val.length > 0) {
          if ((val.length != 14) || isNaN(val)) {
            self.isIdNumButtonDisabled(true);
            self.identityNumMessages.push({
              severity: "warning",
              summary: "الصيغة غير صحيحة",
              detail: "يجب أن يتم إدخال أرقام ويكون الرقم مكون من 14 رقم فقط"
            });
          } else {
            self.isIdNumButtonDisabled(false);
          }
        } else {
          self.isIdNumButtonDisabled(true);
        }
      }

      self.getGovsUrl = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/TIT_SBProject/GetGovsRestService';
      self.getTypesUrl = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/TIT_SBProject/GetPlateTypeRestService';

      self.getGovs = function () {

        $.ajax({
          url: self.getGovsUrl,
          type: 'GET',

        }).done(function (data) {

          self.govs(data.Gov.map(function (item) {
            return {
              value: item.govid,
              label: item.govname
            }
          }));
          self.govs.unshift({
            value: "",
            label: "الجميع"
          });
          //console.log('GOVS: ', self.govs());
        }).fail(function (error) {



          //console.log(error);
        });
      };

      self.getTypes = function () {

        $.ajax({
          url: self.getTypesUrl,
          type: 'GET',

        }).done(function (data) {

          self.types(data.Platetype.map(function (item) {
            return {
              value: item.platetype,
              label: item.platetypename
            }
          }));
          self.types.unshift({
            value: "",
            label: "الجميع"
          });
          //console.log('Types: ', self.types());
        }).fail(function (error) {
          //console.log(error);
        });
      };
      self.getGovs();
      self.getTypes();
      self.showHideControls();

      self.doSearch = function () {
        self.setTableColumns();
        if (self.currentSearchType() == 1)
          self.doSearchByIdNumber();
        else if (self.currentSearchType() == 2)
          self.doSearchByOldPlateNumber();
        else if (self.currentSearchType() == 3)
          self.doSearchByPlateNumber();
        else if (self.currentSearchType() == 4)
          self.doSearchByDriverLicense();
      }
      self.doSearchByIdNumber = function () {
        self.errorMessages([]);
        self.clearData();
        if (tracker.valid == 'valid') {
          self.fetchAllData.setIdNumber(self.identityNum());
          self.fetchAllData.fillWhat = ['carInfo', 'driveInfo'];
          self.fetchAllData.getData(self.errorMessages, 'idnum_loader').then(function (values) {
            var carInfo = values[0];
            var driveInfo = values[1];

            self.clickSearch(true);
            if (carInfo.isOK) {
              var showCars = self.showCarsTable();
              if (showCars)
                self.vechils(carInfo.data.getTITInfoOutput);
            }
            if (driveInfo.isOK) {
              var showDrives = self.showDriveLicenseTable();

              if (showDrives)
                self.drives(driveInfo.data.getDLInfoOutput);
            }
          });
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      }

      self.doSearchByOldPlateNumber = function () {


        //console.log("doSearchByOldPlateNumber Invoke");
        self.errorMessages([]);
        self.clearData();
        if (tracker.valid == 'valid') {
          var carRequest = requests.createCarInfoRequest();

          carRequest.pnum = '',
            carRequest.pnum1 = '',
            carRequest.pnum2 = '',
            carRequest.platenum = '',
            carRequest.platenum1 = self.plateNum(),
            carRequest.ptype = self.selectedType() == -1 ? "" : self.selectedType(),
            carRequest.govid = self.selectedGov() == -1 ? "" : self.selectedGov()

          // var carRequest = {
          //   "pnum": '',
          //   "pnum1": '',
          //   "pnum2": '',
          //   "platenum": '',
          //   "platenum1": self.plateNum(),
          //   "ptype": self.selectedType() == -1 ? "" : self.selectedType(),
          //   "govid": self.selectedGov() == -1 ? "" : self.selectedGov()
          // }
          self.fetchAllData.setIdNumber(self.identityNum());
          self.fetchAllData.fillWhat = [{
            name: 'carInfo',
            postData: carRequest
          }];
          //console.log("CAR REQUEST", carRequest);
          self.fetchAllData.getData(self.errorMessages, 'platenum_loader').then(function (values) {
            var info = values[0];

            self.clickSearch(true);

            if (info.isOK)
              self.vechils(info.data.getTITInfoOutput);

          })
        } else {

          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      }


      self.doSearchByPlateNumber = function () {
        self.errorMessages([]);
        self.clearData();
        if (tracker.valid == 'valid') {
          var carRequest = requests.createCarInfoRequest();


          carRequest.pnum = "";
          carRequest.platenum = self.plateNumAlpha();
          carRequest.pnum1 = "";
          carRequest.pnum2 = "";
          carRequest.platenum1 = '';
          carRequest.ptype = "";
          carRequest.govid = ""

          // var carRequest = {
          //   "pnum": "",
          //   "platenum": self.plateNumAlpha(),
          //   "pnum1": "",
          //   "pnum2": "",
          //   "platenum1": '',
          //   "ptype": "",
          //   "govisPLateNumButtonDisabled": ""
          // }
          self.fetchAllData.setIdNumber(self.identityNum());
          self.fetchAllData.fillWhat = [{
            name: 'carInfo',
            postData: carRequest
          }];
          self.fetchAllData.getData(self.errorMessages, 'platealphanum_loader').then(function (values) {
            var info = values[0];
            self.clickSearch(true);

            if (info.isOK) self.vechils(info.data.getTITInfoOutput);
          });
        } else {

          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      }

      self.doSearchByDriverLicense = function () {
        self.errorMessages([]);
        self.clearData();
        if (tracker.valid == 'valid') {

          self.fetchAllData.setIdNumber(self.identityNum());
          self.fetchAllData.fillWhat = [{
            name: 'driveInfo'
          }];
          self.fetchAllData.getData(self.errorMessages).then(function (values) {
            var info = values[0];
            if (info.isOK) self.vechils(info.data.getDLInfoOutput);
          });
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
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

      self.carTableListener = function () {
        var table = document.getElementById('table');
        self.clickedIndex(table.currentRow.rowIndex);
        self.carID(table.currentRow.rowKey);
        var car = self.vechils().find(function (element) {
          return element.ID === self.carID();
        });
        var currentStateofviewModel = {
          name: 'searchidnumber',
          state: '/vehicles/searchidnumber',
          gridIndex: table.currentRow.rowIndex,
          idNumber: window.localStorage.getItem('idnumber'),
          viewModel: self //map.toJSON(self,mapping)
        }
        app.addHistory(currentStateofviewModel);

        self.router = oj.Router.rootInstance;
        self.router.getState('car').value = car;
        self.router.go('car');

      }
      self.driveTableListener = function () {
        var table = document.getElementById("drivestable");

        var currentStateofviewModel = {
          name: 'searchidnumber',
          state: '/vehicles/searchidnumber',
          gridIndex: table.currentRow.rowIndex,
          idNumber: window.localStorage.getItem('idnumber'),
          viewModel: self //map.toJSON(self,mapping)
        }


        app.addHistory(currentStateofviewModel);

        //self.nationalIdNum(table.currentRow.rowKey);
        var newIdNumber = table.currentRow.rowKey;
        self.router = oj.Router.rootInstance;

        //window.localStorage.setItem('idnumber', self.nationalIdNum());
        window.localStorage.setItem('idnumber', newIdNumber);

        self.router.go('personDetails');
      }


      self.connected = function () {
        var carIdentity = document.getElementById("carIdentity");
        //console.log("element", carIdentity);

        carIdentity.addEventListener("keyup", function (event) {
          if (event.keyCode == 13 && self.isSearchButtonDisabled() != true) {

            self.doSearch();

          }
        });
      }

    }

    return securityViewModel;
  }
);




define(['ojs/ojcore', 'knockout', 'jquery',
    'viewModels/helpers/ipConfig', 'viewModels/helpers/fetchandcache_alldata',
    'appController', 'viewModels/helpers/requests',
    'ojs/ojformlayout', , 'ojs/ojselectcombobox',
    'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
    'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol',
    'ojs/ojvalidationgroup', 'ojs/ojarraydataprovider', 'ojs/ojtable', 'ojs/ojmessages', 'ojs/ojradioset'
  ],
  function (oj, ko, $, ipConfig, fetchAllDataClass, app, requests) {



    return SearchPlateViewModel;
  }
);