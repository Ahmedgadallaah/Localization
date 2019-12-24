define(['ojs/ojcore', 'knockout', 'jquery',
        'ojs/ojmodule-element-utils', 'appController',
        'ojs/ojvalidationgroup', 'ojs/ojbutton', 'ojs/ojbutton'
    ],
    function (oj, ko, $, moduleUtils, app) {

        function VehiclesViewModel() {
            var self = this;

            self.searchOptions = [{
                    id: 1,
                    label: 'رقم الهوية'
                },
                {
                    id: 2,
                    label: 'أرقام و حروف'
                }, {
                    id: 3,
                    label: 'أرقام فقط'
                }, {
                    id: 4,
                    label: 'رخصة القيادة'
                }
            ]
            self.selectedOption = ko.observable(1);

            var routerConfig = {
                'searchidnumber': {
                    label: 'البحث برقم الهوية',
                    isDefault: true
                },
                'searchplate': {
                    label: 'البحث بالأرقام والحروف'
                },
                'searcholdplate': {
                    label: 'البحث بأرقام فقط'
                },
                'drivelisence': {
                    label: 'رخصة القيادة'
                },
            };
            // self.selectedOption.subscribe(function(value){
            //     if(value == 1)
            //         self.subRouter.go("searchidnumber");
            //     else if(value == 2)
            //         self.subRouter.go("searchplate"); 
            //     else 
            //         self.subRouter.go("searcholdplate");
            // });

            self.parentRouter = oj.Router.rootInstance;
            self.subRouter = self.parentRouter.createChildRouter('vehicle');
            self.subRouter.configure(routerConfig);

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

                    // var viewPath = 'views/vehicles/' + moduleName + '.html';
                    // var modelPath = 'viewModels/vehicles/' + moduleName;
                    // var masterPromise = Promise.all([
                    //     moduleUtils.createView({
                    //         'viewPath': viewPath
                    //     }),
                    //     moduleUtils.createViewModel({
                    //         'viewModelPath': modelPath
                    //     })
                    // ]);
                    // masterPromise.then(
                    //     function (values) {
                    //         console.log("VALUES", values);
                    //         //var viewModel = new values[1](viewModelParams);
                    //         self.moduleConfig({
                    //             'view': values[0],
                    //             'viewModel': values[1]
                    //         });
                    //     }
                    // );


                }
            });


            self.refreshModule = function (moduleName) {
                var viewPath = 'views/vehicles/' + moduleName + '.html';
                var modelPath = 'viewModels/vehicles/' + moduleName;
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
                oj.Router.sync().then(
                    null,
                    function (error) {
                        oj.Logger.error('Error during refresh: ' + error.message);
                    }
                );
            };

            self.disconnected = function () {
                self.subRouter.dispose();
            };

        }

        return VehiclesViewModel;
    }
);