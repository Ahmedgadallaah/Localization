/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/helpers/ipConfig',
        'viewModels/helpers/fetchandcache_alldata', 'appController', 'viewModels/helpers/requests',
        'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource',
        'ojs/ojpagingcontrol', , 'ojs/ojrouter', 'ojs/ojcollectiontabledatasource',
        'ojs/ojarraydataprovider', 'ojs/ojtable', 'ojs/ojinputtext', 'ojs/ojdatetimepicker',
        'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojbutton',
        'ojs/ojmessages', 'ojs/ojselectcombobox', 'ojs/ojradioset',
    ],
    function (oj, ko, $, ipConfig, fetchCaheAllDataClass, app, requests) {

        function SearchIdViewModel() {
            var st = "Ayman";

            var self = this;
            self.errorMessages = ko.observableArray([]);
            self.identityNumMessages = ko.observableArray([]);
            self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
            self.clickSearch = ko.observable(false);
            // self.errorInputMessagesProvider = new oj.ArrayDataProvider(self.identityNumMessages);
            self.currentSearchType = ko.observable(1);
            self.fetchCaheAllData = new fetchCaheAllDataClass();
            self.tracker = ko.observable();
            self.groupValid = ko.observable();
            self.idValue = ko.observable('');
            self.nationalIdNum = ko.observable('');
            self.govs = ko.observableArray([]);
            self.selectedGov = ko.observable('');
            self.firstName = ko.observable('');
            self.familyName = ko.observable('');
            self.fatherFirstName = ko.observable('');
            self.fatherSecondName = ko.observable('');
            self.birthDateStart = ko.observable('');
            self.birthDateEnd = ko.observable('');
            self.motherName = ko.observable('');
            self.nickName = ko.observable('');
            self.governorateCodeOfAddress = ko.observable('');
            self.policestationCodeOfAddress = ko.observable('');
            self.placeDescription = ko.observable('');
            self.placeNo = ko.observable('');

            self.showNationalId = ko.observable(false);
            self.showFullName = ko.observable(false);
            self.showFatherName = ko.observable(false);

            self.showBirthDate = ko.observable(false);
            self.showMotherName = ko.observable(false);
            self.showAddress = ko.observable(false);
            self.showFirstName = ko.observable(false);

            self.showOthersSection = ko.observable(false);

            self.showPersonTable = ko.observable(false);
            self.showSpouseTable = ko.observable(false);
            self.showDeathTable = ko.observable(false);



            self.personInfoData = ko.observableArray([]);
            self.spouseInfoData = ko.observableArray([]);
            self.deathInfoData = ko.observableArray([]);


            //self.personInfoData = ko.observableArray([]);
            self.router = oj.Router.rootInstance;
            //console.log(ipConfig.secondOctet)

            self.personColumns = [];
            self.spouseColumns = [];
            self.deathColumns = [];


            self.setTableColumns = function () {
                var sec = app.securityData;
                //if (sec.ahwal.NationalId.has_50) {
                self.personColumns = [{
                        "headerText": "",
                        "field": "idNum",
                        "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
                    },
                    {
                        "headerText": "الاسم الكامل",
                        "field": "fullName",
                        "headerClassName": "oj-sm-only-hide",
                        "className": "oj-sm-only-hide",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "رقم الهوية",
                        "field": "idNum",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "محافظة الميلاد",
                        "field": "governorateDescrOfBirth",
                        "headerClassName": "oj-sm-only-hide",
                        "className": "oj-sm-only-hide",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "تفاصيل العنوان",
                        "field": "AddressDetails",
                        "resizable": "enabled"
                    }
                ];

                //}

                // if (sec.ahwal.NationalId.has_58) {
                self.spouseColumns = [{
                        "headerText": "",
                        "field": "idNum",
                        "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
                    },
                    {
                        "headerText": "الاسم",
                        "field": "fullName",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "رقم الهوية",
                        "field": "idNum",
                        "resizable": "enabled"
                    },

                    {
                        "headerText": "اسم الام",
                        "field": "spouseMotherName",
                        "headerClassName": "oj-sm-only-hide",
                        "className": "oj-sm-only-hide",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "تاريخ الزواج/الطلاق",
                        "field": "eventDate",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "تاريخ الميلاد",
                        "field": "spouseBirthDate",
                        "headerClassName": "oj-sm-only-hide",
                        "className": "oj-sm-only-hide",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "حالة الزواج",
                        "field": "spouseType",
                        "resizable": "enabled"
                    }
                ];
                // }

                //  if (sec.ahwal.NationalId.has_57) {

                self.deathColumns = [{
                        "headerText": "",
                        "field": "idNum",
                        "renderer": oj.KnockoutTemplateUtils.getRenderer("serial", true)
                    },
                    {
                        "headerText": "الاسم الأول",
                        "field": "firstName",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "رقم الهوية",
                        "field": "idNum",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "الاسم الاول للوالد",
                        "field": "fatherFirstName",
                        "headerClassName": "oj-sm-only-hide",
                        "className": "oj-sm-only-hide",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "الاسم الثاني للوالد",
                        "field": "fatherSecondName",
                        "resizable": "enabled",
                        "className": "oj-sm-only-hide",
                        "headerClassName": "oj-sm-only-hide",
                        "resizable": "enabled"
                    },
                    {
                        "headerText": "تاريخ الوفاة",
                        "field": "deathDate",
                        "resizable": "enabled"
                    },
                ];
                //  }
            }



            self.showHideControls = function () {
                var sec = app.securityData;
                //console.log("AHWAL ", sec);
                //====for Test
                //sec.ahwal.NationalId.visible = false;
                //sec.ahwal.others.FullName.visible = false;
                // sec.ahwal.others.FirstName_BirthDate.visible = false;
                // sec.ahwal.others.FatherName.visible = false;
                // sec.ahwal.others.Father_Mother_Name.visible = false;
                //   sec.ahwal.others.MotherName.visible = false;
                //  sec.ahwal.others.FullName_BirthDate.visible = false;
                //====for Test
                //     sec.ahwal.others.Address.visible = false;
                //sec.ahwal.others.visible = false;
                //sec.ahwal.NationalId.visible = false;
                //sec.ahwal.others.FirstName_BirthDate.visible = false;
                //sec.ahwal.others.FullName.visible = false;
                //sec.ahwal.others.FatherName.visible = false;
                //sec.ahwal.others.Father_Mother_Name.visible = false;
                //sec.ahwal.others.FirstName_BirthDate.visible = true;
                self.showOthersSection(sec.ahwal.others.visible);

                self.showNationalId(sec.ahwal.NationalId.visible);

                self.showFullName(sec.ahwal.others.FullName.visible);
                self.showFirstName(sec.ahwal.others.FullName.visible ||
                    sec.ahwal.others.FirstName_BirthDate.visible);


                self.showFatherName(sec.ahwal.others.FatherName.visible ||
                    sec.ahwal.others.Father_Mother_Name.visible ||
                    sec.ahwal.others.FullName.visible

                );

                self.showMotherName(sec.ahwal.others.MotherName.visible || sec.ahwal.others.Father_Mother_Name.visible);


                self.showAddress(sec.ahwal.others.Address.visible);

                self.showBirthDate(sec.ahwal.others.FirstName_BirthDate.visible);

                if (self.showNationalId() == false) {
                    self.currentSearchType(2);
                }
                // alert(sec.ahwal.NationalId.has_57);

                self.showPersonTable((sec.ahwal.NationalId.visible && sec.ahwal.NationalId.has_50) || sec.ahwal.others.visible);
                self.showSpouseTable(sec.ahwal.NationalId.visible && sec.ahwal.NationalId.has_58);
                self.showDeathTable(sec.ahwal.NationalId.visible && sec.ahwal.NationalId.has_57);


                //console.log("showPersonTable", self.showPersonTable())

                //  console.log("showSpouseTable", self.showSpouseTable())

                //console.log("showDeathTable", self.showDeathTable())


            }

            self.showHideControls();
            self.setTableColumns();

            //self.getGovsUrl = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/TIT_SBProject/GetGovsRestService';
            self.getGovs = function () {

                self.fetchCaheAllData.fillWhat = ['govsInfo'];
                self.fetchCaheAllData.getData(self.errorMessages)
                    .then(function (values) {
                        var info = values[0];
                        if (info.isOK) self.govs(info.data);
                    });

                // $.ajax({
                //     url: self.getGovsUrl,
                //     type: 'GET',

                // }).done(function (data) {

                //     self.govs(data.Gov.map(function (item) {
                //         return {
                //             value: item.govname,
                //             label: item.govname
                //         }
                //     }));
                //     self.govs.unshift({
                //         value: "",
                //         label: "الجميع"
                //     });
                //     console.log('GOVS: ', self.govs());
                // }).fail(function (error) {



                //     console.log("GOVS Error", error);
                // });
            };

            self.getGovs();

            self.personDataprovider = new oj.ArrayTableDataSource(self.personInfoData, {
                idAttribute: 'idNum',
                sortCriteria: {
                    key: 'idNum',
                    direction: 'ascending'
                }
            });

            self.personPagingDataProvider =
                new oj.PagingTableDataSource(self.personDataprovider);



            self.spouseDataprovider = new oj.ArrayTableDataSource(self.spouseInfoData, {
                idAttribute: 'idNum',
                sortCriteria: {
                    key: 'idNum',
                    direction: 'ascending'
                }
            });

            self.spousePagingDataProvider =
                new oj.PagingTableDataSource(self.spouseDataprovider);


            self.deathDataprovider = new oj.ArrayTableDataSource(self.deathInfoData, {
                idAttribute: 'idNum',
                sortCriteria: {
                    key: 'idNum',
                    direction: 'ascending'
                }
            });

            self.deathPagingDataProvider =
                new oj.PagingTableDataSource(self.deathDataprovider);


            self.isSearchButtonDisabled = ko.observable(true);


            self.currentSearchType.subscribe(function (val) {
                self.isSearchButtonDisabled(false);

                self.isIdentityNumValid();

            });


            self.idValue.subscribe(function (val) {
                self.isSearchButtonDisabled(false);
                self.isIdentityNumValid();
            })

            self.isIdentityNumValid = function () {
                val = self.idValue();
                self.identityNumMessages([]);
                if (self.currentSearchType() != 1) {
                    self.isSearchButtonDisabled(true);
                    return;
                }
                //self.isSearchButtonDisabled(false);
                //console.log("Is Valid", isNaN(val));
                if (val.length > 0) {
                    if ((val.length != 14) || isNaN(val)) {
                        self.isSearchButtonDisabled(true);
                        self.identityNumMessages.push({
                            severity: "warning",
                            summary: "الصيغة غير صحيحة",
                            detail: "يجب أن يتم إدخال أرقام ويكون الرقم مكون من 14 رقم فقط"
                        });
                    } else {
                        self.isSearchButtonDisabled(false);
                    }
                } else {
                    self.isSearchButtonDisabled(true);
                }
            }

            //self.url = 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/CSO_SBProject/GetPersonProfileRestService';

            // self.postData = {
            //     "requestType": "60",
            //     "idNum": self.idValue(),
            //     "firstName": "",
            //     "fatherFirstName": "",
            //     "fatherSecondName": "",
            //     "familyName": "",
            //     "birthDateStart": "",
            //     "birthDateEnd": "",
            //     "motherName": "",
            //     "nickName": "",
            //     "governorateCodeOfAddress": "",
            //     "policestationCodeOfAddress": "",
            //     "placeDescription": "",
            //     "placeNo": "",

            //     "CSOHeader": {
            //         "OrganizationCode": "10-10",
            //         "UserName": "AZEID",
            //         "UserIdnum": "27508122700611",
            //         "TransactionNumber": "1010",
            //         "RequestTimeStamp": "2019-06-02 10:10:10.000000",
            //         "ResponseTimeStamp": ""
            //     }
            // }


            self.clearData = function () {
                self.personInfoData([]);
                self.deathInfoData([]);
                self.spouseInfoData([]);
            }

            self.doSearchOthers = function () {

                //console.log("Selected Gov", self.governorateCodeOfAddress());
                self.clearData();

                self.errorMessages([]);


                var req = requests.createPersonInfoRequest("61");
                req.requestType = "61";
                req.idNum = "";
                req.firstName = self.firstName();

                req.fatherFirstName = self.fatherFirstName();
                req.fatherSecondName = self.fatherSecondName();
                req.familyName = self.familyName();
                req.birthDateStart = self.birthDateStart();
                req.birthDateEnd = self.birthDateEnd();
                req.motherName = self.motherName();
                req.nickName = self.nickName();
                req.governorateCodeOfAddress = self.governorateCodeOfAddress();
                req.policestationCodeOfAddress = self.policestationCodeOfAddress();
                req.placeDescription = self.placeDescription();
                req.placeNo = self.placeNo();


                self.fetchCaheAllData.setIdNumber('');
                self.fetchCaheAllData.fillWhat = [{
                    name: 'personInfo',
                    postData: req
                }];
                self.fetchCaheAllData.getData(self.errorMessages, 'doSearchOthers_loader').then(function (values) {
                    var info = values[0];
                    if (info.isOK)
                        self.personInfoData(info.data.ResponsePersonProfile);
                    self.clickSearch(true);
                });
            }


            self.isButtonDisabled = ko.computed(function () {
                var bool = self.firstName().length == 0 &&
                    self.familyName().length == 0 &&
                    self.fatherFirstName().length == 0 &&
                    self.fatherSecondName().length == 0 &&
                    self.motherName().length == 0;


                // self.birthDateStart().length == 0 &&
                // self.birthDateEnd().length == 0 &&
                // self.policestationCodeOfAddress().length == 0 &&
                // self.placeDescription().length == 0 &&
                // self.placeNo().length == 0;
                //console.log("IsButtonDisabled", bool);
                return bool;
            });



            self.doSearchById = function (event) {
                self.errorMessages([]);
                self.clearData();
                if (tracker.valid == 'valid') {
                    // var req = requests.createPersonInfoRequest("60");
                    // req.requestType = "60";
                    // req.idNum = self.idValue();
                    self.fetchCaheAllData.setIdNumber(self.idValue());
                    self.fetchCaheAllData.fillWhat = [];

                    if (self.showPersonTable()) self.fetchCaheAllData.fillWhat.push('personInfo');
                    if (self.showDeathTable()) self.fetchCaheAllData.fillWhat.push('deathInfo');
                    if (self.showSpouseTable()) self.fetchCaheAllData.fillWhat.push('spouseInfo');

                    //console.log("Fill What", self.fetchCaheAllData.fillWhat);

                    self.fetchCaheAllData.getData(self.errorMessages, 'doSearchId_loader').then(function (values) {
                        // document.getElementById("loader").style.visibility = "hidden";
                        // document.getElementById("load").style.visibility = "hidden";

                        var personInfo = values.find(function (ele) {
                            return ele.name == "personInfo"
                        });
                        var spouseInfo = values.find(function (ele) {
                            return ele.name == "spouseInfo"
                        });
                        var deathInfo = values.find(function (ele) {
                            return ele.name == "deathInfo"
                        });

                        self.clickSearch(true);

                        if (personInfo && personInfo.isOK) {
                            self.personInfoData(personInfo.data.ResponsePersonProfile);
                        }

                        if (spouseInfo && spouseInfo.isOK) {
                            self.spouseInfoData(spouseInfo.data.ResponseSpouseProfile);
                        }

                        if (deathInfo && deathInfo.isOK) {
                            self.deathInfoData.push(deathInfo.data);

                            // var b = self.deathInfoData().length > 0 && self.showDeathTable();
                            // alert("COndition   =  " + self.showDeathTable());
                        }
                        // console.log("Person , Spouse , Death",
                        //     personInfo, spouseInfo, deathInfo);


                    });
                } else {
                    tracker.showMessages();
                    tracker.focusOn("@firstInvalidShown");
                }

            }

            // self.isDataValid = function (info) {
            //     if (info.success == false) {
            //         self.errorMessages.push({
            //             severity: "error",
            //             summary: "خطأ",
            //             detail: info.errorText
            //         });
            //         return false;
            //     } else if (info.hasData == false) {
            //         self.errorMessages.push({
            //             severity: "error",
            //             summary: "خطأ",
            //             detail: info.errorText
            //         });
            //         return false;
            //     }
            //     return true;
            // }


            self.doSearch = function () {
                if (self.currentSearchType() == 1) {
                    self.doSearchById();
                } else if (self.currentSearchType() == 2) {
                    self.doSearchOthers();
                }
            }
            self.onRowClick = function (table) {
                var sec = app.securityData;
                // sec.ahwal.NationalId.visible = false;
                if (!(sec.ahwal.NationalId.visible || sec.ahwal.others.visible)) {

                    alert("لايوجد صلاحيه لعرض بيانات");

                    return;
                }

                var currentStateofviewModel = {
                    name: 'searchid',
                    state: '/dashboard/searchid',
                    gridIndex: table.currentRow.rowIndex,
                    idNumber: window.localStorage.getItem('idnumber'),
                    viewModel: self //map.toJSON(self,mapping)
                }
                //console.log("to JS", currentStateofviewModel.viewModel);

                app.addHistory(currentStateofviewModel);


                self.nationalIdNum(table.currentRow.rowKey);
                //console.log("idvalue:", self.nationalIdNum())
                self.router = oj.Router.rootInstance;

                window.localStorage.setItem('idnumber', self.nationalIdNum());

                var lastIdNum = window.sessionStorage.getItem("lastIdNum");

                if (lastIdNum == null || self.nationalIdNum() != lastIdNum) {
                    window.sessionStorage.clear();
                    window.sessionStorage.setItem("lastIdNum", self.nationalIdNum());
                    //console.log("Clear All Cach Data");
                }

                self.router.go('personDetails');


            }

            self.spouseTableListener = function () {
                var table = document.getElementById('spousetable');
                if (table.currentRow == null) {
                    return;
                }
                self.onRowClick(table)

            }
            self.deathTableListener = function () {

                var table = document.getElementById('deathtable');
                if (table.currentRow == null) {
                    return;
                }
                self.onRowClick(table)
            }

            self.personTableListener = function () {
                var table = document.getElementById('persontable');
                if (table.currentRow == null) {
                    return;
                }
                self.onRowClick(table)
            }




            self.connected = function () {

                var personalIdentity = document.getElementById("personalIdentity");
                //console.log("element", personalIdentity);

                personalIdentity.addEventListener("keyup", function (event) {
                    if (event.keyCode == 13 && self.isButtonDisabled() != true) {

                        self.doSearchById();

                    }
                });


            }

        }
        return SearchIdViewModel;
    }
);