import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';

import healthCheck from './middlewares/healthCheck';
import isReady from './middlewares/isReady';
import jupyterCreate from './middlewares/jupyterCreate';
import readinessCheck from './middlewares/readinessCheck';
import  bodyparser  from 'body-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5210;
  const app = express();
  app.use(bodyparser.urlencoded({
    extended: true
  }));
  app.use(healthCheck()).use(readinessCheck()).use(jupyterCreate()).use(isReady());

  app.engine('handlebars', engine());
  app.set('view engine', 'handlebars');
  app.set('views', './src/views');


  app.listen(PORT);

  process.on('uncaughtException', (error) => {
    console.log('Unhandled NODE exception', error);
  });

  console.log(
    `Running a scicat-to-jupyternotebook server at http://localhost:${PORT}`,
    {}
  );

}

bootstrap();




