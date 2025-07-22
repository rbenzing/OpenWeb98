// js/utils/draggable.js

/**
 * Draggable Utility
 * Adds drag-and-drop capability to an element using a specified handle.
 *
 * @param {HTMLElement} element - The element to be made draggable.
 * @param {HTMLElement} handle - The handle element that initiates the drag.
 */
function makeDraggable(element, handle) {
    if (!element || !handle) {
        console.error('makeDraggable: element or handle is null');
        return;
    }

    handle.addEventListener('mousedown', function(e) {
        // Only handle left mouse button clicks.
        if (e.button !== 0) return;

        // Don't drag if clicking on window controls
        if (e.target.closest('.window-control') || e.target.closest('.window-menu-item')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Record the starting mouse position.
        const startX = e.clientX;
        const startY = e.clientY;

        // Record the element's starting position.
        const rect = element.getBoundingClientRect();
        const startLeft = rect.left;
        const startTop = rect.top;

        // Optionally, activate the window if this element is part of a window.
        if (window.WinOS && WinOS.components.windows) {
            const windowData = window.State.openWindows.find(w => w.element === element);
            if (windowData) {
                WinOS.components.windows.activateWindow(windowData);
            }
        }

        // Define the mousemove handler.
        function onMouseMove(e) {
            e.preventDefault();
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            element.style.left = `${startLeft + deltaX}px`;
            element.style.top = `${startTop + deltaY}px`;
        }

        // Define the mouseup handler to remove event listeners.
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Attach the mousemove and mouseup handlers.
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Expose the makeDraggable function globally so it can be used by other modules.
window.makeDraggable = makeDraggable;
