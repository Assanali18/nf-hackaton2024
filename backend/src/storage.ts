import fs from 'fs'

async function saveDataToJsonFile(data) {
    try {
        // Преобразование данных в строку JSON
        const jsonData = JSON.stringify(data, null, 2); // Здесь 2 - это количество пробелов для форматирования

        // Запись JSON в файл
        fs.writeFileSync('output.json', jsonData, 'utf8');
        console.log('Данные успешно сохранены в', 'output.json');
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
}

function readJsonFile(filePath) {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
}

export {saveDataToJsonFile, readJsonFile}