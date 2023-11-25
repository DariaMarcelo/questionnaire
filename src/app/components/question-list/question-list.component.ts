import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import { IQuestion } from '../../interfaces/question.interface';
import { questionAdapter } from '../../store/reducers/question.reducer';
import { map } from "rxjs/operators";
import { FormBuilder } from '@angular/forms';
import { editQuestion } from "../../store/actions/question.actions";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnDestroy {
  unansweredQuestions$: Observable<IQuestion[]>;
  answeredQuestions$: Observable<IQuestion[]>;
  private answeredQuestionsSubscription: Subscription = new Subscription();

  selectedOptions: { [id: string]: string[] } = {};

  constructor(private store: Store<IAppState>, private formBuilder: FormBuilder) {
    this.unansweredQuestions$ = store.select('questions').pipe(
      map(state => questionAdapter.getSelectors().selectAll(state)),
      map(questions => questions.filter(question => !question.answer)),
    );

    this.answeredQuestions$ = store.select('questions').pipe(
      map(questions => questionAdapter.getSelectors().selectAll(questions)),
      map(questions => questions.filter(question => !!question.answer)),
      tap(v => v.forEach(question => {
        this.custom(question);
      }))
    );

    this.answeredQuestionsSubscription = this.answeredQuestions$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.answeredQuestionsSubscription) {
      this.answeredQuestionsSubscription.unsubscribe();
    }
  }
  custom(question: IQuestion): void {
    this.selectedOptions[question.id] = question.answer || [];
  }

  setCheckboxValue(questionId: string, option: string, target: EventTarget | null) {
    const { checked } = target as HTMLInputElement;
    const currentValue = this.selectedOptions[questionId];

    if (!currentValue && checked) {
      this.selectedOptions[questionId] = [option];
      return;
    }

    if (!checked) {
      this.selectedOptions[questionId] = this.selectedOptions[questionId].filter(value => value !== option);
      return;
    }

    this.selectedOptions[questionId] = [...currentValue, option];
  }
  createAnswer(question: IQuestion): void {
    this.store.dispatch(editQuestion({
      id: question.id,
      question: { ...question, answer: this.selectedOptions[question.id] },
    }));
  }

  isAnswerValid(question: IQuestion): boolean {
    return this.selectedOptions[question.id] !== undefined && this.selectedOptions[question.id] !== null;
  }

  rollbackAnswer(question: IQuestion): void {
    this.store.dispatch(editQuestion({
      id: question.id,
      question: { ...question, answer: null },
    }));
  }
}
