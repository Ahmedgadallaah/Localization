// Config your IP ADREESS and PORT NUMBER HERE
// Right Octets From Left To Right
// The most left octet is the firstOctet, The most right octet is fourthOctet

define(['ojs/ojcore', 'knockout', 'jquery'],
  function (oj, ko, $) {

    function ipConfigModel() {
      var self = this;
      self.firstOctet = "192";
      self.secondOctet = "168";
      self.thirdOctet = "1";
      self.fourthOctet = "202";
      self.portNumber = "7777";
    }

    return new ipConfigModel();
  }
);