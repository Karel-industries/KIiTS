import { SmartLed, LED_WS2812 } from "smartled";
import * as colors_lib from "./libs/colors.js";
import * as gpio from "gpio";
import { stdout } from "stdio";
import * as fs from "fs";
import { read } from "adc";
import * as karel from "./karel.js"

/* ================================ */
// const size_file = fs.open("test.K99.size", "r");
// const file_size = Number(size_file.read(10));
// size_file.close();
/*const file_size = 1000000
const chunk_size = 100

let buffer = "";

async function read_file() {
  const file = fs.open("test.K", "r");

  let read = file.read(chunk_size);
  console.log(Math.ceil(file_size / chunk_size))

  for (let o = 0; o < Math.ceil(file_size / chunk_size); o++) {
    await sleep(5)
    console.log(buffer.length)
    buffer += read;
    read = file.read(chunk_size);
  }

  file.close();

  console.log(buffer)
}*/

const raw_code: string = `
MAIN
   LEFT

   WHILE ISNOT NORTH
      LEFT
   END
   
END
`;
const func_name: string = "MAIN";



/* ================================ */

async function main() {
  //await read_file();
  console.log("loading")
  karel.load(raw_code)
  console.log("loaded")
  console.log("running")
  karel.run(func_name);
  console.log("done")
}

main()