import express from 'express';
import cors from 'cors';
import globalRouter from './routes/global-router';
import path from 'path';
import { checkRepoForPlagiarism } from './plagiat-checker-second';


const app = express();

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

const BASE_URL = 'http://localhost:3000';

app.use(cors({
    origin: BASE_URL,
    credentials: true
}));

app.use(express.json());

checkRepoForPlagiarism('https://github.com/sharn1999/nf-hackaton2024')
app.use('/api/', globalRouter);

app.listen(5000, () => {
    console.log(`Server running at ${BASE_URL}`);
});
