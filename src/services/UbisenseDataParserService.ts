export class UbisenseDataParserService {
    public static dataCache: Record<string, {time: string, tag: string, x: string, y: string }> = {};
    
    public static parseData(data: string) {
        const lines: string[] = data.split('\n');
        lines.shift();

        lines.forEach((line: string) => {
            const time: string = line.substring(7, 15);
            const tag: string = line.substring(21, 44);
            const x: string = line.substring(63, 68).trim();
            const y: string = line.substring(71, 76).trim();
            console.log(time);

            UbisenseDataParserService.dataCache[`${time}-${tag.substring(21)}`] = { time, tag, x, y }
        })

        console.log(this.dataCache["12:09:10-2E"]);
    }
}