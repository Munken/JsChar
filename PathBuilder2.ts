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

    constructor(id:string) {
        this.canvas = $("#" + id);
        this.ctx = (<HTMLCanvasElement> this.canvas[0]).getContext("2d");

        this.ctx.lineWidth = 2;
        this.ctx.lineJoin = "round";

        var can : any = document.getElementById(id);

        var down:boolean = false;

        var fStop = function (e) {
            e.preventDefault();
            down = false;
        };
        this.canvas.mouseup(fStop);
        can.addEventListener("touchend", fStop, false);

        var fDown = (e) => {
            e.preventDefault();
            down = true;

            this.ctx.beginPath();
            var x = this.x0(e), y = this.y0(e);
            this.ctx.moveTo(x, y);
            this.pat.add(x, y);
        };
        this.canvas.mousedown(fDown);
        can.addEventListener("touchstart", fDown, false);

        var fMove = (e) => {
            e.preventDefault();
            if (!down) return;

            var x = this.x0(e), y = this.y0(e);
            this.ctx.lineTo(x, y);
            this.pat.add(x, y);
            this.ctx.stroke();
        };
        this.canvas.mousemove(fMove);
        can.addEventListener("touchmove", fMove, true);
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

