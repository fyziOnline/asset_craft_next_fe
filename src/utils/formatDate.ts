/**
 * Formats a given timestamp into a string with the format "DD-MM-YYYY".
 *
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */

export const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};
