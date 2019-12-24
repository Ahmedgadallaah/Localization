define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodule-element-utils',
        'viewModels/helpers/fetchandcache_alldata', 'appController',
        'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojinputnumber',
        'ojs/ojcollectiontabledatasource', 'ojs/ojarraydataprovider',
        'ojs/ojtable', 'ojs/ojrouter', 'ojs/ojmodule-element-utils',
        'ojs/ojbutton', 'ojs/ojnavigationlist', 'ojs/ojmessages',
    ],
    function (oj, ko, $, moduleUtils, fetchAllDataClass, app) {

        function personDetails() {
            var self = this;
            self.fetchAllData = new fetchAllDataClass();
            self.personalDeathData = ko.observableArray(['']);
            self.personalSpouseData = ko.observableArray(['']);
            self.personalCarData = ko.observableArray(['']);
            self.errorMessages = ko.observableArray([]);
            self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
            self.showDeathTab = ko.observable(false);
            self.showCarTab = ko.observable(false);
            self.showSpouseTab = ko.observable(false);
            self.showHide = ko.observable(true);
            self.selectedOption = ko.observable(1);


            self.disableTabs = {
                personInfo: ko.observable(false),
                personSpouseInfo: ko.observable(false),
                personVechilsInfo: ko.observable(false),
                personDeathInfo: ko.observable(false),
            }


            self.getPersonData = function () {
                // var lastIdNum = window.sessionStorage.getItem("lastIdNum");
                var lastIdNum = window.localStorage.getItem('idnumber');
                self.fetchAllData.setIdNumber(lastIdNum);
                self.fetchAllData.fillWhat = ["spouseInfo", "carInfo", "deathInfo"];
                self.fetchAllData.getData(self.errorMessages).then(function (values) {
                    var spouseInfo = values[0];
                    var carInfo = values[1];
                    var deathInfo = values[2];

                    // self.disableTabs.personSpouseInfo(!spouseInfo.success || !spouseInfo.hasData);
                    // self.disableTabs.personVechilsInfo(!carInfo.success || !carInfo.hasData);
                    // self.disableTabs.personDeathInfo(!deathInfo.success || !deathInfo.hasData);
                    self.disableTabs.personSpouseInfo(!spouseInfo.isOK);
                    self.disableTabs.personVechilsInfo(!carInfo.isOK);
                    self.disableTabs.personDeathInfo(!deathInfo.isOK);


                });

            }
            self.showHideButton = function (id) {
                var b = self.disableTabs[id]();
                //console.log("TAB", id, b);
                return b;

            }
            self.showHideDeathInfoTab = function (data) {}




            self.showHideCarInfoTab = function (data) {}



            self.showHideSpouseInfoTab = function (data) {}

            self.transitionCompleted = function () {

            }

            self.parentRouter = oj.Router.rootInstance;
            self.subRouter = self.parentRouter.createChildRouter('persondetails');

            self.setRouters = function () {
                var config = {};
                var sec = app.securityData;

                var isdefault = false;
                var ar = [];
                config['temp'] = {
                    label: '',
                    // isDefault: true
                };
                if ((sec.ahwal.NationalId.visible && sec.ahwal.NationalId.has_50) || sec.ahwal.others.visible) {
                    config['personInfo'] = {
                        label: 'معلومات المواطن',
                        // isDefault: true
                    };
                    ar.push(config['personInfo']);
                }

                if (sec.ahwal.NationalId.has_58) {
                    config['personSpouseInfo'] = {
                        label: 'معلومات الزواج',
                        // isDefault: true
                    };

                    ar.push(config['personSpouseInfo']);
                }
                if (sec.cars.visible && sec.cars.NationalId.has_60) {
                    config['personVechilsInfo'] = {
                        label: 'معلومات المركبات',
                        // isDefault: true
                    };

                    ar.push(config['personVechilsInfo']);
                }

                if (sec.ahwal.NationalId.has_57) {
                    config['personDeathInfo'] = {
                        label: 'معلومات الوفاة',
                        // isDefault: true
                    };

                    ar.push(config['personDeathInfo']);
                }

                if (ar.length > 0) ar[0].isDefault = true;
                self.subRouter.configure(config);
            }

            self.setRouters();
            self.moduleConfig = ko.observable({
                'view': [],
                'viewModel': null
            });
            self.initial = false;

            self.runComputed = ko.observable(false);


            ko.computed(function () {
                // create subscription to changes in states for both routers
                var currentState = self.subRouter.currentState();


                var parentCurrentState = oj.Router.rootInstance.currentState();

                if (parentCurrentState) {}
                //var orderId = customerState && customerState.parameters.orderId;
                if (!currentState)
                    return;
                if (self.initial) {
                    // nothing to load on inital call
                    self.initial = false;
                } else {
                    // update module config for oj-module on customers page
                    var moduleName, viewModelParams = {};

                    moduleName = self.subRouter.moduleConfig.name();

                    self.refreshModule(moduleName);
                    //=====
                }
            });


            self.refreshModule = function (moduleName, newViewModel) {
                var viewPath = 'views/persondetails/' + moduleName + '.html';
                var modelPath = 'viewModels/persondetails/' + moduleName;
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
                        var finalViewModel = values[1];
                        if (app.isBack) {
                            if (app.nextRoute != null && moduleName == app.nextRoute.name) {
                                //alert("Now get the new Instance : " );
                                var vm = {};
                                var st = app.nextRoute.viewModel;
                                finalViewModel = app.nextRoute.viewModel;
                                window.localStorage.setItem('idnumber', app.nextRoute.idNumber);
                                app.resetHistory();
                                //console.log("VM Binded", finalViewModel);
                            }
                        }

                        self.moduleConfig({
                            'view': values[0],
                            'viewModel': typeof newViewModel === 'undefined' ? finalViewModel : newViewModel
                        });
                    }
                ); //---then


            } //====setModuleConfig







            self.connected = function () {
                app.personDetailsViewModel = self;
                self.routerSync();

            };


            self.routerSync = function () {
                oj.Router.sync().then(
                    function () {






                    },
                    function (error) {
                        oj.Logger.error('Error during refresh: ' + error.message);
                    }
                );
            }


            self.disconnected = function () {
                self.subRouter.dispose();
            };

            self.getPersonData();
        }

        return personDetails;
    }
);