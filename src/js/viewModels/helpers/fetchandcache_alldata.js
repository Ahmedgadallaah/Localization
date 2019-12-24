define([
    'jquery',
    'viewModels/helpers/ipConfig',
    'viewModels/helpers/requests'
], function ($, ipConfig, requests) {

    function FetchAndCacheAllData() {
        var self = this;

        self.idNumber = "";
        self.setIdNumber = function (idnumber) {
            self.idNumber = idnumber;
        }
        self.isObject = function (val) {
            return typeof val === "object";
        }
        self.isNaN = function (val) {
            return typeof val === "NaN";
        }
        self.iterate = function (obj) {
            for (k in obj) {
                if (self.isObject(obj[k])) {
                    obj[k] = "";
                }
                if (self.isNaN(obj[k])) {
                    obj[k] = "";

                }

            }
        }

        self.genAjax = {
            setIdNumber: function (idNumber) {

            },
            getData: function (service) {
                var postData = service.postData;


                console.log(`Request Data [${service.name}]`, postData);

                return new Promise(function (resolve, reject) {

                    var ajaxOptions = {
                        url: service.url,
                        type: !service.ajaxType ? 'POST' : service.ajaxType,
                        contentType: 'application/json;charset=UTF-8',
                        dataType: 'json',
                        success: function (data) {
                            console.log('success data: ', data);
                            resolve(data);
                        },
                        error: function (error) {
                            reject(error);
                            console.log('Error: ', error);
                        }

                    }
                    if (postData)
                        ajaxOptions.data = JSON.stringify(postData);

                    $.ajax(ajaxOptions);

                })
            }
        }

        self.services = {
            personInfo: {
                name: 'personInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/CSO_SBProject/GetPersonProfileRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: 'لايوجد بيانات اساسيه للمواطن"',
                onErrorMessage: "خطأ ف استرجاع البيانات الاساسيىه للمواطن",
                getRealData: function (data) {
                    return data.ResponsePersonProfile
                },
                processData: function (data) {

                },
                getDefaultRequest: function () {
                    var req = requests.createPersonInfoRequest("60");
                    req.idNum = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            spouseInfo: {
                name: 'spouseInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/CSO_SBProject/GetSpouseProfileRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لا يوجد معلومات زواج للمواطن",
                onErrorMessage: "خطأ ف استرجاع معلومات الزواج للمواطن",
                getRealData: function (data) {
                    return data.ResponseSpouseProfile
                },
                processData: function (data) {
                    var sortFunc = function (data) {
                        if (Array.isArray(data.ResponseSpouseProfile)) {
                            data.ResponseSpouseProfile.sort(function (a, b) {
                                if (a.eventDate < b.eventDate) return -1;
                                if (a.eventDate > b.eventDate) return 1;
                                return 0;
                            })
                        }
                    } ///sort func
                    var changeData = function (data) {
                        obj = data.ResponseSpouseProfile;
                        for (i = 0; i < obj.length; i++) {
                            obj[i].spouseType = obj[i].spouseType.trim();
                            if (obj[i].spouseType == '1') {
                                obj[i].spouseType = 'قائمة';
                            } else if (obj[i].spouseType == '2') {
                                obj[i].spouseType = 'غير قائمة';
                            }
                        }

                    }

                    sortFunc(data);
                    changeData(data);
                },
                getDefaultRequest: function () {
                    var req = requests.createSpouseInfoRequest();
                    req.idNum = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            deathInfo: {
                name: 'deathInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/CSO_SBProject/GetDeathDetailsRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لايوجد بيانات وفاة للمواطن",
                onErrorMessage: "خطأ ف استرجاع بيانات الوفاة للمواطن",
                getRealData: function (data) {
                    return data;
                },
                processData: function (data) {},
                getDefaultRequest: function () {
                    var req = requests.createDeathInfoRequest();
                    req.idNum = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            carInfo: {
                name: 'carInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/TIT_SBProject/TITInfoRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لايوجد بيانات مركبات للمواطن",
                onErrorMessage: "خطأ ف استرجاع بيانات المركبات للمواطن",
                getRealData: function (data) {
                    return data.getTITInfoOutput
                },
                processData: function (data) {
                    var filterArray = function (data) {
                        return data.filter(function (ele) {
                            return ele.PLATENUM != "";
                        });
                    }
                    var processData = function (data) {
                        data.forEach(function (item) {
                            self.iterate(item);
                        });
                    }
                    processData(data.getTITInfoOutput);
                    data.getTITInfoOutput = filterArray(data.getTITInfoOutput);
                },
                getDefaultRequest: function () {
                    var req = requests.createCarInfoRequest();
                    req.pnum = self.idNumber;
                    req.pnum1 = self.idNumber;
                    req.pnum2 = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            detailsInfo: {
                name: 'detailsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/CSO_SBProject/GetPersonDetailsRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لايوجد بيانات تفصيليه للمواطن",
                onErrorMessage: "خطأ ف استرجاع البيانات التفصيليه للمواطن",
                getRealData: function (data) {
                    return data;
                },
                processData: function (data) {
                    var changeData = function (obj) {
                        // father birth day
                        fatherBirthCentury = obj.fatherIdNum.substring(0, 1);

                        if (fatherBirthCentury == 1) {
                            fatherBirthCentury = 18;
                        } else if (fatherBirthCentury == 2) {
                            fatherBirthCentury = 19;
                        } else {
                            fatherBirthCentury = 20;
                        }

                        fatherBirthYear = obj.fatherIdNum.substring(1, 3);
                        fatherBirthMon = obj.fatherIdNum.substring(3, 5);
                        fatherBirthDay = obj.fatherIdNum.substring(5, 7);

                        obj.fatherBirthDate = fatherBirthCentury + fatherBirthYear + '-' + fatherBirthMon + '-' + fatherBirthDay;

                        // mother birth day
                        motherBirthCentury = obj.motherIdNum.substring(0, 1);

                        if (motherBirthCentury == 1) {
                            motherBirthCentury = 18;
                        } else if (motherBirthCentury == 2) {
                            motherBirthCentury = 19;
                        } else {
                            motherBirthCentury = 20;
                        }

                        motherBirthYear = obj.motherIdNum.substring(1, 3);
                        motherBirthMon = obj.motherIdNum.substring(3, 5);
                        motherBirthDay = obj.motherIdNum.substring(5, 7);


                        obj.motherBirthDate = motherBirthCentury + motherBirthYear + '-' + motherBirthMon + '-' + motherBirthDay;
                    }

                    changeData(data);
                },
                getDefaultRequest: function () {
                    var req = requests.createDetailsInfoRequest();
                    req.idNum = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            driveInfo: {
                name: 'driveInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/DL_SBProject/getDLInfoRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: 'لا يوجد بيانات رخص القيادة للمواطن',
                onErrorMessage: "خطأ في استرجاع بيانات رخص القيادة للمواطن",
                getRealData: function (data) {
                    return data.getDLInfoOutput;
                },
                processData: function (data) {
                    var changeData = function (row) {
                        for (k in row) {
                            if (k == 'ISSUEDATE') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                            if (k == 'EXPIRYDATE') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                        }
                    }
                    var processData = function (data) {
                        data.forEach(function (item) {
                            self.iterate(item);
                            changeData(item);
                        });
                    }

                    processData(data.getDLInfoOutput);


                },
                getDefaultRequest: function () {
                    var req = requests.createDriveInfoRequest();
                    req.plnum = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            prisonInfo: {
                name: 'prisonInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/Prisons_SBProject/PrisonerInfoRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لايوجد بيانات  للمسجون",
                onErrorMessage: "خطأ ف استرجاع البيانات  للمسجون",
                getRealData: function (data) {
                    return data.Prisoner;
                },
                processData: function (data) {

                    var changeData = function (row) {
                        for (k in row) {
                            if (k == 'startdate') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                            if (k == 'enddate') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                        }
                    }
                    var processData = function (data) {
                        data.forEach(function (item) {
                            self.iterate(item);
                            changeData(item);
                        });
                    }

                    processData(data.Prisoner);

                },
                getDefaultRequest: function () {
                    var req = requests.createPrisonInfoRequest();
                    req.natid = self.idNumber;
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            authInfo: {
                name: 'authInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/USISEC_SBProject/UserAuthorityRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لايوجد بيانات سماحيات للمستخدم",
                onErrorMessage: "خطأ ف استرجاع البيانات السماحيات للمستخدم",
                getRealData: function (data) {
                    return data.userAuthorityOutput
                },
                processData: function (data) {

                    var ar = data.userAuthorityOutput;
                    var tabsNumbers = [5, 6, 7, 8, 9];
                    isUserAuthorized = false;
                    var i = 0;
                    var ele;
                    for (i = 0; i < ar.length; i++) {
                        ele = ar[i];
                        if (tabsNumbers.includes(ele.APP_ID)) {
                            isUserAuthorized = true;
                            break;
                        }
                    }
                    data.isUserAuthorized = isUserAuthorized;
                },
                getDefaultRequest: function () {
                    var req = requests.createAuthInfoRequest();
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            loginInfo: {
                name: 'loginInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/USISEC_SBProject/UserLoginRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "خطا فى الاسم او كلمة السر",
                onErrorMessage: "لايوجد بيانات  للمستخدم",
                getOtherErrorMessage: function (data) {
                    if (data.userLoginOutput[0].valid !== 1)
                        return "خطا فى الاسم او كلمة السر";
                    return "";
                },
                getRealData: function (data) {
                    return data.userLoginOutput
                },
                processData: function (data) {

                },
                getDefaultRequest: function () {
                    var req = requests.createLoginInfoRequest();
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            egyptCardsInfo: {
                name: 'egyptCardsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/ExitEntryEgy_SBProject/ExitEntryEgyRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات كروت مصريين ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.exitEntryEgyOutput
                },
                processData: function (data) {
                    var changeData = function (row) {
                        for (k in row) {
                            if (k == 'pbirthdatefrom') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                            if (k == 'pbirthdateto') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                            if (k == 'movement_date') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                            if (k == 'pbirthdateto') {
                                row[k] = new Date(row[k]).toLocaleDateString()
                            }
                        }
                    }
                    data.exitEntryEgyOutput.forEach(function (ele) {
                        changeData(ele);
                    })
                },
                getDefaultRequest: function () {
                    var req = requests.createEgyptCardsInfoRequest();
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            egyptPortsInfo: {
                name: 'egyptPortsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/PortsEgyMovsRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات منافذ مصريين",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.portsEgyMovsOutput
                },
                processData: function (data) {

                },
                getDefaultRequest: function () {
                    var req = requests.createEgyptPortsInfoRequest();
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            foreignCardsInfo: {
                name: 'foreignCardsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/ExitEntryEgy_SBProject/ExitEntryForRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات كروت أجانب",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.exitEntryForOutput
                },
                processData: function (data) {

                },
                getDefaultRequest: function () {
                    var req = requests.createForeignCardsInfoRequest();
                    return req;
                },
                loader: undefined,
                postData: undefined
            },

            foreignPortsInfo: {
                name: 'foreignPortsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/PortsForRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات منافذ أجانب",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.portsForMovsOutput
                },
                processData: function (data) {

                },
                getDefaultRequest: function () {
                    var req = requests.createForeignPortsInfoRequest();
                    return req;
                },
                loader: undefined,
                postData: undefined
            },
            //========combo ports

            comboEgyptCardsInfo: {
                name: 'comboEgyptCardsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + "/ExitEntryEgy_SBProject/getAllPortsEgyRestService",
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.LkpExitEgyGeo;
                },
                processData: function (data) {

                },
                loader: undefined,
                postData: undefined
            },


            comboEgyptPortsInfo: {
                name: 'comboEgyptPortsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/getAllPortEgyRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.LkpPortsEgyPorts
                },
                processData: function (data) {

                },
                loader: undefined,
                postData: undefined
            },



            comboForeignCardsInfo: {
                name: 'comboForeignCardsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/ExitEntryEgy_SBProject/getAllPortsForRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.LkpExitForGeo;
                },
                processData: function (data) {

                },
                loader: undefined,
                postData: undefined
            },


            comboForeignPortsInfo: {
                name: 'comboForeignPortsInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/PASSPORTS_PORTS_SBProject/getAllPortsForRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.LkpPortsForPorts;
                },
                processData: function (data) {

                },
                loader: undefined,
                postData: undefined
            },


            govsInfo: {
                name: 'govsInfo',
                ajaxType: 'GET',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/TIT_SBProject/GetGovsRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.Gov
                },
                processData: function (data) {
                    var ar = data.Gov.map(function (item) {
                        return {
                            value: item.govname,
                            label: item.govname
                        }
                    });
                    ar.unshift({
                        value: "",
                        label: "الجميع"
                    });
                    return ar;
                },
                loader: undefined,
                postData: undefined
            },


            typesInfo: {
                name: 'typesInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/TIT_SBProject/GetPlateTypeRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: "لاتوجد بيانات ",
                onErrorMessage: " خطأ استرجاع بيانات البحث ",
                getRealData: function (data) {
                    return data.exitEntryEgyOutput
                },
                processData: function (data) {

                },
                loader: undefined,
                postData: undefined
            },


            securityInfo: {
                name: 'securityInfo',
                url: 'http://' + ipConfig.firstOctet + '.' + ipConfig.secondOctet + '.' + ipConfig.thirdOctet + '.' + ipConfig.fourthOctet + ':' + ipConfig.portNumber + '/USISEC_SBProject/UserAuthorityRestService',
                fetchAjax: self.genAjax,
                onHasNotDataMessage: 'لايوجد صلاحيـات "',
                onErrorMessage: "خطأ ف استرجاع الصلاحيـــات",
                getRealData: function (data) {
                    return data.userAuthorityOutput
                },
                processData: function (data) {
                    var build = new BuildSecurityData(data.userAuthorityOutput);
                    return build.getApplications(); //if processData return data then 
                    //this data will be passed to the resolve in servicePromise.
                },
                getDefaultRequest: function () {
                    var req = requests.createSecurityInfoRequest();

                    return req;
                },
                loader: undefined,
                postData: undefined
            },







        } //===self.services
        /**
         * @param {string} service service to be processed
         */
        self.getServicePromise = function (service) {
            // personInfo.setPostData(postData);
            service.fetchAjax.setIdNumber(self.idNumber);
            return new Promise(function (resolve, reject) {
                if (service.loader) self.showLoader(service.loader);

                var postData = service.postData;
                if (typeof service.getDefaultRequest === "function") {
                    if (!postData)
                        service.postData = service.getDefaultRequest();
                }

                //service.fetchAjax.getData(postData, service.url)
                service.fetchAjax.getData(service)
                    .then(function (data) {
                        if (service.loader) self.hideLoader(service.loader);
                        var realData = (data != null && data) ? service.getRealData(data) : undefined;
                        var bhasdata =
                            data != null && !(typeof data === 'undefined' || typeof realData === 'undefined');
                        var obj = {
                            success: true,
                            hasData: bhasdata,
                            name: service.name,
                            data: data,
                            otherErrorMessage: service.getOtherErrorMessage ? service.getOtherErrorMessage(data) : undefined,
                            errorText: !bhasdata ? service.onHasNotDataMessage : "",
                            error: null
                        };
                        if (self.isValid(obj)) {

                            var dd = service.processData(obj.data);
                            console.log("Real Data", obj);
                            //===if processData return data then pass this data(dd)
                            //instead of obj ELse(processData is undefined or null) pass obj.data
                            obj.data = (dd != null && dd) ? dd : obj.data;
                            obj.isOK = true;
                            resolve(obj);

                        } else {

                            reject(obj)
                        }
                    }).catch(function (error) {

                        if (service.loader) self.hideLoader(service.loader);
                        var obj = {
                            success: false,
                            errorText: service.onErrorMessage,
                            name: service.name,
                            error: error,
                            data: null
                        };
                        self.isValid(obj, error); //==to show error

                        reject(obj);
                    });
            }).catch(function (error) {
                if (service.loader) self.hideLoader(service.loader);
                return error;
            });

        } //getServicePromise

        self.fillWhat = [];


        self.errorMessages = undefined;
        self.mainLoader = undefined;
        self.getData = function (errorMessages, mainLoader) {
            self.errorMessages = errorMessages;
            self.mainLoader = mainLoader;

            //console.log("Person Info class", personInfo);
            var lastIdNum = window.sessionStorage.getItem("lastIdNum");
            if (lastIdNum == null || self.idNumber != lastIdNum) {
                window.sessionStorage.clear();
                window.sessionStorage.setItem("lastIdNum", self.idNumber);
                console.log("Clear All Cach Data");
            }

            var promises = [];

            if (self.fillWhat.length == 0) {

            } //if
            else {
                for (var i = 0; i < self.fillWhat.length; i++) {
                    var objPassed = self.fillWhat[i];
                    var type = typeof objPassed;
                    console.log("objPassed", objPassed);
                    var name = type == 'object' ? objPassed.name : objPassed;
                    var postData = type == 'object' ? objPassed.postData : undefined;
                    var loader = type == 'object' ? objPassed.loader : undefined;


                    self.services[name].postData = postData;
                    self.services[name].loader = loader;
                    promises.push(self.getServicePromise(self.services[name]));

                }
            } //else
            console.log("Promises", promises);
            return new Promise(function (resolve, reject) {
                self.showMainLoader();
                Promise.all(promises).then(function (values) {
                    self.hideMainLoader();
                    resolve(values);
                }).catch(function (error) {
                    self.hideMainLoader()
                    reject(error);
                });
            })
        }

        self.hideMainLoader = function () {
            if (!self.mainLoader) return;
            var loader = self.mainLoader;
            // setTimeout(function () {
            $("#" + loader).hide();
            //  }, 3000);

        }


        self.showMainLoader = function () {
            if (!self.mainLoader) return;
            var loader = self.mainLoader;

            $("#" + loader).show();

            console.log("LOADER", loader);
        }

        self.showLoader = function (loader) {
            if (loader) {
                $("#" + loader).show();
            }
            console.log("LOADER", loader);
        }

        self.hideLoader = function (loader) {
            // setTimeout(function () {
            if (loader) $("#" + loader).hide();
            // }, 3000);

        }

        self.objectToDash = function (data) {
            var isObject = function (val) {
                return typeof val === "object";
            }
            var iterate = function (obj) {
                for (k in obj) {
                    if (isObject(obj[k])) {
                        obj[k] = "--";
                    }
                }
            }
            data.forEach(function (item) {
                iterate(item);
            });
        }

        self.isValid = function (obj, error) {
            // if (obj.success && obj.hasData) return true;
            if (obj.success && obj.hasData) {
                if (obj.otherErrorMessage) {
                    if (self.errorMessages) {
                        //alert("Must show Error messages")
                        console.log("errorMessages", self.errorMessages)
                        self.errorMessages.push({
                            severity: "error",
                            summary: "خطأ",
                            detail: obj.otherErrorMessage
                        });

                    }
                    return false;
                }
                return true;
            } else if (!obj.success || !obj.hasData) {
                var summary = (obj.success && !obj.hasData) ? 'تحذير' : 'خطأ';
                var severity = (obj.success && !obj.hasData) ? 'warning' : 'error';
                if (self.errorMessages) {
                    //alert("Must show Error messages")
                    console.log('obj.errorText + error ? JSON.stringify(error) : ""',
                        typeof obj.errorText + error ? JSON.stringify(error) : "")
                    var erText = obj.errorText;
                    self.errorMessages.push({
                        severity: severity,
                        summary: summary,
                        detail: obj.errorText + (error ? JSON.stringify(error) : "")
                    });
                }
            }
            return false;
        }
        //===============define here buisines classes====

        //class to build security data and convert it to an object which used in pages
        function BuildSecurityData(data) {
            var self = this;
            self.data = data;
            self.getApplications = function () {
                var app = {};
                app.ahwal = {};
                app.cars = {};
                app.prisoners = {};
                app.passports = {};
                app.genSecurity = {};
                serviceData = {};


                serviceData.appIds = self.data.map(function (ele) {
                    return ele.APP_ID;
                });

                //======Gadallah this for TEST=========
                serviceData.appIds.push(8);
                serviceData.appIds.push(10);
                console.log("serviceData", serviceData);
                //======Gadallah this for TEST=======

                serviceData.ahwalTransIds = self.data.filter(function (ele) {
                    return ele.APP_ID == 5;
                }).map(function (el) {
                    return el.TRANSACTION_ID;
                });
                serviceData.carsTransIds = self.data.filter(function (ele) {
                    return ele.APP_ID == 6;
                }).map(function (el) {
                    return el.TRANSACTION_ID;
                });

                serviceData.prisonersTransIds = self.data.filter(function (ele) {
                    return ele.APP_ID == 7;
                }).map(function (el) {
                    return el.TRANSACTION_ID;
                });




                serviceData.passportsTransIds = self.data.filter(function (ele) {
                    return ele.APP_ID == 8;
                }).map(function (el) {
                    return el.TRANSACTION_ID;
                });

                serviceData.genSecurity = self.data.filter(function (ele) {
                    return ele.APP_ID == 10;
                }).map(function (el) {
                    return el.TRANSACTION_ID;
                });


                //===GADALLAH THIS FOR TEST=====
                serviceData.passportsTransIds.push(81);
                serviceData.passportsTransIds.push(82);
                serviceData.passportsTransIds.push(83);
                serviceData.passportsTransIds.push(84);
                serviceData.passportsTransIds.push(85);
                serviceData.passportsTransIds.push(86);
                serviceData.passportsTransIds.push(87);
                serviceData.passportsTransIds.push(88);
                serviceData.passportsTransIds.push(89);


                serviceData.genSecurity.push(100);
                serviceData.genSecurity.push(101);
                serviceData.genSecurity.push(102);
                serviceData.genSecurity.push(103);
                serviceData.genSecurity.push(104);
                serviceData.genSecurity.push(105);
                serviceData.genSecurity.push(106);
                serviceData.genSecurity.push(107);
                //===GADALLAH THIS FOR TEST=====




                app.ahwal.visible = serviceData.appIds.includes(5);
                app.cars.visible = serviceData.appIds.includes(6);
                app.prisoners.visible = serviceData.appIds.includes(7);
                app.passports.visible = serviceData.appIds.includes(8);
                app.genSecurity.visible = serviceData.appIds.includes(10);

                self.buildAhwal(serviceData, app.ahwal);
                self.buildCars(serviceData, app.cars);
                self.buildPrisoners(serviceData, app.prisoners);
                self.buildPassports(serviceData, app.passports);
                self.buildgenSecurity(serviceData, app.genSecurity);
                return app;
            }

            self.buildAhwal = function (serviceData, ahwal) {

                ahwal.NationalId = {};
                ahwal.others = {};

                ahwal.others.Address = {};
                ahwal.others.FullName = {};


                ahwal.others.FirstName_BirthDate = {};

                ahwal.others.FatherName = {};
                ahwal.others.MotherName = {};
                ahwal.others.Father_Mother_Name = {}

                ahwal.NationalId.has_50 = serviceData.ahwalTransIds.includes(50);
                ahwal.NationalId.has_57 = serviceData.ahwalTransIds.includes(57);
                ahwal.NationalId.has_58 = serviceData.ahwalTransIds.includes(58);
                ahwal.NationalId.visible = ahwal.NationalId.has_50 || ahwal.NationalId.has_57 || ahwal.NationalId.has_58;


                ahwal.others.Address.has_56 = serviceData.ahwalTransIds.includes(56);
                ahwal.others.Address.visible = ahwal.others.Address.has_56;

                ahwal.others.FullName.has_51 = serviceData.ahwalTransIds.includes(51);
                ahwal.others.FullName.visible = ahwal.others.FullName.has_51;


                ahwal.others.FirstName_BirthDate.has_52 = serviceData.ahwalTransIds.includes(52);
                ahwal.others.FirstName_BirthDate.visible = ahwal.others.FirstName_BirthDate.has_52;


                ahwal.others.FatherName.has_53 = serviceData.ahwalTransIds.includes(53);
                ahwal.others.FatherName.visible = ahwal.others.FatherName.has_53;


                ahwal.others.MotherName.has_54 = serviceData.ahwalTransIds.includes(54);
                ahwal.others.MotherName.visible = ahwal.others.MotherName.has_54;


                ahwal.others.Father_Mother_Name.has_55 = serviceData.ahwalTransIds.includes(55);
                ahwal.others.Father_Mother_Name.visible = ahwal.others.Father_Mother_Name.has_55;


                ahwal.others.visible = ahwal.others.Father_Mother_Name.visible ||
                    ahwal.others.MotherName.visible || ahwal.others.FatherName.visible ||
                    ahwal.others.FirstName_BirthDate.visible || ahwal.others.FullName.visible ||
                    ahwal.others.Address.visible


            }


            self.buildCars = function (serviceData, cars) {

                cars.NationalId = {}; //==

                cars.PlateAplhaNum = {};
                cars.PlateNum = {};
                cars.PlateNum_LicenseType = {};
                cars.PlateNum_Gov = {};
                cars.PlateNum_LicenseType_Gov = {};

                cars.NationalId.has_60 = serviceData.carsTransIds.includes(60);
                cars.NationalId.has_66 = serviceData.carsTransIds.includes(66);

                cars.NationalId.visible = cars.NationalId.has_60 || cars.NationalId.has_66;

                cars.PlateAplhaNum.has_61 = serviceData.carsTransIds.includes(61);

                cars.PlateAplhaNum.visible = cars.PlateAplhaNum.has_61;

                cars.PlateNum.has_62 = serviceData.carsTransIds.includes(62);

                cars.PlateNum.visible = cars.PlateNum.has_62;

                cars.PlateNum_LicenseType.has_63 = serviceData.carsTransIds.includes(63);
                cars.PlateNum_LicenseType.visible = cars.PlateNum_LicenseType.has_63;



                cars.PlateNum_Gov.has_64 = serviceData.carsTransIds.includes(64);
                cars.PlateNum_Gov.visible = cars.PlateNum_Gov.has_64;


                cars.PlateNum_LicenseType_Gov.has_65 = serviceData.carsTransIds.includes(65);
                cars.PlateNum_LicenseType_Gov.visible = cars.PlateNum_LicenseType_Gov.has_65;






            }


            self.buildPrisoners = function (serviceData, prisoners) {

                prisoners.NationalId = {}; //==

                prisoners.Name = {};


                prisoners.NationalId.has_70 = serviceData.prisonersTransIds.includes(70);


                prisoners.NationalId.visible = prisoners.NationalId.has_70;


                prisoners.Name.has_71 = serviceData.prisonersTransIds.includes(71);


                prisoners.Name.visible = prisoners.Name.has_71;

            }

            self.buildPassports = function (serviceData, passports) {
                passports.NationalId = {};
                passports.PassportNo = {};
                passports.Others = {};
                passports.NationalId.has_81 = serviceData.passportsTransIds.includes(81);
                passports.NationalId.visible = passports.NationalId.has_81;

                passports.PassportNo.has_82 = serviceData.passportsTransIds.includes(82);
                passports.PassportNo.has_83 = serviceData.passportsTransIds.includes(83);
                passports.PassportNo.visible = passports.PassportNo.has_82 || passports.PassportNo.has_83;

                passports.PassportNo.SearchEgypt = passports.PassportNo.has_82;
                passports.PassportNo.SearchForeign = passports.PassportNo.has_83;

                passports.Others.has_84 = serviceData.passportsTransIds.includes(84);
                passports.Others.has_85 = serviceData.passportsTransIds.includes(85);
                passports.Others.has_86 = serviceData.passportsTransIds.includes(86);
                passports.Others.has_87 = serviceData.passportsTransIds.includes(87);
                passports.Others.has_88 = serviceData.passportsTransIds.includes(88);
                passports.Others.has_89 = serviceData.passportsTransIds.includes(89);
                passports.Others.visible = passports.Others.has_84 ||
                    passports.Others.has_85 || passports.Others.has_86 ||
                    passports.Others.has_87 || passports.Others.has_88 ||
                    passports.Others.has_89;

                passports.Others.SearchEgypt = passports.Others.has_84 || passports.Others.has_86 || passports.Others.has_88;
                passports.Others.SearchForeign = passports.Others.has_85 || passports.Others.has_87 || passports.Others.has_89;

                passports.Others.BirthDate = {}; //تاريخ ميلاد من الى
                passports.Others.TransDate = {}; //ناريخ حركة من الى
                passports.Others.BirthDate.visible = passports.Others.has_86 || passports.Others.has_87
                passports.Others.TransDate.visible = passports.Others.has_88 || passports.Others.has_89



            }

            self.buildgenSecurity = function (serviceData, genSecurity) {
                genSecurity.NationalId = {};
                genSecurity.PlateAplhaNum = {};
                genSecurity.PlateNum = {};
                genSecurity.CaseNum = {};
                genSecurity.NationalId.has_100 = serviceData.genSecurityTransIds.includes(100);
                genSecurity.NationalId.has_101 = serviceData.genSecurityTransIds.includes(101);
                genSecurity.NationalId.visible = genSecurity.NationalId.has_100 || genSecurity.NationalId.has_101;

                genSecurity.PlateAplhaNum.has_102 = serviceData.genSecurityTransIds.includes(102);
                genSecurity.PlateAplhaNum.visible = genSecurity.PlateAplhaNum.has_102;

                genSecurity.PlateNum.has_103 = serviceData.genSecurityTransIds.includes(103);
                genSecurity.PlateNum_Gov.has_104 = serviceData.genSecurityTransIds.includes(104);
                genSecurity.PlateNum_PlateType.has_105 = serviceData.genSecurityTransIds.includes(105);
                genSecurity.PlateNum_Gov_PlateType.has_106 = serviceData.genSecurityTransIds.includes(106);
                genSecurity.Others.visible = genSecurity.PlateNum.has_103 ||
                    genSecurity.PlateNum_Gov.has_104 ||
                    genSecurity.PlateNum_PlateType.has_105 ||
                    genSecurity.PlateNum_Gov_PlateType.has_106;

                genSecurity.CaseNum.has_107 = serviceData.genSecurityTransIds.includes(107);
                genSecurity.CaseNum.visible = genSecurity.Case.has_107;
            }


        }

    }
    return FetchAndCacheAllData;
});