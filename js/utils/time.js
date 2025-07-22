// js/utils/time.js

/**
 * Time Utility
 * Provides utility functions for time-related operations.
 */

/**
 * Formats a Date object into a 12-hour time string with AM/PM.
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted time, e.g., "12:00 PM".
 */
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // Convert 0 or 24 hour to 12
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    // Pad minutes with a leading zero if needed.
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

// Expose the formatTime function globally for use in other modules.
window.formatTime = formatTime;
