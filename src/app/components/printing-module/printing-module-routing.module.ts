import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintingComponent } from './printing/printing.component';

const routes: Routes = [
  { path: '', component: PrintingComponent } // Default route for PrintingModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintingModuleRoutingModule { }
