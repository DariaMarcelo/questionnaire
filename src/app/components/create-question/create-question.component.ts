import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map, filter } from 'rxjs/operators';
import { createUniqId } from '../../utils/database.utils';
import { IQuestion } from "../../interfaces/question.interface";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit, OnDestroy {
  questionForm!: FormGroup;
  isEditMode: boolean = false;
  questionId: string = '';
  private routeSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.routeSubscription = this.route.params.pipe(
      map(params => params['id']),
      filter(Boolean),
      switchMap(id => this.store.select('questions', 'entities', id)),
      filter(Boolean),
    ).subscribe(question => {
      this.questionId = question.id;
      this.initForm(question);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  initForm(question?: IQuestion): void {
    this.questionForm = new FormGroup({
      text: new FormControl(question?.text, Validators.required),
      type: new FormControl(question?.type || 'single', Validators.required),
      options: new FormArray(
        question?.options?.map(option => new FormControl(option))
        || [new FormControl()],
      ),
    });
  }

  saveQuestion(): void {
    if (!this.questionForm.valid) {
      return;
    }

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
}

