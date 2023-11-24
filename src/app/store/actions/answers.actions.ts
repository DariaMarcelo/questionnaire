import { createAction, props } from '@ngrx/store';
import { IAnswer } from '../../interfaces/question.interface';

export const createAnswer = createAction(
  '[Question] Create Answer',
  props<{ answer: Partial<IAnswer> }>(),
);

export const rollbackAnswer = createAction(
  '[Question] Rollback Answer',
  props<{ questionId: string }>(),
);


export const loadAnswers = createAction(
  '[Question] Load Answers',
);

export const loadAnswersSuccess = createAction(
  '[Question] Load Answers Success',
  props<{ answers: any[] }>(),
);

export const loadAnswersFailure = createAction(
  '[Question] Load Answers Failure',
  props<{ error: any }>(),
);
