import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalViewComponent } from './personal-view/personal-view.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import {DataTableModule} from "angular-6-datatable";
//import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SearchViewComponent } from './search-view/search-view.component';


@NgModule({
  imports: [
    CommonModule,
  //  DataTablesModule,
    DataTableModule,
    FormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    RouterModule.forChild([
      {path:'reportIssue',component:IssueViewComponent},
      {path:'issueDescription/:id',component:IssueViewComponent},
      {path:'searchView',component:SearchViewComponent}
    ])
  ],
  declarations: [PersonalViewComponent, IssueViewComponent, SearchViewComponent]
})
export class DashboardModule { }
