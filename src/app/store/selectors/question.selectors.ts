import { createFeatureSelector } from "@ngrx/store";
import { IQuestionState } from "../reducers/question.reducer";

export const questionFeatureKey = 'questions';

export const selectQuestions = createFeatureSelector<IQuestionState>(questionFeatureKey);


