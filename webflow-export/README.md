# Vortex Section - Webflow Integration Guide

This folder contains a standalone export of the Vortex Section, ported from React/Three.js to Vanilla JS/Three.js.

## Contents
- `index.html`: The HTML structure.
- `style.css`: The styles (extracted from Tailwind).
- `script.js`: The logic (Three.js scene + Scroll interactions).

## How to Test Locally
1. Open `index.html` in your browser.
2. You should see the dark background.
3. Scroll down. The "Vortex" funnel should appear, animate, and the text phases should fade in/out.

## How to Integrate into Webflow

### 1. Add Custom Code (Head)
In your Webflow project settings or page settings, add the following to the **Head Code**:

```html
<!-- Load Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Add Styles -->
<style>
  /* Paste the contents of style.css here */
  /* OR host style.css externally and link it */
</style>
```

### 2. Add HTML Structure
Add an **Embed** element to your page where you want the section to appear. Paste the HTML structure from `index.html`:

```html
<div id="vortex-section" class="vortex-section">
    <!-- Paste the inner content of the body from index.html here -->
    <!-- Make sure to include the sticky-wrapper and all its children -->
</div>
```

### 3. Add Custom Code (Footer / Before Body Close)
Add the following to the **Footer Code**:

```html
<script>
  // Paste the contents of script.js here
  // OR host script.js externally and link it
</script>
```

## Important Notes
- **Fonts**: The code assumes `Open Sauce Sans`. Ensure this font is loaded in your Webflow project, or update the `font-family` in the CSS to match your project's fonts.
- **Images/Assets**: This export uses procedural graphics (Three.js), so no external image assets are required for the background.
- **IDs**: The script relies on specific IDs (`vortex-section`, `canvas-container`, `scroll-bar`, etc.). Do not change these IDs in the HTML without updating the JavaScript.
