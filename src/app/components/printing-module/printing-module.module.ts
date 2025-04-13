import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PrintingComponent } from './printing/printing.component';

import { PrintingModuleRoutingModule } from './printing-module-routing.module'; // Import the correct routing module


@NgModule({
  declarations: [PrintingComponent],
  imports: [
    CommonModule,
    PrintingModuleRoutingModule,
  ],
  exports: [PrintingComponent],
})
export class PrintingModuleModule {}
