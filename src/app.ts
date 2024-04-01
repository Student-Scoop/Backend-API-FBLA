import http from 'http';
import cors from 'cors';
import EventEmitter from 'events';
import bodyParser from 'body-parser';
import router from './router/router';
import express, { Express } from 'express';
import startWebsocketServer from './gateway';
import errorHandler from './middleware/errorHandler';
import { secureHeaders } from './middleware/security/headers';

const app: Express = express();
const server = http.createServer(app);
const websocketBus = new EventEmitter();

startWebsocketServer(server, websocketBus);
app.set('websocketBus', websocketBus);

app.disable('x-powered-by');

cors({
	origin: '*',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

app.use(secureHeaders);
app.use(bodyParser.json());

app.use(router);

app.use(errorHandler);

export default server;
