import { SmartLed, LED_WS2812 } from "smartled";
import * as gpio from "gpio";
import * as fs from "fs";
/* ================================ */
gpio.pinMode(18, gpio.PinMode.INPUT);
gpio.pinMode(16, gpio.PinMode.INPUT);
gpio.pinMode(42, gpio.PinMode.INPUT);
/* ================================ */
const brightness = 0.5;
const ledStrip = new SmartLed(21, 64, LED_WS2812);
/* ================================ */
const colors = [
    { r: 0, g: 0, b: 0 }, // 0  - 0
    { r: 0, g: 0, b: 1 }, // 1  - 1
    { r: 0, g: 0, b: 2 }, // 2  - 2
    { r: 0, g: 0, b: 3 }, // 3  - 3
    { r: 0, g: 0, b: 4 }, // 4  - 4
    { r: 0, g: 0, b: 5 }, // 5  - 5
    { r: 0, g: 0, b: 6 }, // 6  - 6
    { r: 0, g: 0, b: 7 }, // 7  - 7
    { r: 0, g: 0, b: 8 }, // 8  - 8
    { r: 5, g: 0, b: 0 }, // 9  - wall
    { r: 0, g: 1, b: 0 }, // 10 - up
    { r: 0, g: 2, b: 0 }, // 11 - left
    { r: 0, g: 3, b: 0 }, // 12 - down
    { r: 0, g: 4, b: 0 }, // 13 - rignt
    { r: 1, g: 0, b: 1 }, // 14 - home
];
/* ================================ */
const file = fs.open("test.K99", "r");
file.close();
/* ================================ */
const map_size = 8;
const map = [];
for (let i = 0; i < map_size; i++) {
    map[i] = new Array(map_size).fill(0);
}
for (let i = 1; i < 8; i++) {
    map[i][0] = i;
}
for (let i = 9; i < 15; i++) {
    map[i - 9][1] = i;
}
/* ======== */
/* 0 = up            [North]     Sever
 * 1 = left  (<-)    [WEST]      Západ
 * 2 = down          [SOUTH]     Jih
 * 3 = right (->)    [EAST]      Východ
 */
let k_dir = 0;
let k_x = 0;
let k_y = 0;
let k_home_x = 0;
let k_home_y = 0;
/* ======== */
function get_pos_in_front() {
    switch (k_dir) {
        case 0: // up
            return { x: k_x, y: k_y - 1 };
            break;
        case 1: // left
            return { x: k_x - 1, y: k_y };
            break;
        case 2: // down
            return { x: k_x, y: k_y + 1 };
            break;
        case 3: // right
            return { x: k_x + 1, y: k_y };
            break;
        default:
            break;
    }
}
/* ======== */
function turn_left() {
    k_dir += 1;
    if (k_dir == 4) {
        k_dir = 0;
    }
}
function step() {
    switch (k_dir) {
        case 0:
            k_y -= 1;
            break;
        case 1:
            k_x -= 1;
            break;
        case 2:
            k_y += 1;
            break;
        case 3:
            k_x += 1;
            break;
        default:
            break;
    }
    if (k_x < 0) {
        k_x = 0;
    }
    else if (k_x > map_size - 1) {
        k_x = map_size - 1;
    }
    if (k_y < 0) {
        k_y = 0;
    }
    else if (k_y > map_size - 1) {
        k_y = map_size - 1;
    }
}
function place_flag() {
    map[k_x][k_y] += 1;
    if (map[k_x][k_y] > 8) {
        map[k_x][k_y] = 8;
    }
}
function pick_flag() {
    map[k_x][k_y] -= 1;
    if (map[k_x][k_y] < 0) {
        map[k_x][k_y] = 0;
    }
}
function is_wall_if_front() {
    let pos = get_pos_in_front();
    if (pos.x < 0 || pos.x > map_size - 1 || pos.y < 0 || pos.y > map_size - 1 || map[pos.x][pos.y] == 9) {
        return true;
    }
    return false;
}
/* ================================ */
function draw_map() {
    for (let y = 0; y < map_size; y++) {
        for (let x = 0; x < map_size; x++) {
            ledStrip.set(x + y * map_size, colors[map[x][y]]);
        }
    }
    let orig_color = colors[map[k_x][k_y]];
    let k_color = colors[k_dir + 10];
    let home_color = { r: 0, g: 0, b: 0 };
    if (k_x == k_home_x && k_y == k_home_y) {
        home_color = colors[14];
    }
    ledStrip.set(k_x + k_y * map_size, {
        r: orig_color.r + k_color.r + home_color.r,
        g: orig_color.g + k_color.g + home_color.g,
        b: orig_color.b + k_color.b + home_color.b,
    });
    ledStrip.show();
}
draw_map();
gpio.on("falling", 18, () => {
    turn_left();
    draw_map();
    console.log(is_wall_if_front());
});
gpio.on("falling", 16, () => {
    step();
    draw_map();
    console.log(is_wall_if_front());
});
