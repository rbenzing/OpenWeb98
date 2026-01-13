# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **full-featured Windows 98 desktop simulation** built with vanilla JavaScript, HTML, and CSS. It includes a mock file system, working applications (Calculator, Minesweeper, Notepad, Paint), Start Menu with Programs submenu, context menus, and authentic Windows 98 behavior.

## Development

This is a static web application with no build process. To run:
- Open [index.html](index.html) directly in a web browser
- Or serve via any static web server (e.g., `python -m http.server` or `npx serve`)

## New Features (Latest Update)

### Mock File System
- **Location**: [js/utils/fileSystem.js](js/utils/fileSystem.js), [js/data/fileSystemData.js](js/data/fileSystemData.js)
- In-memory file system with C:, A:, D: drives
- Full navigation with path parsing and history (back/forward/up)
- File operations: create, delete, rename, copy, paste, search
- File content management
- Access via `State.fileSystem` - initialized in [js/main.js](js/main.js)

### Start Menu & Programs
- **Location**: [js/components/menus.js](js/components/menus.js), [js/data/programsData.js](js/data/programsData.js)
- Fully functional Start Menu with click and hover handlers
- Programs submenu with nested submenus (Accessories, System Tools, Games, etc.)
- Settings, Find, and Documents submenus
- Submenu positioning with viewport boundary detection
- Hover delay for submenu appearance (configurable in Config)

### Working Applications
- **Location**: [js/windows/apps.js](js/windows/apps.js)
- **Calculator**: Fully functional with all operations (+, -, *, /, backspace, clear)
- **Minesweeper**: Complete playable game (8x8 grid, 10 mines, flag/reveal, win/lose detection, timer)
- **Notepad**: Text editing with file integration hooks
- **Paint**: Basic canvas drawing functionality
- **Solitaire**: UI framework (full game logic pending)

### Modular Window System
- **Core**: [js/windows/core.js](js/windows/core.js) - Window lifecycle management
- **Apps**: [js/windows/apps.js](js/windows/apps.js) - Application windows
- **Integration**: [js/windows/integration.js](js/windows/integration.js) - Bridges old and new systems
- Backwards compatible with existing [js/components/windows.js](js/components/windows.js)

### Enhanced Configuration
- **Location**: [js/config.js](js/config.js)
- File extension to icon mapping
- Submenu positioning constants
- File system limits (max filename/path length)
- Recent documents tracking

### Enhanced State
- **Location**: [js/state.js](js/state.js)
- `fileSystem`: Mock file system instance
- `recentDocuments`: Recent file tracking
- `desktopWallpaper`: Current desktop theme
- `doubleClickSpeed`: Click sensitivity
- `mouseButtonsSwapped`: Mouse configuration

## Architecture

### Module System

The application uses a global namespace pattern with a modular architecture:

- **`window.WinOS`** - Main application namespace
- **`window.WinOS.components`** - Contains all component modules (desktop, taskbar, windows, menus)
- **`window.State`** - Global application state (defined in [js/state.js](js/state.js))
- **`window.Config`** - Configuration constants (defined in [js/config.js](js/config.js))

### Script Loading Order

**CRITICAL**: Scripts must be loaded in this exact order (as defined in [index.html](index.html)):
1. [js/config.js](js/config.js) - Configuration constants
2. [js/state.js](js/state.js) - Application state
3. [js/utils/draggable.js](js/utils/draggable.js) - Dragging utility
4. [js/utils/resizable.js](js/utils/resizable.js) - Resizing utility
5. [js/utils/time.js](js/utils/time.js) - Time utility
6. [js/components/desktop.js](js/components/desktop.js) - Desktop icons
7. [js/components/taskbar.js](js/components/taskbar.js) - Taskbar
8. [js/components/windows.js](js/components/windows.js) - Window management
9. [js/components/menus.js](js/components/menus.js) - Menus
10. [js/components/recycleBin.js](js/components/recycleBin.js) - Recycle bin
11. [js/main.js](js/main.js) - Initialization

Each component script attaches itself to the global namespace and may depend on previously loaded modules.

### Core Components

**Desktop** ([js/components/desktop.js](js/components/desktop.js))
- Creates and positions desktop icons vertically on the left side
- Handles icon selection, double-click actions, and context menus
- Each icon has a name, icon image, and optional action callback

**Windows** ([js/components/windows.js](js/components/windows.js))
- Central window management system
- Creates windows with titlebar, optional menu bar, and content area
- Handles window lifecycle: create, activate, minimize, maximize, restore, close
- Manages z-index stacking and window state in `State.openWindows`
- Contains specialized window types:
  - `openMyComputer()` - File explorer with folder/drive navigation
  - `openRecycleBin()` - Displays deleted items
  - `openMyDocuments()` - Documents folder view
  - `openInternetExplorer()` - Browser simulation
  - `openControlPanel()` - System settings interface

**Taskbar** ([js/components/taskbar.js](js/components/taskbar.js))
- Renders taskbar at bottom of screen
- Creates task buttons for open windows
- Handles start menu toggle
- Updates system tray clock

**Menus** ([js/components/menus.js](js/components/menus.js))
- Manages context menus (desktop and icon-specific)
- Handles start menu interactions
- Positions menus to prevent viewport overflow

### Utilities

**makeDraggable()** ([js/utils/draggable.js](js/utils/draggable.js))
- Enables dragging elements by a handle
- Used for moving windows by their titlebar
- Automatically activates window on drag start

**makeResizable()** ([js/utils/resizable.js](js/utils/resizable.js))
- Enables resizing elements via resize handles
- Enforces minimum dimensions from Config
- Used for all window resizing

### State Management

Global state in `window.State` tracks:
- `openWindows` - Array of window objects with element, title, dimensions, minimized/maximized state
- `activeWindow` - Currently focused window
- `zIndexCounter` - Incrementing z-index for window stacking
- `selectedIcon` - Currently selected desktop icon
- `recycleBinFiles` - Items in recycle bin
- `dragState`, `resizeState` - Interaction state
- `contextMenuOpen` - Context menu visibility flag

### CSS Architecture

Main stylesheet [css/win98.css](css/win98.css) imports all other stylesheets:
- [css/reset.css](css/reset.css) - CSS reset
- [css/global.css](css/global.css) - Global styles
- [css/desktop.css](css/desktop.css) - Desktop and icon styles
- [css/taskbar.css](css/taskbar.css) - Taskbar styles
- [css/menus.css](css/menus.css) - Menu styles
- [css/windows.css](css/windows.css) - Window chrome styles
- [css/explorer.css](css/explorer.css) - File explorer styles
- [css/internetExplorer.css](css/internetExplorer.css) - Browser styles
- [css/controlPanel.css](css/controlPanel.css) - Control panel styles
- [css/iconSprites.css](css/iconSprites.css) - Icon sprite definitions
- [css/forms.css](css/forms.css) - Form controls
- [css/dialog.css](css/dialog.css) - Dialog styles

### Icons

Icons are stored in [icons/](icons/) directory and sourced from Windows 98 icon sets. Some icons are also fetched from `https://win98icons.alexmeub.com`.

## Using New Features

### Launch Applications
```javascript
// From Start Menu: Start → Programs → Accessories → Calculator
// Or programmatically:
Windows.launchCalculator();
Windows.launchMinesweeper();
Windows.launchNotepad('filename.txt', 'C:\\Path\\To\\File');
Windows.launchPaint();
Windows.launchSolitaire();
```

### File System Operations
```javascript
// Navigate
State.fileSystem.navigate('C:\\Windows\\System');
State.fileSystem.goBack();
State.fileSystem.goForward();
State.fileSystem.goUp();

// Create/Delete
State.fileSystem.createFolder('C:\\', 'NewFolder');
State.fileSystem.createFile('C:\\NewFolder', 'test.txt', 'Hello World!');
State.fileSystem.deleteItem('C:\\NewFolder\\test.txt');

// Copy/Paste
State.fileSystem.copyToClipboard('C:\\file.txt');
State.fileSystem.pasteFromClipboard('C:\\Destination');

// Search
State.fileSystem.search('C:\\', '*.txt', true);

// File Content
State.fileSystem.getFileContent('C:\\file.txt');
State.fileSystem.setFileContent('C:\\file.txt', 'New content');
```

### Add Programs to Start Menu
Edit [js/data/programsData.js](js/data/programsData.js) to add items to Programs submenu:
```javascript
{
    name: 'My App',
    icon: 'icons/myapp.png',
    type: 'app',
    action: 'openMyApp'  // Then implement in menus.js handleSubmenuAction
}
```

## Adding New Features

**To add a new application:**
1. Add method to [js/windows/apps.js](js/windows/apps.js) following WindowsApps pattern
2. Create window using `WindowCore.createWindow(title, content, width, height...)`
3. Add app launcher to [js/windows/integration.js](js/windows/integration.js)
4. Add to Programs menu in [js/data/programsData.js](js/data/programsData.js)

**To add a new desktop icon:**
1. Add icon data to the `icons` array in [js/components/desktop.js](js/components/desktop.js)
2. Provide name, icon path, and action callback
3. Action typically calls a window creation method

**To add a new context menu:**
1. Create menu in [js/components/menus.js](js/components/menus.js) following existing patterns
2. Use `buildSubmenuHTML()` for dynamic menus
3. Attach event listeners and handle actions

## Key Patterns

- Components self-register to `window.WinOS.components` namespace
- All components expose an `init()` method called from [js/main.js](js/main.js)
- Event delegation is used for dynamic elements (task buttons, menu items)
- Window state is preserved during minimize/maximize operations in `prevDimensions`
- Z-index management ensures proper window stacking order
