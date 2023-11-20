export interface IQuestion {
  id: string;
  text: string;
  type: string;
  dateCreated: Date;
  options?: string[];
  answer?: string;
}
