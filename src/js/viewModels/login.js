/* 
 Changes To Login Javascript File
 */

/**
 * login module
 */
define(['ojs/ojcore', 'knockout', 'jquery',
    'appController', 'viewModels/helpers/fetchandcache_alldata', 'viewModels/helpers/requests',
    'ojs/ojknockout',
    'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojcheckboxset', 'ojs/ojselectcombobox', 'ojs/ojarraydataprovider', 'ojs/ojmessages'

], function (oj, ko, $, app, fetchCaheAllDataClass, requests) {
    /**
     * The view model for the main content view template
     */
    function loginContentViewModel() {
        var self = this;


        self.fetchCaheAllData = new fetchCaheAllDataClass();
        self.username = ko.observable("المرور");
        self.password = ko.observable("المرور");
        self.login = ko.observable("Login");
        self.errorMessages = ko.observableArray([]);
        self.errorMessagesProvider = new oj.ArrayDataProvider(self.errorMessages);
        self.validateMessages = ko.observable();
        self.doLogin = function (event) {
            //document.getElementById("loader").style.visibility = "visible";
            var loginRequest = requests.createLoginInfoRequest();

            loginRequest.username = self.username();
            loginRequest.password = self.password();

            // var loginRequest = {
            //     username: self.username(),
            //     password: self.password()
            // };
            self.fetchCaheAllData.fillWhat = [{
                name: 'loginInfo',
                postData: loginRequest
            }];

            self.fetchCaheAllData.getData(self.errorMessages, 'login_loader').
            then(function (values) {
                // document.getElementById("load").style.visibility = "hidden";

                var info = values[0];


                // if (info.data.userLoginOutput[0].valid !== 1) {
                //     self.errorMessages.push({
                //         severity: "error",
                //         summary: "خطأ",
                //         detail: "خطا فى الاسم او كلمة السر"
                //     });
                // } else 
                // {
                if (info.isOK) {
                    var userId = info.data.userLoginOutput[0].userid;
                    self.checkAuthorized(userId).then(function (userIsAuth) {
                        if (userIsAuth) {
                            self.getSecurityData(userId).then(function (data) {
                                app.setSecurityData(data); //save security data in appController
                                //console.log("Security Application Data", data);
                                setTimeout(() => {
                                    var startPage = "";
                                    if (data.ahwal.visible) startPage = "dashboard";
                                    else if (data.cars.visible) startPage = "vehicles";
                                    else if (data.prisoners.visible) startPage = "prisoners";
                                    else if (data.passports.visible) startPage = "passports";
                                    oj.Router.rootInstance.go(startPage).then(() => {

                                    })
                                }, 10)
                            })
                        } else {
                            self.errorMessages.push({
                                severity: "error",
                                summary: "خطأ",
                                detail: "لا توجد لهذا المستخدم أي صلاحية لإستخدام هذا التطبيق"
                            });
                        }
                    });
                }
            });
        } //=====do Login function
        self.getSecurityData = function (userId) {
            return new Promise(function (resolve, reject) {
                var securityRequest = requests.createSecurityInfoRequest();
                securityRequest.userid = userId;
                // var securityRequest = {
                //     userid: userId
                // };
                var fetch = new fetchCaheAllDataClass();
                fetch.fillWhat = [{
                    name: 'securityInfo',
                    postData: securityRequest
                }];


                fetch.getData(self.errorMessages, 'login_loader')
                    .then(function (values) {
                        var info = values[0];
                        if (info.isOK) resolve(info.data);
                    })
            }).catch(function (error) {
                reject(error);
            });
        }
        self.checkAuthorized = function (userid) {
            var fetchData = new fetchCaheAllDataClass();

            var authRequest = requests.createAuthInfoRequest();
            authRequest.userid = userid;

            fetchData.fillWhat = [{
                name: 'authInfo',
                postData: authRequest
            }];
            return new Promise(function (resolve, reject) {
                fetchData.getData(self.errorMessages, 'login_loader')
                    .then(function (values) {
                        var info = values[0];
                        if (info.isOK)
                            resolve(info.data.isUserAuthorized);
                        else
                            resolve(false);
                        //}
                    }).catch(function (error) {
                        resolve(false);
                    });
            });
        }

        self.connected = function () {
            // self.refresh(self.selectedLang());

            var username = document.getElementById("username");
            username.addEventListener("keyup", function (event) {
                if (event.keyCode == 13) {
                    passwordElem.focus();
                }
            });

            var passwordElem = document.getElementById("password");
            passwordElem.addEventListener("keyup", function (event) {
                if (event.keyCode == 13)
                    $("#submit").click();
            });
        }
    }


    return loginContentViewModel;
});