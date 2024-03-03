import { Route } from '@angular/router';
import { AboutComponent } from '@features/about/about.component';
import { HomeComponent } from '@features/home/home.component';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'about',
        component: AboutComponent
    }
];
