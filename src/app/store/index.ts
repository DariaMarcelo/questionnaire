import { ActionReducerMap } from '@ngrx/store';
import * as fromQuestion from './reducers/question.reducer';

export interface IAppState {
  questions: fromQuestion.IQuestionState;
}

export const reducers: ActionReducerMap<IAppState> = {
  questions: fromQuestion.questionReducer,
};
