import production, { Config } from './production';

const staging: Config = {
  ...production,
  api_host: 'https://staging.api.host.com',
};

export default staging;
