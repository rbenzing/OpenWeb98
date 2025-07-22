// js/utils/resizable.js

/**
 * Resizable Utility
 * Enables resizing for an element by attaching event listeners to its resize handles.
 *
 * @param {HTMLElement} element - The element to make resizable.
 */
function makeResizable(element) {
    // Find all resize handles within the element.
    const handles = element.querySelectorAll('.resize-handle');
    
    // Attach mousedown event to each resize handle.
    handles.forEach(handle => {
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the initial mouse coordinates and element dimensions/position.
            const startX = e.clientX;
            const startY = e.clientY;
            const rect = element.getBoundingClientRect();
            const startWidth = rect.width;
            const startHeight = rect.height;
            const startLeft = rect.left;
            const startTop = rect.top;
            
            // Determine the resize direction based on the handle's CSS class.
            let direction = '';
            if (handle.classList.contains('resize-handle-n')) direction = 'n';
            else if (handle.classList.contains('resize-handle-s')) direction = 's';
            else if (handle.classList.contains('resize-handle-e')) direction = 'e';
            else if (handle.classList.contains('resize-handle-w')) direction = 'w';
            else if (handle.classList.contains('resize-handle-ne')) direction = 'ne';
            else if (handle.classList.contains('resize-handle-nw')) direction = 'nw';
            else if (handle.classList.contains('resize-handle-se')) direction = 'se';
            else if (handle.classList.contains('resize-handle-sw')) direction = 'sw';
            
            // Mousemove handler to calculate and apply new size/position.
            function onMouseMove(e) {
                e.preventDefault();
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                switch (direction) {
                    case 'n':
                        newHeight = Math.max(startHeight - deltaY, Config.MIN_WINDOW_HEIGHT);
                        newTop = startTop + (startHeight - newHeight);
                        break;
                    case 's':
                        newHeight = Math.max(startHeight + deltaY, Config.MIN_WINDOW_HEIGHT);
                        break;
                    case 'e':
                        newWidth = Math.max(startWidth + deltaX, Config.MIN_WINDOW_WIDTH);
                        break;
                    case 'w':
                        newWidth = Math.max(startWidth - deltaX, Config.MIN_WINDOW_WIDTH);
                        newLeft = startLeft + (startWidth - newWidth);
                        break;
                    case 'ne':
                        newWidth = Math.max(startWidth + deltaX, Config.MIN_WINDOW_WIDTH);
                        newHeight = Math.max(startHeight - deltaY, Config.MIN_WINDOW_HEIGHT);
                        newTop = startTop + (startHeight - newHeight);
                        break;
                    case 'nw':
                        newWidth = Math.max(startWidth - deltaX, Config.MIN_WINDOW_WIDTH);
                        newHeight = Math.max(startHeight - deltaY, Config.MIN_WINDOW_HEIGHT);
                        newLeft = startLeft + (startWidth - newWidth);
                        newTop = startTop + (startHeight - newHeight);
                        break;
                    case 'se':
                        newWidth = Math.max(startWidth + deltaX, Config.MIN_WINDOW_WIDTH);
                        newHeight = Math.max(startHeight + deltaY, Config.MIN_WINDOW_HEIGHT);
                        break;
                    case 'sw':
                        newWidth = Math.max(startWidth - deltaX, Config.MIN_WINDOW_WIDTH);
                        newHeight = Math.max(startHeight + deltaY, Config.MIN_WINDOW_HEIGHT);
                        newLeft = startLeft + (startWidth - newWidth);
                        break;
                    default:
                        break;
                }
                
                // Update the element's dimensions and position.
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            }
            
            // Remove event listeners on mouseup.
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

// Expose the makeResizable function globally for use in other modules.
window.makeResizable = makeResizable;
