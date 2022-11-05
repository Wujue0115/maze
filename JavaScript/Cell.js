


class Cell {
    constructor(is_road = false){
        this.empty = is_road;
        this.top = true;
        this.bottom = true;
        this.left = true;
        this.right = true;
        this.visit = false;
        this.color = (is_road ? 0 : 1);
    }
}