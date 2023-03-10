export type TagTimeGap = {
    tagId: string;
    gap: number;
};

export type TagTimeGapInterval = {
    interval: {
        from: number;
        to: number;
        tag: string;
        amoung: number;
    };
};

export type ExtractedDataType = {
    time: string;
    tag: string;
    x: string;
    y: string;
  };
  
  export type TimeGapData = {
    firstDataPoint: ExtractedDataType;
    secondDataPoint: ExtractedDataType;
    timeGapSize: number;
  };
  
  export type BubbleChartDataType = {
    x: number;
    y: number;
    r: number;
    label?: string;
  };
  
  export type DatasetType = {
    label: string;
    data: BubbleChartDataType[];
    backgroundColor: string;
  }[];