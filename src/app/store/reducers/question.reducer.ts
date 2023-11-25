import { createReducer, on } from '@ngrx/store';
import * as QuestionActions from '../actions/question.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { IQuestion } from '../../interfaces/question.interface';

export interface IQuestionState extends EntityState<IQuestion> {}

export const questionAdapter = createEntityAdapter<IQuestion>({
  selectId: (question: IQuestion) => question.id,
});

export const initialState: IQuestionState = questionAdapter.getInitialState();

const loadQuestionsFromLocalStorage = (): IQuestionState => {
  try {
    const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    return questionAdapter.setAll(storedQuestions, initialState);
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
    return initialState;
  }
};


export const questionReducer = createReducer(
  loadQuestionsFromLocalStorage(),
  on(QuestionActions.addQuestion, (state, { question }) => {
    return questionAdapter.addOne(question, state);
  }),
  on(QuestionActions.editQuestion, (state, { id, question }) => {
    return questionAdapter.updateOne({ id, changes: question }, state);
  }),
  on(QuestionActions.deleteQuestion, (state, { id }) => {
    return questionAdapter.removeOne(id, state);
  }),
);
