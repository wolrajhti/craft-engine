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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
    Rect.prototype.turnLeft = function () {
        return new Rect(-this.y, this.x, this.h, this.w);
    };
    Rect.prototype.turnRight = function () {
        return new Rect(this.y, -this.x, this.h, this.w);
    };
    Rect.prototype.mirrorX = function () {
        return new Rect(-this.x - this.w, this.y, this.w, this.h);
    };
    Rect.prototype.mirrorY = function () {
        return new Rect(this.x, -this.y - this.h, this.w, this.h);
    };
    Rect.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ", " + this.w + ", " + this.h + ")";
    };
    Rect.prototype.contains = function (x, y) {
        return (this.x <= x && x < this.x + this.w) &&
            (this.y <= y && y < this.y + this.h);
    };
    Rect.prototype.equals = function (other) {
        return this.x === other.x &&
            this.y === other.y &&
            this.w === other.w &&
            this.h === other.h;
    };
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
// const map = '' + 
//   'X    X     X' +
//   'X    X      ' +
//   '  XXXXX     ' +
//   '           X' +
//   '';
// const map = '' + 
// 'X1111X33333X' +
// 'X2222X444444' +
// '67XXXXX55555' +
// '00000000000X' +
// '';
// const map = '' + 
// 'X2222X33333X' +
// 'X2222X333334' +
// '55XXXXX11111' +
// '00000000000X' +
// '';
var map = '' +
    'XXXXXX    X     X' +
    'X        XXX     ' +
    '  X   X          ' +
    '  XX XX    XXXX  ' +
    '  XX        XXX  ' +
    '     XX          ' +
    '  XXXXX          ' +
    '              XXX' +
    '';
// const map = '' + 
// 'XXXXXX    X66666X' +
// 'X22222222XXX77777' +
// '  X333X          ' +
// '  XX8XX    XXXX  ' +
// '  XX44444444XXX  ' +
// '00000XX          ' +
// '9 XXXXX5555555555' +
// '11111111111111XXX' +
// '';
var width = function () {
    return 17; // 12
};
var height = function () {
    return 8; // 4
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
var validRects = __spread(rects);
var draw = function () {
    var result = '';
    var _loop_1 = function (y) {
        var _loop_2 = function (x) {
            var rect = validRects.findIndex(function (rect) { return rect.contains(x, y); });
            if (validRects.length > 16) {
                if (rect !== -1) {
                    result += '[' + rect.toString(16).padStart(2, ' ') + ']';
                }
                else {
                    result += '    ';
                }
            }
            else if (rect !== -1) {
                result += '[' + rect.toString(16) + ']';
            }
            else {
                result += '   ';
            }
        };
        for (var x = 0; x < width(); x++) {
            _loop_2(x);
        }
        result += '\n';
    };
    for (var y = 0; y < height(); y++) {
        _loop_1(y);
    }
    console.log(validRects.length);
    console.log(validRects.map(function (r, i) { return [i.toString(16), r]; }));
    console.log(result);
};
draw();
var mergeTopLeft = function (r1, r2) {
    if (r1.x === r2.x && r1.y === r2.y - r1.h) {
        if (r1.w < r2.w && r2.h < r1.w) {
            // 111       111
            // 111    -> 111
            // 222222    111222
            return [
                new Rect(r1.x, r1.y, r1.w, r1.h + r2.h),
                new Rect(r1.x + r1.w, r2.y, r2.w - r1.w, r2.h)
            ];
        }
        else if (r1.w === r2.w) {
            // 111111    222222
            // 111111 -> 222222
            // 222222    222222
            return [new Rect(r1.x, r1.y, r1.w, r1.h + r2.h)];
        }
    }
    return [];
};
var cases = [
    [
        function (r) { return r; },
        function (r) { return r; }
    ],
    [
        function (r) { return r.mirrorX(); },
        function (r) { return r.mirrorX(); }
    ],
    [
        function (r) { return r.mirrorY(); },
        function (r) { return r.mirrorY(); }
    ],
    [
        function (r) { return r.mirrorX().mirrorY(); },
        function (r) { return r.mirrorY().mirrorX(); }
    ],
    [
        function (r) { return r.turnLeft(); },
        function (r) { return r.turnRight(); }
    ],
    [
        function (r) { return r.turnLeft().mirrorX(); },
        function (r) { return r.mirrorX().turnRight(); }
    ],
    [
        function (r) { return r.turnLeft().mirrorY(); },
        function (r) { return r.mirrorY().turnRight(); }
    ],
    [
        function (r) { return r.turnLeft().mirrorX().mirrorY(); },
        function (r) { return r.mirrorY().mirrorX().turnRight(); }
    ],
];
var optimize = function () {
    var e_1, _a;
    var i, j;
    var r1, r2, merged;
    i = 0;
    while (i < validRects.length - 1) {
        j = i + 1;
        r1 = validRects[i];
        while (j < validRects.length) {
            // console.log(i, j);
            r2 = validRects[j];
            var _loop_3 = function (send, receive) {
                merged = mergeTopLeft(send(r1), send(r2));
                if (merged.length) {
                    console.log('merging', i, j);
                    validRects.splice(j, 1);
                    validRects.splice(i, 1);
                    validRects.push.apply(validRects, __spread(merged.map(function (r) { return receive(r); })));
                    i = -1;
                    return "break";
                }
            };
            try {
                for (var cases_1 = (e_1 = void 0, __values(cases)), cases_1_1 = cases_1.next(); !cases_1_1.done; cases_1_1 = cases_1.next()) {
                    var _b = __read(cases_1_1.value, 2), send = _b[0], receive = _b[1];
                    var state_1 = _loop_3(send, receive);
                    if (state_1 === "break")
                        break;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (cases_1_1 && !cases_1_1.done && (_a = cases_1["return"])) _a.call(cases_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (i === -1) {
                break;
            }
            j++;
        }
        i++;
    }
    draw();
};
optimize();
optimize();
optimize();
// validRects.sort((r1, r2) => {
//   if (r1.x === r2.x) {
//     return r1.y - r2.y;
//   }
//   return r1.x - r2.x;
// });
function t(r) {
    if (!r.mirrorX().mirrorX().equals(r)) {
        console.log('mirrorX');
    }
    if (!r.mirrorY().mirrorY().equals(r)) {
        console.log('mirrorY');
    }
    if (!r.mirrorX().mirrorY().mirrorX().mirrorY().equals(r)) {
        console.log('mirrorXY');
    }
    if (!r.turnLeft().turnRight().equals(r)) {
        console.log('mirror');
    }
    if (!r.turnLeft().mirrorX().mirrorX().turnRight().equals(r)) {
        console.log('mirrormirrorX');
    }
    if (!r.turnLeft().mirrorY().mirrorY().turnRight().equals(r)) {
        console.log('mirrormirrorY');
    }
    if (!r.turnLeft().mirrorX().mirrorY().mirrorX().mirrorY().turnRight().equals(r)) {
        console.log('mirrormirrorXY');
    }
}
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
t(new Rect(Math.random(), Math.random(), Math.random(), Math.random()));
