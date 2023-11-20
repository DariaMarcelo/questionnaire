import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
})
export class CreateQuestionComponent {
  questionForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<IAppState>, private router: Router) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['single', Validators.required],
      options: [''],
    });
  }

  createQuestion(): void {
    const question = {...this.questionForm.value, dateCreated: new Date()};
    this.store.dispatch(QuestionActions.addQuestion({question}));

    this.router.navigate(['/question-management'])
      .then(() => {
        console.log('Navigation succeeded');
      })
      .catch(error => {
        console.error('Navigation failed:', error);
      });
  }
}
