import devConfig from './development';
import testConfig from './testing';

let config = devConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    config = devConfig;
    break;
  case 'test':
    config = testConfig;
    break;
  default:
    config = devConfig;
}

export default config;
