import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../error-module/error/error.component';

//const routes: Routes = [{ path: '', component: ErrorModuleComponent }];
const routes: Routes = [
  { path: '', component: ErrorComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorModuleRoutingModule { }
