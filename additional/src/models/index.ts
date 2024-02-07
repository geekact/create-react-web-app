import { store, type Middleware } from 'foca';
import { createLogger } from 'redux-logger';

const middleware: Middleware[] = [];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(
    createLogger({
      collapsed: true,
      diff: true,
      duration: true,
      logErrors: true,
    }),
  );
}

store.init({
  compose: 'redux-devtools',
  middleware,
  persist: [
    {
      key: 'react-app-' + import.meta.env.MODE,
      version: 1,
      engine: localStorage,
      models: [],
    },
  ],
});

if (import.meta.hot) {
  import.meta.hot.accept(() => {});
}
