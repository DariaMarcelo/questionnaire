import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionManagementComponent } from './components/question-management/question-management.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { QuestionListComponent } from './components/question-list/question-list.component';

const routes: Routes = [
  { path: 'question-management', component: QuestionManagementComponent },
  { path: 'create-question', component: CreateQuestionComponent },
  { path: 'edit-question/:id', component: EditQuestionComponent },
  { path: 'question-list', component: QuestionListComponent },
  { path: '', redirectTo: '/question-management', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
