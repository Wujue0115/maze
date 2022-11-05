import cv2
import numpy as np

#images = cv2.imread("../Images/maze_shape.png")
#images = cv2.imread("../Images/cat.png")
images = cv2.imread("../Images/hippo_color.png")
rgb = np.array(images)

height = np.size(rgb, 0)
width = np.size(rgb, 1)
rgb = rgb.reshape([np.size(rgb, 0), np.size(rgb, 1) * 3])

file = open("hippo_color_rgb.txt", "w")
file.write(str(height) + " " + str(width) + "\n")
np.savetxt("hippo_color_rgb.txt", rgb.astype(int), fmt='%i')
file.close()
