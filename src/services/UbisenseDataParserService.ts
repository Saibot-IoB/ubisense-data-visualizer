type ExtractedDataType = {
  time: string,
  tag: string,
  x: string,
  y: string
}

type BubbleChartDataType = {
  x: number,
  y: number,
  r: number
}

export class UbisenseDataParserService {

  // public static dataCache: Record<string, { time: string, tag: string, x: string, y: string }> = {};
  public static dataCache: Map<string, ExtractedDataType[]> = new Map<string, ExtractedDataType[]>();
  public static participant5: BubbleChartDataType[] = [];
  public static participant4: BubbleChartDataType[] = [];
  public static robot1: BubbleChartDataType[] = [];


  public static parseData(data: string) {
    const lines: string[] = data.split('\n');
    lines.shift();

    console.log(lines[3].replace(/\0/g, ''))

    lines.forEach((line: string) => {
      line = line.replace(/\0/g, '');
      const time: string = line.substring(7, 15);
      const tag: string = line.substring(21, 44);
      const valid: string = line.substring(53, 55);
      const x: string = line.substring(63, 68).trim();
      const y: string = line.substring(71, 76).trim();

      // UbisenseDataParserService.dataCache[`${time}-${tag.substring(21)}`] = { time, tag, x, y }
      if (valid == "ok") {
        if (this.dataCache.has(tag)) {
          this.dataCache.get(tag)?.push({ time, tag, x, y })
        } else {
          this.dataCache.set(tag, [{ time, tag, x, y }])
        }
      }
    })

    // console.log(this.dataCache["12:09:10-2E"]);
    // console.log(this.dataCache)

    const participant5 = "00:11:CE:00:00:00:CB:2E";
    const participant4 = "00:11:CE:00:00:00:CB:29";
    const robot1 = "00:11:CE:00:00:00:CB:35";


    if (this.dataCache.has(participant5)) {
      // @ts-ignore
      this.dataCache.get(participant5).forEach(e => {
        this.participant5.push({ x: parseFloat(e.x), y: parseFloat(e.y), r: 4 })
      });
    }

    if (this.dataCache.has(participant4)) {
      // @ts-ignore
      this.dataCache.get(participant4).forEach(e => {
        this.participant4.push({ x: parseFloat(e.x), y: parseFloat(e.y), r: 4 })
      });
    }

    if (this.dataCache.has(robot1)) {
      // @ts-ignore
      this.dataCache.get(robot1).forEach(e => {
        this.robot1.push({ x: parseFloat(e.x), y: parseFloat(e.y), r: 4 })
      });
    }
  }
}