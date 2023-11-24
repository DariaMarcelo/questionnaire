import { createAction, props } from '@ngrx/store';
import { IQuestion } from '../../interfaces/question.interface';

export const addQuestion = createAction(
  '[Question] Add Question',
  props<{ question: IQuestion }>(),
);

export const editQuestion = createAction(
  '[Question] Edit Question',
  props<{ id: string; question: Partial<IQuestion> }>(),
);

export const deleteQuestion = createAction(
  '[Question] Delete Question',
  props<{ id: string }>(),
);

export const loadQuestions = createAction('[Question] Load Questions');

export const loadQuestionsSuccess = createAction(
  '[Question] Load Questions Success',
  props<{ questions: IQuestion[] }>(),
);

export const loadQuestionsFailure = createAction(
  '[Question] Load Questions Failure',
  props<{ error: any }>(),
);
