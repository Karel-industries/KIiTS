const ALIASES: { [key: string]: string } = {
  KROK: "STEP",
  "VLEVO-VBOK": "LEFT",
  ZVEDNI: "PICK",
  POLOŽ: "PLACE",
  OPAKUJ: "REPEAT",
  KRÁT: "TIMES",
  DOKUD: "UNTIL",
  KDYŽ: "IF",
  JINAK: "ELSE",
  JE: "IS",
  NENÍ: "ISNOT",
  ZEĎ: "WALL",
  ZNAČKA: "FLAG",
  DOMOV: "HOME",
  SEVER: "NORTH",
  JIH: "SOUTH",
  ZÁPAD: "WEST",
  VÝCHOD: "EAST",
  KONEC: "END",
  "Velikost města": "Map size",
  "Pozice Karla": "Karel position",
  "Otočení Karla": "Karel rotation",
  "Umístění domova": "Home position",
  "Definice města": "Map definition",
};

let Karel_stop: boolean = false;

class Functions {
  static FUNCTIONS: { [key: string]: Function } = {
    STEP: Functions.Step,
    LEFT: Functions.Turn_left,
    PICK: Functions.Pick,
    PLACE: Functions.Place,
  };

  static Step(): void {
    // Implementation goes here

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

    console.log(`forward: x:${old_x} y:${old_y} -> x:${k_x} y:${k_y}`);
  }

  static Turn_left(): void {
    // Implementation goes here

    const old_dir = k_dir;

    k_dir += 1;
    if (k_dir == 4) {
      k_dir = 0;
    }

    console.log(`left: dir:${old_dir} -> dir:${k_dir}`);
  }

  static Place(): void {
    // Implementation goes here

    k_pen = true;
    console.log(`lowered pen`);
  }

  static Pick(): void {
    // Implementation goes here

    k_pen = false;
    console.log(`picked up pen`);
  }

  static Is_wall_front(): boolean {
    const sensor: boolean = false; // Placeholder value
    console.log(`is wall front: ${sensor} x:${k_x} y:${k_y} `);
    return sensor;
  }

  static Is_wall_left(): boolean {
    const sensor: boolean = false; // Placeholder value
    console.log(`is wall left: ${sensor} x:${k_x} y:${k_y} `);
    return sensor;
  }

  static Is_wall_right(): boolean {
    const sensor: boolean = false; // Placeholder value
    console.log(`is wall right: ${sensor} x:${k_x} y:${k_y} `);
    return sensor;
  }

  static Is_flag(): boolean {
    return k_pen; // Return if pen is up (false) or down (true)
  }

  static At_home(): boolean {
    const bool: boolean = k_x == k_home_x && k_y == k_home_y;
    console.log(`at home: ${bool} x:${k_x} y:${k_y} `);
    return bool;
  }

  static Facing_north(): boolean {
    const bool: boolean = k_dir == 0;
    console.log(`facing north (up): ${bool}`);
    return bool;
  }

  static Facing_south(): boolean {
    const bool: boolean = k_dir == 2;
    console.log(`facing south (down): ${bool}`);
    return bool;
  }

  static Facing_east(): boolean {
    const bool: boolean = k_dir == 3;
    console.log(`facing east (right): ${bool}`);
    return bool;
  }

  static Facing_west(): boolean {
    const bool: boolean = k_dir == 1;
    console.log(`facing west (left): ${bool}`);
    return bool;
  }

  static Stop(): void {
    Karel_stop = true;
  }
}

const IF_LIST: { [key: string]: () => boolean } = {
  WALL: Functions.Is_wall_front,
  FLAG: Functions.Is_flag,
  HOME: Functions.At_home,
  NORTH: Functions.Facing_north,
  SOUTH: Functions.Facing_south,
  EAST: Functions.Facing_east,
  WEST: Functions.Facing_west,
};

export function load(str: string): void {
  Code.load(str);
}

export function run(func: string): void {
  Code.run(func);
}

/* ================================ */

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
let k_pen: boolean = false;

/* ================================ */

class Code {
  static code: string[] = [];
  static commented_code: string[] = [];
  static function_definitions: { [key: string]: string[] } = {}; // The commands under the function

  static ready: boolean = false;

  static format_code(raw_code: string): string[] {
    // Fix some characters and remove newlines
    let in_code = raw_code.split("\n");

    // Translate to english
    let translated_code: string[] = [];
    for (let line of in_code) {
      for (let key in ALIASES) {
        line = line.replace(key, ALIASES[key]);
      }
      translated_code.push(line);
    }

    // Remove comments and save them to commented_code
    in_code = translated_code;
    let uncommented_code: string[] = [];
    for (let line of in_code) {
      if (line.length > 0) {
        if (line[0] === "#") {
          Code.commented_code.push(line);
        } else {
          uncommented_code.push(line.toUpperCase());
        }
      }
    }

    return uncommented_code;
  }

  static load(raw_code: string): void {
    Code.ready = false;
    Code.code = Code.format_code(raw_code);
    Code.split_functions();
    Code.ready = true;
  }

  static split_functions(): void {
    let in_code = Code.code;
    let func_code: string[] = [];
    let func_name: string = "";

    for (let line of in_code) {
      if (line.startsWith("END")) {
        Code.function_definitions[func_name] = func_code;

        func_code = [];
        func_name = "";
      } else if (line.startsWith(" ")) {
        func_code.push(line);
      } else {
        func_name = line;
      }
    }
  }

  static run(func_name: string): void {
    if (Code.ready) {
      if (func_name in Code.function_definitions) {
        Code.run_func_list(Code.function_definitions[func_name]);
      }
    }
  }

  static run_func_list(func_list: string[]): void {
    let index = 0;
    while (index < func_list.length) {
      if (Karel_stop) {
        return;
      }
      let line = func_list[index].trim();

      if (line in Functions.FUNCTIONS) {
        Functions.FUNCTIONS[line]();
      } else if (line.startsWith("WHILE")) {
        let conditions = line.replace("WHILE", "").trim().split(" ");
        let tab_count = func_list[0].split("   ").length - 1;
        let tmp_index = index + 1;
        let tmp_code: string[] = [];
        while (true) {
          if (func_list[tmp_index] === "   ".repeat(tab_count) + "END") {
            break;
          } else {
            tmp_code.push(func_list[tmp_index]);
          }
          tmp_index++;
        }
        index = tmp_index;

        if (tmp_code.length === 0) {
          continue;
        }

        while (!Karel_stop) {
          if (IF_LIST[conditions[1]]() === (conditions[0] === "IS")) {
            Code.run_func_list(tmp_code);
          } else {
            break;
          }
        }

      } else if (line.startsWith("IF")) {
        let conditions = line.replace("IF", "").trim().split(" ");
        let tab_count = func_list[0].split("   ").length - 1;
        let tmp_index = index + 1;
        let if_tmp_code: string[] = [];
        let else_tmp_code: string[] = [];
        let else_detected = false;
        while (true) {
          if (func_list[tmp_index] === "   ".repeat(tab_count) + "END") {
            break;
          } else {
            if (func_list[tmp_index].trim() === "ELSE") {
              else_detected = true;
              tmp_index++;
              continue;
            }
            if (!else_detected) {
              if_tmp_code.push(func_list[tmp_index]);
            } else {
              else_tmp_code.push(func_list[tmp_index]);
            }
          }
          tmp_index++;
        }
        index = tmp_index;

        if (if_tmp_code.length === 0) {
          continue;
        }
        if (conditions[0] === "IS" && IF_LIST[conditions[1]]()) {
          Code.run_func_list(if_tmp_code);
        } else {
          Code.run_func_list(else_tmp_code);
        }
      } else if (line.startsWith("REPEAT")) {
        let tab_count = func_list[0].split("   ").length - 1;
        let tmp_index = index + 1;
        let tmp_code: string[] = [];
        while (true) {
          if (func_list[tmp_index] === "   ".repeat(tab_count) + "END") {
            break;
          } else {
            tmp_code.push(func_list[tmp_index]);
          }
          tmp_index++;
        }
        index = tmp_index;

        if (tmp_code.length === 0) {
          continue;
        }

        for (
          let i = 0;
          i < parseInt(line.replace("REPEAT ", "").replace("-TIMES", ""));
          i++
        ) {
          if (Karel_stop) {
            return;
          }
          Code.run_func_list(tmp_code);
        }
      } else if (line.startsWith("END")) {
        // just to be safe, but not used (hopefully)
      } else {
        try {
          Code.run_func_list(Code.function_definitions[line]); // recursive
        } catch (e) {
          // missing funcs are interpreted as no-ops
        }
      }

      index++;
    }
  }
}
