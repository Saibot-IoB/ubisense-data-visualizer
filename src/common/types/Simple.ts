export type TagTimeGap = {
  tagId: string;
  gap: number;
};

export type LocationData = {
  time: string;
  tag: string;
  x: string;
  y: string;
};

export type TimeGapData = {
  locationA: LocationData;
  locationB: LocationData;
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