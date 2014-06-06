var classApp = angular.module('trainerApp', []);
//
function createDB(data) {
    var idbSupported = false;
    var db;
    const OBJ_STORE = "traces";
    const TABLE = "traceDB";

    if ("indexedDB" in window) {
        idbSupported = true;
    }

    if (!idbSupported) {
        alert("IDB not supported!");
    } else {
        var openRequest = indexedDB.open(TABLE, 1);

        openRequest.onupgradeneeded = function (e) {
            console.log("running onupgradeneeded");
            var thisDB = e.target.result;

            if (!thisDB.objectStoreNames.contains(OBJ_STORE)) {
                thisDB.createObjectStore(OBJ_STORE, {keyPath: "i"});
            }

        };

        openRequest.onsuccess = function (e) {
            console.log("Success!");
            db = e.target.result;
        };

        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        };
    }
//            var transaction = db.transaction(OBJ_STORE, "readwrite");
//            var objectStore = transaction.objectStore(OBJ_STORE);
//            for (var i in data) {
//                var request = objectStore.add(data[i]);
//                request.onsuccess = function (event) {
//                    // event.target.result == customerData[i].ssn;
//                    console.log("Added: " + i);
//                };
//            }
}
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
            comp = new PathComparator2(data);
        });

        $http({
            method: "GET",
            url: "/php/rawtrace.php",
            params: {
                LOW_IDX : DbWrapper.lastIdx
            }
        }).success(function (data) {
            console.log(data);
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
            comp = new PathComparator2(data);

            if (DbWrapper.offline) {
                DbWrapper.addBasis(data.data);
                DbWrapper.setIndex(data.hI);
            }
        });
    }

    $scope.clear = function () {
        builder.clear();
//        $scope.matches = [];
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

}]);