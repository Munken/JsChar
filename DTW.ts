/**
 * Created by Munk on 08-05-2014.
 */




function dtw(p0 : Path, p1 : Path) {
    var n = p0.x.length;
    var m = p1.y.length;

    var dtw = [];

    for (var i = 0; i < n; i++) {
        dtw[i] = [];
        dtw[i][0] = Number.MAX_VALUE;
    }
    for (var i = 0; i < m; i++) dtw[0][i] = Number.MAX_VALUE;
    dtw[0][0] = 0;

    for (var i = 1; i < n; i++) {
        for (var j = 1; j < m; j++) {
            var c = cost(p0.x[i], p0.y[i], p1.x[j], p1.y[j]);

            dtw[i][j] = c + Math.min(dtw[i-1][j], dtw[i][j-1], dtw[i-1][j-1]);
        }
    }
    return dtw[n-1][m-1];
}

function gdtw(p0 : Path, p1 : Path, max : number) {
//    var pathLength = 1;
    var res = cost(p0.x[0], p0.y[0], p1.x[0], p1.y[0]);
    var n = 0, m = 0;
    var nM = p0.x.length - 1, mM = p1.x.length - 1;

    while (n < nM && m < mM && res < max) {
        var left = cost(p0.x[n+1], p0.y[n+1], p1.x[m], p1.y[m]);
        var middle = cost(p0.x[n+1], p0.y[n+1], p1.x[m+1], p1.y[m+1]);
        var right = cost(p0.x[n], p0.y[n], p1.x[m+1], p1.y[m+1]);

        var min = Math.min(left, middle, right);
        switch (min) {
            case left :
                n++;
                res += left;
                break;
            case right :
                m++;
                res += right;
                break;

            default :
                n++;
                m++;
                res += middle;
                break;
        }

//        pathLength++;
    }

    if (res >= max) return res;

    if (m == mM) {
        var tmp : any = p1;
        p1 = p0; p0 = tmp;
        tmp = m;
        m = n; n = tmp;
        mM = nM;
    }

    if (m !== mM + 1) {
        for (var i = m; i <= mM; i++) {
            res += cost(p0.x[n], p0.y[n], p1.x[i], p1.y[i]);
//            pathLength++;
        }
    }
    return res;
}

function cost(x0, y0, x1, y1 ) {
    return Math.sqrt(Math.pow(x0 - x1,2) + Math.pow(y0 - y1,2));
}

class Path {
//    arr : Point[] = [];
    x : number[] = [];
    y : number[] = [];

    add(x:number, y:number) {
//        this.arr.push({x: x, y: y});
        this.x.push(x);
        this.y.push(y);
    }
}
