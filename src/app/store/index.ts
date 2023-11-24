import { ActionReducerMap } from '@ngrx/store';
import * as fromQuestion from './reducers/question.reducer';
import { questionFeatureKey } from "./selectors/question.selectors";

export interface IAppState {
  [questionFeatureKey]: fromQuestion.IQuestionState;
}

export const reducers: ActionReducerMap<IAppState> = {
  [questionFeatureKey]: fromQuestion.questionReducer,
};
