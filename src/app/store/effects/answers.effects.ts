import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as AnswersActions from '../actions/answers.actions';
import * as QuestionsActions from '../actions/question.actions';
import { IAnswer } from "../../interfaces/question.interface";
import { Store } from '@ngrx/store';

@Injectable()
export class AnswersEffects {
  loadAnswers$ = createEffect(() => this.actions$.pipe(
    ofType(AnswersActions.loadAnswers),
    mergeMap(() => {
      try {
        const storedAnswers = localStorage.getItem('answers');
        const answers = storedAnswers ? JSON.parse(storedAnswers) : [];
        return [AnswersActions.loadAnswersSuccess({ answers })];
      } catch (error) {
        console.error('Error loading answers from localStorage:', error);
        return [AnswersActions.loadAnswersFailure({ error })];
      }
    }),
  ));

  saveAnswers$ = createEffect(() => this.actions$.pipe(
    ofType(AnswersActions.createAnswer, AnswersActions.rollbackAnswer),
    mergeMap(action => {
      const storedAnswers = JSON.parse(localStorage.getItem('answers') || '[]');
      const updatedQuestions = this.updateAnswers(storedAnswers, action);
      localStorage.setItem('answers', JSON.stringify(updatedQuestions));

      this.updateQuestionWithAnswer(action);
      return EMPTY;
    }),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  private updateAnswers(answers: IAnswer[], action: any): IAnswer[] {
    switch (action.type) {
      case AnswersActions.createAnswer.type:
        return [...answers, action.answer];
      case AnswersActions.rollbackAnswer.type:
        return answers.filter(ans => ans.questionId !== action.questionId);
      default:
        return answers;
    }
  }

  private updateQuestionWithAnswer(action: any): void {
    switch (action.type) {
      case AnswersActions.createAnswer.type: {
        const answer = action.answer;
        this.store.dispatch(
          QuestionsActions.editQuestion({ id: answer.questionId, question: { answer: answer.id } }),
        );
        break;
      }
      case AnswersActions.rollbackAnswer.type:
        this.store.dispatch(
          QuestionsActions.editQuestion({ id: action.questionId, question: { answer: undefined } }),
        );
        break;
      default:
        break;
    }
  }
}
