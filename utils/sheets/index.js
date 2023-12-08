const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "utils/sheets/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "utils/sheets/credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
module.exports.authorize = async () => {
  try {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      console.log("Authorized client loaded from file.");
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    console.log("New Author");
    return client;
  } catch (err) {
    console.log(err);
  }
};

module.exports.createNewGoogleSheet = async (auth, title) => {
  const service = google.sheets({ version: "v4", auth });
  const resource = {
    properties: {
      title,
    },
  };
  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.createSheet = async (auth, spreadsheetId, tabName) => {
  const service = google.sheets({ version: "v4", auth });
  const resource = {
    requests: [
      {
        addSheet: {
          properties: {
            title: tabName,
          },
        },
      },
    ],
  };
  try {
    const spreadsheet = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource,
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.getListOfSheets = async (auth, spreadsheetId) => {
  const service = google.sheets({ version: "v4", auth });
  try {
    const spreadsheet = await service.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });
    return spreadsheet.data.sheets.map((sheet) => sheet.properties.title);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.getValues = async (auth, spreadsheetId, range) => {
  const service = google.sheets({ version: "v4", auth });
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const numRows = result.data.values ? result.data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    return result.data.values;
  } catch (err) {
    // TODO (developer) - Handle exception
    console.log(err);
    // throw err;
  }
};

module.exports.updateValues = async (auth, spreadsheetId, range, values) => {
  const { google } = require("googleapis");

  const service = google.sheets({ version: "v4", auth });
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource,
    });
    console.log("%d cells updated.", result.data.updatedCells);
    return "Ok";
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.appendValues = async (auth, spreadsheetId, range, values) => {
  const service = google.sheets({ version: "v4", auth });
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource,
    });
    console.log(`${result.data.updates.updatedCells} cells appended.`);
    return "Ok";
  } catch (err) {
    console.log(err);
    throw err;
  }
};
