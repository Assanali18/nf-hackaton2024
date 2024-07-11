function extractSpreadsheetId(url) {
    const matches = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/.exec(url);
    return matches ? matches[1] : null;
}

export {extractSpreadsheetId}