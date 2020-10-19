
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

export interface IInsightFromDbPayload {
  insight_since: string;
  insight_until: string;
  insight_user_id: string;
  insight_connection_id: string;
}
