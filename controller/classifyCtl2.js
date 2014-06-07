var classApp = angular.module('trainerApp', []);
//
classApp.controller('classifyCtrl', ["$scope", "$http", "$interval", function ($scope, $http, $interval) {
    var comp;
    $scope.last = null;
    $scope.working = false;
    var builder = new PathBuilder2("mCanvas");
    $scope.matches = [];
    $scope.allMatches = [];


    if (DbWrapper.offline && DbWrapper.lastIdx > 0)
        loadDataFromStorage();
    else
        loadDataFromPHP();

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
        $scope.matches = [];
        $scope.working = true;
        var stop = $interval(function () {
            if (!angular.isDefined(comp)) return;

            $('html,body').scrollTop(0);
            $scope.allMatches = comp.checkAll(builder.morphed());
//        $scope.matches = $scope.allMatches;
            $scope.matches = $scope.allMatches.slice(0, 10);
            $interval.cancel(stop);
            $scope.working = false;
        }, 100);
    };

    var cachedIndex;
    $scope.offline = DbWrapper.offline;
    $scope.flipOnline = function() {
        if (DbWrapper.offline) cachedIndex = DbWrapper.lastIdx;

        $scope.offline = !$scope.offline;
        DbWrapper.wantOffline($scope.offline);

        if (DbWrapper.offline) {
            DbWrapper.addBasis(comp.data()); // We need all that old data
            if (cachedIndex > DbWrapper.lastIdx) DbWrapper.setIndex(cachedIndex);
        }
    };



    // Internal
    function loadDataFromStorage() {
        DbWrapper.cursor(function (data) {
            console.log("Loaded trace db: " + data.length);
//            console.log(data);
            comp = new PathComparator2(data);

            $scope.N = data.length;

//            alert("Stor " + $scope.N);
        });

        $http({
            method: "GET",
            url: "/php/rawtrace.php",
            params: {
                LOW_IDX: DbWrapper.lastIdx
            }
        }).success(function (data) {
            console.log("Extra:");
            console.log(data);
            DbWrapper.addExtra(data);
        });
    }

    function loadDataFromPHP() {
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
            $scope.N = data.data.length;
//            alert("PHP " + $scope.N);
            comp = new PathComparator2(data.data);

            cachedIndex = data.hI;
            if (DbWrapper.offline) {
                DbWrapper.addBasis(data.data);
                DbWrapper.setIndex(cachedIndex);
            }
        });
    }
}]);