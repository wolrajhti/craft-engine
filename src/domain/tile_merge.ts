// map_width and map_height are the dimensions of the map
// is_wall_f checks if a tile is a wall

interface  Rect {
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
}

const rectangles: Rect[] = []; // Each rectangle covers a grid of wall tiles

const map_width = 4;
const map_height = 4;

const walls = new Map<number, Set<number>>();

walls.set(3, new Set([0]));

function is_wall_f(x: number, y: number) {
  return !(walls.has(x) && walls.get(x)?.has(y));
}

for (let x = 0; x < map_width; ++x) {
  let start_y = -1;
  let end_y = -1;
  for (let y = 0; y < map_height; ++y) {
    if (is_wall_f(x, y)) {
      if (start_y === -1) {
        start_y = y;
      }
      end_y = y;
    } else if (start_y !== -1) {
      const overlaps = rectangles
        .filter(r => {
          return r.end_x === x - 1 &&
            start_y <= r.start_y &&
            end_y >= r.end_y;
        })
        .sort((r1, r2) => {
          return r1.start_y - r2.start_y;
        });
      overlaps.forEach(r => {
        if (start_y < r.start_y) {
          rectangles.push({
            start_x: x,
            start_y,
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
          } else if (end_y > r.end_y) {
            start_y = r.end_y + 1;
          }
        }
      });

      if (start_y !== -1) {
        rectangles.push({
          start_x: x,
          start_y,
          end_x: x,
          end_y
        });
        start_y = -1;
        end_y = -1;
      }
    }
  }

  if (start_y !== -1) {
    rectangles.push({
      start_x: x,
      start_y,
      end_x: x,
      end_y
    });
    start_y = -1;
    end_y = -1;
  }
}

rectangles.forEach(r => console.log(r));