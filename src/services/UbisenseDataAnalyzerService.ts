import { time } from "console";
import { ExtractedDataType, UbisenseDataParserService } from "./UbisenseDataParserService";

export type TagTimeGap = {
  tagId: string,
  gap: number
}

export type TagTimeGapInterval = {
  interval: {
    from: number,
    to: number,
    tag: string,
    amoung: number
  }
}

export class UbisenseDataAnalyzerService {
  private readonly dataCache: Map<string, ExtractedDataType[]>;

  constructor() {
    this.dataCache = UbisenseDataParserService.GetParsedData();
  }

  public LargestGapInData(): TagTimeGap[] {
    const toReturn: TagTimeGap[] = [];

    // For hver key
    this.dataCache.forEach((value, key) => {
      let currentLargetsGap: number = 0;

      // Tjek alle values til den key
      for (let i = 0; i < value.length; i++) {
        const element = value[i];

        if (i + 1 < value.length) {

          // Udregn gap mellem i og i+1
          let timeGap = (this.TimestampToSeconds(value[i + 1].time) - this.TimestampToSeconds(element.time));

          // Hvis gap er større end hvad vi havde so fare
          if (timeGap > currentLargetsGap)
            currentLargetsGap = timeGap;
        }
      }
      // Returner listen af tags og deres time gap i sekunder
      toReturn.push({ tagId: key, gap: currentLargetsGap })
    })
    return toReturn;
  };

  public SmallestGapInData(): TagTimeGap[] {
    const toReturn: TagTimeGap[] = [];

    // For hver key
    this.dataCache.forEach((value, key) => {
      let currentSmallestGap: number = 0;

      // Tjek alle values til den key
      for (let i = 0; i < value.length; i++) {
        const element = value[i];

        if (i + 1 < value.length) {

          // Udregn gap mellem i og i+1
          let timeGap = (this.TimestampToSeconds(value[i + 1].time) - this.TimestampToSeconds(element.time));

          // Hvis gap er større end hvad vi havde so fare
          if (timeGap < currentSmallestGap)
            currentSmallestGap = timeGap;
        }
      }
      // Returner listen af tags og deres time gap i sekunder
      toReturn.push({ tagId: key, gap: currentSmallestGap })
    })
    return toReturn;
  }

  public AverageGapInData(): TagTimeGap[] {
    const toReturn: TagTimeGap[] = [];

    // For hver key
    this.dataCache.forEach((value, key) => {
      let timegapList: number[] = [];

      // Tjek alle values til den key
      for (let i = 0; i < value.length; i++) {
        const element = value[i];

        if (i + 1 < value.length) {

          // Udregn gap mellem i og i+1
          let timeGap = (this.TimestampToSeconds(value[i + 1].time) - this.TimestampToSeconds(element.time));
          // Tilføj timegap til liste
          timegapList.push(timeGap);
        }
      }
      // Gennemsnit af liste og 
      const sum = timegapList.reduce((a, b) => a + b, 0);
      const avg = (sum / timegapList.length) || 0;

      toReturn.push({ tagId: key, gap: parseFloat(avg.toFixed(2)) })
    })
    return toReturn;
  }

  private TimestampToSeconds(timestamp: string): number {
    const timeArrStr = timestamp.split(":");
    return (parseInt(timeArrStr[0]) * 60 * 60 + parseInt(timeArrStr[1]) * 60 + parseInt(timeArrStr[2]));
  }
}
