import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { Router } from '@angular/router';
import { createUniqId } from '../../utils/database.utils';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent {
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private router: Router,
  ) {
    this.questionForm = new FormGroup({
      text: new FormControl(null, Validators.required),
      type: new FormControl('single', Validators.required),
      options: new FormArray([new FormControl()]),
    })
  }

  createQuestion(): void {
    if (this.questionForm.valid) {
      const question = {
        ...this.questionForm.value,
        dateCreated: new Date(),
        id: createUniqId(),
      };
      this.store.dispatch(QuestionActions.addQuestion({ question }));

      this.router.navigate(['/question-management'])
        .then(() => {
          console.log('Navigation succeeded');
        })
        .catch(error => {
          console.error('Navigation failed:', error);
        });
    }
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  getOptionControl(index: number): FormControl | null {
    return this.options.at(index) as FormControl;
  }

  protected readonly FormControl = FormControl;
}
