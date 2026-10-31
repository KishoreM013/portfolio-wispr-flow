# Portrait cleanup

Tool: built-in image_gen, transparent background enabled. Original source photos are retained.

Saved assets:
- public/images/portraits/portrait-05-clean.png
- public/images/portraits/portrait-06-clean.png
- public/images/portraits/portrait-07-clean.png
- public/images/portraits/portrait-10-clean.png

The end-alcove material uses per-photo UV crops from src/components/three/portraitFraming.ts. The exhibit artwork does not consume these portraits.

## Prompts

### Portrait 5

Use case: background-extraction. Edit target: supplied portrait-05.png. Precisely clean the cutout of the single foreground young man with glasses. Remove ALL background leftovers around his hair and ears (including white/colored patches and halos), while keeping the actual hair. Preserve his EXACT original facial identity, expression, pose, glasses, natural skin texture, clothing and lighting. Do not beautify, retouch features, change gaze or substitute his face. Truly transparent alpha background; no added background, no text, no other people. Crop to a tight vertical head-and-shoulders portrait, approximately 4:7 canvas ratio: full hair within the top with only 2% headroom, face occupies most of the panel, shoulders cropped at bottom. Keep his original head angle. Remove excessive original transparent empty space above him. Clean natural hair edges with no bright fringe.

### Portrait 6

Use case: background-extraction. Edit target: the supplied portrait-06 PNG. Remove ALL remaining background, including the enormous sideways printed faces/poster and all pink fabric/poster shapes behind the main man. Retain ONLY the actual foreground young man with black rectangular glasses, dark wavy hair, blue wired earphones and gray collared shirt, looking left. Preserve his exact facial identity, original expression, pose, skin texture, glasses, hair, lighting and clothes. Do not beautify, redesign or substitute his face. Clean precise natural alpha edges around hair, glasses, ear and clothing. No background people or poster fragments, no colored fringe, no checkerboard baked into the image. Transparent PNG. Compose as a tightly cropped head-and-shoulders portrait with the full top of his hair close to the top edge and his face large and centered; small margin, no excessive empty space. No text, no border.

### Portrait 7

Use case: background-extraction. Edit target: supplied portrait-07.png. Precisely clean the cutout of the single foreground young man with glasses. Remove ALL background leftovers around his hair and ears (including white/colored patches and halos), while keeping the actual hair. Preserve his EXACT original facial identity, expression, pose, glasses, natural skin texture, clothing and lighting. Do not beautify, retouch features, change gaze or substitute his face. Truly transparent alpha background; no added background, no text, no other people. Crop to a tight vertical head-and-shoulders portrait, approximately 4:7 canvas ratio: full hair within the top with only 2% headroom, face occupies most of the panel, shoulders cropped at bottom. Keep his original head angle. Remove excessive original transparent empty space above him. Clean natural hair edges with no bright fringe.

### Portrait 10

Use case: background-extraction. Edit target: supplied portrait-10.png. Precisely clean the cutout of the single foreground young man with glasses. Remove ALL background leftovers around his hair and ears (including white/colored patches and halos), while keeping the actual hair. Preserve his EXACT original facial identity, expression, pose, glasses, natural skin texture, clothing and lighting. Do not beautify, retouch features, change gaze or substitute his face. Truly transparent alpha background; no added background, no text, no other people. Crop to a tight vertical head-and-shoulders portrait, approximately 4:7 canvas ratio: full hair within the top with only 2% headroom, face occupies most of the panel, shoulders cropped at bottom. Keep his original head angle. Remove excessive original transparent empty space above him. Clean natural hair edges with no bright fringe.

