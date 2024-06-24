interface EventParams {
  payloadKeys: string[];
  staticValues: Record<string, string>;
}

export interface AddRecordToMongo extends EventParams {
  recordName: string;
}

export interface SendToNextQueue extends EventParams {
  queueName: string;
}
