import 'module-alias/register';

import * as dotenv from 'dotenv';

import App from '@app';
import * as config from '@env';
import { init as initLogger } from '@logger';

// We use dotenv and nconf to control
// environment variables in the app.
dotenv.config();
config.init();

// Winston is used for logging, lets
// prepare the logger implementation.
initLogger();

// Finally, initialize the app.
const app = new App();
app.listen();
