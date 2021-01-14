// map_width and map_height are the dimensions of the map
// is_wall_f checks if a tile is a wall
var rectangles = []; // Each rectangle covers a grid of wall tiles
var map_width = 4;
var map_height = 4;
var walls = new Map();
walls.set(3, new Set([0]));
function is_wall_f(x, y) {
    var _a;
    return !(walls.has(x) && ((_a = walls.get(x)) === null || _a === void 0 ? void 0 : _a.has(y)));
}
var _loop_1 = function (x) {
    var start_y = -1;
    var end_y = -1;
    for (var y = 0; y < map_height; ++y) {
        if (is_wall_f(x, y)) {
            if (start_y === -1) {
                start_y = y;
            }
            end_y = y;
        }
        else if (start_y !== -1) {
            var overlaps = rectangles
                .filter(function (r) {
                return r.end_x === x - 1 &&
                    start_y <= r.start_y &&
                    end_y >= r.end_y;
            })
                .sort(function (r1, r2) {
                return r1.start_y - r2.start_y;
            });
            overlaps.forEach(function (r) {
                if (start_y < r.start_y) {
                    rectangles.push({
                        start_x: x,
                        start_y: start_y,
                        end_x: x,
                        end_y: r.start_y - 1
                    });
                    start_y = r.start_y;
                }
                if (start_y === r.start_y) {
                    r.end_x = r.end_x + 1;
                    if (end_y === r.end_y) {
                        start_y = -1;
                        end_y = -1;
                    }
                    else if (end_y > r.end_y) {
                        start_y = r.end_y + 1;
                    }
                }
            });
            if (start_y !== -1) {
                rectangles.push({
                    start_x: x,
                    start_y: start_y,
                    end_x: x,
                    end_y: end_y
                });
                start_y = -1;
                end_y = -1;
            }
        }
    }
    if (start_y !== -1) {
        rectangles.push({
            start_x: x,
            start_y: start_y,
            end_x: x,
            end_y: end_y
        });
        start_y = -1;
        end_y = -1;
    }
};
for (var x = 0; x < map_width; ++x) {
    _loop_1(x);
}
rectangles.forEach(function (r) { return console.log(r); });
