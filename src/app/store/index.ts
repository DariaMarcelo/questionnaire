import { ActionReducerMap } from '@ngrx/store';
import * as fromQuestion from './reducers/question.reducer';
import * as fromAnswers from './reducers/answers.reducer';
import { questionFeatureKey } from "./selectors/question.selectors";
import { answersFeatureKey } from "./selectors/answers.selectors";

export interface IAppState {
  [questionFeatureKey]: fromQuestion.IQuestionState;
  [answersFeatureKey]: fromAnswers.IAnswerState;
}

export const reducers: ActionReducerMap<IAppState> = {
  [questionFeatureKey]: fromQuestion.questionReducer,
  [answersFeatureKey]: fromAnswers.answerReducer,
};
