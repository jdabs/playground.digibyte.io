'use strict';

angular.module('playApp.address', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/address', {
    templateUrl: 'address/address.html',
    controller: 'AddressCtrl'
  });
}])

.controller('AddressCtrl', function($scope, digibyte) {

  $scope.digibyteURL = 'https://docs.digibyte.io/address';
  $scope.bitcoinURL = 'https://bitcoin.org/en/developer-guide#term-address';

  $scope.$on('networkUpdate', function() {
    $scope.newKey();
  });

  $scope.newKey = function() {
    $scope.privateKey = new digibyte.PrivateKey();
    $scope.publicKey = $scope.privateKey.publicKey;
    setExampleCode();
  };

  $scope.privateUpdated = function(value) {
    if (digibyte.PrivateKey.isValid(value)) {
      $scope.privateKey = new digibyte.PrivateKey(value);
      $scope.publicKey = $scope.privateKey.publicKey;
      setExampleCode($scope.privateKey);
    } else {
      // mark as invalid
    }
  };

  $scope.publicUpdated = function(value) {
    if (digibyte.PublicKey.isValid(value)) {
      $scope.privateKey = '';
      $scope.publicKey = new digibyte.PublicKey(value);
      setExampleCode(null, $scope.publicKey);
    } else {
      // mark as invalid
    }
  };

  function setExampleCode(privkey, pubkey) {
    var template = "";

    if (!privkey && !pubkey) {
      template += "var privateKey = new digibyte.PrivateKey();\n";
      template += "var publicKey = privateKey.publicKey;\n";
    } else if (privkey) {
      template += "var privateKey = new digibyte.PrivateKey('"+ privkey.toString() + "');\n";
      template += "var publicKey = privateKey.publicKey;\n";
    } else {
      template += "var publicKey = new digibyte.PublicKey('"+ pubkey.toString()+ "');\n";
    }
    template += "var address = publicKey.toAddress();";

    $scope.exampleCode = template;
  };

  $scope.jumpConsole = function() {
    $('#terminaltab').click();
    window.REPL.console.SetPromptText($scope.exampleCode);
    window.REPL.scrollToBottom();
  };

  $scope.newKey();

});
