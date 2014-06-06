/// <reference path="DTW.ts" />
/// <reference path="underscore.d.ts" />
/**
 * Created by Munk on 26-05-2014.
 */


class PathComparator2 {

    constructor(private old : ServerSample2[]) {}

    checkAll(p : Path) {
        var start = _.now();
        var map = _.map(this.old, function(x : ServerSample2) {
            var paths : Path[] = x.s;

            var min = Number.MAX_VALUE;
            _.each(paths, function(x : Path) {
                var d = gdtw(p, x, min);
                min = Math.min(min, d);
//                if (!isNaN(d) && d < min) min = d;
            });
            return {dtw :min, match : x};

        });
        var end = _.now();
        console.log(end - start);

        return _.sortBy(map, function(x) {return x.dtw;});
    }

    add(res : CheckResult2, p : Path) {
        var f = _.find(this.old, function (x:ServerSample2) {
            return x.i == res.match.i;
        });
        f.s.push(p);
    }

    data() {
        return this.old;
    }

}

interface CheckResult2 {
    match : ServerSample2;
    dtw : number;
}

interface ServerSample2 {
    i : number; // Index
    u : string; // Unicode char
    L : string; // LaTeX string
    p : string; // LaTeX package
    m : number; // TeX Mode. 1 = Math, 2 = Text, 3 = Math + Text
    s : Path[]; // Paths
}
