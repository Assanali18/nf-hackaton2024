
import { readSheetData, updateSheetData } from './googleAuth';
import { readJsonFile, saveDataToJsonFile } from './storage';
import { extractSpreadsheetId } from './excractId';
import { generateFullText } from './promts';

async function AIFunction(link, nameOfList) {
    const spreadLink = link;
    const spreadsheetId = extractSpreadsheetId(spreadLink)
    const range = nameOfList;

    
    //readTable

    // await readSheetData(spreadsheetId, range)
    // .then(data => saveDataToJsonFile(data))
    // .catch(error => console.error('Error:', error));


    //update json

    const oldData = readJsonFile('output.json');
    for (const row of oldData.slice(1)) {  // Skip the header row
        const evaluation = await generateFullText(row);
        row.push(evaluation.decision);
        break  // Add decision and reason to each row
    }

    saveDataToJsonFile(oldData);
    await updateSheetData(spreadsheetId, range, oldData);
    // const promtData = await generateFullText(oldData);
    
    // await saveDataToJsonFile(promtData)


    //update table

    // const newData = readJsonFile('output.json')
    // await updateSheetData(spreadsheetId, range, newData)
}

export {AIFunction}