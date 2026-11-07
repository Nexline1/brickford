# Brickford UI/UX Skill & Apple Design Blueprint

## Core Architecture Guidelines
Every screen must adhere to a strict layered structure to match a top-tier mobile application aesthetic.

### 1. Viewport Layering (Stack Layout)
* **Background Canvas:** Set to deep midnight (`Color(0xFF12141C)`). Holds profile highlights, university identity tokens, and context imagery.
* **Overlapping Content Sheet:** High-contrast white foreground container (`Colors.white`) wrapping the core functional scroll views.

### 2. Sheet Boundary Dimensions
* **Top Corner Radius:** Exactly `36.0` on upper points only:
  ```dart
  borderRadius: BorderRadius.only(
    topLeft: Radius.circular(36.0),
    topRight: Radius.circular(36.0),
  )
  ```
* **Shadow Profile:** Subtle ambient blur elevation to cleanly separate container depth:
  ```dart
  boxShadow: [
    BoxShadow(color: Colors.black12, blurRadius: 20.0, offset: Offset(0, -5))
  ]
  ```

### 3. Material Input Design Framework
* **Fill Pattern:** Background tiles must use light slate (`Color(0xFFF3F4F6)`) with explicit `filled: true`.
* **Border Radii:** Standardized outer rounded corners set strictly to `BorderRadius.circular(16.0)`.
* **Border Style:** Explicitly hide default active/inactive lines using `borderSide: BorderSide.none`.
* **Icons:** Pair text input modules with minimalist, descriptive prefix icons (`Icon(Icons.style_outlined, color: Colors.black45)`).

### 4. Primary Actions
* **Pill Geometry:** Form submit controls, entry buttons, and confirmation panels must use fully-rounded horizontal pill geometries (`BorderRadius.circular(16.0)`).
* **Elevations:** Flat structural aesthetics (`elevation: 0`) utilizing crisp, punchy primary color profiles.

### 5. Platform Feature Layout Mapping
* **The Atlas / Dashboard:** Translated into stacked horizontal content cards inside the sheet.
* **Academics (Courses, Problems, Exams):** Formatted into clear, separated item blocks featuring explicit trailing arrow markers (`Icons.arrow_forward_ios`).
* **Rhythm (Monk Mode, Practice):** Rendered as persistent active badge layouts.
