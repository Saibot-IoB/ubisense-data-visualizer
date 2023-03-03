export class TimeFormatter {
    /**
     * Format an interval with a start and an end time,
     * both measured in seconds, as a string with
     * the format HH:mm:ss-HH:mm:ss
     * @param {number} start The start of the interval
     * @param {number} end The end of the interval
     * @returns {string} The formatted interval
     */
    public static formatInterval(start: number, end: number): string {
        const startStr = TimeFormatter.formatTimestamp(start);
        const endStr = TimeFormatter.formatTimestamp(end);
        return `${startStr}-${endStr}`;
    }
    
      /**
       * Converts a timestamp in seconds to a string
       * with the format HH:mm:ss
       * @param {number} timestamp in seconds
       * @returns {string} String with the format HH:mm:ss
       */
      public static formatTimestamp(timestamp: number): string {
        const hours = Math.floor(timestamp / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((timestamp % 3600) / 60).toString().padStart(2, '0');
        const seconds = (timestamp % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
}