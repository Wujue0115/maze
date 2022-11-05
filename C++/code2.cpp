#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
#define File 

const int maxn = 1000;
int images[maxn][maxn];
int colors[maxn][maxn][3];

int main(){
	ios::sync_with_stdio(0), cin.tie(0);
	#ifdef File
		/*
		freopen("../python/rgb.txt", "r", stdin);
		freopen("../javascript/MazeShapes.js", "w", stdout);
		/*/
		freopen("../python/mark2_rgb.txt", "r", stdin);
		freopen("../javascript/MazeShapes/MarkShape.js", "w", stdout);
		//*/
	#endif

	int height, width, r, g, b;
	int left, right, top, bottom;
	
	cin >> height >> width;
	left = width - 1, right = 0, top = height - 1, bottom = 0;
	for(int i=0; i<height; ++i){
		for(int j=0; j<width; ++j){
			cin >> b >> g >> r;
			
			colors[i][j][0] = r, colors[i][j][1] = g, colors[i][j][2] = b;
			int bound[3] = {0, 200, 50};			
			images[i][j] = !(abs(b - bound[0]) <= 90  && abs(g - bound[1]) <= 40 && abs(r - bound[2]) <= 90);
			if(images[i][j]){
				left = min(left, j);
				right = max(right, j);
				top = min(top, i);
				bottom = max(bottom, i);
			}
		}
	}

	if(top) --top;
	if(bottom + 1 < height) ++bottom;
	if(left) --left;
	if(right + 1 < width) ++right;

	cout << endl;
	cout << "let maze_shape = [";
	for(int i=0; i<height; ++i){
		if(i < top) continue;
		if(i > bottom) break;
		cout << "," + (i == top) << "[";
		for(int j=0; j<width; ++j){
			if(j >= left && j <= right){
				cout << (j == left ? "" : ", " ) << (images[i][j] ? "0" : "1");
			}
		}
		cout << "]" << endl;
	}
	cout << "]" << endl << endl;

	cout << "let maze_shape_color = [";
	for(int i=0; i<height; ++i){
		if(i < top) continue;
		if(i > bottom) break;
		cout << "," + (i == top) << "[";
		for(int j=0; j<width; ++j){
			if(j >= left && j <= right){
				cout << "," + (j == left) << "[";
				cout << colors[i][j][0] << ",";
				cout << colors[i][j][1] << ",";
				cout << colors[i][j][2] << "]";
			}
		}
		cout << "]" << endl;
	}
	cout << "]" << endl;
}
