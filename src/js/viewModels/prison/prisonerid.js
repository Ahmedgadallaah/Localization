define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig',
        'viewModels/helpers/fetchandcache_alldata',

        'appController', 'viewModels/helpers/requests', 'ojs/ojpagingtabledatasource',
        'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol',
        'ojs/ojrouter', 'ojs/ojcollectiontabledatasource',
        'ojs/ojarraydataprovider', 'ojs/ojtable', 'ojs/ojinputtext',
        'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojradioset',
        'ojs/ojlabel', 'ojs/ojmessages'
    ],
    function (oj, ko, $, ipConfig, fetchCaheAllDataClass, app, requests) {

        function PrisonerIdViewModel() {

            var self = this;
            self.errorMessages = ko.observableArray([]);
            self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);

            self.fetchCaheAllData = new fetchCaheAllDataClass();
            self.tracker = ko.observable();
            self.groupValid = ko.observable();
            self.idValue = ko.observable('');
            self.name = ko.observable('');
            self.nationalIdNum = ko.observable('');
            self.redrivedData = ko.observableArray([]);
            self.selection = ko.observable(true);
            self.currentSearchType = ko.observable(1);
            self.isIdNumButtonDisabled = ko.observable(true);
            self.isNameButtonDisabled = ko.observable(true);

            self.showNationalId = ko.observable(false);
            self.showName = ko.observable(false);


            self.router = oj.Router.rootInstance;
            //console.log(ipConfig.secondOctet)



            self.accusationIsRed = function (row) {
                //console.log("ROW Accusation", row.accusation);
                return row.accusation.indexOf('هروب') > -1;
            }
            self.columns = [{
                    "headerText": "",
                    "field": "id",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
                },
                {
                    "headerText": "الرقم القومي",
                    "field": "natid",
                    "headerClassName": "oj-sm-only-hide",
                    "className": "oj-sm-only-hide",
                    "resizable": "enabled"
                },
                {
                    "headerText": "الاسم الكامل",
                    "field": "fullname",
                    "headerClassName": "oj-sm-only-hide",
                    "className": "oj-sm-only-hide",
                    "resizable": "enabled"
                },
                {
                    "headerText": "الرقم التسلسلي",
                    "field": "id",
                },
                {
                    "headerText": "التهمة",
                    "field": "accusation",
                    "resizable": "enabled",
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("accusationTemplate", true)
                },
                {
                    "headerText": "الحكم",
                    "field": "judgment",
                    "headerClassName": "oj-sm-only-hide",
                    "className": "oj-sm-only-hide",
                    "resizable": "enabled"
                },
                {
                    "headerText": "فئة المسجون",
                    "field": "prisclass",
                    "resizable": "enabled"
                },
                {
                    "headerText": "السجن",
                    "field": "prison",
                    "resizable": "enabled"
                },
                {
                    "headerText": "المحافظة",
                    "field": "gov",
                    "resizable": "enabled"
                },
                {
                    "headerText": "المدينة",
                    "field": "city",
                    "resizable": "enabled"
                },
                {
                    "headerText": "الحي",
                    "field": "address",
                    "resizable": "enabled"
                },

                {
                    "headerText": "مبدأ",
                    "field": "startdate",
                    "resizable": "enabled"
                },

                {
                    "headerText": "نهاية",
                    "field": "enddate",
                    "resizable": "enabled"
                },
                // {
                //     "headerText": "تاريخ الإفراج",
                //     "field": "AddressDetails",
                //     "resizable": "enabled"
                // }
            ];

            self.dataprovider = new oj.ArrayTableDataSource(self.redrivedData, {
                idAttribute: 'id',

            });

            self.pagingDataProvider =
                new oj.PagingTableDataSource(self.dataprovider);

            self.isSearchButtonDisabled = ko.observable(true);
            self.identityNumMessages = ko.observableArray([]);
            self.nameNumMessages = ko.observableArray([]);

            self.currentSearchType.subscribe(function (val) {


                self.isIdentityNumValid();
                self.isNameValid();

            });

            self.idValue.subscribe(function (val) {
                //self.isSearchButtonDisabled(false);
                self.isIdentityNumValid();
            });

            self.name.subscribe(function (val) {
                self.isNameValid();
            });
            self.isNameValid = function () {
                val = self.name();
                self.nameNumMessages([]);
                if (self.currentSearchType() != 2) {
                    self.isNameButtonDisabled(true);
                    return;
                }

                if ((val.length == 0)) {
                    self.isNameButtonDisabled(true);
                    self.nameNumMessages.push({
                        severity: "warning",
                        summary: "الصيغة غير صحيحة",
                        detail: "لابد من كتابه الاسم او جزء منه"
                    });
                } else {
                    self.isNameButtonDisabled(false);
                }
            }
            self.isIdentityNumValid = function () {
                val = self.idValue();
                self.identityNumMessages([]);
                if (self.currentSearchType() != 1) {
                    self.isIdNumButtonDisabled(true);
                    return;
                }
                //self.isSearchButtonDisabled(false);
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

            self.url = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/Prisons_SBProject/PrisonerInfoRestService';

            //console.log(self.url);

            self.isButtonDisabled = ko.computed(function () {
                var bool = self.idValue().length != 14
                //console.log("IsButtonDisabled", bool);
                return bool;
            });
            self.isButtonDisabled = ko.computed(function () {
                var bool = self.name().length != 0
                //console.log("IsButtonDisabled", bool);
                return bool;
            });

            self.showHideControls = function () {
                var sec = app.securityData;

                self.showNationalId(sec.prisoners.NationalId.visible);

                self.showName(sec.prisoners.Name.visible);

                if (self.showNationalId() == false) {
                    self.currentSearchType(2);
                }
            }

            self.showHideControls();

            self.doSearch = function () {
                if (self.currentSearchType() == 1)
                    self.doSearchByIdNumber();
                else if (self.currentSearchType() == 2)
                    self.doSearchByName();
            }

            self.doSearchByIdNumber = function (event) {
                self.errorMessages([]);
                self.redrivedData([]);

                if (tracker.valid == 'valid') {
                    var prisonRequest = requests.createPrisonInfoRequest();
                    prisonRequest.natid = self.idValue();
                    // var prisonRequest = {
                    //     "natid": self.idValue(),
                    //     "fname": ''
                    // }
                    // self.postData.natid = self.idValue();
                    self.fetchCaheAllData.fillWhat = [{
                        name: 'prisonInfo',
                        postData: prisonRequest
                    }];
                    self.fetchCaheAllData.setIdNumber(self.idValue());
                    self.fetchCaheAllData.getData(self.errorMessages, 'idnum_loader').then(function (values) {
                        var info = values[0];

                        if (info.isOK) self.redrivedData(info.data.Prisoner);

                    });
                } else {
                    tracker.showMessages();
                    tracker.focusOn("@firstInvalidShown");
                }
            }

            self.doSearchByName = function (event) {
                self.errorMessages([]);
                //self.redrivedData([]);
                self.redrivedData.removeAll();

                if (tracker.valid == 'valid') {
                    var prisonRequest = requests.createPrisonInfoRequest();
                    prisonRequest.fname = self.name();
                    // var prisonRequest = {
                    //     "natid": '',
                    //     "fname": self.name()
                    // }
                    // self.postData.natid = self.idValue();
                    self.fetchCaheAllData.fillWhat = [{
                        name: 'prisonInfo',
                        postData: prisonRequest
                    }];
                    self.fetchCaheAllData.setIdNumber(self.idValue());

                    self.fetchCaheAllData.getData(self.errorMessages, 'idname_loader').then(function (values) {
                        var info = values[0];
                        //console.log("prisoner By NAME data FETCH ALL DATA VALUES", info.data);

                        if (info.isOK) self.redrivedData(info.data.Prisoner);

                        //console.log("Data Retrieved", info.data);
                    })
                } else {
                    tracker.showMessages();
                    tracker.focusOn("@firstInvalidShown");
                }

            }
            self.tableListener = function () {

                var table = document.getElementById('table');
                if (table.currentRow == null) {
                    return;
                }
                var sec = app.securityData;
                //sec.ahwal.visible = true;
                //sec.ahwal.NationalId.has_50 = true;
                //sec.ahwal.NationalId.has_57 = true;
                //sec.ahwal.NationalId.has_58 = true;
                if (sec.ahwal.visible == false) {
                    alert("لا يوجد صلاحيه للدخول");
                    return;
                }
                var id = table.currentRow.rowKey;
                var r = self.redrivedData().find(function (ele) {
                    return ele.id = id;
                });

                if (!r) return;

                var NatId = r.natid;
                var currentStateofviewModel = {
                    name: 'prisonerid',
                    state: '/prisoners/prisonerid',
                    gridIndex: table.currentRow.rowIndex,
                    idNumber: window.localStorage.getItem('idnumber'),
                    viewModel: self //map.toJSON(self,mapping)
                }

                app.addHistory(currentStateofviewModel);

                // self.nationalIdNum(table.currentRow.rowKey);

                self.router = oj.Router.rootInstance;

                window.localStorage.setItem('idnumber', NatId);

                self.router.go('personDetails');

            }
            self.connected = function () {

                var personalIdentity = document.getElementById("personalIdentity");
                //console.log("element", personalIdentity);

                personalIdentity.addEventListener("keyup", function (event) {
                    if (event.keyCode == 13 && self.isButtonDisabled() != true) {
                        self.doSearch();
                    }
                });
            }

        }
        return PrisonerIdViewModel;
    }
);