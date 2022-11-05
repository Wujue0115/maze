

console.log(maze_shape.length);
console.log(maze_shape[0].length);


let canvas3 = document.getElementById("canvas3");
let height = canvas3.height = canvas3.offsetHeight;
let width  = canvas3.width = canvas3.offsetWidth;
let ctx    = makeHighRes(canvas3);
let interval;
let maze = new FadeInMaze(ctx, maze_shape.length, maze_shape[0].length);

console.log("max_size: " + showp(maze.max_rows, maze.max_cols));
console.log("shape_size: " + showp(maze.rows, maze.cols));

// maze.drawGrid();
// maze.generate("traversal");
setTimeout(function(){
    maze.generate("kruskal");
}, 500);


window.onresize = function(){
    canvas3.style.height = "100%";
    canvas3.style.width = "100%";
    height = canvas3.height = canvas3.offsetHeight;
    width = canvas3.width = canvas3.offsetWidth;
    ctx = makeHighRes(canvas3);
    maze.resize();
}


// document.addEventListener("dblclick", function(){ return; });

let mouse_size = 0;
let cursor = document.getElementById("cursor");
cursor.style.width = cursor.style.height = "30px";
document.addEventListener("mousemove", function(event){
    if(mouse_size) return;
    let move_px = (parseInt(cursor.style.width) >> 1);
    cursor.style.left = event.clientX - move_px + "px";
    cursor.style.top = event.clientY - move_px + "px";
});


document.addEventListener("mousedown", function(event){
    if(mouse_size || cursor.style.display == "none") return;
    mouse_size = 0;
    interval = setInterval(function(){
        ++mouse_size;
        cursor.style.left = event.clientX - (mouse_size >> 1) + "px";
        cursor.style.top = event.clientY - (mouse_size >> 1) + "px";
        cursor.style.width = mouse_size + "px";
        cursor.style.height = mouse_size + "px";
        if(mouse_size >= 28){
            mouse_size = 0;
            clearInterval(interval);
        }
    }, 8);

    timer.stop();
    timer2.stop();
    maze.flood_color = [];
    maze.generate("kruskal");
});


function fadeIn(){
    clearInterval(interval);
    let opacity = 1;
    interval = setInterval(function(){
        opacity -= 0.01;
        document.body.style.opacity = opacity;
        if(opacity <= 0){
            clearInterval(interval);
            location.href = "index.html";
        }
    }, 10);
}


document.addEventListener("keydown", function(event){
    if(button_click.style.opacity < 1) return;
    if(event.key === "Enter") fadeIn();
});


button_click.onmouseenter = function(){
    cursor.style.display = "none";
}
button_click.onmouseleave = function(){
    cursor.style.display = "block";
}
button_click.onmousedown = function(){
    fadeIn();
}