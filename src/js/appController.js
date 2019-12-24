/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element',
    'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
    'jquery', 'appController', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojcheckboxset',
    'ojs/ojoffcanvas', 'ojs/ojarraydataprovider'
  ],
  function (oj, ko, $, moduleUtils, app) {
    function ControllerViewModel() {
      var self = this;

      self.history = ko.observableArray([]);
      self.historyProvider = new oj.ArrayDataProvider(self.history);

      self.addHistory = function (ele) {
        self.history.push(ele);
      }
      self.popHistory = function () {
        return self.history.pop();
      }
      self.isBack = false;
      self.nextRoute = null;
      self.isBackDisabled = ko.computed(function () {
        return self.history().length == 0;
      });
      self.resetHistory = function () {
        self.isBack = false;
        self.nextRoute = null;
      }

      self.counter = 0;
      window.onpopstate = function (e) {

        if (window.location.hash != '#undefined') {

        }
      }

      self.goBack = function () {

        self.isBack = true;
        self.nextRoute = self.popHistory();
        console.log("nextRoute", self.nextRoute);
        var currentParentViewName = oj.Router.rootInstance.currentState().id;
        parentNames = ['personDetails', 'dashboard'];
        if (currentParentViewName == "personDetails") {
          self.handleGoBack(self.personDetailsViewModel);
        } else if (currentParentViewName == "dashboard") {
          self.handleGoBack(self.dashboardViewModel);
        } else {
          self.goNormalBack();
        }
      } //====goBack Function

      self.handleGoBack = function (parentViewModelInstance) {

        var currentChildViewName = "";
        if (parentViewModelInstance != null) {
          currentChildViewName = parentViewModelInstance.subRouter.currentState().id;

          if (currentChildViewName == self.nextRoute.name) {
            //alert("Now Setting module Config")

            parentViewModelInstance.refreshModule(currentChildViewName).
            then(function () {
              //alert("OK set module config");
              //  self.resetHistory();
              oj.Router.sync().then(
                function () {},
                function (error) {
                  oj.Logger.error('Error during refresh: ' + error.message);
                }
              );
            });
            return;
          } //==currentChildViewName == self.nextRoute.name
          else {
            self.goNormalBack();
          } //===else
        } //=====parentViewModelInstance!=null
      } //==handle go back function

      self.goNormalBack = function () {
        //alert("Go Back Normal");

        oj.Router.rootInstance.go(self.nextRoute.state);
      } //====goNormalBack function


      self.personDetailsViewModel = null;
      self.dashboardViewModel = null;

      self.getCurrentIdNumber = function () {
        //alert(window.localStorage.getItem("idnumber"));
      }

      self.navData = ko.observableArray([]);
      self.navDataSource = new oj.ArrayTableDataSource(self.navData, {
        idAttribute: 'id'
      });
      self.showAhwal = ko.observable(false);
      self.showCars = ko.observable(false);
      self.showPrisoners = ko.observable(false);
      self.showPassports = ko.observable(false);

      self.securityData = null;
      self.lastPage = null;

      self.setSecDataToStorage = function (secData) {
        window.localStorage.setItem("sec", JSON.stringify(secData));
      }

      self.getSecDataFromStorage = function () {
        var sec = window.localStorage.getItem("sec");
        if (sec != null) return JSON.parse(sec);
        return null;
      }



      self.initRouters = function () {

        var config = {};
        var ar = [];
        config['login'] = {
          label: 'دخول',

        }
        //ar.push(config['login']);
        if (self.securityData != null) { //===user has permission 

          if (self.securityData.ahwal.visible) {
            config['dashboard'] = {
              label: 'الاحوال'
            };
            ar.push(config['dashboard']);
          }

          config['services'] = {
            label: 'الخدمات'
          };

          if (self.securityData.cars.visible) {
            config['vehicles'] = {
              label: 'المركبات'
            };
            ar.push(config['vehicles']);
          }
          config['personDetails'] = {
            label: 'التفاصيل الخاصة بالمواطن'
          };
          if (self.securityData.prisoners.visible) {
            config['prisoners'] = {
              label: 'السجون'
            };
            ar.push(config['prisoners']);
          }
          // if (self.securityData.prisoners.visible) {
          config['generalSecurity'] = {
            label: 'الأمن العام'
          };
          ar.push(config['generalSecurity']);
          //}

          // if (self.securityData.passports.visible) {
          config['passports'] = {
            label: 'الجوازات'
          };
          ar.push(config['passports']);
          //}

          config['car'] = {
            label: 'تفاصيل السيارات'
          }
        }
        if (ar.length > 0)
          ar[0].isDefault = true;

        if (self.securityData == null) {
          config['login'].isDefault = true;
        }

        self.router.configure(config);

        self.navData([]);
        if (self.securityData != null) { //===user has permission 
          if (self.securityData.ahwal.visible)
            self.navData.push({
              name: 'الأحوال',
              id: 'dashboard',
              iconClass: 'fa fa-home fa-2x'
            });
          if (self.securityData.cars.visible)
            self.navData.push({
              name: 'المرور',
              id: 'vehicles',
              // iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-vehicle-icon-24'
              iconClass: 'fa fa-car fa-2x'
            });


          if (self.securityData.prisoners.visible)
            self.navData.push({
              name: 'السجون',
              id: 'prisoners',
              iconClass: 'fa fa-lock fa-2x'
            });



          //if (self.securityData.passports.visible)
          self.navData.push({
            name: 'الجوازات',
            id: 'passports',
            iconClass: 'fa fa-vcard fa-2x'
          });
          //if (self.securityData.generalSecurity.visible)
          self.navData.push({
            name: 'الأمن العام',
            id: 'generalSecurity',
            iconClass: 'fa fa-lock fa-2x'
          });
        }
      }


      self.setSecurityData = function (secData) {
        self.securityData = secData;

        self.setSecDataToStorage(secData);

        self.showAhwal(secData.ahwal.visible);
        self.showCars(secData.cars.visible);
        self.showPrisoners(secData.prisoners.visible);
        self.showPassports(secData.passports.visible);

        self.initRouters();

      }


      self.startUp = function () {
        var sec = self.getSecDataFromStorage();
        if (sec != null) {
          // alert("Already Logged");
          self.setSecurityData(sec);

          var last = window.localStorage.getItem("last");
          if (last != null) {
            // alert("last " + last);
            // oj.Router.rootInstance.go(last);
          }
        } else {
          // alert("Login")
          self.initRouters();
          oj.Router.rootInstance.go("login");
        }
      }


      self.logout = function (event) {
        //oj.Router.rootInstance.go('login');


        window.localStorage.removeItem("sec");
        window.localStorage.removeItem("last");
        self.securityData = null;
        self.initRouters();
        oj.Router.rootInstance.go();

      }






      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Router setup
      self.router = oj.Router.rootInstance;
      // self.router.configure({
      //   'login': {
      //     label: 'دخول',
      //     isDefault: true
      //   }
      // });

      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      self.startUp();




      self.moduleConfig = ko.observable({
        'view': [],
        'viewModel': null
      });
      self.lastRoute = ko.observable("");

      self.router.stateId.subscribe(function () {
        // alert("State Id Changed");
        if (self.router.stateId() != "personDetails" && self.router.stateId() != "login") {
          var state = oj.Router.rootInstance.getState('services');
          if (state) state.value = self.router.stateId();
        }
        if (self.router.stateId() && self.router.stateId() != "login" && self.router.stateId() != "personDetails")
          window.localStorage.setItem("last", self.router.stateId());
      });









      self.setDefaultState = function (stateid) {
        self.router.defaultStateId = stateid;
      }



      // self.securityData = function () {
      //   var sec = window.localStorage.getItem("sec");
      //   if (sec != null) return sec;
      // }


      self.refreshModule = function (name) {
        var viewPath = 'views/' + name + '.html';
        var modelPath = 'viewModels/' + name;
        var masterPromise = Promise.all([
          moduleUtils.createView({
            'viewPath': viewPath
          }),
          moduleUtils.createViewModel({
            'viewModelPath': modelPath
          })
        ]);
        masterPromise.then(
          function (values) {
            self.moduleConfig({
              'view': values[0],
              'viewModel': values[1]
            });
          }
        );
      }

      self.loadModule = function () {
        ko.computed(function () {
          var name = self.router.moduleConfig.name();
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          var masterPromise = Promise.all([
            moduleUtils.createView({
              'viewPath': viewPath
            }),
            moduleUtils.createViewModel({
              'viewModelPath': modelPath
            })
          ]);
          masterPromise.then(
            function (values) {
              self.moduleConfig({
                'view': values[0],
                'viewModel': values[1]
              });
            }
          );



        });
      };

      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function () {
        oj.OffcanvasUtils.close(self.drawerParams);
      });
      self.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function () {
        return oj.OffcanvasUtils.toggle(self.drawerParams);
      }
      // Add a close listener so we can move focus back to the toggle button when the drawer closes
      $("#navDrawer").on("ojclose", function () {
        $('#drawerToggleButton').focus();
      });

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("شركة زدني");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('عن زدني', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('اتصل بنا', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('شروط الاستخدام', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('حقوق الملكية', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
    }


    self.urlLogout = "http://127.0.0.1:8000";



    self.resetCache = function () {
      window.sessionStorage.clear();
    }



    self.getHeaderModel = function () {
      var headerFactory = {
        createViewModel: function (params, valueAccessor) {
          var model = {
            pageTitle: self.router.currentState().label,
            handleBindingsApplied: function (info) {
              // Adjust content padding after header bindings have been applied
              self.adjustContentPadding();
            },
            toggleDrawer: self.toggleDrawer,
            logout: self.logout
          };
          return Promise.resolve(model);
        }
      }
      return headerFactory;
    }
    console.log("current Url", window.location.href)
    // console.log("prev Url",window.location.href=document.referrer);
    self.goBackFromButton = function () {

      var prevState = oj.Router.rootInstance.getState('services').value;
      if (typeof prevState === 'undefined' || prevState == '') {
        oj.Router.rootInstance.go();
      } else {

        oj.Router.rootInstance.go(prevState);
      }


      return;

    }




    self.goRouter = function () {
      oj.Router.rootInstance.go("/dashboard/searchothers");
    }

    return new ControllerViewModel();
  }
);