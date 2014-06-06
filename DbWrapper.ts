/// <reference path="PathComparator2.ts" />
/**
 * Created by Munk on 06-06-2014.
 */

module DbWrapper {

    var TABLE = "texDB";
    var OFFLINE = "offline?";
    var LAST_INDEX = "lastIndex";//
    var OBJ_STORE = "traces";
    var db;
    var dbWaiters = [];

    export var offline = !!window.localStorage.getItem(OFFLINE);
    export var lastIdx = window.localStorage.getItem(LAST_INDEX);
    export var isDbSupported:boolean = "indexedDB" in window;

    export function wantOffline(b:boolean) {
        window.localStorage.setItem(OFFLINE, b ? "TRUE" : "");

        console.log("Offline status switched to: " + b);

        if (!b) deleteAll();
    }

    export function setIndex(i : number) {
        lastIdx = i;
        window.localStorage.setItem(LAST_INDEX, ""+i);

        console.log("Updated index: " + i);
    }


    console.log("Initial online status: " + offline);

    if (offline && isDbSupported) {

        var openRequest = indexedDB.open(TABLE, 2);

        openRequest.onupgradeneeded = function (e: any) {
            console.log("Upgrading...");
            var thisDB = e.target.result;
            if(!thisDB.objectStoreNames.contains(OBJ_STORE)) {
                thisDB.createObjectStore(OBJ_STORE, { keyPath: "i" });
            }
        };

        openRequest.onsuccess = function (e : any) {
            console.log("Success!");
            db = e.target.result;

            _.each(dbWaiters, function(fcn) {fcn();});
        };

        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        };

    }

    export function addBasis(samples : ServerSample2[]) {
        if (db) {
            var transaction = db.transaction(OBJ_STORE, "readwrite");
            var store = transaction.objectStore(OBJ_STORE);

            _.each(samples, function (x) {
                store.add(x)
            });
        }
        else {
            dbWaiters.push(function() {
                addBasis(samples);
            })
        }
    }


    export function cursor(fcn : (s: ServerSample2[]) => void) {
        if (db) {
            var transaction = db.transaction(OBJ_STORE, "readonly");
            var objectStore = transaction.objectStore(OBJ_STORE);

            var result = [];
            var cursor = objectStore.openCursor();
            cursor.onsuccess = function (e) {
                var res = e.target.result;
                if (res) {
                    result.push(res.value);
                    res.continue();
                }
                else {
                    console.log(result.length);
                    fcn(result);
                }
            }
        } else {
            dbWaiters.push(function () {
                DbWrapper.cursor(fcn);
            });
        }
    }

    function deleteAll() {
        var store = db.transaction([OBJ_STORE], "readwrite")
            .objectStore(OBJ_STORE);

        store.clear();
    }
}