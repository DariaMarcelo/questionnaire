import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { IQuestion } from '../../interfaces/question.interface';
import { questionAdapter } from '../../store/reducers/question.reducer';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
})
export class QuestionListComponent {
  unansweredQuestions$: Observable<IQuestion[]>;
  answeredQuestions$: Observable<IQuestion[]>;

  selectedOption: string = '';
  openAnswer: string = '';

  constructor(private store: Store<IAppState>) {
    this.unansweredQuestions$ = store.select('questions').pipe(
      map(state => questionAdapter.getSelectors().selectAll(state)),
      map(questions => questions.filter(question => !question.answer)),
    );

    this.answeredQuestions$ = store.select('questions').pipe(
      map(state => questionAdapter.getSelectors().selectAll(state)),
      map(questions => questions.filter(question => !!question.answer)),
    );
  }

  createAnswer(questionId: string): void {
    this.store.dispatch(QuestionActions.createAnswer({ questionId, selectedOption: this.selectedOption, openAnswer: this.openAnswer }));
  }

  rollbackAnswer(questionId: string): void {
    this.store.dispatch(QuestionActions.rollbackAnswer({ questionId }));
  }
}
