import { createAction, props } from '@ngrx/store';
import { IQuestion } from '../../interfaces/question.interface';

export const addQuestion = createAction(
  '[Question] Add Question',
  props<{ question: IQuestion }>()
);

export const editQuestion = createAction(
  '[Question] Edit Question',
  props<{ id: string; question: IQuestion }>()
);

export const deleteQuestion = createAction(
  '[Question] Delete Question',
  props<{ id: string }>()
);

export const loadQuestions = createAction('[Question] Load Questions');

export const loadQuestionsSuccess = createAction(
  '[Question] Load Questions Success',
  props<{ questions: IQuestion[] }>()
);

export const loadQuestionsFailure = createAction(
  '[Question] Load Questions Failure',
  props<{ error: any }>()
);

export const createAnswer = createAction(
  '[Question] Create Answer',
  props<{ questionId: string; selectedOption: string; openAnswer: string }>()
);

export const rollbackAnswer = createAction(
  '[Question] Rollback Answer',
  props<{ questionId: string }>()
);
