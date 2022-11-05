


// ------------------------------------------------------------ // FadeIn body
let opacity = 0;
document.body.style.opacity = opacity;
let interval2 = setInterval(function(){
    opacity += 0.02;
    document.body.style.opacity = opacity;
    if(opacity >= 1){
        clearInterval(interval2);
    }
}, 10);


// ------------------------------------------------------------ // Setting
// canvas
let canvas = document.getElementById("canvas");
// console.log("canvas-wh: " + showp(canvas.height, canvas.width));
//*
let height = canvas.height = canvas.offsetHeight;
let width  = canvas.width = canvas.offsetWidth;
//*/
/*
let height = canvas.offsetHeight;
let width  = canvas.offsetWidth;
//*/
let ctx    = makeHighRes(canvas);
/*
console.log("canvas-style: " + showp(canvas.style.height, canvas.style.width));
console.log("canvas-offset: " + showp(canvas.offsetHeight, canvas.offsetWidth));
console.log("canvas-wh: " + showp(canvas.height, canvas.width));
//*/

// canvas2
let canvas2    = document.getElementById("canvas2");
canvas2.height = canvas2.offsetHeight;
canvas2.width  = canvas2.offsetWidth;
let ctx2       = makeHighRes(canvas2);

// -2...
canvas2.style.top = -(height + 2) + "px";

// rows and columns and maze object
let text_rows  = document.getElementById("text-rows");
let text_cols  = document.getElementById("text-cols");
let label_rows = document.getElementById("label-rows");
let label_cols = document.getElementById("label-cols");
let rows = text_rows.value;
let cols = text_cols.value;
let maze = new Maze(rows, cols);

// select element
let select_generation_algorithm = document.getElementById("select-generation-algorithm");
let select_solving_algorithm    = document.getElementById("select-solving-algorithm");
let select_flooding_color   = document.getElementById("select-flooding-color");



// ------------------------------------------------------------ // Animation
// button element
// let button_animation = document.getElementById("button-animation");
let button_step      = document.getElementById("button-step");
let button_pause     = document.getElementById("button-pause");
let button_reset     = document.getElementById("button-reset");

// speed
let text_speed  = document.getElementById("text-speed");
let range_speed = document.getElementById("range-speed");



// ------------------------------------------------------------ // Function
let button_generate = document.getElementById("button-generate");
let button_solve    = document.getElementById("button-solve");
let button_flood    = document.getElementById("button-flood");



// ------------------------------------------------------------ // Editing
// clear and fill
let button_clear_road = document.getElementById("button-clear-road");
let button_clear_all  = document.getElementById("button-clear-all");
let button_fill_wall = document.getElementById("button-fill-wall");

// color function button
let button_grid_show = document.getElementById("button-grid-show");

let button_road_select  = document.getElementById("button-road-select");
let button_wall_select  = document.getElementById("button-wall-select");
let button_begin_select = document.getElementById("button-begin-select");
let button_end_select   = document.getElementById("button-end-select");

let button_head_reset  = document.getElementById("button-head-reset");
let button_path_reset  = document.getElementById("button-path-reset");
let button_visit_reset = document.getElementById("button-visit-reset");
let button_grid_reset  = document.getElementById("button-grid-reset");
let button_road_reset  = document.getElementById("button-road-reset");
let button_wall_reset  = document.getElementById("button-wall-reset");
let button_begin_reset = document.getElementById("button-begin-reset");
let button_end_reset   = document.getElementById("button-end-reset");

let color_head  = document.getElementById("color-head");
let color_path  = document.getElementById("color-path");
let color_visit = document.getElementById("color-visit");
let color_grid  = document.getElementById("color-grid");
let color_road  = document.getElementById("color-road");
let color_wall  = document.getElementById("color-wall");
let color_begin = document.getElementById("color-begin");
let color_end   = document.getElementById("color-end");



// ------------------------------------------------------------ // file
/*
let a_save_image = document.getElementById("a-save-image");

a_save_image.onclick = function(e){
    // get image URI from canvas object
    var imageURI = canvas.toDataURL("image/png");
    console.log(imageURI);
    //el.href = imageURI;
}
//*/



// ------------------------------------------------------------ // function
function disableButton(is_disabled){
    text_rows.disabled = is_disabled;
    text_cols.disabled = is_disabled;
    select_generation_algorithm.disabled = is_disabled;
    select_solving_algorithm.disabled    = is_disabled;
    select_flooding_color.disabled       = is_disabled;

    setButtonDisabled(button_step , !is_disabled);
    setButtonDisabled(button_pause, interval === 1001 ? true : !is_disabled);
    setButtonDisabled(button_reset, !is_disabled);

    setButtonDisabled(button_generate, is_disabled);
    setButtonDisabled(button_solve   , is_disabled);
    setButtonDisabled(button_flood   , is_disabled);

    setButtonDisabled(button_clear_road  , is_disabled);
    setButtonDisabled(button_clear_all   , is_disabled);
    setButtonDisabled(button_fill_wall   , is_disabled);
    setButtonDisabled(button_road_select , is_disabled);
    setButtonDisabled(button_wall_select , is_disabled);
    setButtonDisabled(button_begin_select, is_disabled);
    setButtonDisabled(button_end_select  , is_disabled);
}





// ------------------------------------------------------------ // window resize
// console.log("resize: " + showp(window.innerWidth, window.innerHeight));
// console.log("canvas: " + showp(canvas.offsetWidth, canvas.offsetHeight)); 

window.onresize = function(){
    // console.log("resize: " + showp(window.innerWidth, window.innerHeight));
    // console.log("canvas: " + showp(canvas.offsetWidth, canvas.offsetHeight));
    // let zoom = detectZoom() / 100;

    cancelEditButtonStyle();

    canvas.style.height = "100%";
    canvas.style.width = "100%";
    height = canvas.height = canvas.offsetHeight;
    width = canvas.width = canvas.offsetWidth;
    ctx = makeHighRes(canvas);

    canvas2.style.height = "100%";
    canvas2.style.width = "100%";
    canvas2.height = canvas2.offsetHeight;
    canvas2.width = canvas2.offsetWidth;
    ctx2 = makeHighRes(canvas2);
    canvas2.style.top = -(height + 2) + "px";

    maze.resize();
    label_rows.textContent = getRangeString(maze.max_rows);
    label_cols.textContent = getRangeString(maze.max_cols);

    //*
    if(text_rows.value > maze.max_rows || text_cols.value > maze.max_cols){
        alert("warning: (rows over max rows) or (cols over max cols) !!");
        // button_reset.onclick();
        /*
        maze.reset = true;
        disableButton(false);
        button_generate.value == "false";
        button_solve.value = "false";
        text_rows.value = 19;
        text_cols.value = 19;
        rows = text_rows.value; 
        cols = text_cols.value;
        maze.init(rows, cols);
        //*/
    }
    //*/
}



// ------------------------------------------------------------ // rows and cols
function setSize(){
    if(isNaN(parseInt(text_rows.value))) text_rows.value = "19";
    if(isNaN(parseInt(text_cols.value))) text_cols.value = "19";

    rows = parseInt(text_rows.value); 
    cols = parseInt(text_cols.value); 

    // 5 <= value <= 661
    if(rows < 5){ rows = 5; text_rows.value = rows; }
    if(cols < 5){ cols = 5; text_cols.value = cols; }
    if(rows > maze.max_rows){ rows = maze.max_rows; text_rows.value = rows; }
    if(cols > maze.max_cols){ cols = maze.max_cols; text_cols.value = cols; }

    // value is odd
    if(rows & 1 ^ 1){ ++rows; text_rows.value = rows; }
    if(cols & 1 ^ 1){ ++cols; text_cols.value = cols; }

    // reset maze size
    maze.init(rows, cols);
}

text_rows.onchange = function(){ setSize(); }
text_cols.onchange = function(){ setSize(); }

label_rows.textContent = getRangeString(maze.max_rows);
label_cols.textContent = getRangeString(maze.max_cols);



// ------------------------------------------------------------ // animation
/*
button_animation.onmouseenter = function(){
    if(button_animation.value == "true") return;
    setButtonHoverStyle(button_animation);
}

button_animation.onmouseleave = function(){
    if(button_animation.value == "true") return;
    setButtonStyle(button_animation);
}

button_animation.onclick = function(){
    button_animation.value = button_animation.value == "true" ? "false" : "true";
    maze.animation = button_animation.value == "true";
    setButtonClickStyle(button_animation);
}

button_animation.value = "false";
button_animation.onclick();
setButtonDisabled(button_animation, true);
//*/



// ------------------------------------------------------------ // step
button_step.onclick = function(){
    maze.step = true;
    if(button_generate.value == "true"){
        switch(select_generation_algorithm.value){
            case "dfs":
                maze.dfsGenerate();
                break;
            case "kruskal":
                maze.kruskalGenerate();
                break;
            case "traversal":
                maze.traversalGenerate();
                break;
            case "prim":
                maze.primGenerate();
                break;
            case "recursive-division":
                maze.recursiveDivisionGenerate();
                break;
            case "eller":
                maze.ellerGenerate();
                break;
            case "aldous-broder":
                maze.aldousBroderGenerate();
                break;
            case "wilson":
                maze.wilsonGenerate();
                break;
            case "hunt-and-kill":
                maze.huntAndKillGenerate();
                break;
            case "growing-tree":
                maze.growingTreeGenerate();
                break;
            case "binary-tree":
                maze.binaryTreeGenerate();
                break;
            case "sidewinder":
                maze.sidewinderGenerate();
                break;
            case "a-star":
                maze.aStarGenerate();
                break;
        }
    }else if(button_solve.value == "true"){
        switch(select_solving_algorithm.value){
            case "dfs":
                maze.dfsSolve();
                break;
            case "bfs":
                maze.bfsSolve();
                break;
            case "btfs":
                maze.btfsSolve();
                break;
            case "astar":
                maze.astarSolve();
                break;
        }
    }else if(button_flood.value == "true"){
        maze.flood();
    }
}

button_step.value = "false";
setButtonDisabled(button_step, true);



// ------------------------------------------------------------ // pause
button_pause.onmouseenter = function(){
    if(button_pause.value == "true") return;
    setButtonHoverStyle(button_pause);
}

button_pause.onmouseleave = function(){
    if(button_pause.value == "true") return;
    setButtonStyle(button_pause);
}

button_pause.onclick = function(){
    if(button_pause.value === "true" && interval === 1001) return;
    button_pause.value = button_pause.value == "true" ? "false" : "true";
    button_pause.textContent = button_pause.value == "true" ? "Resume" : "Pause";
    maze.step = button_pause.value == "true" ? true : false;
    setButtonDisabled(button_step, !maze.step);
    setButtonClickStyle(button_pause);
    if(button_pause.value == "true"){
        clearTimeout(timeout);
    }else{
        if(button_generate.value == "true"){
            switch(select_generation_algorithm.value){
                case "dfs":
                    maze.dfsGenerate();
                    break;
                case "kruskal":
                    maze.kruskalGenerate();
                    break;
                case "traversal":
                    maze.traversalGenerate();
                    break;
                case "prim":
                    maze.primGenerate();
                    break;
                case "recursive-division":
                    maze.recursiveDivisionGenerate();
                    break;
                case "eller":
                    maze.ellerGenerate();
                    break;
                case "aldous-broder":
                    maze.aldousBroderGenerate();
                    break;
                case "wilson":
                    maze.wilsonGenerate();
                    break;
                case "hunt-and-kill":
                    maze.huntAndKillGenerate();
                    break;
                case "growing-tree":
                    maze.growingTreeGenerate();
                    break;
                case "binary-tree":
                    maze.binaryTreeGenerate();
                    break;
                case "sidewinder":
                    maze.sidewinderGenerate();
                    break;
                case "a-star":
                    maze.aStarGenerate();
                    break;
            }
        }else if(button_solve.value == "true"){
            switch(select_solving_algorithm.value){
                case "dfs":
                    maze.dfsSolve();
                    break;
                case "bfs":
                    maze.bfsSolve();
                    break;
                case "btfs":
                    maze.btfsSolve();
                    break;
                case "astar":
                    maze.astarSolve();
                    break;
            }
        }else if(button_flood.value == "true"){
            maze.flood();
        }
    }
}

button_pause.value = "false";
setButtonDisabled(button_pause, true);



// ------------------------------------------------------------ // reset
button_reset.onclick = function(){
    maze.reset = true;
    if(button_generate.value == "true"){
        maze.init();
        button_generate.value = "false";
    }else if(button_solve.value == "true"){
        maze.clearRoad();
        maze.finish = true;
        button_solve.value = "false";
    }else if(button_flood.value == "true"){
        maze.clearRoad();
        maze.finish = true;
        maze.begin = [];
        button_flood.value = "false";
    }
    disableButton(false);
}

button_reset.value = "false";
setButtonDisabled(button_reset, true);



// ------------------------------------------------------------ // speed
interval = 1001 - text_speed.value;

text_speed.onchange = function(){
    if(isNaN(parseInt(text_speed.value))) text_speed.value = "920";
    if(parseInt(text_speed.value) < 0) text_speed.value = "0";
    if(parseInt(text_speed.value) > 1000) text_speed.value = "1000";
    range_speed.value = text_speed.value;
    interval = 1001 - parseInt(text_speed.value);

    if(!maze.finish){
        setButtonDisabled(button_pause, interval === 1001);
        if(button_pause.value === "false" && interval === 1001) button_pause.onclick();
    }
}

range_speed.oninput = function(){
    text_speed.value = range_speed.value;
    interval = 1001 - parseInt(range_speed.value);

    if(!maze.finish){
        setButtonDisabled(button_pause, interval === 1001);
        if(button_pause.value === "false" && interval === 1001) button_pause.onclick();
    }else{
        if(button_pause.value === "false" && interval === 1001){
            button_pause.onclick(); 
        }
        if(button_pause.value === "true" && interval !== 1001){
            button_pause.onclick(); 
            setButtonStyle(button_pause);
        }
        setButtonDisabled(button_step, true);
    }
}



// ------------------------------------------------------------ // generate
button_generate.onclick = function(){
    button_generate.value = "true";
    disableButton(true);
    setButtonDisabled(button_step, true);
    maze.generate(select_generation_algorithm.value);
    if(interval === 1001){
        console.log("interval");
        setButtonDisabled(button_step, false);
    }

    let animation = setInterval(() => { 
        if(maze.finish){
            button_generate.value = "false";
            disableButton(false);
            if(button_pause.value == "true"){ 
                button_pause.onclick();
                if(interval !== 1001) setButtonStyle(button_pause);
            }
            clearInterval(animation);
            return;
        }
    }, 10);
}



// ------------------------------------------------------------ // solve
button_solve.onclick = function(){
    button_solve.value = "true";
    disableButton(true);
    setButtonDisabled(button_step, true);
    maze.solve(select_solving_algorithm.value);
    if(interval === 1001){
        setButtonDisabled(button_step, false);
    }

    let animation = setInterval(() => { 
        if(maze.finish){
            button_solve.value = "false";
            disableButton(false);
            if(button_pause.value == "true"){ 
                button_pause.onclick();
                if(interval !== 1001) setButtonStyle(button_pause);
            }
            clearInterval(animation);
            return;
        }
    }, 10);
}



// ------------------------------------------------------------ // flood
button_flood.onclick = function(){
    button_flood.value = "true";
    disableButton(true);
    setButtonDisabled(button_step, true);
    maze.floodInit(select_flooding_color.value);
    maze.flood();
    if(interval === 1001){
        setButtonDisabled(button_step, false);
    }

    let animation = setInterval(() => { 
        if(maze.finish){
            button_flood.value = "false";
            disableButton(false);
            if(button_pause.value == "true"){ 
                button_pause.onclick();
                if(interval !== 1001) setButtonStyle(button_pause);
            }
            clearInterval(animation);
            return;
        }
    }, 10);
}



// ------------------------------------------------------------ // clear and fill
button_clear_road.onclick = function(){ maze.clearRoad(); }
button_clear_all.onclick = function(){ maze.clearAll(); }
button_fill_wall.onclick = function(){ maze.fillWall(); }



// ------------------------------------------------------------ // gridline show
button_grid_show.onmouseenter = function(){
    if(button_grid_show.value == "true") return;
    setButtonHoverStyle(button_grid_show);
}

button_grid_show.onmouseleave = function(){
    if(button_grid_show.value == "true") return;
    setButtonStyle(button_grid_show);
}

button_grid_show.onclick = function(){ 
    button_grid_show.value = button_grid_show.value == "true" ? "false" : "true";
    maze.gridline_show = button_grid_show.value == "true";
    maze.showGridline();
    setButtonClickStyle(button_grid_show);
}

button_grid_show.value = "false";



// ------------------------------------------------------------ // color select
let button_edit = [button_road_select, button_wall_select, button_begin_select, button_end_select];
let edit_number = -1;
let status;

function cancelEditButtonStyle(){
    for(let i=0; i<button_edit.length; ++i){
        if(button_edit[i].value == "true"){
            button_edit[i].value = "false";
            setButtonStyle(button_edit[i]);
        }
    }
    maze.edit = "false";
}

function setEditButtonStyle(i){
    button_edit[i].value = status;
    maze.edit = status == "true";
    button_edit[i].style.backgroundColor = button_edit[i].value == "true" ? "#fa0" : "#F7C483";
    button_edit[i].style.color = button_edit[i].value == "true" ? "#fff" : "#4d516b";
    button_edit[i].style.textShadow = button_edit[i].value == "true" ? "1px 1px #4d516b" : "none";
    setButtonClickStyle(button_edit[i]);
}



button_road_select.onmouseenter = function(){
    if(button_road_select.value == "true") return;
    setButtonHoverStyle(button_road_select);
}

button_wall_select.onmouseenter = function(){
    if(button_wall_select.value == "true") return;
    setButtonHoverStyle(button_wall_select);
}

button_begin_select.onmouseenter = function(){
    if(button_begin_select.value == "true") return;
    setButtonHoverStyle(button_begin_select);
}

button_end_select.onmouseenter = function(){
    if(button_end_select.value == "true") return;
    setButtonHoverStyle(button_end_select);
}



button_road_select.onmouseleave = function(){
    if(button_road_select.value == "true") return;
    setButtonStyle(button_road_select);
}

button_wall_select.onmouseleave = function(){
    if(button_wall_select.value == "true") return;
    setButtonStyle(button_wall_select);
}

button_begin_select.onmouseleave = function(){
    if(button_begin_select.value == "true") return;
    setButtonStyle(button_begin_select);
}

button_end_select.onmouseleave = function(){
    if(button_end_select.value == "true") return;
    setButtonStyle(button_end_select);
}



button_road_select.onclick = function(){
    status = button_road_select.value == "true" ? "false" : "true";
    cancelEditButtonStyle();
    setEditButtonStyle(0);

    if(button_road_select.value == "true") edit_number = 0;
}

button_wall_select.onclick = function(){
    status = button_wall_select.value == "true" ? "false" : "true";
    cancelEditButtonStyle();
    setEditButtonStyle(1);

    if(button_wall_select.value == "true") edit_number = 1;
}

button_begin_select.onclick = function(){
    status = button_begin_select.value == "true" ? "false" : "true";
    cancelEditButtonStyle();
    setEditButtonStyle(2);

    if(button_begin_select.value == "true") edit_number = 5;
}

button_end_select.onclick = function(){
    status = button_end_select.value == "true" ? "false" : "true";
    cancelEditButtonStyle();
    setEditButtonStyle(3);

    if(button_end_select.value == "true") edit_number = 6;
}



// ------------------------------------------------------------ // canvas edit
canvas2.onmousedown = function(event){
    if(maze.edit == false) return;

    let position = getPosition(canvas2);
    canvas2.onmousemove = function(event){
        event.preventDefault();
        if(event.buttons != 1) return;

        let x = event.clientX - position.x;
        let y = event.clientY - position.y;

        let row = Math.floor((y - maze.offset_y) / maze.cell_size);
        let col = Math.floor((x - maze.offset_x) / maze.cell_size);

        if(row < 0 || col < 0 || row >= maze.rows || col >= maze.cols) return;
        if(maze.grid_color[row][col] == edit_number) return;

        maze.clearRoad();
        maze.editCell(row, col, edit_number);
    }
    //*
    let x = event.clientX - position.x;
    let y = event.clientY - position.y;

    let row = Math.floor((y - maze.offset_y) / maze.cell_size);
    let col = Math.floor((x - maze.offset_x) / maze.cell_size);

    if(row < 0 || col < 0 || row >= maze.rows || col >= maze.cols) return;
    if(maze.grid_color[row][col] == edit_number) return;

    maze.clearRoad();
    maze.editCell(row, col, edit_number);
    //*/
}



// ------------------------------------------------------------ // color input
color_head.value = maze.origin_head_color;
color_path.value = maze.origin_path_color;
color_visit.value = maze.origin_visit_color;
color_grid.value = maze.origin_line_color;
color_road.value = maze.origin_road_color;
color_wall.value = maze.origin_wall_color;
color_begin.value = maze.origin_begin_color;
color_end.value = maze.origin_end_color;

color_head.oninput = function(){
    maze.head_color = color_head.value;
    maze.resetCellColor();
    maze.drawGrid();
}

color_path.oninput = function(){
    maze.path_color = color_path.value;
    maze.resetCellColor();
    maze.drawGrid();
}

color_visit.oninput = function(){
    maze.visit_color = color_visit.value;
    maze.resetCellColor();
    maze.drawGrid();
}

color_grid.oninput = function(){
    maze.line_color = color_grid.value;
    maze.showGridline();
}

color_road.oninput = function(){
    maze.road_color = color_road.value;
    maze.resetCellColor();
    maze.drawGrid();
}

color_wall.oninput = function(){
    maze.wall_color = color_wall.value;
    maze.resetCellColor();
    maze.drawGrid();
}

color_begin.oninput = function(){
    maze.begin_color = color_begin.value;
    maze.resetCellColor();
    maze.drawGrid();
}

color_end.oninput = function(){
    maze.end_color = color_end.value;
    maze.resetCellColor();
    maze.drawGrid();
}



// ------------------------------------------------------------ // color reset
button_head_reset.onclick = function(){
    color_head.value = maze.origin_head_color;
    color_head.oninput();
}

button_path_reset.onclick = function(){
    color_path.value = maze.origin_path_color;
    color_path.oninput();
}

button_visit_reset.onclick = function(){
    color_visit.value = maze.origin_visit_color;
    color_visit.oninput();
}

button_grid_reset.onclick = function(){
    color_grid.value = maze.origin_line_color;
    color_grid.oninput();
}

button_road_reset.onclick = function(){
    color_road.value = maze.origin_road_color;
    color_road.oninput();
}

button_wall_reset.onclick = function(){
    color_wall.value = maze.origin_wall_color;
    color_wall.oninput();
}

button_begin_reset.onclick = function(){
    color_begin.value = maze.origin_begin_color;
    color_begin.oninput();
}

button_end_reset.onclick = function(){
    color_end.value = maze.origin_end_color;
    color_end.oninput();
}