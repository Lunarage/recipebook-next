export interface databaseResult {
  type: 'OK' | 'INVALID INPUT' | 'SERVER ERROR' | 'NOT FOUND' | 'UNKNOWN';
  message: string;
  content?: any;
}
