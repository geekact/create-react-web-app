import production, { Config } from './production';
import development from './development';
import staging from './staging';

const configs = {
  production,
  staging,
  development,
};

export const config: Config =
  configs[(import.meta.env.MODE || 'development') as keyof typeof configs];
