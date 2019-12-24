define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojformlayout',
        'ojs/ojinputtext', 'ojs/ojbutton',
        'ojs/ojvalidationgroup', 'ojs/ojrouter'
    ],
    function (oj, ko, $, app) {

        function CarViewModel() {
            var self = this;
            self.carDetails = ko.observable({});
            // self.current_datetime = new Date(self.carDetails().EXPIRYDATE);
            // console.log('DATE: ', self.current_datetime);
            // self.formatted_date = self.current_datetime.getFullYear() + "-" + (self.current_datetime.getMonth() + 1) + "-" + self.current_datetime.getDate();
            //self.carDetails = JSON.parse(window.localStorage.getItem('carData'));


            self.connected = function () {
                //console.log("Current State :", oj.Router.rootInstance.currentState().value)
                var row = oj.Router.rootInstance.getState('car').value;
                //console.log('Row State:', row);
                if (!row)
                    return;
                //console.log("ROW", row);
                row.ISSUEDATE = self.getDateAsString(row.ISSUEDATE);
                row.EXPIRYDATE = self.getDateAsString(row.EXPIRYDATE);
                row.INSURANCEDATE = self.getDateAsString(row.INSURANCEDATE);
                row.INSURANCEEXPIRYDATE = self.getDateAsString(row.INSURANCEEXPIRYDATE);
                self.carDetails(row);
                //console.log('Car Details: ', self.carDetails());

            }


            self.getDateAsString = function (dateString) {
                var d = new Date(dateString);
                var s = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                return s;
            }
        }



        self.gotoPersonDetails = function (num) {

            var idnum = num;

            var currentStateofviewModel = {
                name: 'car',
                state: 'car',
                gridIndex: -1,
                idNumber: window.localStorage.getItem('idnumber'),
                viewModel: self //map.toJSON(self,mapping)
            }


            app.addHistory(currentStateofviewModel);

            self.router = oj.Router.rootInstance;

            window.localStorage.setItem('idnumber', idnum);

            self.router.go('personDetails');
        }

        return CarViewModel;
    }
);