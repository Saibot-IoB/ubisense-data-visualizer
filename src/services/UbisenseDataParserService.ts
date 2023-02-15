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

export type DatasetType = {
  label: string,
  data: BubbleChartDataType[],
  backgroundColor: string,
}[]

export class UbisenseDataParserService {

  // public static dataCache: Record<string, { time: string, tag: string, x: string, y: string }> = {};
  public static dataCache: Map<string, ExtractedDataType[]> = new Map<string, ExtractedDataType[]>();
  public static participant5: BubbleChartDataType[] = [];
  public static participant4: BubbleChartDataType[] = [];
  public static robot1: BubbleChartDataType[] = [];

  public static parseData(data: string) {
    const lines: string[] = data.split('\n');
    lines.shift();


    lines.forEach((line: string) => {
      line = line.replace(/\0/g, '');
      const time: string = line.substring(7, 15);
      const tag: string = line.substring(21, 44);
      const valid: string = line.substring(53, 55);
      const x: string = line.substring(63, 68).trim();
      const y: string = line.substring(71, 76).trim();

      if (valid == "ok") {
        if (this.dataCache.has(tag)) {
          this.dataCache.get(tag)?.push({ time, tag, x, y })
        } else {
          this.dataCache.set(tag, [{ time, tag, x, y }])
        }
      }
    })
  }

  public static GetExperimentDuration(): { start: number, end: number } {
    const timeArr: number[] = []

    this.dataCache.forEach((value, key) => {
      const currentArr: BubbleChartDataType[] = [];

      value.forEach((e: ExtractedDataType) => {
        currentArr.push({ x: parseFloat(e.x), y: parseFloat(e.y), r: 4 })
        const timeArrStr = e.time.split(":")
        timeArr.push((parseInt(timeArrStr[0]) * 60 * 60 + parseInt(timeArrStr[1]) * 60 + parseInt(timeArrStr[2])));
      });
    });

    return { start: 0, end: Math.max(...timeArr) - Math.min(...timeArr) }
  }

  public static GetExperimentInterval(): { start: number, end: number } {
    const timeArr: number[] = []

    this.dataCache.forEach((value, key) => {
      const currentArr: BubbleChartDataType[] = [];

      value.forEach((e: ExtractedDataType) => {
        currentArr.push({ x: parseFloat(e.x), y: parseFloat(e.y), r: 4 })
        const timeArrStr = e.time.split(":")
        timeArr.push((parseInt(timeArrStr[0]) * 60 * 60 + parseInt(timeArrStr[1]) * 60 + parseInt(timeArrStr[2])));
      });
    });

    return { start: Math.min(...timeArr), end: Math.max(...timeArr) }
  }

  public static GetBubbleChartDatasets(rangeStart: number, rangeEnd: number): DatasetType {
    let index = 0;
    const datasets: DatasetType = []

    const mapping: Record<string, string> = {
      '00:11:CE:00:00:00:CB:34': 'Participant 5',
      '00:11:CE:00:00:00:CB:23': 'Participant 4',
      '00:11:CE:00:00:00:CB:2B': 'Participant 3',
      '00:11:CE:00:00:00:CB:29': 'Participant 2',
      '00:11:CE:00:00:00:CB:2E': 'Participant 1',
      '00:11:CE:00:00:00:CB:35': '4701',
      '00:11:CE:00:00:00:CB:25': '4702',
      '00:11:CE:00:00:00:CB:2C': '4703',
      '00:11:CE:00:00:00:CB:33': 'White',
    }

    const colors: string[] = [
      "rgba(233, 30, 99), 0.5)",
      "rgba(156, 39, 17, 0.5)",
      "rgba(3, 169, 24, 0.5)",
      "rgba(0, 150, 136, 0.5)",
      "rgba(255, 235, 59, 0.5)",
      "rgba(255, 152, 0, 0.5)",
      "rgba(255, 87, 34, 0.5)",
      "rgba(121, 85, 72, 0.5)",
      "rgba(96, 125, 13, 0.5)"
    ]


    this.dataCache.forEach((value, key) => {
      const currentArr: BubbleChartDataType[] = [];
      const experimentStart = this.GetExperimentInterval().start;

      value.forEach((e: ExtractedDataType) => {
        const timeArrStr = e.time.split(":")
        const timeInSeconds = (parseInt(timeArrStr[0]) * 60 * 60 + parseInt(timeArrStr[1]) * 60 + parseInt(timeArrStr[2]));

        if (
          timeInSeconds >= rangeStart + experimentStart &&
          timeInSeconds <= rangeEnd + experimentStart
        ) {
          currentArr.push({ x: parseFloat(e.x), y: parseFloat(e.y), r: 3 })
        }
      });

      datasets.push({
        label: mapping[key],
        data: currentArr,
        backgroundColor: colors[index]
      });

      index++;
    })

    return datasets;
  }
}