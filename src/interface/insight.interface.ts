
export interface IInsight {
  [key: string]: Record<string, any> | string | number;
}

export interface IInsightTotal {
  total: number;
}

export interface IInsightChart extends IInsightTotal {
  categories?: string[];
  response: number[];
}

export interface IInsightBase {
  categories: string[];
  id: string;
}
