import cv2
import numpy as np

# Load the image
img_path = '/Users/bastianignaciopueblagallardo/.gemini/antigravity/brain/038ac460-4bbd-43ee-9a35-68ed4fc2cf2e/.user_uploaded/media_1785878650538.png'
img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

# Convert to BGRA if not already
if img.shape[2] == 3:
    img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

# Find green and yellow parts to get the shield's shape
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
lower_bound = np.array([20, 50, 50])
upper_bound = np.array([80, 255, 255])
mask = cv2.inRange(hsv, lower_bound, upper_bound)

# Find contours
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Find the largest contour which should be the main triangle shield
largest_contour = max(contours, key=cv2.contourArea)

# Create a new blank mask
final_mask = np.zeros_like(mask)

# The shield is a triangle, but the contour might be slightly messy.
# We approximate it to a polygon (triangle)
epsilon = 0.05 * cv2.arcLength(largest_contour, True)
approx = cv2.approxPolyDP(largest_contour, epsilon, True)

# If it didn't find exactly a triangle (3 points), just use the convex hull
hull = cv2.convexHull(largest_contour)

cv2.drawContours(final_mask, [hull], -1, 255, thickness=cv2.FILLED)

# Apply mask: anything outside the hull becomes transparent
img[final_mask == 0] = [0, 0, 0, 0]

# Now let's crop the image to the bounding box of the hull
x, y, w, h = cv2.boundingRect(hull)
cropped_img = img[y:y+h, x:x+w]

# Save the final image to the project folder
cv2.imwrite('/Users/bastianignaciopueblagallardo/Desktop/juanito/escudo_real.png', cropped_img)
print("Escudo procesado exitosamente!")
