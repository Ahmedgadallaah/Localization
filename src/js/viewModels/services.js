define(['ojs/ojcore', 'knockout', 'jquery'],
  function (oj, ko, $) {
    function DashboardViewModel() {
      var self = this;
      // self.personalProfile = {
      //   requestType: "61",
      //   idNum: "",
      //   firstName: "أحمد",
      //   fatherFirstName: "ماهر",
      //   fatherSecondName: "محمد حسن",
      //   familyName: "عبد الرؤوف",
      //   birthDateStart: "1983-01-31",
      //   birthDateEnd: "1983-01-31",
      //   motherName: "",
      //   nickName: "",
      //   governorateCodeOfAddress: "",
      //   policestationCodeOfAddress: "",
      //   placeDescription: "",
      //   placeNo: "",
      //   CSOHeader: {
      //     OrganizationCode: "10-10",
      //     UserName: "amaher",
      //     UserIdnum: "28301310102372",
      //     TransactionNumber: "1010",
      //     RequestTimeStamp: "",
      //     ResponseTimeStamp: ""
      //   }
      // };

      //$.post('http://192.168.1.202:7003/CSO_SBProject/GetPersonDetailsRestService', self.personalProfile);
    }

    return new DashboardViewModel();
  }
);