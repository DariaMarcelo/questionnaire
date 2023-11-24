import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store';
import * as QuestionActions from '../../store/actions/question.actions';
import { IQuestion } from '../../interfaces/question.interface';
import { questionAdapter } from '../../store/reducers/question.reducer';
import { map } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss'],
})
export class QuestionManagementComponent {
  questions$: Observable<IQuestion[]>;

  constructor(
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.questions$ = store.select('questions').pipe(
      map(state => state && state.ids ? questionAdapter.getSelectors().selectAll(state) : []),
    );
  }

  deleteQuestion(id: string): void {
    this.store.dispatch(QuestionActions.deleteQuestion({ id }));
  }

  editQuestion(id: string): void {
    this.router.navigate(['edit-question', id]);
  }
}
