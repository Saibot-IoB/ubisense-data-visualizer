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

    public static timeStrToSeconds = (time: string): number => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    public static secondsToTimeStr = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsStr = secs < 10 ? `0${secs}` : `${secs}`;

        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    };
}
