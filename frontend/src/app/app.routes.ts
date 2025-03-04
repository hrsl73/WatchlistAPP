import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  
  { path: 'watchlist/:type', component: WatchlistComponent }
];
