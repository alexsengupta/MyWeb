import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ExplainedComponent } from './pages/explained/explained.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { TeamComponent } from './pages/team/team.component';
import { SimulationComponent } from './simulation/simulation.component';
import { SchoolsComponent } from './pages/schools/schools.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'explained', component: ExplainedComponent},
  {path: 'faqs', component: FaqsComponent},
  {path: 'team', component: TeamComponent},
  {path: 'schools', component: SchoolsComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: 'scenario/:id', component: SimulationComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule {
}
