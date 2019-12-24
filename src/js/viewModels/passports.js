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

        function PassportViewModel() {
            var self = this;

            //console.log("Module Utilies", moduleUtils);


            self.url = "http://192.168.1.202:7003/CSO_SBProject/GetSpouseProfileRestService";


            self.searchOptions = [{
                    id: 1,
                    label: 'مصريين'
                },
                {
                    id: 2,
                    label: 'الأجانب'
                }
            ]
            self.selectedOption = ko.observable(1);

            // var routerConfig = {
            //     'egyptcards': {
            //         label: ' مصريين كروت',
            //         isDefault: true
            //     },
            //     'foreigncards': {
            //         label: 'أجانب كروت'
            //     },
            //     'egyptports': {
            //         label: 'مصريين منافذ',

            //     },
            //     'foreignports': {
            //         label: 'أجانب منافذ'
            //     }

            // };


            var routerConfig = {
                'passportsegyptforeign': {
                    label: ' مصريين اجانب',
                    isDefault: true
                },


            };


            self.parentRouter = oj.Router.rootInstance;
            self.subRouter = self.parentRouter.createChildRouter('passports');
            self.subRouter.configure(routerConfig);
            self.lastStateId = "";
            self.subRouter.stateId.subscribe(function () {
                if (typeof self.subRouter.stateId() === 'undefined') {} else {
                    self.lastStateId = self.subRouter.stateId();

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

                // if (moduleName == 'egyptcards') {
                //     type = 1;
                //     moduleName = "passportegypt" //currentType=1
                // } else if (moduleName == 'egyptports') {
                //     type = 2;
                //     moduleName = "passportegypt" //currentType=2
                // } else if (moduleName == 'foreigncards') {
                //     type = 1;
                //     moduleName = "passportforeign" //currentType=1
                // } else if (moduleName == 'foreignports') {
                //     type = 2;
                //     moduleName = "passportforeign" //currentType=2
                // }




                var viewPath = 'views/passport/' + moduleName + '.html';
                var modelPath = 'viewModels/passport/' + moduleName;
                //console.log("files", viewPath, modelPath);
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
                        var finalViewModel = new values[1];

                        self.moduleConfig({
                            'view': values[0],
                            'viewModel': finalViewModel
                        });
                    } //==function (values)
                ); //then
                //========

            } //===refreshModule function

            self.connected = function () {
                //app.dashboardViewModel = self;
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

        return PassportViewModel;
    }
);