


let timer, timer2;
let done, times;
let button_click = document.getElementById("button-click");
button_click.style.display = "none";
button_click.style.opacity = 0;


class FadeInMaze {
    constructor(ctx, rows = 19, cols = 19){
        this.ctx = ctx;

        // this.origin_road_color = "#eeeeee";
        this.origin_road_color = "#2b2b2b";
        this.origin_wall_color = "rgba(43, 43, 43, 1)";
        // this.origin_wall_color = "#ffffff";
        this.origin_head_color = "#61dfff";
        this.origin_path_color = "#ffa3c3";
        this.origin_visit_color = "#bdb7ab";
        this.origin_begin_color = "#00ff00";
        this.origin_end_color = "#ff0000";
        // this.origin_line_color = "#909598";
        this.origin_line_color = "#ffffff";
        // this.origin_line_color = "#000000";
        // this.origin_line_color = "rgba(255, 255, 255, .5)";

        this.road_color = this.origin_road_color;
        this.wall_color = this.origin_wall_color;
        this.head_color = this.origin_head_color;
        this.path_color = this.origin_path_color;
        this.visit_color = this.origin_visit_color;
        this.begin_color = this.origin_begin_color;
        this.end_color = this.origin_end_color;
        this.line_color = this.origin_line_color;

        this.gap = 0;
        this.line_gap = 1;
        this.rows = rows;
        this.cols = cols;
        this.line_height;
        this.line_width;
        this.cell_size;
        this.offset_y;
        this.offset_x;
        this.max_rows; 
        this.max_cols;

        this.grid;
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

        this.finish;
        this.current;
        this.previous;
        this.begin;
        this.end;

        // flood
        this.rainbow_colors;
        this.flood_color;
        this.queue = new Queue();

        // traversal
        this.edges;
        this.edge_count;
        this.point_count;
        this.top = 1;
        this.bottom = 2;
        this.left = 3;
        this.right = 4;

        // kruskal and traversal
        this.djs = new DisjointSet();
        
        this.init(rows, cols, 1);
    }

    init(rows = this.rows, cols = this.cols, fill = 0){
        this.rows = rows;
        this.cols = cols;
        this.line_height = (rows + 1) * this.line_gap;
        this.line_width = (cols + 1) * this.line_gap;
        this.cell_size = Math.min(Math.floor((height - this.gap - this.line_height) / this.rows), 
                                  Math.floor((width - this.gap - this.line_width) / this.cols));
        this.offset_y = Math.round((height - this.rows * this.cell_size - this.line_height) / 2);
        this.offset_x = Math.round((width - this.cols * this.cell_size - this.line_width) / 2);
        this.max_rows = Math.floor((height - this.gap - this.line_gap) / (this.line_gap + 2)); 
        if(this.max_rows & 1 ^ 1) --this.max_rows;
        this.max_cols = Math.floor((width - this.gap - this.line_gap) / (this.line_gap + 2)); 
        if(this.max_cols & 1 ^ 1) --this.max_cols;

        this.grid = [];
        for(let r=0; r<this.rows; ++r){
            let array = [];
            for(let c=0; c<this.cols; ++c){
                array.push(new Cell(maze_shape[r][c] == 0));
            }
            this.grid.push(array);
        }

        this.ctx.fillStyle = this.cell_colors[fill];
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillRect(0, 0, width, height);

        this.finish = true;
    }

    resize(rows = this.rows, cols = this.cols){
        this.rows = rows;
        this.cols = cols;
        this.line_height = (rows + 1) * this.line_gap;
        this.line_width = (cols + 1) * this.line_gap;
        this.cell_size = Math.min(Math.floor((height - this.gap - this.line_height) / this.rows), 
                                  Math.floor((width - this.gap - this.line_width) / this.cols));
        this.offset_y = Math.round((height - this.rows * this.cell_size - this.line_height) / 2);
        this.offset_x = Math.round((width - this.cols * this.cell_size - this.line_width) / 2);
        this.max_rows = Math.floor((height - this.gap - this.line_gap) / (this.line_gap + 2)); 
        if(this.max_rows & 1 ^ 1) --this.max_rows;
        this.max_cols = Math.floor((width - this.gap - this.line_gap) / (this.line_gap + 2)); 
        if(this.max_cols & 1 ^ 1) --this.max_cols;
        
        this.drawGrid();
    }

    fillCell([r, c], color){
        this.ctx.clearRect(this.offset_x + c * this.cell_size + (c + 1) * this.line_gap,
                      this.offset_y + r * this.cell_size + (r + 1) * this.line_gap,
                      this.cell_size,
                      this.cell_size);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.offset_x + c * this.cell_size + (c + 1) * this.line_gap,
                     this.offset_y + r * this.cell_size + (r + 1) * this.line_gap,
                     this.cell_size,
                     this.cell_size);
    }

    drawTop([r, c], road_color){
        this.ctx.fillStyle = (this.grid[r][c].top ? this.line_color : road_color);
        this.ctx.fillRect(this.offset_x + c * this.cell_size + (c + 1) * this.line_gap,
                        this.offset_y + r * this.cell_size + r * this.line_gap,
                        this.cell_size,
                        this.line_gap);
    }

    drawBottom([r, c], road_color){
        this.ctx.fillStyle = (this.grid[r][c].bottom ? this.line_color : road_color);
        this.ctx.fillRect(this.offset_x + c * this.cell_size + (c + 1) * this.line_gap,
                        this.offset_y + (r + 1) * this.cell_size + (r + 1) * this.line_gap,
                        this.cell_size,
                        this.line_gap);
    }

    drawLeft([r, c], road_color){
        this.ctx.fillStyle = (this.grid[r][c].left ? this.line_color : road_color);
        this.ctx.fillRect(this.offset_x + c * this.cell_size + c * this.line_gap,
                        this.offset_y + r * this.cell_size + (r + 1) * this.line_gap,
                        this.line_gap,
                        this.cell_size);
    }

    drawRight([r, c], road_color){
        this.ctx.fillStyle = (this.grid[r][c].right ? this.line_color : road_color);
        this.ctx.fillRect(this.offset_x + (c + 1) * this.cell_size + (c + 1) * this.line_gap,
                        this.offset_y + r * this.cell_size + (r + 1) * this.line_gap,
                        this.line_gap,
                        this.cell_size);
    }

    drawFourPoint([r, c]){
        this.ctx.fillStyle = this.grid[r][c].empty ? this.line_color : this.wall_color;
        this.ctx.fillRect(this.offset_x + c * this.cell_size + c * this.line_gap,
                     this.offset_y + r * this.cell_size + r * this.line_gap,
                     this.line_gap,
                     this.line_gap);
        this.ctx.fillRect(this.offset_x + (c + 1) * this.cell_size + (c + 1) * this.line_gap,
                     this.offset_y + r * this.cell_size + r * this.line_gap,
                     this.line_gap,
                     this.line_gap);
        this.ctx.fillRect(this.offset_x + c * this.cell_size + c * this.line_gap,
                     this.offset_y + (r + 1) * this.cell_size + (r + 1) * this.line_gap,
                     this.line_gap,
                     this.line_gap);
        this.ctx.fillRect(this.offset_x + (c + 1) * this.cell_size + (c + 1) * this.line_gap,
                     this.offset_y + (r + 1) * this.cell_size + (r + 1) * this.line_gap,
                     this.line_gap,
                     this.line_gap);
    }

    drawCell([r, c], cell_color, line_color = this.road_color){
        /*
        this.ctx.clearRect(this.offset_x + c * this.cell_size + c * this.line_gap,
                      this.offset_y + r * this.cell_size + r * this.line_gap,
                      this.cell_size + (this.line_gap << 1),
                      this.cell_size + (this.line_gap << 1));
        //*/
        this.fillCell([r, c], cell_color);
        this.drawTop([r, c], line_color);
        this.drawBottom([r, c], line_color);
        this.drawLeft([r, c], line_color);
        this.drawRight([r, c], line_color);
        this.drawFourPoint([r, c]);
    }

    drawGrid(){
        this.ctx.fillStyle = this.wall_color;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillRect(0, 0, width, height);
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                if(this.grid[r][c].empty){
                    if(this.flood_color && this.flood_color.length){
                        if(this.grid[r][c].visit){
                            this.drawCell([r, c], this.rainbow_colors[this.flood_color[r][c]], 
                                          this.rainbow_colors[this.flood_color[r][c]]);
                        }else{
                            this.drawCell([r, c], this.cell_colors[this.grid[r][c].color]);
                        }
                    }else{
                        this.drawCell([r, c], this.cell_colors[this.grid[r][c].color]);
                    }
                }
            }
        }
    }

// -------------------------------------------------------------------------------- // maze generate
    generate(algorithm){
        let isflood = false;
        switch(algorithm){
            case "traversal":
                this.traversalGenerateInit();
                timer = d3.timer(function(){
                    done = false, times = 0;
                    while(++times <= 30 && !(done = maze.traversalGenerate()));
                    if(done){
                        isflood = true;
                        maze.floodInit();
                        timer.stop();
                    }
                });
                break;
            case "kruskal":
                this.kruskalGenerateInit();
                timer = d3.timer(function(){
                    done = false, times = 0;
                    while(++times <= 35 && !(done = maze.kruskalGenerate()));
                    if(done){
                        isflood = true;
                        maze.floodInit();
                        // maze.floodImageColorInit();
                        timer.stop();
                    }
                });
                break;
        }

        //*
        timer2 = d3.timer(function(){
            if(!isflood) return;
            done = false, times = 0;
            while(++times <= 2 && !(done = maze.flood()));
            if(done){
                timer2.stop();

                if(button_click.style.display == "none"){
                    let opacity = 0;
                    button_click.style.display = "block";
                    let interval2 = setInterval(function(){
                        opacity += 0.01;
                        button_click.style.opacity = opacity;
                        if(opacity >= 1){
                            clearInterval(interval2);
                        }
                    }, 10);
                }
            }
        });
        //*/
    }

    setNewCell([r, c], [r2, c2]){
        this.grid[r][c].empty = true;

        if(r > r2){
            this.grid[r][c].bottom = false;
            this.grid[r][c].top = false;
            this.grid[r2][c2].bottom = false;
        }else if(r < r2){
            this.grid[r][c].top = false;
            this.grid[r][c].bottom = false;
            this.grid[r2][c2].top = false;
        }else if(c > c2){
            this.grid[r][c].right = false;
            this.grid[r][c].left = false;
            this.grid[r2][c2].right = false;
        }else if(c < c2){
            this.grid[r][c].left = false;
            this.grid[r][c].right = false;
            this.grid[r2][c2].left = false;
        }

        this.drawCell([r, c], this.road_color);
    }

    finishGenerate(){
        //* maze
        this.begin = [56, 0];
        this.setNewCell(this.begin, [56, 1]);
        this.end = [43, 181];
        this.setNewCell(this.end, [43, 180]);
        //*/ 
        /* cat
        this.grid[38][9].empty = true;
        this.grid[38][9].left = false;
        this.grid[38][9].right = false;
        this.grid[38][10].left = false;
        this.drawCell([38, 9], this.road_color);
        this.grid[32][111].empty = true;
        this.grid[32][111].left = false;
        this.grid[32][111].right = false;
        this.grid[32][110].right = false;
        this.drawCell([32, 111], this.road_color);
        //*/
        /* badminton
        this.grid[113][0].empty = true;
        this.grid[113][0].left = false;
        this.grid[113][0].right = false;
        this.grid[113][1].left = false;
        this.drawCell([113, 0], this.road_color);
        this.grid[24][122].empty = true;
        this.grid[24][122].left = false;
        this.grid[24][122].right = false;
        this.grid[24][121].right = false;
        this.drawCell([24, 122], this.road_color);
        //*/
        /* mark
        this.begin = [146, 0];
        this.setNewCell(this.begin, [146, 1]);
        this.end = [0, 54];
        this.setNewCell(this.end, [1, 54]);
        //*/
        /* hippo
        this.begin = [19, 0];
        this.setNewCell(this.begin, [19, 1]);
        this.end = [85, 236];
        this.setNewCell(this.end, [85, 235]);
        //*/ 

        this.finish = true;
    }

    // ------------------------------------------------------------ // Random traversal generation
    traversalGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;

        this.previous = [];
        this.point_count = 0;
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                if(this.grid[r][c].empty){
                    ++this.point_count;
                }
            }
        }
        this.edge_count = 1;
        this.edges = [];
        //* maze
        this.edges.push([[56, 1], [56, 1]]);
        //*/
        /* cat
        this.edges.push([[38, 10], [38, 10]]);
        //*/
        /* badminton
        this.edges.push([[113, 1], [113, 1]]);
        //*/
        /* mark
        this.edges.push([[146, 1], [146, 1]]);
        //*/
    }

    swap(i, j){
        let temp = this.edges[i];
        this.edges[i] = this.edges[j];
        this.edges[j] = temp;
    }

    traversalGenerate(){
        if(this.edge_count > this.point_count){
            this.edges = [];
            this.finishGenerate();
            return true;
        }

        let a, b;
        do{
            let rand = getRandInt(0, this.edges.length - 1);
            this.swap(rand, this.edges.length - 1);
            [a, b] = this.edges[this.edges.length - 1];
            this.edges.pop();
        }while(this.grid[b[0]][b[1]].empty == false || this.grid[b[0]][b[1]].visit);

        let d = 0;
        if(a[0] > b[0]) d = this.top;
        else if(a[0] < b[0]) d = this.bottom;
        else if(a[1] > b[1]) d = this.left;
        else if(a[1] < b[1]) d = this.right;

        this.grid[a[0]][a[1]].visit = true;
        this.grid[b[0]][b[1]].visit = true;
        this.grid[a[0]][a[1]].color = 0;
        this.grid[b[0]][b[1]].color = 0;

        if(d == this.top){
            this.grid[a[0]][a[1]].top = false;
            this.grid[b[0]][b[1]].bottom = false;
        }else if(d == this.bottom){
            this.grid[a[0]][a[1]].bottom = false;
            this.grid[b[0]][b[1]].top = false;
        }else if(d == this.left){
            this.grid[a[0]][a[1]].left = false;
            this.grid[b[0]][b[1]].right = false;
        }else if(d == this.right){
            this.grid[a[0]][a[1]].right = false;
            this.grid[b[0]][b[1]].left = false;
        }
        //*
        this.drawCell(a, this.road_color);
        this.drawCell(b, this.road_color);
        //*/
        /*
        this.drawCell(a, 
            this.getRGBString(maze_shape_color[a[0]][a[1]]),
            this.getRGBString(maze_shape_color[a[0]][a[1]]));
        this.drawCell(b, 
            this.getRGBString(maze_shape_color[b[0]][b[1]]),
            this.getRGBString(maze_shape_color[b[0]][b[1]]));
        //*/

        let [r, c] = b;
        if(r - 1 >=0 && this.grid[r - 1][c].empty && this.grid[r - 1][c].visit == false){
            this.grid[r - 1][c].color = 2;
            this.fillCell([r - 1, c], this.head_color);
            this.edges.push([b, [r - 1, c]]);
        }
        if(r + 1 < this.rows && this.grid[r + 1][c].empty && this.grid[r + 1][c].visit == false){
            this.grid[r + 1][c].color = 2;
            this.fillCell([r + 1, c], this.head_color);
            this.edges.push([b, [r + 1, c]]);
        }
        if(c - 1 >=0 && this.grid[r][c - 1].empty && this.grid[r][c - 1].visit == false){
            this.grid[r][c - 1].color = 2;
            this.fillCell([r, c - 1], this.head_color);
            this.edges.push([b, [r, c - 1]]);
        }
        if(c + 1 < this.cols && this.grid[r][c + 1].empty && this.grid[r][c + 1].visit == false){
            this.grid[r][c + 1].color = 2;
            this.fillCell([r, c + 1], this.head_color);
            this.edges.push([b, [r, c + 1]]);
        }

        ++this.edge_count;
        return false;
    }


    // ------------------------------------------------------------ // Kruskal's generation
    mapping([r, c]){ return r * this.cols + c; }

    kruskalGenerateInit(){
        this.init(this.rows, this.cols, 1);
        this.finish = false;
        this.edge_count = 1;
        this.point_count = 0;
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                if(this.grid[r][c].empty){
                    ++this.point_count;
                }
            }
        }
        this.djs.init(this.rows * this.cols);
        this.edges = [];
        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                if(this.grid[r][c].empty == false) continue;
                
                if(r + 1 < this.rows && this.grid[r + 1][c].empty){
                    this.edges.push([[r, c], [r + 1, c]]);
                }
                if(c + 1 < this.cols && this.grid[r][c + 1].empty){
                    this.edges.push([[r, c], [r, c + 1]]);
                }
            }
        }
    }

    kruskalGenerate(){
        if(this.edge_count >= this.point_count){
            this.edges = [];
            this.djs.clear();
            this.finishGenerate();
            return true;
        }

        let a, b;
        do{
            let rand = getRandInt(0, this.edges.length - 1);
            this.swap(rand, this.edges.length - 1);
            [a, b] = this.edges[this.edges.length - 1];
            this.edges.pop();
        }while(this.djs.union(this.mapping(a), this.mapping(b)) == false);

        let d = 0;
        if(a[0] > b[0]) d = this.top;
        else if(a[0] < b[0]) d = this.bottom;
        else if(a[1] > b[1]) d = this.left;
        else if(a[1] < b[1]) d = this.right;
        
        this.grid[a[0]][a[1]].visit = true;
        this.grid[b[0]][b[1]].visit = true;
        this.grid[a[0]][a[1]].color = 0;
        this.grid[b[0]][b[1]].color = 0;
        
        if(d == this.top){
            this.grid[a[0]][a[1]].top = false;
            this.grid[b[0]][b[1]].bottom = false;
        }else if(d == this.bottom){
            this.grid[a[0]][a[1]].bottom = false;
            this.grid[b[0]][b[1]].top = false;
        }else if(d == this.left){
            this.grid[a[0]][a[1]].left = false;
            this.grid[b[0]][b[1]].right = false;
        }else if(d == this.right){
            this.grid[a[0]][a[1]].right = false;
            this.grid[b[0]][b[1]].left = false;
        }
        //*
        this.drawCell(a, this.road_color);
        this.drawCell(b, this.road_color);
        //*/
        

        ++this.edge_count;
        return false;
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

    floodInit(flooding_color = "pccs-deep"){
        this.finish = false;

        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                this.grid[r][c].visit = false;
            }
        }

        //* maze
        let [r, c] = this.begin;
        //*/
        /* cat
        let [r, c] = [38, 9];
        //*/
        /* badminton
        let [r, c] = [113, 0];
        //*/

        this.flood_color = getMatrix(this.rows, this.cols, -1);
        this.queue.clear();
        this.queue.push([r, c, 0]);

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

        // spacing = add_colors.length / (parseInt(this.rows) + parseInt(this.cols) - 5);

        /* traversal
        // --- maze ---
        // spacing = add_colors.length / ((this.rows + this.cols) * 1.7);
        // --- badminton ---
        // spacing = add_colors.length / ((this.rows + this.cols) * 1);
        //*/

        //* kruskal
        // --- maze ---
        spacing = add_colors.length / ((this.rows + this.cols) * 3.2);
        // --- badminton ---
        // spacing = add_colors.length / ((this.rows + this.cols) * 2.5);
        //*/
        this.rainbowInit(add_colors, spacing);
    }

    flood(){
        if(this.queue.empty()){
            this.finish = true;
            return true;
        }

        let next_queue = [];
        while(this.queue.size()){
            let [r, c, color_index] = this.queue.front(); this.queue.pop();
            this.grid[r][c].visit = true;
            this.flood_color[r][c] = color_index;
            this.drawCell([r, c], this.rainbow_colors[color_index], this.rainbow_colors[color_index]);

            if(r - 1 >= 0 && this.grid[r - 1][c].empty && this.grid[r - 1][c].visit == false && this.grid[r][c].top == false){
                this.grid[r - 1][c].visit = true;
                next_queue.push([r - 1, c, (color_index + 1) % this.rainbow_colors.length]);
            }
            if(r + 1 < this.rows && this.grid[r + 1][c].empty && this.grid[r + 1][c].visit == false && this.grid[r][c].bottom == false){
                this.grid[r + 1][c].visit = true;
                next_queue.push([r + 1, c, (color_index + 1) % this.rainbow_colors.length]);
            }
            if(c - 1 >= 0 && this.grid[r][c - 1].empty && this.grid[r][c - 1].visit == false && this.grid[r][c].left == false){
                this.grid[r][c - 1].visit = true;
                next_queue.push([r, c - 1, (color_index + 1) % this.rainbow_colors.length]);
            }
            if(c + 1 < this.cols && this.grid[r][c + 1].empty && this.grid[r][c + 1].visit == false && this.grid[r][c].right == false){
                this.grid[r][c + 1].visit = true;
                next_queue.push([r, c + 1, (color_index + 1) % this.rainbow_colors.length]);
            }
        }

        for(let i=0; i<next_queue.length; ++i){
            this.queue.push(next_queue[i]);
        }
    }


    getRGBString([r, g, b]){
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    floodImageColorInit(){
        this.finish = false;

        for(let r=0; r<this.rows; ++r){
            for(let c=0; c<this.cols; ++c){
                this.grid[r][c].visit = false;
            }
        }

        let [r, c] = this.begin;

        this.flood_color = getMatrix(this.rows, this.cols, -1);
        this.queue.clear();
        this.queue.push([r, c]);
    }

    floodImageColor(){
        if(this.queue.empty()){
            this.finish = true;
            return true;
        }

        let next_queue = [];
        while(this.queue.size()){
            let [r, c] = this.queue.front(); this.queue.pop();
            this.grid[r][c].visit = true;
            if((r == this.begin[0] && c == this.begin[1])){
                this.drawCell([r, c], this.wall_color, this.wall_color);
            }else if((r == this.end[0] && c == this.end[1])){
                this.drawCell([r, c], this.wall_color, this.wall_color);
            }else{
                this.drawCell([r, c], 
                    this.getRGBString(maze_shape_color[r][c]), 
                    this.getRGBString(maze_shape_color[r][c]));
            }

            if(r - 1 >= 0 && this.grid[r - 1][c].empty && this.grid[r - 1][c].visit == false && this.grid[r][c].top == false){
                this.grid[r - 1][c].visit = true;
                next_queue.push([r - 1, c]);
            }
            if(r + 1 < this.rows && this.grid[r + 1][c].empty && this.grid[r + 1][c].visit == false && this.grid[r][c].bottom == false){
                this.grid[r + 1][c].visit = true;
                next_queue.push([r + 1, c]);
            }
            if(c - 1 >= 0 && this.grid[r][c - 1].empty && this.grid[r][c - 1].visit == false && this.grid[r][c].left == false){
                this.grid[r][c - 1].visit = true;
                next_queue.push([r, c - 1]);
            }
            if(c + 1 < this.cols && this.grid[r][c + 1].empty && this.grid[r][c + 1].visit == false && this.grid[r][c].right == false){
                this.grid[r][c + 1].visit = true;
                next_queue.push([r, c + 1]);
            }
        }

        for(let i=0; i<next_queue.length; ++i){
            this.queue.push(next_queue[i]);
        }
    }
}