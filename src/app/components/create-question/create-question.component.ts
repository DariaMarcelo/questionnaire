import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { createUniqId } from '../../utils/database.utils';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
  questionForm: FormGroup;
  isEditMode: boolean = false;
  questionId: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.questionForm = new FormGroup({
      text: new FormControl(null, Validators.required),
      type: new FormControl('single', Validators.required),
      options: new FormArray([new FormControl()]),
    });

    this.route.queryParams.subscribe(params => {
      this.questionId = params['id'];
      this.isEditMode = !!this.questionId;

      if (this.isEditMode) {
        this.store
          .select('questions', 'entities', this.questionId)
          .pipe(
            map(question => {
              if (question) {
                this.questionForm.setValue({
                  text: question.text,
                  type: question.type,
                  options: question.options || [''],
                });
              }
            })
          )
          .subscribe();
      }
    });
  }

  ngOnInit(): void {}

  createOrUpdateQuestion(): void {
    if (this.questionForm.valid) {
      const question = {
        ...this.questionForm.value,
        dateCreated: new Date(),
        id: this.isEditMode ? this.questionId : createUniqId(),
      };

      if (this.isEditMode) {
        this.store.dispatch(QuestionActions.editQuestion({ id: this.questionId, question }));
      } else {
        this.store.dispatch(QuestionActions.addQuestion({ question }));
      }

      this.router.navigate(['/question-management']);
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

  areOptionsValid(): boolean {
    if (this.questionForm.get('type')?.value === 'single' || this.questionForm.get('type')?.value === 'multiple') {
      return this.options.length >= 2;
    }
    return true;
  }

  protected readonly FormControl = FormControl;
}
