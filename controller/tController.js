var classApp = angular.module('trainerApp', []);

classApp.controller('trainerCtrl', function ($scope, $http) {
    $http.get('php/puller.php').success(function(data) {
        _.each(data, function(x) {if (x.unicode.length > 1) x.unicode = JSON.parse("\"" + x.unicode + "\"");});
        $scope.symbols = data;
        $scope.training = data[0];
        $scope.check = console.log;

        $scope.switchSym = function(x) {$scope.training = x;}

    });

    $scope.builder = new PathBuilder2("mCanvas");
    $scope.clear = function() {
        $scope.builder.clear();
    };
    $scope.train = function() {
        $scope.builder.saveToDB($scope.training.idx);
        $scope.builder.clear();
    }
});