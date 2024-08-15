import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from "express";
import { Request, Response } from 'express';
import { errorHandler } from './src/middlewares/error-handler';
import userRouter from './src/routes/user.routes';
import taskRouter from './src/routes/task.routes';
import * as swaggerUi from 'swagger-ui-express';

const swaggerDoc = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/users', userRouter);
app.use('/tasks', taskRouter);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (req: Request, res: Response) => {
    res.json(`Welcome to my API. Browse documentation on http://localhost:${PORT}/api`);
});

app.use(errorHandler);
createConnection()
    .then(async (connection) => {
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('TypeORM connection error:', error);
        process.exit(1);
    });
