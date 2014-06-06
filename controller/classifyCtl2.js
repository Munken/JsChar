var classApp = angular.module('trainerApp', []);
//
classApp.controller('classifyCtrl', ["$scope", "$http", "$interval", function ($scope, $http, $interval) {
    console.log("Controller!");
    var comp;
    $scope.last = null;
    var builder = new PathBuilder2("mCanvas");
    $scope.matches = [];
    $scope.allMatches = [];

    if (DbWrapper.offline && DbWrapper.lastIdx > 0) {
        DbWrapper.cursor(function(data) {
            console.log("Loaded trace db: " + data.length);
            console.log(data);
            comp = new PathComparator2(data);
        });

        $http({
            method: "GET",
            url: "/php/rawtrace.php",
            params: {
                LOW_IDX : DbWrapper.lastIdx
            }
        }).success(function (data) {
            DbWrapper.addExtra(data);
            cachedIndex = DbWrapper.lastIdx;
        });
    }
    else {
        $http.get('php/dumper.php').success(function (data) {
            console.log("Got trace from php: " + data.data.length);
            _.each(data.data, function (x) {
                _.each(x.s, function (p) {
                    p.x = JSON.parse(p.x);
                    p.y = JSON.parse(p.y);
                });

                if (x.u.length > 1) x.u = JSON.parse("\"" + x.u + "\"");
                x.L = "\\".concat(x.L);
            });
            comp = new PathComparator2(data.data);

            cachedIndex = data.hI;
            if (DbWrapper.offline) {
                DbWrapper.addBasis(data.data);
                DbWrapper.setIndex(cachedIndex);
            }
        });
    }

    $scope.clear = function () {
        builder.clear();
    };
    $scope.trainLast = function () {
        $scope.train($scope.last);
    };
    $scope.train = function (x) {
        if (builder.path().x <= 10) return;
        $scope.last = x;
        builder.saveToDB(x.match.i);
        comp.add(x, builder.morphed());
        builder.clear();
    };

    $scope.check = function () {
        var stop = $interval(function () {
            if (!angular.isDefined(comp)) return;

            $('html,body').scrollTop(0);
            $scope.allMatches = comp.checkAll(builder.morphed());
//        $scope.matches = $scope.allMatches;
            $scope.matches = $scope.allMatches.slice(0, 10);
            $interval.cancel(stop);
        }, 200);
    };

    var cachedIndex;
    $scope.flipOnline = function() {
        console.log("Current offline is: " + DbWrapper.offline);
        console.log("Cached pre " + cachedIndex);
        if (DbWrapper.offline) cachedIndex = DbWrapper.lastIdx;
        console.log("Cached post " + cachedIndex);

        DbWrapper.wantOffline(!DbWrapper.offline);

        if (DbWrapper.offline) {
            DbWrapper.addBasis(comp.data());
            if (cachedIndex > DbWrapper.lastIdx) DbWrapper.setIndex(cachedIndex);
        }
    }
}]);