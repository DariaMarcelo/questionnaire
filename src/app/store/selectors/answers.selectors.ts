import { createFeatureSelector } from "@ngrx/store";
import { IAnswerState } from '../reducers/answers.reducer';

export const answersFeatureKey = 'answers';

export const selectQuestions = createFeatureSelector<IAnswerState>(answersFeatureKey);
