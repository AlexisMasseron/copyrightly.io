import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ManifestSingleComponent } from './registry/manifest/manifest-single.component';
import { RegistrySearchComponent } from './registry/search/registry-search.component';
import { ListComponent } from './registry/list/list.component';

const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: ManifestSingleComponent },
  { path: 'search', component: RegistrySearchComponent },
  { path: 'list', component: ListComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
