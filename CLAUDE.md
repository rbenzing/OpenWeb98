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
- **Explorer**: [js/windows/explorer.js](js/windows/explorer.js) - Windows 98 Explorer with view modes
- **Integration**: [js/windows/integration.js](js/windows/integration.js) - Bridges old and new systems
- Backwards compatible with existing [js/components/windows.js](js/components/windows.js)

### Windows Explorer (NEW)
- **Location**: [js/windows/explorer.js](js/windows/explorer.js), [css/explorer.css](css/explorer.css)
- Authentic Windows 98 Explorer interface with toolbar, address bar, and status bar
- **Four View Modes**: Large Icons, Small Icons, List, Details (switchable via Views button)
- **SVG Toolbar Icons**: All icons embedded as inline SVG (no external files needed)
- **Applies to all explorer-style windows**: My Computer, Control Panel, Recycle Bin, folders
- Interactive item selection (click, Ctrl+click for multiple)
- Proper icon alignment and spacing matching Windows 98
- Address bar with dropdown button (structure ready for navigation history)
- Status bar shows object count

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

### Use Windows Explorer
```javascript
// Open explorer-style windows
Windows.launchMyComputer();      // My Computer with drives
Windows.launchControlPanel();    // Control Panel with applets

// Or use WindowsExplorer directly
WindowsExplorer.openMyComputer();
WindowsExplorer.openControlPanel();
```

**View Modes**: Click the "Views" toolbar button to switch between:
- Large Icons (75x75px with 32x32 icons)
- Small Icons (compact vertical columns)
- List (simple list view)
- Details (spreadsheet-style with Name, Size, Type, Modified columns)

**Features**:
- Click to select items (Ctrl+click for multiple selection)
- Double-click to open/navigate
- All toolbar buttons with SVG icons
- Address bar with location and dropdown
- Status bar shows object count

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

### Create New Explorer-Style Windows
To create a new explorer window (like a folder or special view):

```javascript
// Add method to WindowsExplorer in js/windows/explorer.js
openMyFolder: function() {
    const content = this.buildExplorerContent('My Folder', this.getMyFolderItems());

    const windowData = WindowCore.createWindow(
        'My Folder',
        content,
        640,
        480,
        null,
        null,
        true,
        'icons/folder-icon.png'
    );

    this.initializeExplorer(windowData.element);
    return windowData;
},

// Add items data method
getMyFolderItems: function() {
    return [
        {
            name: 'File.txt',
            icon: 'icons/file_text-0.png',
            action: 'openFile',
            size: '1 KB',
            type: 'Text Document',
            modified: '12/25/1998'
        }
        // ... more items
    ];
}
```

Then wire it in [js/windows/integration.js](js/windows/integration.js):
```javascript
Windows.launchMyFolder = function() {
    if (WindowsExplorer && WindowsExplorer.openMyFolder) {
        return WindowsExplorer.openMyFolder();
    }
};
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

## Best Practices & Common Pitfalls

### Icon File Validation
**ALWAYS verify icon files exist before using them:**

```bash
# Check if icon exists before adding to code
ls icons/ | grep "icon-name"
```

**Common icon mapping issues:**
- `help_book-0.png` → Use `help_book_small-0.png` (check available sizes)
- `shut_down-0.png` → Use `shut_down_normal-0.png` or `shut_down_cool-0.png`
- `directory_program_group-0.png` → Use `directory_closed-1.png`
- `paste-0.png`, `properties-0.png` → Check for alternatives like `document-0.png`, `display_properties-0.png`

**Icon naming conventions:**
- Many icons have variants: `-0.png`, `-1.png`, `_small`, `_cool`, `_normal`, `_big`
- Check [icons/](icons/) directory or use: `ls icons/ | grep "keyword"` to find matches
- Prefer existing icon variants over creating placeholders

### Content Security Policy (CSP)
The CSP in [index.html](index.html) must allow necessary resources:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    img-src https://win98icons.alexmeub.com 'self' data:;
    font-src 'self' https://unpkg.com;
    style-src 'self' 'unsafe-inline';
    script-src 'self' 'unsafe-inline';">
```

**Required directives:**
- `font-src https://unpkg.com` - For MS Sans Serif fonts
- `img-src data:` - For inline SVG/canvas images
- `img-src https://win98icons.alexmeub.com` - External icon fallbacks

### UI Polish - No Blocking Dialogs
**NEVER use `alert()`, `confirm()`, or `prompt()` in production code:**

❌ **Bad:**
```javascript
launchApp: function(appName) {
    alert(`${appName} will be implemented later!`);
}
```

✅ **Good:**
```javascript
launchApp: function(appName) {
    console.log(`Launching ${appName}...`);
    // Implementation or silent placeholder
}
```

**Placeholders should:**
- Log to console for debugging
- Do nothing visibly (don't interrupt user)
- Have comments indicating future implementation

### Submenu CSS Pattern
When creating submenus, ALWAYS use flex column layout:

```css
/* Container must specify vertical layout */
#my-submenu .menu-items {
    display: flex;
    flex-direction: column;  /* CRITICAL: prevents horizontal layout */
    width: 100%;
}

/* Items need proper styling */
.submenu-item {
    position: relative;
    height: 24px;
    padding: 3px 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.submenu-item:hover {
    background-color: #000080;
    color: white;
}
```

**Common mistakes:**
- Forgetting `flex-direction: column` causes horizontal layout
- Not setting proper height/padding makes items overlap
- Missing hover styles breaks visual feedback

### Click-Outside Handler Pattern
For menus that should close when clicking outside:

```javascript
setupClickOutsideHandler: function() {
    // Remove old handler first
    this.removeClickOutsideHandler();

    // Use setTimeout to avoid immediate closure
    setTimeout(() => {
        this.clickOutsideHandler = (e) => {
            const menu = document.getElementById('my-menu');
            const trigger = document.getElementById('trigger-button');

            const clickedOutside =
                !menu?.contains(e.target) &&
                !trigger?.contains(e.target);

            if (clickedOutside) {
                this.hideMenu();
            }
        };

        document.addEventListener('click', this.clickOutsideHandler);
    }, 0);
},

removeClickOutsideHandler: function() {
    if (this.clickOutsideHandler) {
        document.removeEventListener('click', this.clickOutsideHandler);
        this.clickOutsideHandler = null;
    }
}
```

**Key points:**
- Always clean up old handlers before adding new ones
- Use `setTimeout(() => {}, 0)` to avoid race conditions
- Check all related elements (menu, trigger, submenus)
- Call cleanup in hide/close methods

### Integration Between Old and New Code
When adding new functionality alongside existing code:

**Use integration layer pattern:**
```javascript
// js/windows/integration.js
Windows.launchMyApp = function() {
    if (WindowsApps && WindowsApps.openMyApp) {
        return WindowsApps.openMyApp();
    } else {
        // Fallback to old implementation
        return this.createMyAppWindow();
    }
};
```

**Benefits:**
- Maintains backward compatibility
- Allows gradual migration
- Provides fallbacks for incomplete features
- Keeps old code functional while adding new features

### Component Communication
**Preferred communication pattern:**

```javascript
// Check if component exists before calling
if (WinOS && WinOS.components.myComponent) {
    WinOS.components.myComponent.myMethod();
}
```

**When modifying shared state:**
```javascript
// Use State object for shared data
State.mySharedData = newValue;

// Notify other components if needed
if (WinOS && WinOS.components.otherComponent) {
    WinOS.components.otherComponent.onDataChange();
}
```

### Script Loading Order
**CRITICAL:** Scripts must load in dependency order (see [index.html](index.html)):

1. Config & State (no dependencies)
2. Data files (depend on nothing)
3. Utils (depend on Config/State)
4. Window Core (depends on Config/State/Utils)
5. Window Modules (depend on Core)
6. Components (depend on Config/State/Utils)
7. Integration (depends on Components + Window Modules)
8. Main initialization (depends on everything)

**Never:**
- Load integration before components
- Load apps before core
- Load components before utils
- Access objects before they're defined

### Testing Checklist
Before committing changes:

- [ ] All icon paths verified to exist
- [ ] No console errors (ERR_FILE_NOT_FOUND, CSP violations)
- [ ] No `alert()` or blocking dialogs in code
- [ ] Submenus display vertically
- [ ] Click-outside behavior works correctly
- [ ] New features integrate with existing code
- [ ] Script loading order preserved
- [ ] CSS doesn't break existing layouts
- [ ] Cross-component communication uses proper checks

## Troubleshooting Common Issues

### Issue: Icons not loading (404 errors)
**Solution:** Check actual icon names in `icons/` directory
```bash
ls icons/ | grep "keyword"
```

### Issue: Fonts blocked by CSP
**Solution:** Add `font-src` to CSP meta tag in index.html

### Issue: Menus arranged horizontally
**Solution:** Add `flex-direction: column` to submenu container CSS

### Issue: Menus don't close when clicking outside
**Solution:** Implement click-outside handler pattern (see above)

### Issue: Integration between components fails
**Solution:** Always check component existence with `if (WinOS && WinOS.components.X)`

### Issue: Script load order errors
**Solution:** Verify order in index.html matches dependency graph
