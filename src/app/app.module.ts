import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { QuestionManagementComponent } from './components/question-management/question-management.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { QuestionListComponent } from './components/question-list/question-list.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from '@angular/material/list';

import { reducers } from "./store";
import { QuestionEffects } from "./store/effects/question.effects";
import { AnswersEffects } from './store/effects/answers.effects';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    QuestionManagementComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    QuestionListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([QuestionEffects, AnswersEffects]),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
