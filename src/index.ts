import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

import usersRouter from '@routes/usersRouter';
import donorRouter from '@routes/donorRouter';
import healthCondRouter from '@routes/healthCondRouter';
import bloodTestRouter from '@routes/bloodTestRouter';
import donationRouter from '@routes/donationRouter';
import adminRouter from '@routes/adminRouter';
import rootRouter from '@routes/rootRouter';

const app = express();

const { PORT = 8080 } = process.env;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

app.use('/user', usersRouter);
app.use('/api', donorRouter);
app.use('/api', healthCondRouter);
app.use('/api', bloodTestRouter);
app.use('/api', donationRouter);
app.use('/api', adminRouter);
app.use('/api', rootRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static("../client/dist"));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
	});
};

app.listen(PORT, () => {
    console.log(`Server at port ${ PORT }`);
});