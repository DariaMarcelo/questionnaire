import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as AnswerActions from '../../store/actions/answers.actions';
import { IQuestion } from '../../interfaces/question.interface';
import { questionAdapter } from '../../store/reducers/question.reducer';
import { map } from "rxjs/operators";
import { createUniqId } from '../../utils/database.utils';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent {
  unansweredQuestions$: Observable<IQuestion[]>;
  answeredQuestions$: Observable<IQuestion[]>;

  selectedOptions: { [id: string]: string } = {};
  openAnswer: string = '';

  constructor(private store: Store<IAppState>, _formBuilder: FormBuilder) {
    this.unansweredQuestions$ = store.select('questions').pipe(
      map(state => questionAdapter.getSelectors().selectAll(state)),
      map(questions => questions.filter(question => !question.answer)),
    );

    this.answeredQuestions$ = store.select('questions').pipe(
      map(state => questionAdapter.getSelectors().selectAll(state)),
      map(questions => questions.filter(question => !!question.answer)),
    );
  }

  setCheckboxValue(questionId: string, option: string, target: EventTarget | null) {
    const { checked } = target as HTMLInputElement;
    const currentValue = this.selectedOptions[questionId];

    if (!currentValue && checked) {
      this.selectedOptions[questionId] = option;
      return;
    }

    if (!checked) {
      this.selectedOptions[questionId] = currentValue
        .split(',')
        .filter(opt => opt !== option)
        .join(',');
      return;
    }

    this.selectedOptions[questionId] = `${currentValue},${option}`;
  }

  showSelectedOptions(): void {
    console.log(this.selectedOptions)
  }

  createAnswer(questionId: string): void {
    const answer = {
      questionId,
      selectedOption: this.selectedOptions[questionId] || '',
      openAnswer: this.openAnswer,
      id: createUniqId(),
    };
    this.store.dispatch(AnswerActions.createAnswer({ answer }));
  }

  isAnswerValid(question: IQuestion): boolean {
    if (question.type === 'single' || question.type === 'multiple') {
      return this.selectedOptions[question.id] !== undefined && this.selectedOptions[question.id] !== null;
    } else if (question.type === 'open') {
      return this.openAnswer !== undefined && this.openAnswer.trim() !== '';
    }
    return true;
  }

  rollbackAnswer(questionId: string): void {
    this.store.dispatch(AnswerActions.rollbackAnswer({ questionId }));
  }
}
