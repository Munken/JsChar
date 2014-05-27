/// <reference path="DTW.ts" />
/// <reference path="underscore.d.ts" />
/// <reference path="jquery.d.ts" />


/**
 * Created by Munk on 26-05-2014.
 */

class PathBuilder2 {
    private pat:Path = new Path;
    private canvas;
    private ctx;

    constructor(id:String) {
        this.canvas = $("#" + id);
        this.ctx = (<HTMLCanvasElement> this.canvas[0]).getContext("2d");

        this.ctx.lineWidth = 2;
        this.ctx.lineJoin = "round";


        var down:boolean = false;
        this.canvas.mouseup(function () {
            down = false;
        });


        this.canvas.mousedown((e) => {
            down = true;

            this.ctx.beginPath();
            var x = this.x0(e), y = this.y0(e);
            this.ctx.moveTo(x, y);
            this.pat.add(x, y);
        });

        this.canvas.mousemove((e) => {
            if (!down) return;

            var x = this.x0(e), y = this.y0(e);
            this.ctx.lineTo(x, y);
            this.pat.add(x, y);
            this.ctx.stroke();
        });


    }

    x0(e) {
        return e.pageX - this.canvas.offset().left;
    }

    y0(e) {
        return e.pageY - this.canvas.offset().top;
    }

    clear() {
        this.pat = new Path;
        this.ctx.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    }

    saveToDB(idx:number) {
        var m = this.morphed(1);
        $.ajax({
            url: "php/inserter.php",
            type: "post",
            data: {idx: idx, x: JSON.stringify(m.x), y: JSON.stringify(m.y)},
            success: function (response) {
                console.log(response);
            }
        });
    } //

    path() {
        return this.pat;
    }

    morphed(scale:number = 1) {
        var xMin = 1E10, yMin = 1E10,
            xMax = -1, yMax = -1;

        var length = this.pat.x.length;
        for (var i = 0; i < length; i++) {
            var x = this.pat.x[i];
            var y = this.pat.y[i];

            xMin = Math.min(xMin, x);
            yMin = Math.min(yMin, y);
            xMax = Math.max(xMax, x);
            yMax = Math.max(yMax, y);
        }

        var dx = Math.abs(xMax - xMin), dy = Math.abs(yMax - yMin);
        var out = new Path();

        out.x = _.map(this.pat.x, function (x:number) {
            return scale * (x - xMin) / dx
        });
        out.y = _.map(this.pat.y, function (y:number) {
            return scale * (y - yMin) / dy
        });

        return out;
    }

}

