import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountBookComponent } from './account-book.component';

const routes: Routes = [
  {
    path: '',
    component: AccountBookComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountBookRoutingModule {}
