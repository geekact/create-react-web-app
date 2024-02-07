import { Navigate, type RouteObject } from 'react-router-dom';
import { App } from '../app';
import { Home } from '../pages/home';

export const routers: RouteObject[] = [
  {
    element: <App />,
    path: '/',
    children: [
      {
        path: '/',
        element: <Navigate to="/home" />,
      },
      {
        path: '/home',
        element: <Home />,
      },
    ],
  },
];
