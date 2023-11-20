import { createReducer, on } from '@ngrx/store';
import * as QuestionActions from '../actions/question.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { IQuestion } from '../../interfaces/question.interface';
import * as uuid from 'uuid';

export interface IQuestionState extends EntityState<IQuestion> {}

export const questionAdapter = createEntityAdapter<IQuestion>();

export const initialState: IQuestionState = questionAdapter.getInitialState();

const loadQuestionsFromLocalStorage = (): IQuestionState => {
  try {
    const storedQuestions = localStorage.getItem('questions');
    return storedQuestions ? JSON.parse(storedQuestions) : initialState;
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
    return initialState;
  }
};

const saveQuestionsToLocalStorage = (state: IQuestionState): void => {
  try {
    localStorage.setItem('questions', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving questions to localStorage:', error);
  }
};

export const questionReducer = createReducer(
  loadQuestionsFromLocalStorage(),
  on(QuestionActions.addQuestion, (state, { question }) => {
    const newQuestion: IQuestion = { ...question, id: uuid.v4() };
    const newState = questionAdapter.addOne(newQuestion, state);
    saveQuestionsToLocalStorage(newState);
    return newState;
  }),
  on(QuestionActions.editQuestion, (state, { id, question }) => {
    const newState = questionAdapter.updateOne({ id, changes: question }, state);
    saveQuestionsToLocalStorage(newState);
    return newState;
  }),
  on(QuestionActions.deleteQuestion, (state, { id }) => {
    const newState = questionAdapter.removeOne(id, state);
    saveQuestionsToLocalStorage(newState);
    return newState;
  }),
);
