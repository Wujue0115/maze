


let interval, timeout, timeout2;
let time;

class Maze{
    constructor(rows = 19, cols = 19){
        /*
        this.origin_road_color = "#ffffff";
        this.origin_wall_color = "#4d516b";
        this.origin_head_color = "#6A7DF7";
        this.origin_path_color = "#F7C483";
        this.origin_visit_color = "#C1D0F7";
        this.origin_begin_color = "#00ff00";
        this.origin_end_color = "#ff0000";
        /*/
        this.origin_road_color = "#eeeeee";
        this.origin_wall_color = "#2b2b2b";
        this.origin_head_color = "#61dfff";
        this.origin_path_color = "#ffa3c3";
        this.origin_visit_color = "#bdb7ab";
        this.origin_begin_color = "#00ff00";
        this.origin_end_color = "#ff0000";
        //*/

        //*
        this.road_color = this.origin_road_color;
        this.wall_color = this.origin_wall_color;
        this.head_color = this.origin_head_color;
        this.path_color = this.origin_path_color;
        this.visit_color = this.origin_visit_color;
        this.begin_color = this.origin_begin_color;
        this.end_color = this.origin_end_color;

        /*/
        this.road_color = "#fff";
        this.wall_color = "#000";
        this.head_color = "#3F05FA";
        this.path_color = "#e4a0f7";
        this.visit_color = "#C7c6c1";
        this.begin_color = "#0f0";
        this.end_color = "#f00";
        //*/

        // gridline
        this.gridline_show = false;
        this.line_width = 2;
        this.origin_line_color = "#909598";
        this.line_color = this.origin_line_color;
        // this.line_color = "#999da0";
        // this.line_color = "#c7c6c1";
        
        /*
        0 = road
        1 = wall
        2 = head
        3 = path
        4 = visit
        5 = begin
        6 = end
        */
        this.cell_colors = [
            this.road_color,
            this.wall_color,
            this.head_color,
            this.path_color,
            this.visit_color,
            this.begin_color,
            this.end_color
        ];
        this.grid_color;

        this.gap = 6;
        this.rows;
        this.cols;
        this.cell_size;
        this.offset_y;
        this.offset_x;
        this.max_rows;
        this.max_cols;

        this.dir = [[-1, 0], [0, 1], [1, 0], [0, -1], [-1, 1], [1, 1], [1, -1], [-1, -1]];
        this.dir_tag = [2, 3, 4, 5, 6, 7, 8, 9];
        this.grid_dir;

        this.grid;
        this.visit;
        this.weight;
        this.begin; this.end;
        this.previous; this.current; this.next;
        this.back;

        // flood
        this.rainbow_colors;
        this.flood_color;

        // dfs
        this.stack = new Stack();

        // bfs
        this.queue = new Queue();
        this.find;

        // btfs and a*
        this.pq = new PriorityQueue();

        // kruskal and traversal
        this.points_count;
        this.edges;
        this.edges_count;
        this.djs = new DisjointSet();

        // eller
        this.eller_step;
        this.sets;
        this.map = new Map();

        // wilson
        this.points;

        // hunt-and-kill
        this.hunt;
        this.begin_hunt;
        this.connect;

        // growing-tree
        this.index;
        this.delete;
        this.gq = new GrowingQueue();

        // sidewinder
        this.runset;
        this.set_link;

        // a-star
        this.unused_cells;

        // better recursive division
        this.region;
        this.region_a;
        this.region_b;
        this.region_set;

        // this.interval;
        this.animation = true;
        this.step;
        this.reset;
        this.finish;
        this.generation;

        // edit
        this.edit = false;

        this.init(rows, cols, 0);
    }

    init(rows = this.rows, cols = this.cols, fill = 0){
        this.rows = rows;
        this.cols = cols;
        this.cell_size = Math.min(Math.floor((height - this.gap) / rows), Math.floor((width - this.gap) / cols));
        this.offset_y = Math.round((height - rows * this.cell_size) / 2);
        this.offset_x = Math.round((width - cols * this.cell_size) / 2);
        this.max_rows = Math.floor(height - this.gap >> 1); if(this.max_rows & 1 ^ 1) --this.max_rows;
        this.max_cols = Math.floor(width - this.gap >> 1); if(this.max_cols & 1 ^ 1) --this.max_cols;

        this.grid = getMatrix(this.rows, this.cols, fill); // 1 is wall and 0 is road
        this.grid_color = getMatrix(this.rows, this.cols, fill);
        this.stack.clear();
        this.previous = [];
        this.begin = []; this.end = [];
        this.next = []; this.current = [];
        this.back = false;
        this.flood_color = [];

        this.finish = true;
        this.generation = false;

        ctx.fillStyle = this.cell_colors[fill];
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(this.offset_x, this.offset_y, this.cols * this.cell_size, this.rows * this.cell_size);

        /* test function
        // font_size limit = 8
        let font_size = Math.floor(this.cell_size / 6 / 2 * 3);
        console.log(font_size);
        font_size = 8;
        if(font_size >= 8){
            ctx.font = font_size + "px Consolas";
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("012344", this.offset_x + 0.5 * this.cell_size, this.offset_y + 0.5 * this.cell_size);
        }
        //*/

        this.showGridline();
    }

    resize(rows = this.rows, cols = this.cols){
        this.rows = rows;
        this.cols = cols;
        this.cell_size = Math.min(Math.floor((height - this.gap) / rows), Math.floor((width - this.gap) / cols));
        this.offset_y = Math.round((height - rows * this.cell_size) / 2);
        this.offset_x = Math.round((width - cols * this.cell_size) / 2);
        this.max_rows = Math.floor(height - this.gap >> 1); if(this.max_rows & 1 ^ 1) --this.max_rows;
        this.max_cols = Math.floor(width - this.gap >> 1); if(this.max_cols & 1 ^ 1) --this.max_cols;
        
        this.drawGrid();
        //this.flood_color = [];
        this.showGridline();
    }

    drawGrid(){
        // ctx.clearRect(0, 0, width, height);
        if(this.flood_color.length){
            for(let r=0; r<this.rows; ++r){
                for(let c=0; c<this.cols; ++c){
                    if(this.grid[r][c] == 1){
                        this.fillCell([r, c], this.wall_color);
                    }else{
                        if(this.flood_color[r][c] == -1){
                            this.fillCell([r, c], this.road_color);
                        }else{
                            this.fillCell([r, c], this.rainbow_colors[this.flood_color[r][c]], 1);
                        }
                    }
                }
            }
        }else{
            for(let r=0; r<this.rows; ++r){
                for(let c=0; c<this.cols; ++c){
                    this.fillCell([r, c], this.cell_colors[this.grid_color[r][c]], 1);
                }
            }
        }
    }

    showGridline(){
        if(this.gridline_show) this.drawGridline();
        else ctx2.clearRect(0, 0, width, height);
    }

    drawGridline(){
        ctx2.clearRect(0, 0, width, height);
        if(this.cell_size <= 4) return;
        ctx2.lineWidth = this.line_width;
        ctx2.strokeStyle = this.line_color;
        for(let y=0; y<=this.rows; ++y){
            ctx2.beginPath();
            ctx2.moveTo(this.offset_x - 1, this.offset_y + y * this.cell_size);
            ctx2.lineTo(this.offset_x + this.cols * this.cell_size + 1, this.offset_y + y * this.cell_size);
            ctx2.stroke();
        }
        for(let x=0; x<=this.cols; ++x){
            ctx2.beginPath();
            ctx2.moveTo(this.offset_x + x * this.cell_size, this.offset_y);
            ctx2.lineTo(this.offset_x + x * this.cell_size, this.offset_y + rows * this.cell_size);
            ctx2.stroke();
        }
    }

    fillCell([r, c], color, level = 0){
        if(r == this.begin[0] && c == this.begin[1] && level == 0){
            this.grid_color[r][c] = 5;
            return;
        }
        if(r == this.end[0] && c == this.end[1] && level == 0){
            this.grid_color[r][c] = 6;
            return;
        }

        ctx.clearRect(this.offset_x + c * this.cell_size,
                      this.offset_y + r * this.cell_size,
                      this.cell_size,
                      this.cell_size);
        ctx.fillStyle = color;
        ctx.fillRect(this.offset_x + c * this.cell_size,
                     this.offset_y + r * this.cell_size,
                     this.cell_size,
                     this.cell_size);
        /*
        ctx.fillStyle = "#000";
        ctx.lineWidth = 1;
        ctx.moveTo(this.offset_x + cell[1] * this.cell_size + this.cell_size * 0.5,
                   this.offset_y + cell[0] * this.cell_size);
        ctx.lineTo(this.offset_x + cell[1] * this.cell_size + this.cell_size * 0.5,
                   this.offset_y + (cell[0] + 1) * this.cell_size);
        ctx.moveTo(this.offset_x + cell[1] * this.cell_size,
                   this.offset_y + cell[0] * this.cell_size + this.cell_size * 0.5);
        ctx.lineTo(this.offset_x + (cell[1] + 1) * this.cell_size,
                   this.offset_y + cell[0] * this.cell_size + this.cell_size * 0.5);
        ctx.stroke();
        //*/
    }

    fillBlock([r1, c1], [r2, c2], index){
        if(r1 > r2) r1 ^= r2 ^= r1 ^= r2;
        if(c1 > c2) c1 ^= c2 ^= c1 ^= c2;
        let x_block_size = (c2 - c1 + 1) * this.cell_size;
        let y_block_size = (r2 - r1 + 1) * this.cell_size;
        let x = this.offset_x + c1 * this.cell_size;
        let y = this.offset_y + r1 * this.cell_size;

        ctx.clearRect(x, y, x_block_size, y_block_size);
        ctx.fillStyle = this.cell_colors[index];
        ctx.fillRect(x, y, x_block_size, y_block_size);

        for(let r=r1; r<=r2; ++r){
            for(let c=c1; c<=c2; ++c){
                this.grid_color[r][c] = index;
            }
        }
    }

    fillOriginBlock([r1, c1], [r2, c2]){
        if(r1 > r2) r1 ^= r2 ^= r1 ^= r2;
        if(c1 > c2) c1 ^= c2 ^= c1 ^= c2;
        for(let r=r1; r<=r2; ++r){
            for(let c=c1; c<=c2; ++c){
                this.fillCell([r, c], this.cell_colors[this.grid[r][c]]);
                this.grid_color[r][c] = this.grid[r][c];
            }
        }
    }

    editCell(r, c, number){
        switch(number){
            case 0: // road
                if(r == this.begin[0] && c == this.begin[1]){ this.begin = []; }
                if(r == this.end[0] && c == this.end[1]){ this.end = []; }
                this.grid[r][c] = this.grid_color[r][c] = 0;
                this.fillCell([r, c], this.road_color);
                break;
            case 1: // wall
                if(r == this.begin[0] && c == this.begin[1]){ this.begin = []; }
                if(r == this.end[0] && c == this.end[1]){ this.end = []; }
                this.grid[r][c] = this.grid_color[r][c] = 1;
                this.fillCell([r, c], this.wall_color);
                break;
            case 5: // begin
                if(r == this.end[0] && c == this.end[1]){ this.end = []; }
                if(this.begin.length > 0){
                    this.grid_color[this.begin[0]][this.begin[1]] = 0;
                    this.fillCell(this.begin, this.road_color, 1);
                }
                this.begin = [r, c];
                this.grid[r][c] = 0;
                this.grid_color[r][c] = 5;
                this.fillCell([r, c], this.begin_color, 1);
                break;
            case 6: // end
                if(r == this.begin[0] && c == this.begin[1]){ this.begin = []; }
                if(this.end.length > 0){
                    this.grid_color[this.end[0]][this.end[1]] = 0;
                    this.fillCell(this.end, this.road_color, 1);
                }
                this.end = [r, c];
                this.grid[r][c] = 0;
                this.grid_color[r][c] = 6;
                this.fillCell([r, c], this.end_color, 1);
                break;
        }
    }

    clearRoad(){
        this.flood_color = [];
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                if(this.grid[r][c] != 1){
                    this.grid[r][c] = 0;
                } 
                
                if(this.grid_color[r][c] == 0) continue;
                if(this.grid_color[r][c] == 1) continue;
                if(this.grid_color[r][c] == 5) continue;
                if(this.grid_color[r][c] == 6) continue;
                this.grid_color[r][c] = 0;
            }
        }
        this.drawGrid();
    }

    clearAll(){
        this.flood_color = [];
        this.begin = this.end = [];
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                this.grid[r][c] = this.grid_color[r][c] = 0;
            }
        }
        ctx.fillStyle = this.cell_colors[0];
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(this.offset_x, this.offset_y, width - 2 * this.offset_x, height - 2 * this.offset_y);
    }

    fillWall(){
        this.flood_color = [];
        this.begin = this.end = [];
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                this.grid[r][c] = this.grid_color[r][c] = 1;
            }
        }
        ctx.fillStyle = this.cell_colors[1];
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(this.offset_x, this.offset_y, width - 2 * this.offset_x, height - 2 * this.offset_y);
    }

    resetCellColor(){
        this.cell_colors = [this.road_color,
                            this.wall_color,
                            this.head_color,
                            this.path_color,
                            this.visit_color,
                            this.begin_color,
                            this.end_color];
    }
// -------------------------------------------------------------------------------- // maze flood
    addColor(x, y, spacing = 0.02){
        let [rt, gt, bt] = [y[0] - x[0], y[1] - x[1], y[2] - x[2]];
        let [r, g, b] = x;
        for(let t=0; t<1; t+=spacing){
            this.rainbow_colors.push("rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")");
            r += rt * spacing;
            g += gt * spacing;
            b += bt * spacing;
        }
    }

    rainbowInit(colors, spacing){
        for(let i=0; i<colors.length-1; ++i){
            this.addColor(colors[i], colors[i+1], spacing);
        }
        this.addColor(colors[colors.length - 1], colors[0], spacing);
    }

    floodInit(flooding_color){
        this.reset = false;
        this.finish = false;
        this.clearRoad();

        if(this.begin.length == 0) this.begin = [1, 1];
        if(this.end.length){
            this.grid[this.end[0]][this.end[1]] = 0;
            this.fillCell(this.end, this.road_color, 1);
        }

        this.grid[this.begin[0]][this.begin[1]] = 0;
        this.flood_color = getMatrix(this.rows, this.cols, -1);
        this.queue.clear();
        this.queue.push([this.begin[0], this.begin[1], 0]);

        // let spacing = 1 / (Math.max(this.rows, this.cols) / 7);
        // let spacing = 1 / (Math.sqrt(this.rows * this.rows + this.cols * this.cols) / 7);
        let spacing;
        let add_colors;
        this.rainbow_colors = [];

        switch(flooding_color){
            case "pccs-pale":
                add_colors = [
                    [231, 213, 212],
                    [233, 213, 207],
                    [246, 227, 206],
                    [239, 230, 198],
                    [230, 233, 198],
                    [196, 224, 203],
                    [191, 224, 217],
                    [198, 221, 226],
                    [194, 204, 213],
                    [201, 202, 213],
                    [208, 200, 209],
                    [228, 213, 217]
                ];
                break;
            case "pccs-pale+":
                add_colors = [
                    [232, 194, 191],
                    [235, 194, 181],
                    [244, 212, 176],
                    [242, 230, 184],
                    [216, 221, 173],
                    [174, 212, 185],
                    [166, 212, 204],
                    [173, 209, 218],
                    [175, 192, 209],
                    [187, 189, 208],
                    [200, 185, 201],
                    [222, 196, 202]
                ];
                break;
            case "pccs-light":
                add_colors = [
                    [246, 171, 165],
                    [255, 185, 158],
                    [255, 206, 144],
                    [251, 230, 143],
                    [216, 223, 146],
                    [156, 217, 172],
                    [126, 204, 193],
                    [121, 186, 202],
                    [131, 167, 200],
                    [162, 159, 199],
                    [184, 154, 184],
                    [218, 160, 179]
                ];
                break;
            case "pccs-light+":
                add_colors = [
                    [241, 152, 150],
                    [255, 167, 135],
                    [255, 190, 113],
                    [242, 217, 110],
                    [199, 211, 109],
                    [133, 206, 158],
                    [98, 192, 181],
                    [91, 175, 196],
                    [108, 154, 197],
                    [144, 145, 195],
                    [176, 136, 181],
                    [217, 142, 165]
                ];
                break;
            case "pccs-bright":
                add_colors = [
                    [239, 108, 112],
                    [250, 129, 85],
                    [255, 173, 54],
                    [250, 216, 49],
                    [183, 200, 43],
                    [65, 184, 121],
                    [0, 170, 159],
                    [0, 152, 185],
                    [41, 129, 192],
                    [117, 116, 188],
                    [161, 101, 168],
                    [208, 103, 142]
                ];
                break;
            case "pccs-light-grayish":
                add_colors = [
                    [192, 171, 170],
                    [193, 171, 165],
                    [206, 187, 168],
                    [198, 190, 161],
                    [189, 193, 162],
                    [157, 182, 165],
                    [152, 182, 177],
                    [158, 180, 185],
                    [155, 165, 175],
                    [162, 162, 175],
                    [171, 160, 171],
                    [189, 172, 176]
                ];
                break;
            case "pccs-soft":
                add_colors = [
                    [202, 130, 129],
                    [218, 146, 122],
                    [219, 166, 107],
                    [211, 189, 108],
                    [173, 182, 107],
                    [118, 177, 138],
                    [84, 163, 155],
                    [81, 146, 164],
                    [93, 126, 160],
                    [120, 120, 160],
                    [144, 113, 148],
                    [180, 120, 139]
                ];
                break;
            case "pccs-strong":
                add_colors = [
                    [197, 63, 77],
                    [204, 87, 46],
                    [225, 146, 21],
                    [222, 188, 3],
                    [156, 173, 0],
                    [0, 143, 86],
                    [0, 130, 124],
                    [0, 111, 146],
                    [0, 91, 155],
                    [83, 76, 152],
                    [124, 61, 132],
                    [163, 60, 106]
                ];
                break;
            case "pccs-vivid":
                    add_colors = [
                        // [185, 31, 87],
                        [208, 47, 72],
                        // [221, 68, 59],
                        [233, 91, 35],
                        // [230, 120, 0],
                        [244, 157, 0],
                        // [241, 181, 0],
                        [238, 201, 0],
                        // [210, 193, 0],
                        [168, 187, 0],
                        // [88, 169, 29],
                        [0, 161, 90],
                        // [0, 146, 110],
                        [0, 133, 127],
                        // [0, 116, 136],
                        [0, 112, 155],
                        // [0, 96, 156],
                        [0, 91, 165],
                        // [26, 84, 165],
                        [83, 74, 160],
                        // [112, 63, 150],
                        [129, 55, 138],
                        // [143, 46, 124],
                        [173, 46, 108]
                    ];
                    break;
            case "pccs-grayish":
                add_colors = [
                    [116, 92, 92],
                    [117, 92, 87],
                    [128, 108, 92],
                    [120, 111, 87],
                    [110, 114, 90],
                    [83, 102, 90],
                    [78, 103, 100],
                    [79, 101, 108],
                    [76, 87, 101],
                    [86, 85, 102],
                    [96, 82, 98],
                    [114, 92, 99]
                ];
                break;
            case "pccs-dull":
                add_colors = [
                    [163, 90, 92],
                    [175, 105, 84],
                    [179, 127, 70],
                    [171, 148, 70],
                    [133, 143, 70],
                    [79, 135, 102],
                    [42, 123, 118],
                    [36, 106, 125],
                    [52, 89, 125],
                    [84, 82, 124],
                    [108, 74, 113],
                    [139, 79, 101]
                ];
                break;
            case "pccs-deep":
                add_colors = [
                    [166, 29, 57],
                    [171, 61, 29],
                    [177, 108, 0],
                    [179, 147, 0],
                    [116, 132, 0],
                    [0, 114, 67],
                    [0, 102, 100],
                    [0, 84, 118],
                    [0, 66, 128],
                    [62, 51, 123],
                    [97, 36, 105],
                    [134, 29, 85]
                ];
                break;
            case "pccs-dark":
                add_colors = [
                    [105, 41, 52],
                    [117, 54, 42],
                    [121, 77, 28],
                    [116, 96, 31],
                    [82, 91, 32],
                    [35, 82, 58],
                    [0, 71, 70],
                    [0, 69, 88],
                    [18, 52, 82],
                    [50, 45, 81],
                    [67, 40, 72],
                    [97, 45, 70]
                ];
                break;
            case "pccs-dark-grayish":
                add_colors = [
                    [62, 45, 48],
                    [63, 46, 44],
                    [74, 60, 50],
                    [68, 62, 48],
                    [61, 64, 51],
                    [42, 52, 46],
                    [39, 52, 52],
                    [39, 52, 57],
                    [34, 41, 51],
                    [41, 39, 52],
                    [48, 37, 49],
                    [61, 46, 52]
                ];
                break;
            case "gray":
                add_colors = [
                    [255, 255, 255],
                    [  0,   0 ,  0]
                ];
                break;
        }
        spacing = 1 / ((parseInt(this.rows) + parseInt(this.cols) - 5) / add_colors.length);
        this.rainbowInit(add_colors, spacing);
    }

    flood(){
        if(this.reset){
            // this.begin = [];
            clearTimeout(timeout);
            return;
        }

        if(this.queue.empty()){
            // this.begin = [];
            this.finish = true;
            clearTimeout(timeout);
            return;
        }

        let next_queue = [];
        while(this.queue.size()){
            this.current = this.queue.front(); this.queue.pop();
            this.grid[this.current[0]][this.current[1]] = -1;
            this.flood_color[this.current[0]][this.current[1]] = this.current[2];
            this.fillCell(this.current, this.rainbow_colors[this.current[2]], 1);

            for(let i=0; i<4; ++i){
                let nr = this.current[0] + this.dir[i][0];
                let nc = this.current[1] + this.dir[i][1];
    
                if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
                if(this.grid[nr][nc] != 0) continue;

                this.grid[nr][nc] = -1;
                next_queue.push([nr, nc, (this.current[2] + 1) % this.rainbow_colors.length]);
            }
        }

        for(let i=0; i<next_queue.length; ++i){
            this.queue.push(next_queue[i]);
        }

        if(!this.step) timeout = setTimeout(() => { this.flood(); }, interval);
    }
// -------------------------------------------------------------------------------- // maze generation
    generate(algorithm){
        this.flood_color = [];
        this.reset = false;

        switch(algorithm){
            case "dfs":
                this.dfsGenerateInit();
                this.dfsGenerate();
                /*
                if(this.animation){
                    this.dfsGenerate();
                }else{
                    this.dfsGenerate_no_animation();
                    this.drawGrid();
                }
                //*/
                break;
            case "kruskal":
                this.kruskalGenerateInit();
                this.kruskalGenerate();
                break;
            case "traversal":
                this.traversalGenerateInit();
                this.traversalGenerate();
                break;
            case "prim":
                this.primGenerateInit();
                this.primGenerate();
                break;
            case "recursive-division":
                this.recursiveDivisionGenerateInit();
                this.recursiveDivisionGenerate();
                break;
            case "eller":
                this.ellerGenerateInit();
                this.ellerGenerate();
                break;
            case "aldous-broder":
                this.aldousBroderGenerateInit();
                this.aldousBroderGenerate();
                break;
            case "wilson":
                this.wilsonGenerateInit();
                this.wilsonGenerate();
                break;
            case "hunt-and-kill":
                this.huntAndKillGenerateInit();
                this.huntAndKillGenerate();
                break;
            case "growing-tree":
                this.growingTreeGenerateInit();
                this.growingTreeGenerate();
                break;
            case "binary-tree":
                this.binaryTreeGenerateInit();
                this.binaryTreeGenerate();
                break;
            case "sidewinder":
                this.sidewinderGenerateInit();
                this.sidewinderGenerate();
                break;
            case "a-star":
                this.aStarGenerateInit();
                this.aStarGenerate();
                break;
            default:
                alert("generation algorithm error");
                break;
        }
    }

    finishGenerate(){
        this.finish = true;
        this.generation = true;
        this.begin = [1, 1];
        this.end = [this.rows - 2, this.cols - 2];
        this.grid_color[this.begin[0]][this.begin[1]] = 5;
        this.grid_color[this.end[0]][this.end[1]] = 6;
        this.fillCell(this.begin, this.begin_color, 1);
        this.fillCell(this.end, this.end_color, 1);
    }
    // ------------------------------------------------------------ // dfs generation
    dfsGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;
        this.next = this.current = [r, c];
    }

    getNextCell(){
        if(!(this.current[0] & this.current[1] & 1)) return null;
        let next_cell = [];

        let pr = this.current[0] + this.dir[0][0];
        let pc = this.current[1] + this.dir[0][1];
        let nr = this.current[0] + 2 * this.dir[0][0];
        let nc = this.current[1] + 2 * this.dir[0][1];
        if(nr > 0 && this.grid[nr][nc] == 1) next_cell.push([[pr, pc], [nr, nc]]);
        
        pr = this.current[0] + this.dir[1][0];
        pc = this.current[1] + this.dir[1][1];
        nr = this.current[0] + 2 * this.dir[1][0];
        nc = this.current[1] + 2 * this.dir[1][1];
        if(nc < this.cols - 1 && this.grid[nr][nc] == 1) next_cell.push([[pr, pc], [nr, nc]]);

        pr = this.current[0] + this.dir[2][0];
        pc = this.current[1] + this.dir[2][1];
        nr = this.current[0] + 2 * this.dir[2][0];
        nc = this.current[1] + 2 * this.dir[2][1];
        if(nr < this.rows - 1 && this.grid[nr][nc] == 1) next_cell.push([[pr, pc], [nr, nc]]);

        pr = this.current[0] + this.dir[3][0];
        pc = this.current[1] + this.dir[3][1];
        nr = this.current[0] + 2 * this.dir[3][0];
        nc = this.current[1] + 2 * this.dir[3][1];
        if(nc > 0 && this.grid[nr][nc] == 1) next_cell.push([[pr, pc], [nr, nc]]);

        return next_cell.length ? next_cell[getRandInt(0, next_cell.length - 1)] : null;
    }
    
    dfsGenerate(){
        if(this.reset){
            // cancelAnimationFrame(timeout);
            clearTimeout(timeout);
            return;
        }

        this.grid[this.current[0]][this.current[1]] = 0;
        this.grid_color[this.current[0]][this.current[1]] = 2;
        this.fillCell(this.current, this.head_color);
        if(this.previous.length){
            if(this.back){
                this.grid_color[this.previous[0]][this.previous[1]] = 0;
                this.fillCell(this.previous, this.road_color);
            }else{
                this.grid_color[this.previous[0]][this.previous[1]] = 3;
                this.fillCell(this.previous, this.path_color);
            }
        }
        this.previous = this.current;

        if(this.current[0] == this.next[0] && this.current[1] == this.next[1]){
            let next = this.getNextCell();
            if(next){
                this.stack.push(this.current);
                this.current = next[0];
                this.next = next[1];
                this.back = false;
            }else if(this.stack.size()){
                /*
                if(this.back == false) this.stack.push(this.current);
                else this.fillCell(this.current, this.head_color);
                //*/
                // this.fillCell(this.current, this.head_color);
                this.current = this.next = this.stack.top();
                this.stack.pop();
                this.back = true;
            }else{
                this.grid_color[this.current[0]][this.current[1]] = 0;
                this.fillCell(this.current, this.road_color);
                this.finishGenerate();
                return;
            }
        }else{
            this.stack.push(this.current);
            this.current = this.next;
            this.back = false;
        }

        // requestAnimationFrame(() => { this.dfsGenerate() });
        if(!this.step) timeout = setTimeout(() => { this.dfsGenerate(); }, interval);
    }

    dfsGenerate_no_animation(){
        if(this.reset) return;

        this.grid[this.current[0]][this.current[1]] = 0;
        this.grid_color[this.current[0]][this.current[1]] = 2;
        // this.fillCell(this.current, this.head_color);
        if(this.previous.length){
            if(this.back){
                this.grid_color[this.previous[0]][this.previous[1]] = 0;
                // this.fillCell(this.previous, this.road_color);
            }else{
                this.grid_color[this.previous[0]][this.previous[1]] = 3;
                // this.fillCell(this.previous, this.path_color);
            }
        }
        this.previous = this.current;

        if(this.current[0] == this.next[0] && this.current[1] == this.next[1]){
            let next = this.getNextCell();
            if(next){
                this.stack.push(this.current);
                this.current = next[0];
                this.next = next[1];
                this.back = false;
            }else if(this.stack.size()){
                this.current = this.next = this.stack.top();
                this.stack.pop();
                this.back = true;
            }else{
                this.grid_color[this.current[0]][this.current[1]] = 0;
                // this.fillCell(this.current, this.road_color);
                this.finish = true;
                this.generation = true;
                this.begin = [1, 1];
                this.end = [this.rows - 2, this.cols - 2];
                this.grid_color[this.begin[0]][this.begin[1]] = 5;
                this.grid_color[this.end[0]][this.end[1]] = 6;
                // this.fillCell(this.begin, this.begin_color, 1);
                // this.fillCell(this.end, this.end_color, 1);
                return;
            }
        }else{
            this.stack.push(this.current);
            this.current = this.next;
            this.back = false;
        }

        this.dfsGenerate_no_animation();
    }

    // ------------------------------------------------------------ // Kruskal's generation
    mapping([r, c]){ return (r - 1 >> 1) * (this.cols - 1 >> 1) + (c - 1 >> 1); }

    swap(i, j){
        let temp = this.edges[i];
        this.edges[i] = this.edges[j];
        this.edges[j] = temp;
    }

    kruskalGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.previous = [];
        this.edges_count = 1;
        this.points_count = (this.rows - 1 >> 1) * (this.cols - 1 >> 1);
        this.djs.init(this.points_count);
        this.edges = [];
        for(let r=1; r<this.rows; r+=2){
            for(let c=1; c<this.cols; c+=2){
                let nr = r + this.dir[1][0] + this.dir[1][0];
                let nc = c + this.dir[1][1] + this.dir[1][1];
                if(nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols){
                    this.edges.push([[r, c], [nr, nc]]);
                }

                nr = r + this.dir[2][0] + this.dir[2][0];
                nc = c + this.dir[2][1] + this.dir[2][1];
                if(nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols){
                    this.edges.push([[r, c], [nr, nc]]);
                }
            }
        }
    }

    kruskalGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.previous.length){
            let [a, b, c] = this.previous;
            this.grid[a[0]][a[1]] = 0;
            this.grid[b[0]][b[1]] = 0;
            this.grid[c[0]][c[1]] = 0;
            this.grid_color[a[0]][a[1]] = 0;
            this.grid_color[b[0]][b[1]] = 0;
            this.grid_color[c[0]][c[1]] = 0;
            this.fillCell(a, this.road_color);
            this.fillCell(b, this.road_color);
            this.fillCell(c, this.road_color);
        }

        if(this.edges_count >= this.points_count){
            this.edges = [];
            this.djs.clear();
            this.finishGenerate();
            return;
        }

        let a, b, ma, mb;
        do{
            let rand = getRandInt(0, this.edges.length - 1);
            this.swap(rand, this.edges.length - 1);
            [a, b] = this.edges[this.edges.length - 1];
            ma = this.mapping(a);
            mb = this.mapping(b);
            this.edges.pop();
        }while(this.djs.union(ma, mb) == false);
        
        let c = [a[0] + b[0] >> 1, a[1] + b[1] >> 1];
        this.grid[a[0]][a[1]] = 0;
        this.grid[b[0]][b[1]] = 0;
        this.grid[c[0]][c[1]] = 0;
        this.grid_color[a[0]][a[1]] = 3;
        this.grid_color[b[0]][b[1]] = 3;
        this.grid_color[c[0]][c[1]] = 3;
        this.fillCell(a, this.path_color);
        this.fillCell(b, this.path_color);
        this.fillCell(c, this.path_color);

        this.previous = [a, b, c];

        ++this.edges_count;

        if(!this.step) timeout = setTimeout(() => { this.kruskalGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Random traversal generation
    traversalGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.previous = [];
        this.edges_count = 1;
        this.points_count = (this.rows - 1 >> 1) * (this.cols - 1 >> 1);
        this.edges = [];
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;
        // r = 1; c = 1;
        this.edges.push([[r, c], [r, c]]);
    }

    traversalGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.previous.length){
            let [a, b, c] = this.previous;
            this.grid[a[0]][a[1]] = 0;
            this.grid[b[0]][b[1]] = 0;
            this.grid[c[0]][c[1]] = 0;
            this.grid_color[a[0]][a[1]] = 0;
            this.grid_color[b[0]][b[1]] = 0;
            this.grid_color[c[0]][c[1]] = 0;
            this.fillCell(a, this.road_color);
            this.fillCell(b, this.road_color);
            this.fillCell(c, this.road_color);
        }

        if(this.edges_count > this.points_count){
            this.edges = [];
            this.finishGenerate();
            return;
        }

        let a, b;
        do{
            let rand = getRandInt(0, this.edges.length - 1);
            this.swap(rand, this.edges.length - 1);
            [a, b] = this.edges[this.edges.length - 1];
            this.edges.pop();
        }while(this.grid[b[0]][b[1]] == 0);
        
        let c = [a[0] + b[0] >> 1, a[1] + b[1] >> 1];
        this.grid[b[0]][b[1]] = 0;
        this.grid[c[0]][c[1]] = 0;
        this.grid_color[b[0]][b[1]] = 3;
        this.grid_color[c[0]][c[1]] = 3;
        this.fillCell(b, this.path_color);
        this.fillCell(c, this.path_color);

        for(let d=0; d<4; ++d){
            let nr = b[0] + this.dir[d][0] + this.dir[d][0];
            let nc = b[1] + this.dir[d][1] + this.dir[d][1];

            if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            if(this.grid[nr][nc] == 0) continue;

            this.grid_color[nr][nc] = 2;
            this.fillCell([nr, nc], this.head_color);
            this.edges.push([b, [nr, nc]]);
        }

        this.previous = [a, b, c];
        ++this.edges_count;

        if(!this.step) timeout = setTimeout(() => { this.traversalGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Prim's generation
    primGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.previous = [];
        this.edges_count = 1;
        this.points_count = (this.rows - 1 >> 1) * (this.cols - 1 >> 1);
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;
        // r = this.rows - 2;
        // c = 1;
        this.pq.clear();
        this.pq.setCompare((a, b) => a[2] < b[2]);
        this.pq.push([[r, c], [r, c], Math.random()]);
    }

    primGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.previous.length){
            let [a, b, c] = this.previous;
            this.grid[a[0]][a[1]] = 0;
            this.grid[b[0]][b[1]] = 0;
            this.grid[c[0]][c[1]] = 0;
            this.grid_color[a[0]][a[1]] = 0;
            this.grid_color[b[0]][b[1]] = 0;
            this.grid_color[c[0]][c[1]] = 0;
            this.fillCell(a, this.road_color);
            this.fillCell(b, this.road_color);
            this.fillCell(c, this.road_color);
        }

        if(this.edges_count > this.points_count){
            this.edges = [];
            this.djs.clear();
            this.finish = true;
            this.generation = true;
            this.begin = [1, 1];
            this.end = [this.rows - 2, this.cols - 2];
            this.grid_color[this.begin[0]][this.begin[1]] = 5;
            this.grid_color[this.end[0]][this.end[1]] = 6;
            this.fillCell(this.begin, this.begin_color, 1);
            this.fillCell(this.end, this.end_color, 1);
            return;
        }

        let a, b;
        do{
            [a, b] = this.pq.front(); this.pq.pop();
        }while(this.grid[b[0]][b[1]] == 0);
        
        let c = [a[0] + b[0] >> 1, a[1] + b[1] >> 1];
        this.grid[b[0]][b[1]] = 0;
        this.grid[c[0]][c[1]] = 0;
        this.grid_color[b[0]][b[1]] = 3;
        this.grid_color[c[0]][c[1]] = 3;
        this.fillCell(b, this.path_color);
        this.fillCell(c, this.path_color);

        for(let d=0; d<4; ++d){
            let nr = b[0] + this.dir[d][0] + this.dir[d][0];
            let nc = b[1] + this.dir[d][1] + this.dir[d][1];

            if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            if(this.grid[nr][nc] == 0) continue;

            this.grid_color[nr][nc] = 2;
            this.fillCell([nr, nc], this.head_color);
            this.pq.push([b, [nr, nc], Math.random()]);
        }

        this.previous = [a, b, c];
        ++this.edges_count;

        if(!this.step) timeout = setTimeout(() => { this.primGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Recursive division algorithm
    recursiveDivisionGenerateInit(){
        this.init(this.rows, this.cols, 0);
        this.finish = false;
        for(let r=0; r<this.rows; ++r){
            this.grid[r][0] = this.grid[r][this.cols - 1] = 1;
            this.grid_color[r][0] = this.grid_color[r][this.cols - 1] = 1;
        }
        for(let c=0; c<this.cols; ++c){
            this.grid[0][c] = this.grid[this.rows - 1][c] = 1;
            this.grid_color[0][c] = this.grid_color[this.rows - 1][c] = 1;
        }
        this.drawGrid();

        this.stack.clear();
        this.stack.push([[1, 1], [this.rows - 2, this.cols - 2]]);
    }

    horizontalDivision(a, b){
        let rand_cols;
        //*
        rand_cols = a[1] - 1 + (getRandInt(1, (b[1] - a[1] >> 1)) << 1);
        /*/
        rand_cols = (a[1] + b[1] >> 1) + ((a[1] + b[1] >> 1) & 1);
        //*/
        // console.log(rand_cols);
        for(let r=a[0]; r<=b[0]; ++r){
            this.grid[r][rand_cols] = this.grid_color[r][rand_cols] = 1;
            this.fillCell([r, rand_cols], this.wall_color);
        }
        let rand_road = a[0] + (getRandInt(0, (b[0] - a[0] >> 1)) << 1);
        this.grid[rand_road][rand_cols] = this.grid_color[rand_road][rand_cols] = 0;
        this.fillCell([rand_road, rand_cols], this.road_color);

        let right = [[a[0], rand_cols + 1], b];
        let left = [a, [b[0], rand_cols - 1]];
        if(Math.abs(right[0][0] - right[1][0]) >= 1 && Math.abs(right[0][1] - right[1][1]) >= 1){
            this.stack.push(right);
        }
        if(Math.abs(left[0][0] - left[1][0]) >= 1 && Math.abs(left[0][1] - left[1][1]) >= 1){
            this.stack.push(left);
        }
    }

    verticalDivision(a, b){
        let rand_rows;
        //*
        rand_rows = a[0] - 1 + (getRandInt(1, (b[0] - a[0] >> 1)) << 1);
        /*/
        rand_rows = (a[0] + b[0] >> 1) + ((a[0] + b[0] >> 1) & 1);
        //*/
        // console.log(rand_rows);
        for(let c=a[1]; c<=b[1]; ++c){
            this.grid[rand_rows][c] = this.grid_color[rand_rows][c] = 1;
            this.fillCell([rand_rows, c], this.wall_color);
        }
        let rand_road = a[1] + (getRandInt(0, (b[1] - a[1] >> 1)) << 1);
        this.grid[rand_rows][rand_road] = this.grid_color[rand_rows][rand_road] = 0;
        this.fillCell([rand_rows, rand_road], this.road_color);

        let bottom = [[rand_rows + 1, a[1]], b];
        let top = [a, [rand_rows - 1, b[1]]];
        if(Math.abs(bottom[0][0] - bottom[1][0]) >= 1 && Math.abs(bottom[0][1] - bottom[1][1]) >= 1){
            this.stack.push(bottom);
        }
        if(Math.abs(top[0][0] - top[1][0]) >= 1 && Math.abs(top[0][1] - top[1][1]) >= 1){
            this.stack.push(top);
        }
    }

    recursiveDivisionGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.stack.empty()){
            this.finishGenerate();
            return;
        }else{
            let [a, b] = this.stack.top(); this.stack.pop();
            if(Math.abs(a[0] - b[0]) >= 2 && Math.abs(a[1] - b[1]) >= 2){
                if(Math.abs(a[0] - b[0]) > Math.abs(a[1] - b[1])){
                    this.verticalDivision(a, b);
                }else{
                    this.horizontalDivision(a, b);
                }
            }else if(Math.abs(a[1] - b[1]) >= 2){
                this.horizontalDivision(a, b);
            }else{
                this.verticalDivision(a, b);
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.recursiveDivisionGenerate(); }, interval);        
    }

    // ------------------------------------------------------------ // Eller's algorithm
    ellerGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.previous = [];

        this.points_count = (this.rows - 1 >> 1) * (this.cols - 1 >> 1);
        this.djs.init(this.points_count);
        this.joinRowSet(1);

        this.current = [1, 1];
        this.eller_step = 0;
    }

    joinRowSet(row){
        let mx, my;
        let index = -1;
        this.sets = [];
        this.map.clear();
        for(let c=1; c<this.cols-1; c+=2){
            this.grid[row][c] = 0;

            mx = this.mapping([row, c]);
            if(this.map.has(this.djs.parents[mx])){
                this.sets[this.map.get(this.djs.parents[mx])].push(c);
            }else{
                this.map.set(this.djs.parents[mx], ++index);
                this.sets.push([c]);
            }

            my = this.mapping([row, c + 2]);
            if(c + 2 < this.cols - 1 && !this.djs.isSame(mx, my) && Math.random() >= 0.5){
                this.djs.union(mx, my);
                this.grid[row][c + 1] = 0;
            }
        }
    }

    connectVerticalCell(row){
        let mx, my;
        for(let i=0; i<this.sets.length; ++i){
            let counts = 1 + getRandInt(0, this.sets[i].length - 1);
            for(let j=0; j<counts; ++j){
                let last = this.sets[i].length - 1;
                let rand_index = getRandInt(0, last);
                let temp = this.sets[i][last];
                this.sets[i][last] = this.sets[i][rand_index];
                this.sets[i][rand_index] = temp;

                mx = this.mapping([row, this.sets[i][last]]);
                my = this.mapping([row + 2, this.sets[i][last]]);
                this.djs.union(mx, my);
                
                this.grid[row + 1][this.sets[i][last]] = 0;
            }
        }
    }

    finishRow(row){
        let mx, my;
        for(let c=1; c<this.cols-2; c+=2){
            this.grid[row][c] = this.grid_color[row][c] = 0;

            mx = this.mapping([row, c]);
            my = this.mapping([row, c + 2]);
            if(!this.djs.isSame(mx, my)){
                this.djs.union(mx, my);
                this.grid[row][c + 1] = this.grid_color[row][c + 1] = 0;
            }
        }
        this.grid[row][this.cols - 2] = this.grid_color[row][this.cols - 2] = 0;
    }

    ellerGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        let [row, col] = this.current;
        this.grid_color[this.current[0]][this.current[1]] = 2;
        this.fillCell(this.current, this.head_color);
        if(this.eller_step == 2){
            this.grid_color[this.row - 1][this.col] = this.grid[this.row - 1][this.col];
            this.fillCell([this.row - 1, this.col], this.cell_colors[this.grid_color[this.current[0] - 1][this.current[1]]]);
        }
        if(this.previous.length){
            this.grid_color[this.previous[0]][this.previous[1]] = this.grid[this.previous[0]][this.previous[1]];
            this.fillCell(this.previous, this.cell_colors[this.grid_color[this.previous[0]][this.previous[1]]]);
        }
        this.previous = this.current;

        if(row == this.rows - 2 && col == this.cols - 2 && this.eller_step == 0){
            this.djs.clear();
            this.finishGenerate();
            return;
        }

        if(col == this.cols - 2){
            this.eller_step = (this.eller_step + 1) % 2;
            switch(this.eller_step){
                case 0:
                    ++row;
                    if(row != this.rows - 2) this.joinRowSet(row);
                    else this.finishRow(row);
                    break;
                case 1:
                    this.connectVerticalCell(row);
                    ++row
                    break;
            }
            col = 1;
        }else{
            ++col;
        }

        this.current = [row, col];

        if(!this.step) timeout = setTimeout(() => { this.ellerGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Aldous-Broder algorithm
    aldousBroderGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;
        this.current = [r, c];
        this.next = [];
        this.previous = [];

        this.points_count = (this.rows - 1 >> 1) * (this.cols - 1 >> 1);
    }

    getNextCell3(){
        if(!(this.current[0] & this.current[1] & 1)) return null;
        let next_cell = [];

        let pr = this.current[0] + this.dir[0][0];
        let pc = this.current[1] + this.dir[0][1];
        let nr = this.current[0] + 2 * this.dir[0][0];
        let nc = this.current[1] + 2 * this.dir[0][1];
        if(nr > 0) next_cell.push([[pr, pc], [nr, nc]]);
        
        pr = this.current[0] + this.dir[1][0];
        pc = this.current[1] + this.dir[1][1];
        nr = this.current[0] + 2 * this.dir[1][0];
        nc = this.current[1] + 2 * this.dir[1][1];
        if(nc < this.cols - 1) next_cell.push([[pr, pc], [nr, nc]]);

        pr = this.current[0] + this.dir[2][0];
        pc = this.current[1] + this.dir[2][1];
        nr = this.current[0] + 2 * this.dir[2][0];
        nc = this.current[1] + 2 * this.dir[2][1];
        if(nr < this.rows - 1) next_cell.push([[pr, pc], [nr, nc]]);

        pr = this.current[0] + this.dir[3][0];
        pc = this.current[1] + this.dir[3][1];
        nr = this.current[0] + 2 * this.dir[3][0];
        nc = this.current[1] + 2 * this.dir[3][1];
        if(nc > 0) next_cell.push([[pr, pc], [nr, nc]]);

        return next_cell.length ? next_cell[getRandInt(0, next_cell.length - 1)] : null;
    }

    aldousBroderGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        this.grid_color[this.current[0]][this.current[1]] = 2;
        this.fillCell(this.current, this.head_color);
        if(this.previous.length){
            this.grid_color[this.previous[0]][this.previous[1]] = 0;
            this.fillCell(this.previous, this.road_color);
        }

        this.previous = this.current;

        let next = this.getNextCell3();
        if(next){
            if(this.grid[this.current[0]][this.current[1]] == 1){
                this.grid[this.current[0]][this.current[1]] = 0;
                --this.points_count;

                if(this.points_count == 0){
                    this.grid_color[this.current[0]][this.current[1]] = 0;
                    this.fillCell(this.current, this.road_color);
                    this.finishGenerate();
                    return;
                }
            }

            if(this.grid[next[1][0]][next[1][1]]){
                this.current = next[0];
                this.next = next[1];
            }else{
                if(this.grid[next[0][0]][next[0][1]]){
                    this.current = next[1];
                }else{
                    [this.current, this.next] = next;
                }
            }
        }else{
            this.grid[this.current[0]][this.current[1]] = 0;
            this.current = this.next;
        }

        if(!this.step) timeout = setTimeout(() => { this.aldousBroderGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Wilson's algorithm
    wilsonGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.points = [];
        for(let r=1; r<this.rows-1; r+=2){
            for(let c=1; c<this.cols-1; c+=2){
                this.points.push([r, c]);
            }
        }

        let last = this.points.length - 1;
        let rand_index = getRandInt(0, last);
        let temp = this.points[last];
        this.points[last] = this.points[rand_index];
        this.points[rand_index] = temp;

        let [r, c] = this.points[last];
        this.grid[r][c] = this.grid_color[r][c] = 0;
        this.fillCell([r, c], this.road_color);
        this.points.pop();

        console.log(showp(r, c));

        this.current = this.randomBegin();
        this.previous = [];
        this.next = [];

        this.stack.clear();
    }

    connectNewPath(){
        let r, c, tag;
        while(this.stack.size()){
            [r, c, tag] = this.stack.top(); this.stack.pop();
            this.grid[r][c] = 0;
            this.grid_color[r][c] = 0;
            this.fillCell([r, c], this.road_color);    
        }
    }

    randomBegin(){
        let r, c;
        do{
            let last = this.points.length - 1;
            let rand_index = getRandInt(0, last);
            let temp = this.points[last];
            this.points[last] = this.points[rand_index];
            this.points[rand_index] = temp;

            [r, c] = this.points[last];
            if(this.grid[r][c] == 0){
                this.points.pop();
                if(this.points.length == 0) return null;
            }else{
                break;
            }
        }while(true);
        return [r, c, -1];
    } 

    eraseRepeatPath(){
        let r, c, tag;
        do{
            [r, c, tag] = this.stack.top(); this.stack.pop(); 
            r = r - this.dir[tag][0];
            c = c - this.dir[tag][1];
            this.grid[r][c] = this.grid_color[r][c] = 1;
            this.fillCell([r, c], this.wall_color);
        }while(this.stack.top()[0] != this.current[0] || this.stack.top()[1] != this.current[1]);

        this.current = this.stack.top();
        this.previous = this.current;
        this.stack.push(this.current);
        this.grid[r][c] = 1;
        this.grid_color[r][c] = 2;
        this.fillCell([r, c], this.head_color);
    }

    getNextCell4(){
        if(!(this.current[0] & this.current[1] & 1)) return null;
        let next_cell = [];

        let pr = this.current[0] + this.dir[0][0];
        let pc = this.current[1] + this.dir[0][1];
        let nr = this.current[0] + 2 * this.dir[0][0];
        let nc = this.current[1] + 2 * this.dir[0][1];
        if(nr > 0) next_cell.push([[pr, pc, 0], [nr, nc, 0]]);
        
        pr = this.current[0] + this.dir[1][0];
        pc = this.current[1] + this.dir[1][1];
        nr = this.current[0] + 2 * this.dir[1][0];
        nc = this.current[1] + 2 * this.dir[1][1];
        if(nc < this.cols - 1) next_cell.push([[pr, pc, 1], [nr, nc, 1]]);

        pr = this.current[0] + this.dir[2][0];
        pc = this.current[1] + this.dir[2][1];
        nr = this.current[0] + 2 * this.dir[2][0];
        nc = this.current[1] + 2 * this.dir[2][1];
        if(nr < this.rows - 1) next_cell.push([[pr, pc, 2], [nr, nc, 2]]);

        pr = this.current[0] + this.dir[3][0];
        pc = this.current[1] + this.dir[3][1];
        nr = this.current[0] + 2 * this.dir[3][0];
        nc = this.current[1] + 2 * this.dir[3][1];
        if(nc > 0) next_cell.push([[pr, pc, 3], [nr, nc, 3]]);

        return next_cell.length ? next_cell[getRandInt(0, next_cell.length - 1)] : null;
    }

    wilsonGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        this.grid_color[this.current[0]][this.current[1]] = 2;
        this.fillCell(this.current, this.head_color);
        this.stack.push(this.current);
        if(this.previous.length){
            this.grid[this.previous[0]][this.previous[1]] = -1;
            this.grid_color[this.previous[0]][this.previous[1]] = 3;
            this.fillCell(this.previous, this.path_color);
        }
        this.previous = this.current;

        if(this.grid[this.current[0]][this.current[1]] == 0){
            this.previous = [];
            this.connectNewPath();
            this.current = this.randomBegin();
            if(!this.current){
                this.finishGenerate();
                return;
            }

            this.grid_color[this.current[0]][this.current[1]] = 2;
            this.fillCell(this.current, this.head_color);
        }else{
            if(this.grid[this.current[0]][this.current[1]] == -1){
                this.eraseRepeatPath();
            }
            let next = this.getNextCell4();
            if(next){
                this.current = next[0];
                this.next = next[1];
            }else{
                this.current = this.next;
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.wilsonGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Hunt-and-kill algorithm
    huntAndKillGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;
        this.current = [r, c];
        this.previous = [];
        this.next = [];
        this.begin_hunt = 1;
    }

    checkNeighbor([r, c]){
        if(!(r & c & 1)) return false;
        if(r - 2 >= 0 && !this.grid[r - 2][c]) return true;
        if(c + 2 <= this.cols - 1 && !this.grid[r][c + 2]) return true;
        if(r + 2 <= this.rows - 1 && !this.grid[r + 2][c]) return true;
        if(c - 2 >= 0 && !this.grid[r][c - 2]) return true;
        return false;
    }

    checkRowNeighbor(r){
        let temp = 0;
        for(let c=1; c<=this.cols-2; c+=2){
            if((temp |= this.grid[r][c]) && this.checkNeighbor([r, c])) return [r, c];
        }
        if(!temp && r == this.begin_hunt) this.begin_hunt += 2;
        return null;
    }

    connectNeighbor([r, c]){
        let neighbors = [];
        if(r - 2 >= 0 && !this.grid[r - 2][c]) neighbors.push([r - 1, c]);
        if(c + 2 <= this.cols - 1 && !this.grid[r][c + 2]) neighbors.push([r, c + 1]);
        if(r + 2 <= this.rows - 1 && !this.grid[r + 2][c]) neighbors.push([r + 1, c]);
        if(c - 2 >= 0 && !this.grid[r][c - 2]) neighbors.push([r, c - 1]);
        return neighbors[getRandInt(0, neighbors.length - 1)];
    }

    huntAndKillGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.current.length){
            this.grid[this.current[0]][this.current[1]] = 0;
            this.grid_color[this.current[0]][this.current[1]] = 2;
            this.fillCell(this.current, this.head_color);
            if(this.previous.length){
                this.grid[this.previous[0]][this.previous[1]] = 0;
                this.grid_color[this.previous[0]][this.previous[1]] = 0;
                this.fillCell(this.previous, this.road_color);
            }
            this.previous = this.current;

            if(this.current[0] & this.current[1] & 1){
                let next = this.getNextCell();
                if(next){
                    [this.current, this.next] = next;
                }else{
                    this.current = [];
                    this.hunt = this.begin_hunt;
                    this.connect = [];
                }
            }else{
                this.current = this.next;
            }
        }else{ // hunting
            if(this.connect.length){
                this.fillOriginBlock([this.hunt, 0], [this.hunt, this.cols - 1]);
                this.grid[this.connect[0]][this.connect[1]] = 0;
                this.grid_color[this.connect[0]][this.connect[1]] = 2;
                this.fillCell(this.connect, this.head_color);
                this.current = this.next;
                this.previous = this.connect;
            }else{
                if(this.previous.length){
                    this.grid[this.previous[0]][this.previous[1]] = 0;
                    this.grid_color[this.previous[0]][this.previous[1]] = 0;
                    this.fillCell(this.previous, this.road_color);
                    this.previous = [];
                }
                this.fillBlock([this.hunt, 0], [this.hunt, this.cols - 1], 2);
                if(this.hunt > 1){
                    this.fillOriginBlock([this.hunt - 2, 0], [this.hunt - 2, this.cols - 1]);
                }
    
                this.next = this.checkRowNeighbor(this.hunt);
                if(this.next){
                    this.connect = this.connectNeighbor(this.next);
                }else{
                    this.hunt += 2;
                }
    
                if(this.hunt > this.rows - 2){
                    this.fillOriginBlock([this.hunt - 2, 0], [this.hunt - 2, this.cols - 1]);
                    this.finishGenerate();
                    return;
                }
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.huntAndKillGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Growing Tree algorithm
    growingTreeGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;

        this.current = [r, c];
        this.next = [r, c];
        this.gq.clear();
        this.gq.push([this.current, this.current]);
        this.index = 0;
        this.delete = false;

        this.grid[r][c] = 0;
        this.grid_color[r][c] = 0;
        this.fillCell([r, c], this.path_color);
    }

    getNextCell5(py){
        if(this.gq.empty()) return null;
        let result = this.gq.get(py);
        while(true){
            if(this.gq.empty()) return null;
            result = this.gq.get(py);
            if(this.grid[result.element[1][0]][result.element[1][1]]) break;
            if(!this.grid[result.element[0][0]][result.element[0][1]] && 
                !this.grid[result.element[1][0]][result.element[1][1]]) break;
            this.gq.delete(result.index);
        }
        return result;
    }

    chooseRandomNeighbor([r, c]){
        let neighbors = [];
        if(r - 2 >= 0 && this.grid[r - 2][c]) neighbors.push([[r - 1, c], [r - 2, c]]);
        if(c + 2 <= this.cols - 1 && this.grid[r][c + 2]) neighbors.push([[r, c + 1], [r, c + 2]]);
        if(r + 2 <= this.rows - 1 && this.grid[r + 2][c]) neighbors.push([[r + 1, c], [r + 2, c]]);
        if(c - 2 >= 0 && this.grid[r][c - 2]) neighbors.push([[r, c - 1], [r, c - 2]]);
        return neighbors.length ? neighbors[getRandInt(0, neighbors.length - 1)] : null;
    }

    growingTreeGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.gq.empty()){
            this.grid[this.next[0]][this.next[1]] = 0;
            this.grid_color[this.next[0]][this.next[1]] = 0;
            this.fillCell(this.next, this.road_color);
            this.finishGenerate();
            return;
        }

        if(this.current[0] == this.next[0] && this.current[1] == this.next[1]){
            const next = this.chooseRandomNeighbor(this.current);
            if(next){
                [this.current, this.next] = next;
                this.grid[this.current[0]][this.current[1]] = 0;
                this.grid_color[this.current[0]][this.current[1]] = 3;
                this.fillCell(this.current, this.path_color);
                this.gq.push(next);
                this.delete = false;
            }else{
                [this.next, this.current] = this.gq.array[this.index];
                this.grid[this.current[0]][this.current[1]] = 0;
                this.grid_color[this.current[0]][this.current[1]] = 0;
                this.fillCell(this.current, this.road_color);
                this.gq.delete(this.index);
                this.delete = true;
            }
        }else{
            this.current = this.next;
            // const next = this.getNextCell5("newest");
            const next = this.getNextCell5(getRandInt(0, 3) ? "newest" : "random");
            // const next = this.getNextCell5(getRandInt(0, 1) ? "newest" : "random");
            // const next = this.getNextCell5(getRandInt(0, 1) ? "newest" : "oldest");
            // const next = this.getNextCell5(getRandInt(0, 1) ? "oldest" : "random");
            this.index = next.index;
            if(this.delete){
                this.grid[this.current[0]][this.current[1]] = 0;
                this.grid_color[this.current[0]][this.current[1]] = 0;
                this.fillCell(this.current, this.road_color);
                
                this.current = this.next = next.element[1];
            }else{
                this.grid[this.current[0]][this.current[1]] = 0;
                this.grid_color[this.current[0]][this.current[1]] = 3;
                this.fillCell(this.current, this.path_color);
                if(this.grid_color[next.element[1][0]][next.element[1][1]] == 3){
                    this.current = this.next = next.element[1];
                }else{
                    [this.current, this.next] = next.element;
                }
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.growingTreeGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Binary Tree algorithm
    binaryTreeGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.index = 0;
        this.current = [[1, 1]];
        this.previous = [];
    }

    getNextCell6([r, c]){
        if((c += 2) > this.cols - 1){
            r += 2;
            c = 1;
        }
        if(r - 2 >= 0 && c - 2 >= 0){
            return [[[r - 1, c], [r, c]], [[r, c - 1], [r, c]]][getRandInt(0, 1)];
        }
        if(r - 2 >= 0) return [[r - 1, c], [r, c]];
        if(c - 2 >= 0) return [[r, c - 1], [r, c]];
        return [[r, c]];
    }

    binaryTreeGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }
      
        this.grid[this.current[this.index][0]][this.current[this.index][1]] = 0;
        this.grid_color[this.current[this.index][0]][this.current[this.index][1]] = 2;
        this.fillCell(this.current[this.index], this.head_color);
        if(this.previous.length){
            this.grid_color[this.previous[0]][this.previous[1]] = 0;
            this.fillCell(this.previous, this.road_color);
        }  
        this.previous = this.current[this.index];
        
        if(this.current[this.index][0] == this.rows - 2 && 
           this.current[this.index][1] == this.cols - 2){
            this.finishGenerate();
            return;
        }
        
        if(this.index == this.current.length - 1){
            this.current = this.getNextCell6(this.current[this.index]);
            this.index = 0;
        }else{
            ++this.index;
        }

        if(!this.step) timeout = setTimeout(() => { this.binaryTreeGenerate(); }, interval);
    }

    // ------------------------------------------------------------ // Sidewinder algorithm
    sidewinderGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.runset = [];
        this.index = 0;
        this.current = [[1, 1]];
        this.previous = [];
        this.next = [];
        this.set_link = false;
    }

    getNextCell7([r, c]){
        if((c += 2) > this.cols - 2){
            r += 2;
            c = 1;
        }
        return [[r, c]];
    }

    getRunsetLink(){
        let r = getRandInt(0, this.runset.length - 1);
        return [[this.runset[r][0] - 1, this.runset[r][1]]];
    }

    sidewinderGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        this.grid[this.current[this.index][0]][this.current[this.index][1]] = 0;
        this.grid_color[this.current[this.index][0]][this.current[this.index][1]] = 2;
        this.fillCell(this.current[this.index], this.head_color);
        if(this.previous.length){
            this.grid_color[this.previous[0]][this.previous[1]] = 0;
            this.fillCell(this.previous, this.road_color);
        }  
        this.previous = [this.current[this.index][0], this.current[this.index][1]];

        if(this.index == this.current.length - 1){
            if(this.set_link){
                this.grid_color[this.current[this.index][0] + 1][this.current[this.index][1]] = 0;
                this.fillCell(this.current, this.road_color);
                this.current = this.next;
                this.set_link = false;

                if(this.current[0][0] > this.rows - 2){
                    this.grid_color[this.previous[0]][this.previous[1]] = 0;
                    this.fillCell(this.previous, this.road_color);
                    this.runset = [];
                    this.current = this.previous = this.next = [];
                    this.finishGenerate();
                    return;
                }
            }else{
                this.runset.push(this.current[this.index]);
                if(this.current[this.index][0] > 1 && 
                   (this.current[this.index][1] == this.cols - 2 || getRandInt(0, 1))){
                    this.next = this.getNextCell7(this.current[this.index]);
                    this.current = this.getRunsetLink();
                    this.runset = [];
                    this.set_link = true;
                }else if(this.current[this.index][1] + 2 <= this.cols - 2){
                    let [r, c] = this.current[this.index];
                    this.current = [[r, c + 1], [r, c + 2]];
                }else{
                    this.current = this.getNextCell7(this.current[this.index]);
                    this.runset = [];
                }
            }
            this.index = 0;
        }else{
            ++this.index;
        }     

        if(!this.step) timeout = setTimeout(() => { this.sidewinderGenerate(); }, interval);
    }
// -------------------------------------------------------------------------------- //


// ------------------------------------------------------------ // A Star algorithm
    aStarGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.weight = getMatrix(this.rows, this.cols, 0);
        for(let i=1; i<this.rows; i+=2){
            for(let j=1; j<this.cols; j+=2){
                this.weight[i+1][j] = getRandInt(1, 6);
                this.weight[i][j+1] = getRandInt(1, 6);
            }
        }
        let r = (getRandInt(1, (this.rows - 1) / 2)) * 2 - 1;
        let c = (getRandInt(1, (this.cols - 1) / 2)) * 2 - 1;
        this.grid[r][c] = 0;
        this.linkPoints = [[r, c]];
        this.unlinkPoints = [];
        for(let i=1; i<this.rows; i+=2){
            for(let j=1; j<this.cols; j+=2){
                this.unlinkPoints.push([i, j]);
            }
        }
        this.finish = false;
        this.isAStar = false;
        this.isFind = false;
        this.isLink = true;
    }

    selectTwoPoints(){
        do{
            if(this.unlinkPoints.length == 0) return false; 
            let last = this.unlinkPoints.length - 1;
            let rand_index = getRandInt(0, last);
            this.begin = this.unlinkPoints[rand_index];
            this.unlinkPoints[rand_index] = this.unlinkPoints[last];
            this.unlinkPoints.pop();
            // console.log("select begin: " + this.begin + " = " + this.grid[this.begin[0]][this.begin[1]]);
        }while(this.grid[this.begin[0]][this.begin[1]] == 0);

        let last = this.linkPoints.length - 1;
        let rand_index = getRandInt(0, last);
        this.end = this.linkPoints[rand_index];

        this.grid_color[this.begin[0]][this.begin[1]] = 5;
        this.fillCell(this.begin, this.begin_color, 1);

        this.grid_color[this.end[0]][this.end[1]] = 6;
        this.fillCell(this.end, this.end_color, 1);

        return true;
    }

    aStarInit(){
        this.isAStar = true;
        this.isFind = false;
        this.isLink = false;
        this.isLinkRoad = false;
        this.current = [];
        this.visitPoints = [];
        this.pq.clear();
        this.pq.setCompare((a, b) => a[3] + a[4] < b[3] + b[4]);
        this.pq.push([this.begin[0], this.begin[1], -1, 0, 0]);
    }

    aStarFind(){
        let next_pq = [];
        let dis = this.pq.front()[3] + this.pq.front()[4];
        while(this.pq.size() && (this.pq.front()[3] + this.pq.front()[4]) == dis){
            this.current = this.pq.front(); this.pq.pop();

            if(this.grid[this.current[0]][this.current[1]] == -2){
                this.grid[this.current[0]][this.current[1]] = this.current[2];
                let d = this.current[2] - 2;
                this.previous = [this.current[0] - this.dir[d][0], this.current[1] - this.dir[d][1]];
                this.grid[this.previous[0]][this.previous[1]] = this.current[2];
                this.grid_color[this.previous[0]][this.previous[1]] = 4;
                this.fillCell(this.previous, this.visit_color);
                // console.log("previous: " + this.previous);
                this.grid[this.previous[0]][this.previous[1]] = this.current[2];
                this.isLinkRoad = true;
                this.isAStar = false;
                this.isFind = true;
                // console.warn("empty find");
                this.pq.clear();
                // this.pq.push([-1]);
                this.update_cell();
                break;
            }

            this.grid[this.current[0]][this.current[1]] = this.current[2];
            this.grid_color[this.current[0]][this.current[1]] = 4;
            this.fillCell(this.current, this.visit_color);
            this.visitPoints.push(this.current);

            // console.log("current: " + this.current);

            let d = this.current[2] - 2;
            if(d >= 0){
                this.previous = [this.current[0] - this.dir[d][0], this.current[1] - this.dir[d][1]];
                // console.log("previous: " + this.previous);
                this.grid[this.previous[0]][this.previous[1]] = this.current[2];
                this.grid_color[this.previous[0]][this.previous[1]] = 4;
                this.fillCell(this.previous, this.visit_color);
                this.visitPoints.push(this.previous);
            }

            // if(this.current[0] == this.end[0] && this.current[1] == this.end[1]){
            //     this.isAStar = false;
            //     this.isFind = true;
            //     this.pq.clear();
            //     // this.pq.push([-1]);
            //     this.update_cell();
            //     break;
            // }

            let minDis = 2147483647;
            for(let i=0; i<4; ++i){
                let nr = this.current[0] + (this.dir[i][0] << 1);
                let nc = this.current[1] + (this.dir[i][1] << 1);
    
                if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
                if(this.grid[nr][nc] != 1 && this.grid[nr][nc] != 0) continue;

                let er = this.current[0] + this.dir[i][0];
                let ec = this.current[1] + this.dir[i][1];

                this.grid[nr][nc] = (this.grid[nr][nc] ? -1 : -2);
                this.visitPoints.push([er, ec]);
                this.visitPoints.push([nr, nc]);


                let euclideanDis = this.getEuclidean([nr, nc], this.end);
                let gDis = this.current[3] + this.weight[er][ec];
                minDis = Math.min(minDis, gDis + euclideanDis);
                /*
                next_pq.push([nr, nc, this.dir_tag[i], this.current[3] + 1, this.getManhattan([nr, nc], this.end)]);
                //*/
                //*
                next_pq.push([nr, nc, this.dir_tag[i], gDis, euclideanDis]);
                //*/
                /*
                next_pq.push([nr, nc, this.dir_tag[i], this.current[3] + getRandInt(1, 8), this.getEuclidean([nr, nc], this.end)]);
                //*/
            }

            if(minDis < dis){
                // console.log("break");
                break;
            }
        }

        for(let i=0; i<next_pq.length; ++i){
            this.pq.push(next_pq[i]);
        }
    }

    aStarLink(){
        this.grid[this.current[0]][this.current[1]] = 0;
        this.grid_color[this.current[0]][this.current[1]] = 2;
        this.fillCell(this.current, this.head_color);
        if(this.current[0] != this.end[0] || this.current[1] != this.end[1]){
            this.grid[this.previous[0]][this.previous[1]] = 0;
            this.grid_color[this.previous[0]][this.previous[1]] = 0;
            this.fillCell(this.previous, this.road_color);
        }
        if(this.current[0] == this.begin[0] && this.current[1] == this.begin[1]){
            this.pq.clear();
            this.grid_color[this.current[0]][this.current[1]] = 3;
            this.fillCell(this.current, this.path_color);

            this.grid[this.begin[0]][this.begin[1]] = 0;
            this.grid_color[this.begin[0]][this.begin[1]] = 0;
            this.fillCell(this.begin, this.road_color, 1);
            this.linkPoints.push(this.begin);
            // console.log("add link: " + this.begin);

            this.grid[this.end[0]][this.end[1]] = 0;
            this.grid_color[this.end[0]][this.end[1]] = 0;
            this.fillCell(this.end, this.road_color, 1);

            for(let i=0; i<this.visitPoints.length; ++i){
                let r = this.visitPoints[i][0];
                let c = this.visitPoints[i][1];
                if(this.grid_color[r][c]){
                    this.grid[r][c] = this.grid_color[r][c] = 1;
                    this.fillCell(this.visitPoints[i], this.wall_color);
                }else{
                    this.grid[r][c] = this.grid_color[r][c] = 0;
                }
            }

            this.isLink = true;
            return;
        }else if((this.current[0] & 1) && (this.current[1] & 1)){
            this.linkPoints.push(this.current);
            // console.log("add link: " + this.current);
        }
        this.update_cell();
    }

    aStarGenerate(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.isLink){
            let isSelect = this.selectTwoPoints();
            
            if(isSelect){
                this.aStarInit();
                this.aStarFind();
            }else{
                this.weight = [];
                this.isAStar = false;
                this.isFind = false;
                this.isLink = true;
                this.finishGenerate();
                return;
            }
        }else if(this.isAStar){
            this.aStarFind();
        }else if(this.isFind){
            this.aStarLink();
        }

        if(!this.step) timeout = setTimeout(() => { this.aStarGenerate(); }, interval);
    }

// -------------------------------------------------------------------------------- //


// -------------------------------------------------------------------------------- // maze solving
    getManhattan(a, b){ return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); }
    
    getEuclidean(a, b){ 
        let answer = Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
        return Math.round(answer * 100) / 100; 
    }
    
    solve(algorithm){
        this.clearRoad();
       
        if(this.begin.length == 0 && this.end.length == 0){
            alert("Begin and end point isn't setting!");
            this.finish = true;
            return;
        }
        if(this.begin.length == 0){
            alert("Begin point isn't setting!");
            this.finish = true;
            return;
        }
        if(this.end.length == 0){
            alert("End point isn't setting!");
            this.finish = true;
            return;
        }

        this.reset = false;
        this.finish = false;

        this.stack.clear();
        this.queue.clear();
        this.pq.clear();

        switch(algorithm){
            case "dfs":
                this.dfsSolveInit();
                this.dfsSolve();
                break;
            case "bfs":
                this.bfsSolveInit();
                this.bfsSolve();
                break;
            case "btfs":
                this.btfsSolveInit();
                this.btfsSolve();
                break;
            case "astar":
                this.astarSolveInit();
                this.astarSolve();
                break;
        }
    }
    // ------------------------------------------------------------ // Depth-First Search solve
    dfsSolveInit(){
        this.previous = [];
        this.current = this.begin;
    }

    getNextCell2(){
        for(let i=0; i<4; ++i){
            let nr = this.current[0] + this.dir[i][0];
            let nc = this.current[1] + this.dir[i][1];

            if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            if(this.grid[nr][nc] != 0) continue;

            return [nr, nc];
        }

        return null;
    }

    dfsSolve(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        this.grid_color[this.current[0]][this.current[1]] = 2;
        this.fillCell(this.current, this.head_color);
        if(this.previous.length){
            if(this.back){
                this.grid_color[this.previous[0]][this.previous[1]] = 4;
                this.fillCell(this.previous, this.visit_color);
            }else{
                this.grid_color[this.previous[0]][this.previous[1]] = 3;
                this.fillCell(this.previous, this.path_color);
            }
        }
        this.grid[this.current[0]][this.current[1]] = 2;
        this.previous = this.current;
        this.next = this.getNextCell2();

        if(this.current[0] == this.end[0] && this.current[1] == this.end[1]){
            this.grid_color[this.current[0]][this.current[1]] = 3;
            this.fillCell(this.current, this.path_color);
            this.finish = true;
            clearTimeout(timeout);
            return;
        }

        if(this.next){
            this.stack.push(this.current);
            this.current = this.next;
            this.back = false;
        }else{
            if(this.stack.empty()){
                alert("The maze is no solution.");
                this.finish = true;
                clearTimeout(timeout);
                return;
            }
            this.current = this.stack.top();
            this.stack.pop();
            this.back = true;
        }

        if(!this.step) timeout = setTimeout(() => { this.dfsSolve(); }, interval);
    }

    // ------------------------------------------------------------ // Breath-First Search solve
    bfsSolveInit(){
        this.find = false;
        this.current = [];
        this.queue.push([this.begin[0], this.begin[1], -1]); 
    }

    update_cell(){
        let tag = this.current[2] - 2;
        let pr = this.current[0] - this.dir[tag][0];
        let pc = this.current[1] - this.dir[tag][1];
        this.previous = [this.current[0], this.current[1]];
        this.current = [pr, pc, this.grid[pr][pc]];
    }

    bfsSolve(){   
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.queue.empty()){
            alert("The maze is no solution.");
            this.finish = true;
            clearTimeout(timeout);
            return;
        }

        if(this.find){
            this.grid_color[this.current[0]][this.current[1]] = 2;
            this.fillCell(this.current, this.head_color);
            if(this.current[0] != this.end[0] || this.current[1] != this.end[1]){
                this.grid_color[this.previous[0]][this.previous[1]] = 3;
                this.fillCell(this.previous, this.path_color);
            }
            if(this.current[0] == this.begin[0] && this.current[1] == this.begin[1]){
                this.queue.clear();
                this.grid_color[this.current[0]][this.current[1]] = 3;
                this.fillCell(this.current, this.path_color);
                this.finish = true;
                clearTimeout(timeout);
                return;
            }
            this.update_cell();
        }else{
            let next_queue = [];

            while(this.queue.size()){
                this.current = this.queue.front(); this.queue.pop();
                //*
                this.grid[this.current[0]][this.current[1]] = this.current[2];
                this.grid_color[this.current[0]][this.current[1]] = 4;
                this.fillCell(this.current, this.visit_color);
                //*/

                /*
                this.grid[this.current[0]][this.current[1]] = this.current[2];
                this.grid_color[this.current[0]][this.current[1]] = 3;
                this.fillCell(this.current, this.head_color);

                if(this.current[2] != -1){
                    let tag = this.current[2] - 2;
                    let pr = this.current[0] - this.dir[tag][0];
                    let pc = this.current[1] - this.dir[tag][1];
                    this.grid_color[pr][pc] = 4;
                    this.fillCell([pr, pc], this.visit_color);
                }
                //*/

                if(this.current[0] == this.end[0] && this.current[1] == this.end[1]){
                    this.find = true;
                    this.queue.clear();
                    this.queue.push([-1]);
                    this.update_cell();
                    break;
                }

                for(let i=0; i<4; ++i){
                    let nr = this.current[0] + this.dir[i][0];
                    let nc = this.current[1] + this.dir[i][1];
        
                    if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
                    if(this.grid[nr][nc] != 0) continue;

                    this.grid[nr][nc] = -1;
                    next_queue.push([nr, nc, this.dir_tag[i]]);
                }
            }

            for(let i=0; i<next_queue.length; ++i){
                this.queue.push(next_queue[i]);
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.bfsSolve(); }, interval);
    }

    // ------------------------------------------------------------ // Best-Fisrt Search solve
    btfsSolveInit(){
        this.find = false;
        this.current = [];
        this.pq.setCompare((a, b) => a[3] < b[3]);
        this.pq.push([this.begin[0], this.begin[1], -1, 0]);
    }

    btfsSolve(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.pq.empty()){
            alert("The maze is no solution.");
            this.finish = true;
            clearTimeout(timeout);
            return;
        }

        if(this.find){
            this.grid_color[this.current[0]][this.current[1]] = 2;
            this.fillCell(this.current, this.head_color);
            if(this.current[0] != this.end[0] || this.current[1] != this.end[1]){
                this.grid_color[this.previous[0]][this.previous[1]] = 3;
                this.fillCell(this.previous, this.path_color);
            }
            if(this.current[0] == this.begin[0] && this.current[1] == this.begin[1]){
                this.pq.clear();
                this.grid_color[this.current[0]][this.current[1]] = 3;
                this.fillCell(this.current, this.path_color);
                this.finish = true;
                clearTimeout(timeout);
                return;
            }
            this.update_cell();
        }else{
            let next_pq = [];
            let dis = this.pq.front()[3];
            while(this.pq.size() && this.pq.front()[3] == dis){
                this.current = this.pq.front(); this.pq.pop();
                this.grid[this.current[0]][this.current[1]] = this.current[2];
                this.grid_color[this.current[0]][this.current[1]] = 4;
                this.fillCell(this.current, this.visit_color);

                if(this.current[0] == this.end[0] && this.current[1] == this.end[1]){
                    this.find = true;
                    this.pq.clear();
                    this.pq.push([-1]);
                    this.update_cell();
                    break;
                }

                let minDis = this.rows + this.cols;
                for(let i=0; i<4; ++i){
                    let nr = this.current[0] + this.dir[i][0];
                    let nc = this.current[1] + this.dir[i][1];
        
                    if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
                    if(this.grid[nr][nc] != 0) continue;

                    this.grid[nr][nc] = -1;

                    let euclideanDis = this.getEuclidean([nr, nc], this.end);
                    minDis = Math.min(minDis, euclideanDis);
                    /*
                    next_pq.push([nr, nc, this.dir_tag[i], this.getManhattan([nr, nc], this.end)]);
                    //*/
                    //*
                    next_pq.push([nr, nc, this.dir_tag[i], euclideanDis]);
                    //*/
                }

                if(minDis < dis) break;
            }

            for(let i=0; i<next_pq.length; ++i){
                this.pq.push(next_pq[i]);
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.btfsSolve(); }, interval);
    }
    // ------------------------------------------------------------ // A-Star Search solve
    astarSolveInit(){
        this.find = false;
        this.current = [];
        this.pq.setCompare((a, b) => a[3] + a[4] < b[3] + b[4]);
        this.pq.push([this.begin[0], this.begin[1], -1, 0, 0]);
    }

    astarSolve(){
        if(this.reset){
            clearTimeout(timeout);
            return;
        }

        if(this.pq.empty()){
            alert("The maze is no solution.");
            this.finish = true;
            clearTimeout(timeout);
            return;
        }

        if(this.find){
            this.grid_color[this.current[0]][this.current[1]] = 2;
            this.fillCell(this.current, this.head_color);
            if(this.current[0] != this.end[0] || this.current[1] != this.end[1]){
                this.grid_color[this.previous[0]][this.previous[1]] = 3;
                this.fillCell(this.previous, this.path_color);
            }
            if(this.current[0] == this.begin[0] && this.current[1] == this.begin[1]){
                this.pq.clear();
                this.grid_color[this.current[0]][this.current[1]] = 3;
                this.fillCell(this.current, this.path_color);
                this.finish = true;
                clearTimeout(timeout);
                return;
            }
            this.update_cell();
        }else{
            let next_pq = [];
            let dis = this.pq.front()[3] + this.pq.front()[4];
            while(this.pq.size() && (this.pq.front()[3] + this.pq.front()[4]) == dis){
                this.current = this.pq.front(); this.pq.pop();
                this.grid[this.current[0]][this.current[1]] = this.current[2];
                this.grid_color[this.current[0]][this.current[1]] = 4;
                this.fillCell(this.current, this.visit_color);

                if(this.current[0] == this.end[0] && this.current[1] == this.end[1]){
                    this.find = true;
                    this.pq.clear();
                    this.pq.push([-1]);
                    this.update_cell();
                    break;
                }

                let minDis = 2147483647;
                for(let i=0; i<4; ++i){
                    let nr = this.current[0] + this.dir[i][0];
                    let nc = this.current[1] + this.dir[i][1];
        
                    if(nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
                    if(this.grid[nr][nc] != 0) continue;

                    this.grid[nr][nc] = -1;

                    let euclideanDis = this.getEuclidean([nr, nc], this.end);
                    minDis = Math.min(minDis, this.current[3] + 1 + euclideanDis);
                    /*
                    next_pq.push([nr, nc, this.dir_tag[i], this.current[3] + 1, this.getManhattan([nr, nc], this.end)]);
                    //*/
                    //*
                    next_pq.push([nr, nc, this.dir_tag[i], this.current[3] + 1, euclideanDis]);
                    //*/
                }

                if(minDis < dis) break;
            }

            for(let i=0; i<next_pq.length; ++i){
                this.pq.push(next_pq[i]);
            }
        }

        if(!this.step) timeout = setTimeout(() => { this.astarSolve(); }, interval);
    }
// -------------------------------------------------------------------------------- //
}
