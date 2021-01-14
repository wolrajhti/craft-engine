// tsc src/domain/nav-mesh.ts --downlevelIteration && node src/domain/nav-mesh.js
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var _a;
var Rect = /** @class */ (function () {
    function Rect(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    return Rect;
}());
var Cell = /** @class */ (function () {
    function Cell(rectX, rectY) {
        if (rectX === void 0) { rectX = new Rect(); }
        if (rectY === void 0) { rectY = new Rect(); }
        this.rectX = rectX;
        this.rectY = rectY;
    }
    Cell.prototype.score = function () {
        return Math.abs(this.rectX.w - this.rectY.h);
    };
    Cell.prototype._cutX = function () {
        if (this.rectX.w === 1) {
            return [];
        }
        if (this.rectX.x < this.rectY.x) {
            if (this.rectY.x < this.rectX.x + this.rectX.w - 1) {
                //      Y
                // [XXX]Y[XXX]
                //      Y
                var head = new Rect(this.rectX.x, this.rectX.y, this.rectY.x - this.rectX.x, 1);
                var tail = new Rect(this.rectY.x + 1, this.rectX.y, this.rectX.w - (this.rectY.x - this.rectX.x + 1), 1);
                for (var x = 0; x < head.w; x++) {
                    cellAt(head.x + x, head.y).rectX = head;
                }
                for (var x = 0; x < tail.w; x++) {
                    cellAt(tail.x + x, tail.y).rectX = tail;
                }
                return [head, tail];
            }
            else {
                //      Y
                // [XXX]Y
                //      Y
                var head = new Rect(this.rectX.x, this.rectX.y, this.rectX.w - 1, 1);
                for (var x = 0; x < head.w; x++) {
                    cellAt(head.x + x, head.y).rectX = head;
                }
                return [head];
            }
        }
        else {
            // Y
            // Y[XXX]
            // Y
            var tail = new Rect(this.rectX.x + 1, this.rectX.y, this.rectX.w - 1, 1);
            for (var x = 0; x < tail.w; x++) {
                cellAt(tail.x + x, tail.y).rectX = tail;
            }
            return [tail];
        }
    };
    Cell.prototype._cutY = function () {
        if (this.rectY.h === 1) {
            return [];
        }
        if (this.rectY.y < this.rectX.y) {
            if (this.rectX.y < this.rectY.y + this.rectY.h - 1) {
                //   [Y]
                // XXXXXXX
                //   [Y]
                var head = new Rect(this.rectY.x, this.rectY.y, 1, this.rectX.y - this.rectY.y);
                var tail = new Rect(this.rectY.x, this.rectX.y + 1, 1, this.rectY.h - (this.rectX.y - this.rectY.y + 1));
                for (var y = 0; y < head.h; y++) {
                    cellAt(head.x, head.y + y).rectY = head;
                }
                for (var y = 0; y < tail.h; y++) {
                    cellAt(tail.x, tail.y + y).rectY = tail;
                }
                return [head, tail];
            }
            else {
                //   [Y]
                // XXXXXXX
                var head = new Rect(this.rectY.x, this.rectY.y, 1, this.rectY.h - 1);
                for (var y = 0; y < head.h; y++) {
                    cellAt(head.x, head.y + y).rectY = head;
                }
                return [head];
            }
        }
        else {
            // XXXXXXX
            //   [Y]
            var tail = new Rect(this.rectY.x, this.rectY.y + 1, 1, this.rectY.h - 1);
            for (var y = 0; y < tail.h; y++) {
                cellAt(tail.x, tail.y + y).rectY = tail;
            }
            return [tail];
        }
    };
    Cell.prototype.cut = function () {
        if (this.rectX.w < this.rectY.h) {
            rects["delete"](this.rectX);
            var newRects = this._cutX();
            // console.log([
            //   'cutX',
            //   this,
            //   ...newRects
            // ]);
            newRects.forEach(function (newRect) { return rects.add(newRect); });
            return [this.rectX, this._cutX()];
        }
        else {
            rects["delete"](this.rectY);
            var newRects = this._cutY();
            // console.log([
            //   'cutY',
            //   this,
            //   ...newRects
            // ]);
            newRects.forEach(function (newRect) { return rects.add(newRect); });
        }
    };
    return Cell;
}());
var cells = new Map();
var cellAt = function (x, y) {
    var _a, _b;
    if (cells.has(x) && ((_a = cells.get(x)) === null || _a === void 0 ? void 0 : _a.has(y))) {
        return (_b = cells.get(x)) === null || _b === void 0 ? void 0 : _b.get(y);
    }
};
var setCellAt = function (x, y, cell) {
    var _a;
    if (!cells.has(x)) {
        cells.set(x, new Map());
    }
    (_a = cells.get(x)) === null || _a === void 0 ? void 0 : _a.set(y, cell);
};
var rects = new Set();
var map = '' +
    'X    X     X' +
    'X    X      ' +
    '  XXXXX     ' +
    '           X' +
    '';
// const map = '' +
//   'X XX' +
//   'X  X' +
//   '    ' +
//   '';
var width = function () {
    return 12;
};
var height = function () {
    return 4;
};
var isEmpty = function (x, y) {
    return map[y * width() + x] === ' ';
};
// setup cells
for (var x = 0; x < width(); x++) {
    for (var y = 0; y < height(); y++) {
        if (isEmpty(x, y)) {
            // init new cell
            var cell = new Cell(new Rect(x, y, 1, 1), new Rect(x, y, 1, 1));
            setCellAt(x, y, cell);
            // update rectX
            var cellX = cellAt(x - 1, y);
            if (cellX) {
                cell.rectX = cellX.rectX;
                cell.rectX.w++;
            }
            else {
                rects.add(cell.rectX);
            }
            // update rectY
            var cellY = cellAt(x, y - 1);
            if (cellY) {
                cell.rectY = cellY.rectY;
                cell.rectY.h++;
            }
            else {
                rects.add(cell.rectY);
            }
        }
    }
}
// setup todos
var todos = [];
cells.forEach(function (row) { return row.forEach(function (cell) { return todos.push(cell); }); });
console.log(rects.size, todos.length);
// while
while (todos.length) {
    todos.sort(function (c1, c2) { return c1.score() - c2.score(); });
    (_a = todos.pop()) === null || _a === void 0 ? void 0 : _a.cut();
}
console.log(__spread(rects));
