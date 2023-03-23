import {LocationData} from '../../common/types/Simple';

export class TimeConverter {
    /**
     * Convert a timestamp with the format HH:mm:ss
     * to a timestamp in seconds
     * @param {string} timestamp formatted timestamp
     * @returns {number} the value of the timestamp in seconds
     */
    public static convertTimestampToSeconds(timestamp: string): number {
        const [hours, minutes, seconds] = timestamp
            .split(":")
            .map((str) => parseInt(str));
        return hours * 3600 + minutes * 60 + seconds;
    }

    public static convertLocationDataTimestampsToSeconds(locationData: LocationData[]): number[] {
        const returnArray: number[] = [];
        
        locationData.forEach((data) => {
            returnArray.push(this.convertTimestampToSeconds(data.time));
        });
        
        return returnArray;
    }
}
