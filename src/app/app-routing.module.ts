import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ChatComponent} from './components/chat/chat.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'chat', component: ChatComponent},
  {path: '*', component: PageNotFoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {enableTracing: false})
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
