import { createReducer, on } from '@ngrx/store';
import * as AnswersActions from '../actions/answers.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { IAnswer } from '../../interfaces/question.interface';
import * as uuid from 'uuid';

export interface IAnswerState extends EntityState<IAnswer> {}

export const answerAdapter = createEntityAdapter<IAnswer>({
  selectId: (answer: IAnswer) => answer.questionId,
});

export const initialState: IAnswerState = answerAdapter.getInitialState();

const loadQuestionsFromLocalStorage = (): IAnswerState => {
  try {
    const storedQuestions = JSON.parse(localStorage.getItem('answers') || '[]');
    return answerAdapter.setAll(storedQuestions, initialState);
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
    return initialState;
  }
};

export const answerReducer = createReducer(
  loadQuestionsFromLocalStorage(),
  on(AnswersActions.createAnswer, (state, { answer }) => {
    const newAnswer = { ...answer, id: uuid.v4() } as IAnswer;
    return answerAdapter.addOne(newAnswer, state);
  }),
  on(AnswersActions.rollbackAnswer, (state, { questionId }) => {
    return answerAdapter.removeOne(questionId, state);
  }),
);
