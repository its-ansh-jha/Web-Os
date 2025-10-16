# Web OS Design Guidelines

## Design Approach: Fluent Design System with Glassmorphism Enhancement

**Selected Approach**: Microsoft Fluent Design System enhanced with modern glassmorphism aesthetics
**Justification**: Building a Windows-like OS requires familiarity and functionality while showcasing modern visual appeal. Fluent Design provides the foundation for depth, motion, and material, while glassmorphism adds contemporary polish.

**Core Design Principles**:
- Depth through layering and transparency
- Contextual responsiveness with subtle animations
- Consistent spatial relationships across all windows
- Material authenticity with blur and acrylic effects

## Color Palette

**System Colors (Dark Mode Primary)**:
- Desktop Background: 220 25% 12% (deep blue-grey)
- Taskbar/System UI: 220 20% 18% with 40% opacity backdrop blur
- Window Chrome: 220 18% 20% with 60% opacity backdrop blur
- Window Content: 220 15% 16%
- Primary Accent: 210 100% 55% (vibrant blue)
- Secondary Accent: 280 60% 58% (purple for highlights)

**Light Mode Variants**:
- Desktop Background: 210 40% 96%
- Window Chrome: 0 0% 100% with 70% opacity backdrop blur
- Window Content: 0 0% 98%
- Text Primary: 220 15% 20%

**Semantic Colors**:
- Success: 142 71% 45%
- Warning: 38 92% 50%
- Error: 0 72% 51%
- Info: 199 89% 48%

## Typography

**Font System**:
- Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Monospace: 'Fira Code', 'Cascadia Code', 'Monaco', monospace

**Type Scale**:
- Window Titles: 14px, font-weight 600, letter-spacing -0.01em
- App Names (Taskbar): 13px, font-weight 500
- Body Text: 14px, font-weight 400, line-height 1.5
- Button Labels: 13px, font-weight 500
- Menu Items: 13px, font-weight 400
- Code/Terminal: 13px, font-weight 400, font-family monospace

## Layout System

**Spacing Units**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16 for consistent rhythm
- Window padding: p-4 to p-6
- Toolbar spacing: gap-2 to gap-3
- Icon margins: m-2
- Section gaps: gap-4 to gap-8

**Window System**:
- Default window size: min-w-96, min-h-64
- Maximum content width: varies per app (code editor: full width, calculator: fixed)
- Title bar height: h-12
- Border radius: rounded-xl (12px) for windows
- Border radius: rounded-lg (8px) for buttons and inputs

**Desktop Grid**: 
- App icons: grid-cols-auto, gap-8
- Icon size: 64x64px with 12px text below

## Component Library

### Core Window Components

**Window Chrome**:
- Glassmorphism effect: backdrop-blur-xl with bg-opacity-60
- Border: 1px solid with 20% white overlay
- Shadow: Multi-layered shadows for depth (0 10px 40px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1))
- Title bar with app icon (20px), title text, and control buttons (minimize, maximize, close)
- Control buttons: w-12 h-12 with hover states

**Taskbar**:
- Position: fixed bottom-0, h-14
- Glassmorphism: backdrop-blur-2xl with 40% opacity
- Start button: rounded-lg, accent color on hover
- App icons: 40x40px with indicator dot (4px) for active apps
- System tray: time, volume, network icons (20px each)

**Start Menu**:
- Size: w-96 h-[600px]
- Position: bottom-16 left-4
- Sections: Pinned apps (grid), Recent files (list), Power options (footer)
- App tiles: 80x80px with icon and label

### Application-Specific Components

**File Manager**:
- Sidebar: w-48 with folder tree
- Main view: Grid (grid-cols-6) or List (table layout)
- File icons: 64x64px (grid), 24px (list)
- Preview pane: w-72 (optional right panel)

**Code Editor/IDE**:
- Sidebar: w-64 file explorer with tree structure
- Editor: Monaco editor integration, tab bar h-10
- Status bar: h-8 at bottom
- Syntax highlighting: VS Code Dark+ theme colors

**Terminal**:
- Prompt style: `user@webos:~$` in accent color
- Text: monospace, 13px, line-height 1.4
- Input: border-b with focus glow effect
- Command history: up/down arrow navigation

**Paint App**:
- Toolbar: Left sidebar w-16 with tool icons (32x32px)
- Canvas: Center with checkerboard background for transparency
- Color picker: Bottom panel with swatches and HSL sliders
- Layers panel: Right sidebar w-56

**Music Player**:
- Album art: 280x280px with subtle shadow
- Progress bar: h-2 with accent color fill
- Controls: Icon buttons 48x48px
- Playlist: Scrollable list with alternating row colors

### Form Elements

**Buttons**:
- Primary: bg-accent, px-4 py-2, rounded-lg
- Secondary: border with hover fill
- Icon buttons: Square 36x36px or 40x40px

**Inputs**:
- Height: h-10
- Padding: px-3
- Border: 1px with focus ring (accent color, 2px)
- Background: slightly lighter than container

**Context Menus**:
- Width: w-56
- Padding: p-1
- Item height: h-9
- Hover: Subtle accent background
- Dividers: 1px border between sections

## Animations & Interactions

**Window Behaviors**:
- Open: Scale from 0.95 to 1 with opacity fade (200ms ease-out)
- Close: Scale to 0.95 with opacity fade (150ms ease-in)
- Minimize: Scale down to taskbar icon position (250ms cubic-bezier)
- Drag: Slight opacity reduction (0.9) during drag
- Resize: Cursor changes, live preview

**Micro-interactions**:
- Button hover: Scale 1.02, brightness increase
- Icon hover: Transform translateY(-2px)
- Menu expand: Height transition 200ms
- Loading states: Subtle pulse or shimmer effect

**Performance Considerations**:
- Use `will-change: transform` sparingly
- Prefer `transform` and `opacity` for animations
- Limit blur effects to visible windows only

## Special Features

**Glassmorphism Implementation**:
```
backdrop-filter: blur(20px)
background: hsla(220, 20%, 18%, 0.6)
border: 1px solid hsla(0, 0%, 100%, 0.1)
```

**Dynamic Wallpapers**:
- Time-based gradients (morning: warm tones, night: cool tones)
- Smooth transitions every 4 hours
- Parallax effect on mouse movement (subtle 20px shift)

**Accessibility**:
- Focus indicators: 2px accent-colored outline with 2px offset
- Keyboard navigation: Tab order follows visual hierarchy
- Screen reader labels for all interactive elements
- Color contrast: WCAG AAA for text (7:1 minimum)

## Application Icons

**Icon Style**: Flat design with subtle gradients and long shadows
- Size variations: 16px, 24px, 32px, 48px, 64px
- Use Heroicons for system icons via CDN
- App-specific icons: Custom colored variants with brand identity

**Folder Icons**: Classic folder shape with accent color tint based on type (Documents: blue, Images: purple, Music: pink)

This design system creates a cohesive, modern operating system experience that balances functionality with visual sophistication, delivering a polished interface across all 22+ applications.