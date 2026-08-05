from PIL import Image, ImageDraw

path = '/Users/bastianignaciopueblagallardo/.gemini/antigravity/brain/038ac460-4bbd-43ee-9a35-68ed4fc2cf2e/.user_uploaded/media_1785878650538.png'
img = Image.open(path).convert("RGBA")
width, height = img.size

# 1. Make the black background transparent
datas = img.getdata()
newData = []
for item in datas:
    # If the pixel is very dark (black background)
    if item[0] < 40 and item[1] < 40 and item[2] < 40:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)
img.putdata(newData)

# 2. Mask out everything except the main triangle
# The leaves are on the outside, and banner is at the bottom.
# We define a triangle polygon that safely covers the yellow shield
# but excludes the sides and the bottom banner.
pt_top_left = (int(width * 0.05), int(height * 0.05))
pt_top_right = (int(width * 0.95), int(height * 0.05))
pt_bottom_right = (int(width * 0.58), int(height * 0.81))
pt_bottom = (int(width * 0.5), int(height * 0.85))
pt_bottom_left = (int(width * 0.42), int(height * 0.81))

mask = Image.new('L', (width, height), 0)
draw = ImageDraw.Draw(mask)
draw.polygon([pt_top_left, pt_top_right, pt_bottom_right, pt_bottom, pt_bottom_left], fill=255)

# 3. Apply the mask to the alpha channel
# We need to combine the existing alpha (from making black transparent) with our polygon mask
existing_alpha = img.split()[3]
# Only keep pixels that are opaque in BOTH the existing alpha and the polygon mask
combined_mask = Image.new('L', (width, height))
combined_data = []
for m_poly, a_orig in zip(mask.getdata(), existing_alpha.getdata()):
    if m_poly > 0 and a_orig > 0:
        combined_data.append(a_orig)
    else:
        combined_data.append(0)
combined_mask.putdata(combined_data)

img.putalpha(combined_mask)

# 4. Crop the image tightly to the remaining visible pixels
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# 5. Save the final processed image
out_path = '/Users/bastianignaciopueblagallardo/Desktop/juanito/escudo_real.png'
img.save(out_path)
print(f"Saved perfectly cropped shield to {out_path}")
