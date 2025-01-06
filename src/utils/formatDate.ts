export const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    // const hours = date.getHours().toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
};
