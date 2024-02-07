import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const App: FC = () => {
  return (
    <div>
      <p>Hello app</p>
      <Outlet />
    </div>
  );
};
