define(['ojs/ojcore', 'knockout', 'jquery',
        'viewModels/helpers/ipConfig', 'viewModels/helpers/fetchandcache_alldata',
        'ojs/ojformlayout', 'ojs/ojpagingtabledatasource',
        'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol',
        'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojcollectiontabledatasource',
        'ojs/ojarraydataprovider',
        'ojs/ojtable', 'ojs/ojrouter', 'ojs/ojmodule-element-utils',
        'ojs/ojbutton', 'ojs/ojmessages'
    ],
    function (oj, ko, $, ipConfig, fetchAllDataClass) {

        function personVechilsInfo() {
            var self = this;
            var childRouter = oj.Router.rootInstance.getChildRouter('persondetails');
            self.isCurrent = childRouter.getState("personVechilsInfo").isCurrent();



            self.nationalIdNum = window.localStorage.getItem('idnumber');
            self.showLoadDialog = ko.observable(false);
            self.carsData = ko.observableArray([]);
            self.carPlateNum = ko.observable();
            self.errorMessages = ko.observableArray([]);
            self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
            self.clickedIndex = ko.observable('');
            self.fetchAllData = new fetchAllDataClass();
            self.dataprovider = new oj.ArrayTableDataSource(self.carsData, {
                idAttribute: 'PLATENUM',
                sortCriteria: [{
                    key: 'fullName',
                    direction: 'ascending'
                }]
            });

            self.pagingDataProvider =
                new oj.PagingTableDataSource(self.dataprovider);

            self.tableColumns = [{
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
            self.openLoadDialog = function () {
                // $("#loadPanel").show();
                self.showLoadDialog(true);
            }


            self.closeLoadDialog = function () {
                //   $("#loadPanel").hide();
                self.showLoadDialog(false);
            }


            self.cancel = function () {
                self.closeLoadDialog();
            }

            self.refresh = function () {
                //alert("Refresh");
                self.errorMessages([]);
                self.getData();
            }

            self.getData = function () {
                self.carsData([]);
                self.fetchAllData.setIdNumber(self.nationalIdNum);
                self.fetchAllData.fillWhat = ['carInfo'];
                self.fetchAllData.getData(self.errorMessages, 'personVechilsInfo_loader').then(function (values) {
                    var info = values[0];

                    if (info.isOK) self.carsData(info.data.getTITInfoOutput);

                });
            };
            self.transitionCompleted = function () {
                //alert("Transistion Completed");
                if (self.clickedIndex() !== '') {
                    self.closeLoadDialog();
                    //alert("Row " + self.clickedIndex());
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

            self.tableListener = function () {
                var table = document.getElementById('table');
                self.clickedIndex(table.currentRow.rowIndex);
                //alert("Clicked Index "  +  self.clickedIndex());
                self.carPlateNum(table.currentRow.rowKey);
                //console.log(self.carPlateNum());
                var car = self.carsData().find(function (element) {
                    return element.PLATENUM === self.carPlateNum();
                });

                self.router = oj.Router.rootInstance;
                self.router.getState('car').value = car;
                self.router.go('car');

            }

            //            self.getData();
            if (self.isCurrent) self.refresh();
            // console.log('status: ',self.personalDetailsData.status);

        }

        return personVechilsInfo;
    }
);