define(['ojs/ojcore', 'knockout', 'jquery'],
    function (oj, ko, $) {

        function Requests() {
            var self = this;

            self.createDetailsInfoRequest = function (requestType) {
                return {
                    requestType: !requestType ? "61" : requestType,
                    idNum: "",
                    fcn: "",
                    CSOHeader: {
                        OrganizationCode: "10-10",
                        UserName: "AZEID",
                        UserIdnum: "27508122700611",
                        TransactionNumber: "1010",
                        RequestTimeStamp: "2019-06-02 10:10:10.000000",
                        ResponseTimeStamp: ""
                    }
                }

            }
            self.createSpouseInfoRequest = function (requestType) {
                return {
                    requestType: !requestType ? "62" : requestType,
                    idNum: "",
                    CSOHeader: {
                        OrganizationCode: "10-10",
                        UserName: "AZEID",
                        UserIdnum: "27508122700611",
                        TransactionNumber: "1010",
                        RequestTimeStamp: "2019-06-02 10:10:10.000000",
                        ResponseTimeStamp: ""
                    }
                }
            }
            self.createCarInfoRequest = function () {

                return {
                    pnum: "",
                    platenum: "",
                    pnum1: "",
                    pnum2: "",
                    platenum1: "",
                    ptype: "",
                    govid: ""
                }


            }
            self.createDeathInfoRequest = function (requestType) {
                return {
                    requestType: !requestType ? "63" : requestType,
                    idNum: "",
                    CSOHeader: {
                        OrganizationCode: "10-10",
                        UserName: "AZEID",
                        UserIdnum: "27508122700611",
                        TransactionNumber: "1010",
                        RequestTimeStamp: "2019-06-02 10:10:10.000000",
                        ResponseTimeStamp: ""
                    }
                }
            }
            self.createPersonInfoRequest = function (requestType) {
                var req = {
                    requestType: requestType, //must be string
                    idNum: !requestType ? "60" : requestType,
                    firstName: "",
                    fatherFirstName: "",
                    fatherSecondName: "",
                    familyName: "",
                    birthDateStart: "",
                    birthDateEnd: "",
                    motherName: "",
                    nickName: "",
                    governorateCodeOfAddress: "",
                    policestationCodeOfAddress: "",
                    placeDescription: "",
                    placeNo: "",

                    CSOHeader: {
                        OrganizationCode: "10-10",
                        UserName: "AZEID",
                        UserIdnum: "27508122700611",
                        TransactionNumber: "1010",
                        RequestTimeStamp: "2019-06-02 10:10:10.000000",
                        ResponseTimeStamp: ""
                    }
                };
                return req;
            }

            self.createDriveInfoRequest = function () {
                return {
                    plnum: "",
                }
            }

            self.createPrisonInfoRequest = function () {
                return {
                    natid: "",
                    fname: ''

                }
            }
            self.createAuthInfoRequest = function () {
                return {
                    userid: ""
                }
            }

            self.createLoginInfoRequest = function () {
                return {
                    username: "",
                    password: ""
                }
            }
            self.createForeignPortsInfoRequest = function () {
                return {
                    pass_no: " ",
                    pass_no1: " ",
                    pname: "",
                    pbirthdatefrom: "",
                    pbirthdateto: "",
                    pport_id: "",
                    pmovement_type: "",
                    pmovementdatefrom: "",
                    pmovementdateto: "",
                    pnationaltiyid: "",
                }
            }

            self.createForeignCardsInfoRequest = function () {
                return {
                    pass_no: " ",
                    pass_no1: " ",
                    pname: "",
                    pbirthdatefrom: "",
                    pbirthdateto: "",
                    pport_id: "",
                    pmovement_type: "",
                    pmovementdatefrom: "",
                    pmovementdateto: "",
                    pnationality: "",
                    ppasstype: "",
                }
            }

            self.createEgyptPortsInfoRequest = function () {
                return {
                    pass_no: " ",
                    pass_no1: " ",
                    pname: "",
                    pbirthdatefrom: "",
                    pbirthdateto: "",
                    pport_id: "",
                    pmovement_type: "",
                    pmovementdatefrom: "",
                    pmovementdateto: "",
                }
            }



            self.createEgyptCardsInfoRequest = function () {
                return {
                    pass_no: " ",
                    natid: " ",
                    pass_no1: " ",
                    natid1: " ",
                    pname: "",
                    pbirthdatefrom: "",
                    pbirthdateto: "",
                    pport_id: "",
                    pmovement_type: "",
                    pmovementdatefrom: "",
                    pmovementdateto: "",
                    pissueyear: "",
                    ppasstype: "",
                    pissueplace: ""
                }
            }

            self.createSecurityInfoRequest = function () {
                return {
                    userid: ""
                }
            }
        }
        return new Requests();
    }
);