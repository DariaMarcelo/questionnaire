export interface IQuestion {
  id: string;
  text: string;
  type: string;
  dateCreated: Date;
  options?: string[];
  answer?: string;
}


export interface IAnswer {
  id: string;
  questionId: string;
  selectedOption?: string;
  openAnswer?: string;
}
