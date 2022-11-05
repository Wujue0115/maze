#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
#define File 

const int maxn = 1000;
int images[maxn][maxn];

int main(){
	ios::sync_with_stdio(0), cin.tie(0);
	#ifdef File
		/*
		freopen("../python/rgb.txt", "r", stdin);
		freopen("../javascript/MazeShapes.js", "w", stdout);
		/*/
		freopen("../python/mark_rgb.txt", "r", stdin);
		freopen("../javascript/MazeShapes/MarkShape.js", "w", stdout);
		//*/
	#endif

	int height, width, r, g, b;
	int left, right, top, bottom;
	
	cin >> height >> width;
	left = width - 1, right = 0, top = height - 1, bottom = 0;
	for(int i=0; i<height; ++i){
		for(int j=0; j<width; ++j){
			cin >> r >> g >> b;
			
			images[i][j] = (r + g + b);
			if(images[i][j] > 33){
				left = min(left, j);
				right = max(right, j);
				top = min(top, i);
				bottom = max(bottom, i);
			}
		}
	}

	--top;
	++bottom;
	--left;
	++right;
	
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
	cout << "]";
}
