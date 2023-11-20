import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { IQuestion } from '../../interfaces/question.interface';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
})
export class EditQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  questionId: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private router: Router,
  ) {
    this.questionId = '';
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.store.select('questions', 'entities', id))
    ).subscribe(question => {
      if (question) {
        this.setFormValues(question);
      }
    });
  }

  private setFormValues(question: IQuestion): void {
    this.questionForm = this.fb.group({
      text: [question.text, Validators.required],
      type: [question.type, Validators.required],
      options: [question.options],
    });
  }

  editQuestion(): void {
    const editedQuestion = { ...this.questionForm.value, dateCreated: new Date() };
    this.store.dispatch(QuestionActions.editQuestion({ id: this.questionId, question: editedQuestion }));
    this.router.navigate(['/question-management'])
      .then(() => {
        console.log('Navigation succeeded');
      })
      .catch(error => {
        console.error('Navigation failed:', error);
      });
  }
}
