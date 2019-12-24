/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodule-element-utils',
        'appController', 'ojs/ojvalidationgroup', 'ojs/ojbutton'
    ],
    function (oj, ko, $, moduleUtils, app) {

        function PersonsViewModel() {
            var self = this;

            //console.log("Module Utilies", moduleUtils);


            self.url = "http://192.168.1.202:7003/CSO_SBProject/GetSpouseProfileRestService";


            self.searchOptions = [{
                    id: 1,
                    label: 'رقم الهوية'
                },
                {
                    id: 2,
                    label: 'بيانات اخرى'
                }
            ]
            self.selectedOption = ko.observable(1);

            var routerConfig = {
                'searchid': {
                    label: 'البحث برقم الهوية',
                    isDefault: true
                },
                'searchothers': {
                    label: 'البحث ببيانات أخري'
                }
            };



            /*  self.selectedOption.subscribe(function(value){
                    if(value==1)
                         self.subRouter.go("searchid");
                     else
                          self.subRouter.go("searchothers"); 
              });*/
            self.parentRouter = oj.Router.rootInstance;
            self.subRouter = self.parentRouter.createChildRouter('search');
            self.subRouter.configure(routerConfig);
            self.lastStateId = "";
            self.subRouter.stateId.subscribe(function () {
                if (typeof self.subRouter.stateId() === 'undefined') {} else {
                    self.lastStateId = self.subRouter.stateId();
                    //alert("Subscribe  " + self.lastStateId);
                }

            });


            self.moduleConfig = ko.observable({
                'view': [],
                'viewModel': null
            });
            self.initial = false;
            ko.computed(function () {
                // create subscription to changes in states for both routers
                var currentState = self.subRouter.currentState();
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
                    //console.log("VIEW NAME: " + currentState.id);

                    self.refreshModule(moduleName);

                } //====else
            });


            self.refreshModule = function (moduleName) {
                var viewPath = 'views/' + moduleName + '.html';
                var modelPath = 'viewModels/' + moduleName;
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
                        //console.log("VALUES", values);
                        var vModel = values[1];
                        var finalViewModel = values[1];
                        if (app.isBack) {
                            //alert("Is Back From Dash Board");
                            if (app.nextRoute != null && moduleName == app.nextRoute.name) {
                                var vm = {};
                                var st = app.nextRoute.viewModel;

                                finalViewModel = app.nextRoute.viewModel;
                                window.localStorage.setItem('idnumber', app.nextRoute.idNumber);
                                app.resetHistory();
                            }
                        }

                        self.moduleConfig({
                            'view': values[0],
                            'viewModel': finalViewModel
                        });
                    } //==function (values)
                ); //then
                //========

            } //===refreshModule function
            self.connected = function () {
                app.dashboardViewModel = self;
                var lastState = window.localStorage.getItem("dashboardLastState");
                //alert("Connected " +  lastState);
                oj.Router.sync().then(
                    function () {
                        if (lastState != null) {
                            //self.subRouter.stateId(lastState);
                        }

                    },
                    function (error) {
                        oj.Logger.error('Error during refresh: ' + error.message);
                    }
                );
            };

            self.disconnected = function (context) {
                //console.log("Disconnected Context : ", context);
                //alert("Disconnected " +  self.lastStateId);
                window.localStorage.setItem("dashboardLastState", self.lastStateId);
                self.subRouter.dispose();
            };

        }

        return PersonsViewModel;
    }
);