import * as fs from "fs";

/* ================================ */
// const size_file = fs.open("test.K99.size", "r");
// const file_size = Number(size_file.read(10));
// size_file.close();

const file_size = 1000000
const chunk_size = 100

let buffer = [];

async function read_file() {
  const file = fs.open("test.K", "r");

  let read = file.read(chunk_size);
  console.log(Math.ceil(file_size / chunk_size))

  for (let o = 0; o < Math.ceil(file_size / chunk_size); o++) {
    await sleep(5)
    console.log(buffer.length)
    buffer.push(read);
    read = file.read(chunk_size);
  }

  file.close();

  console.log(buffer)
}

//
//const file_content = file.read(13000);
//
//const lines = file_content.split("\n");
//console.log(lines);

/* ================================ */

// for (let i = 1; i < 8; i++) {
//   map[i][0] = i;
// }
// for (let i = 9; i < 15; i++) {
//   map[i - 9][1] = i;
// }

/* ======== */

/* 0 = up            [North]     Sever
 * 1 = left  (<-)    [WEST]      Západ
 * 2 = down          [SOUTH]     Jih
 * 3 = right (->)    [EAST]      Východ
 */
let k_dir: number = 0;
let k_x: number = 0; // ->
let k_y: number = 0; // down
let k_home_x: number = 0;
let k_home_y: number = 0;

/* ======== */

function turn_left(): void {
  // TODO - Left

  const old_dir = k_dir;

  k_dir += 1;
  if (k_dir == 4) {
    k_dir = 0;
  }

  console.log('left: dir:${old_dir} -> dir:${k_dir}')

}

function step(): void {
  // TODO - Forward

  const old_x = k_x;
  const old_y = k_y;

  switch (k_dir) {
    case 0:
      k_y--;
      break;
    case 1:
      k_x--;
      break;
    case 2:
      k_y++;
      break;
    case 3:
      k_x++;
      break;

    default:
      break;
  }

  console.log('forward: x:${old_x} y:${old_y} -> x:${k_x} y:${k_y}')

}

function place(): void {
  // TODO - Place pen on paper
  console.log('lowered pen')

}
function pick(): void {
  // TODO - Pick pen up
  console.log('picked up pen')
}

function is_wall_front(): boolean {
  // TODO - Get front sensor
  const sensor: boolean = false;
  console.log('is wall front: ${sensor} x:${k_x} y:${k_y} ')
  return sensor
}

function is_wall_left(): boolean {
  // TODO - Get left sensor
  const sensor: boolean = false;
  console.log('is wall left: ${sensor} x:${k_x} y:${k_y} ')
  return sensor
}

function is_wall_right(): boolean {
  // TODO - Get left sensor
  const sensor: boolean = false;
  console.log('is wall right: ${sensor} x:${k_x} y:${k_y} ')
  return sensor
}

function at_home(): boolean {
  const bool: boolean = k_x == k_home_x && k_y == k_home_y;
  console.log('at home: ${bool} x:${k_x} y:${k_y} ')
  return bool
}

function facing_north(): boolean {
  const bool: boolean = k_dir == 0;
  console.log('facing north (up): ${bool}')
  return bool
}
function facing_west(): boolean {
  const bool: boolean = k_dir == 1;
  console.log('facing west (left): ${bool}')
  return bool
}
function facing_south(): boolean {
  const bool: boolean = k_dir == 2;
  console.log('facing south (down): ${bool}')
  return bool
}
function facing_east(): boolean {
  const bool: boolean = k_dir == 3;
  console.log('facing east (right): ${bool}')
  return bool
}


/* ================================ */

async function main() {
  await read_file()

  console.log(buffer.length)
}

main()