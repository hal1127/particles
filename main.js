var Canvas = /** @class */ (function () {
    function Canvas() {
        var _this = this;
        this.stage = new createjs.Stage("view");
        this.container = new createjs.Container();
        this.circles = [];
        this.circle = new createjs.Shape();
        this.circles_v = [];
        this.circles_life = [];
        this.circles_size = [];
        this.count = 0;
        this.pos = [0, 0];
        this.width = document.documentElement.clientWidth * devicePixelRatio;
        this.height = document.documentElement.clientHeight * devicePixelRatio;
        this.stage.addChild(this.container);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        var canvas = document.getElementById('view');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.width = String(canvas.width / devicePixelRatio) + "px";
        canvas.style.height = String(canvas.height / devicePixelRatio) + "px";
        // タッチ操作をサポートしているブラウザーならば
        if (createjs.Touch.isSupported() == true) {
            // タッチ操作を有効にします。
            createjs.Touch.enable(this.stage);
        }
        window.onload = function () {
            _this.init();
        };
    }
    Canvas.prototype.init = function () {
        this.event();
        this.update();
    };
    Canvas.prototype.update = function () {
        var _this = this;
        createjs.Ticker.addEventListener('tick', function () {
            _this.pos[0] = _this.stage.mouseX;
            _this.pos[1] = _this.stage.mouseY;
            // this.pos[0] = this.width / 2
            // this.pos[1] = this.height / 2
            _this.emit_circles();
            _this.update_circles();
            _this.stage.update();
        });
    };
    Canvas.prototype.event = function () {
    };
    Canvas.prototype.emit_circles = function () {
        // if (Math.random() < 0.5) return
        for (var i = 0; i < 1; i++) {
            var circle_v = [0, 0];
            var circle = new createjs.Shape();
            var circle_life = 100;
            var circle_size = Math.random() * 30;
            if (circle_size >= 29.9)
                circle_size *= 3;
            if (Math.random() < 0.7) {
                circle.graphics
                    .beginFill(createjs.Graphics.getHSL(this.count, 50, 50))
                    .drawCircle(0, 0, circle_size);
                // 一定の確率でブラーをかける
                if (Math.random() < 0.2) {
                    var blurFilter = new createjs.BlurFilter(2 * circle_size, 2 * circle_size, 2);
                    circle.filters = [blurFilter];
                    circle.cache(-1 * circle_size, -1 * circle_size, circle_size * 2, circle_size * 2);
                }
            }
            else {
                circle.graphics
                    .beginStroke(createjs.Graphics.getHSL(this.count, 50, 50))
                    .setStrokeStyle(1.5)
                    .drawCircle(0, 0, circle_size);
            }
            circle.x = this.pos[0];
            circle.y = this.pos[1];
            circle.compositeOperation = "lighter";
            var angle = Math.random() * 2 * Math.PI;
            circle_v[0] = Math.cos(angle) * Math.random() * 2;
            circle_v[1] = Math.sin(angle) * Math.random() * 2;
            this.count++;
            this.circles_size.push(circle_size);
            this.circles_life.push(circle_life);
            this.circles_v.push(circle_v);
            this.circles.push(circle);
            this.container.addChild(circle);
        }
    };
    Canvas.prototype.update_circles = function () {
        for (var i = 0; i < this.circles.length; i++) {
            // 浮力
            this.circles_v[i][1] -= 0.05;
            this.circles[i].x += this.circles_v[i][0];
            this.circles[i].y += this.circles_v[i][1];
            this.circles_life[i] -= 1;
            if (this.circles_life[i] <= 10) {
                this.circles[i].alpha = this.circles_life[i] / 10;
            }
            // if (this.circles[i].y > this.height - this.circles_size[i]) {
            //   this.circles[i].y = this.height - this.circles_size[i]
            //   this.circles_v[i][1] *= -0.7
            // }
            if (this.circles_life[i] <= 0 ||
                this.circles[i].y < 0 - this.circles_size[i]) {
                this.container.removeChild(this.circles[i]);
                this.circles.splice(i, 1);
                this.circles_v.splice(i, 1);
                this.circles_life.splice(i, 1);
                this.circles_size.splice(i, 1);
            }
        }
    };
    return Canvas;
}());
var canvas = new Canvas();
