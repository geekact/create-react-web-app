import { Config } from './production';
import staging from './staging';

const development: Config = {
  ...staging,
  api_host: 'http://localhost:3000',
};

export default development;
