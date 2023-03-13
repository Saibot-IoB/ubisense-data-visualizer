export type TagTimeGap = {
  tagId: string;
  gap: number;
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

export type TableDataRow = {
  propertyName: string,
  propertyValue: string | number
}[];

export type LineDatasetType = {
  label: string,
  data: number[],
  borderColor: string,
  backgroundColor: string
}[];