import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as QuestionActions from '../actions/question.actions';
import { IQuestion } from "../../interfaces/question.interface";

@Injectable()
export class QuestionEffects {
  loadQuestions$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.loadQuestions),
    mergeMap(() => {
      try {
        const storedQuestions = localStorage.getItem('questions');
        const questions = storedQuestions ? JSON.parse(storedQuestions) : [];
        return [QuestionActions.loadQuestionsSuccess({ questions })];
      } catch (error) {
        console.error('Error loading questions from localStorage:', error);
        return [QuestionActions.loadQuestionsFailure({ error })];
      }
    }),
  ));

  saveQuestions$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.addQuestion, QuestionActions.editQuestion, QuestionActions.deleteQuestion),
    mergeMap((action) => {
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      const updatedQuestions = this.updateQuestions(storedQuestions, action);
      localStorage.setItem('questions', JSON.stringify(updatedQuestions));
      return EMPTY;
    }),
  ), { dispatch: false });

  private updateQuestions(questions: IQuestion[], action: any): IQuestion[] {
    console.log(action, questions);
    switch (action.type) {
      case QuestionActions.addQuestion.type:
        return [...questions, action.question];
      case QuestionActions.editQuestion.type:
        return questions.map(q => (q.id === action.id
          ? { ...q, ...action.question }
          : q));
      case QuestionActions.deleteQuestion.type:
        return questions.filter(q => q.id !== action.id);
      default:
        return questions;
    }
  }

  constructor(private actions$: Actions) {}
}
