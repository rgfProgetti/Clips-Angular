import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const reditectUnathorizedToHome = () => redirectUnauthorizedTo('/')
const routes: Routes = [{
  path: 'manage',
  component: ManageComponent,
  data: {
    authOnly: true,
    authGuardPipe: reditectUnathorizedToHome
  },
  canActivate: [AuthGuard]
  }, 
  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true,
      authGuardPipe: reditectUnathorizedToHome
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-clips',
    redirectTo: 'manage'
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
