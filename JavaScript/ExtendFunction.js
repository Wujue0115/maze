


function makeHighRes(canvas) {
    let context = canvas.getContext('2d');
    // Get the device pixel ratio, falling back to 1.               
    let dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    //*
    let oldWidth = canvas.width;
    let oldHeight = canvas.height;
    /*/
    let oldWidth = canvas.width = canvas.offsetWidth;
    let oldHeight = canvas.height = canvas.offsetHeight;
    //*/
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = Math.round(oldWidth * dpr);
    canvas.height = Math.round(oldHeight * dpr);
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    context.scale(dpr, dpr);
    return context;
}

function getArray(n, val = 0){
    let array = [];
    for(let i=0; i<n; ++i){
        array.push(val);
    }
    return array;
}

function getMatrix(m, n, val = 0){
    let array = [];
    for(let i=0; i<m; ++i){
        let row = [];
        for(let j=0; j<n; ++j){
            row[j] = val;
        }
        array[i] = row;
    }
    return array;
}

function getRandInt(a, b){
    return a + (Math.random() * (b - a + 1) | 0);
}

function getPosition(element){
    let x = 0;
    let y = 0;
    while(element){
        x += element.offsetLeft - element.scrollLeft + element.clientLeft;
        y += element.offsetTop - element.scrollTop + element.clientTop;
        element = element.offsetParents;
    }
    return {x: x, y: y};
}

function showp(x, y){
    return "(" + x + ", " + y + ")";
}

function getRangeString(limit){
    return "(5 <= value <= " + limit + "  and  value is odd)";
}

function setButtonStyle(object){
    object.style.background = "#eee";
    object.style.color = "#555";
    object.style.boxShadow = "";
    object.style.boxShadow = "-1px -1px 1px rgba(255, 255, 255, 0.3),\
                              1px 1px 3px rgba(0, 0, 0, 0.8);";
    object.style.textShadow = "none";
}

function setButtonHoverStyle(object){
    object.style.background = "#333";
    object.style.color = "#fff";
    object.style.boxShadow = "";
    object.style.boxShadow = "inset 1px 1px 2px rgba(255, 255, 255, .6),\
                              1px 1px 3px rgba(0, 0, 0, 0.8)";
    object.style.textShadow = "0px 0px 8px #fff";
}

function setButtonClickStyle(object){
    setButtonHoverStyle(object);
    if(object.value == "false"){ return; }
    object.style.boxShadow = "";
    object.style.boxShadow = "inset 1px 1px 2px rgba(0, 0, 0, .6),\
                                1px 1px 3px rgba(255, 255, 255, 0.8)";
}

function setButtonDisabled(object, is_disabled){
    if(is_disabled){
        object.style.pointerEvents = "none";
        object.style.opacity = ".6";
    }else{
        object.style.pointerEvents = "";
        object.style.opacity = "1";
    }
}


/*
function detectZoom (){ 
    var ratio = 0,
      screen = window.screen,
      ua = navigator.userAgent.toLowerCase();
  
    if (~ua.indexOf('firefox')) {
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      }
    }
    else if (~ua.indexOf('msie')) {	
      if (screen.deviceXDPI && screen.logicalXDPI) {
        ratio = screen.deviceXDPI / screen.logicalXDPI;
      }
    }
    else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
      ratio = window.outerWidth / window.innerWidth;
    }
    
    if (ratio){
      ratio = Math.round(ratio * 100);
    }
    
    // 360安全瀏覽器下瀏覽器最大化時詭異的outerWidth和innerWidth不相等
    if (ratio === 99 || ratio === 101) {
      ratio = 100;
    }
    
    return ratio;
}
//*/