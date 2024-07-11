import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import globalRouter from './routes/global-router';
import { readSheetData, updateSheetData } from './googleAuth';
import { readJsonFile, saveDataToJsonFile } from './storage';
import { extractSpreadsheetId } from './excractId';

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

const spreadLink = 'https://docs.google.com/spreadsheets/d/1oNjuXTcnX-GW61f7e3XteA_7lZU6uecle5gEemdaUA4/edit?gid=910644525#gid=910644525';
const spreadsheetId = extractSpreadsheetId(spreadLink)
const range = 'Sheet3';


// readSheetData(spreadsheetId, range)
//     .then(data => saveDataToJsonFile(data))
//     .catch(error => console.error('Error:', error));




const data = readJsonFile('output.json');
updateSheetData(spreadsheetId, range, data)

app.use(express.json());
app.use('/api/', globalRouter);

app.listen(5000, () => {
  console.log(`Server running at ${BASE_URL}`);
});