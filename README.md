# Maze World ![GitHub language count](https://img.shields.io/github/languages/count/wujue0115/maze) ![GitHub top language](https://img.shields.io/github/languages/top/wujue0115/maze) ![GitHub](https://img.shields.io/github/license/wujue0115/maze)

## Description
Maze World 是一個視覺化呈現迷宮動畫的網頁
#### 支援 13 種迷宮生成演算法：
  1. Randomized depth-first search (Recursive backtracker algorithm)
  2. Eller's algorithm
  3. Randomized Kruskal's algorithm
  4. Randomized Prim's algorithm
  5. Random traversal algorithm
  6. Recursive division algorithm
  7. Aldous-Broder algorithm
  8. Wilson's algorithm
  9. Hunt-and-Kill algorithm
  10. Growing tree algorithm (Newest/Random, 75/25 split)
  11. Binary tree algorithm
  12. Sidewinder algorithm
  13. Randomized A-Star algorithm (此演算法是我使用 A-Star 去優化 Wilson's 生成迷宮效率，演算法名稱是自己取的，若是有找到類似此演算法相關文獻請告知我)
#### 支援 4 種路徑搜尋演算法：
  1. Depth-first search
  2. Breadth-first search
  3. Best-first search
  4. A-Star algorith
  
## Live demo
#### [Maze World](https://wujue0115.github.io/maze/fadeInMaze.html)

## Visuals
- 進入前迷宮生成動畫

  <img width="640" alt="image" src="https://user-images.githubusercontent.com/56119287/226511158-6c4f95cc-1ff2-4b27-892c-6ab6e7b9778f.gif">

- 視覺化生成迷宮 1 (Randomized depth-first search algorithm)

  <img width="640" alt="image" src="https://user-images.githubusercontent.com/56119287/226512674-8b49e908-93f3-4489-8ebb-42f994ce6044.gif">
  
- 視覺化生成迷宮 2 (Randomized Kruskal's algorithm)

  <img width="640" alt="image" src="https://user-images.githubusercontent.com/56119287/226513414-d2b743c9-0654-4985-b139-428193a9402f.gif">

- 迷宮路徑搜尋演算法動畫 (Breadth-first search algorithm)

  <img width="640" alt="image" src="https://user-images.githubusercontent.com/56119287/226513764-31870888-6c12-4d89-a56f-80211b1c93f1.gif">

- 操作頁面

  <img width="640" alt="image" src="https://user-images.githubusercontent.com/56119287/226511494-cae72afe-521f-4fdd-a3be-6b54365a5654.png">
  
  - Setting panel: 調整迷宮長寬、選擇演算法
  - Animation panel: 動畫顯示設定 (暫停、重置、調整動畫速度等)
  - Function panel: 選擇呈現動畫類別 
    - Generate: 根據 setting panel 選擇的迷宮演算法生成一個迷宮
    - Solve: 根據 setting panel 選擇的路徑搜尋演算法對一個已生成迷宮求解
    - Flood: 使用 BFS 演算法根據每個網格與起點的曼哈頓距離呈現不同的顏色深度，進而觀察一個已生成迷宮的結構複雜度
  - Editing panel: 修改迷宮內部元素顏色、給使用者客製化迷宮等功能


## License
[MIT](https://github.com/Wujue0115/wujue-gpt/blob/main/license)
