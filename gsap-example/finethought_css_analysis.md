# Fine Thought CSS Animation Analysis

## Key Animation Techniques Identified

### 1. State-Based Animation System
- Uses CSS classes with `state-` prefix for different animation states
- Key states: `state-site-loaded`, `state-light-mode`, `state-info-open`, `state-hide`
- Transitions triggered by adding/removing these classes via JavaScript

### 2. CSS Transitions
- Primary animation method: CSS transitions on various properties
- Common transition properties:
  - `background-color .25s` (theme switching)
  - `opacity .5s` (fade effects)
  - `left .4s` (sliding panels)
  - `transform` (scaling, translation)

### 3. Cover/Loading System
```css
.c-cover {
  position: fixed;
  z-index: 9999;
  background-color: #282828;
}
.state-site-loaded .c-cover {
  opacity: 0;
  left: -9999px;
  transition: opacity .5s, left 0s linear .5s;
}
```

### 4. Guide System (Background Grid)
```css
.c-guides {
  position: absolute;
  z-index: -1;
  opacity: 0;
  display: flex;
  flex-wrap: wrap;
}
```

### 5. Interactive Elements
- `.c-interactive` - Main interactive layer (z-index: 100)
- `.c-interactive__link__lines-column` - Line number elements
- Hover effects with opacity and background-color transitions

### 6. Panel System
- Sliding panels with transform and position transitions
- GUI panels that slide in/out based on state classes
- Responsive behavior with different animations per breakpoint

### 7. Typography Animation
- Font transitions and scaling
- Text color transitions for theme switching
- Line-height and spacing animations

## Animation Patterns

### Loading Sequence
1. Page loads with `.c-cover` overlay
2. JavaScript adds `state-site-loaded` class
3. Cover fades out and slides away
4. Main content becomes visible

### Theme Switching
- Background color transitions on body/html
- Border color changes on panels
- Text color transitions

### Interactive States
- Hover effects on buttons and links
- Focus states with background color changes
- Active states with transform effects

## No CSS Keyframes Found
- All animations use CSS transitions, not @keyframes
- State changes are controlled by JavaScript class manipulation
- Smooth, performant transitions using GPU-accelerated properties

