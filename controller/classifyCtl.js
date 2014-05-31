var classApp = angular.module('trainerApp', []);
//
classApp.controller('classifyCtrl', ["$scope", "$http", "$interval", function ($scope, $http, $interval) {

    var comp;
    $scope.last = null;
    var builder = new PathBuilder2("mCanvas");
    $scope.matches = [];
    $scope.allMatches = [];

    $http.get('php/dumper.php').success(function(data) {
        _.each(data, function(x) {
            _.each(x.s, function(p) {
                p.x = JSON.parse(p.x);
                p.y = JSON.parse(p.y);
            });

            if (x.u.length > 1) x.u = JSON.parse("\"" + x.u + "\"");
        });
        comp = new PathComparator2(data);
    });

    $scope.clear = function() {
        builder.clear();
//        $scope.matches = [];
    };
    $scope.trainLast = function() {
        $scope.train($scope.last);
    };
    $scope.train = function(x) {
        if (builder.path().x <= 0) return;
        $scope.last = x;
        builder.saveToDB(x.match.i);
        comp.add(x, builder.morphed());
        builder.clear();
    };

    $scope.check = function() {
        var stop = $interval(function () {
            if (!angular.isDefined(comp)) return;

            $('html,body').scrollTop(0);
            $scope.allMatches = comp.checkAll(builder.morphed());
//        $scope.matches = $scope.allMatches;
            $scope.matches = $scope.allMatches.slice(0, 10);
            $interval.cancel(stop);
        }, 200);
    };


}]);