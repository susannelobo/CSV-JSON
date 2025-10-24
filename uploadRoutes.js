const express = require('express');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const router = express.Router();

const { setNestedProperty, transformForDb } = require('../helpers/csvHelpers');
const { insertDataBatch, calculateAndPrintAgeDistribution } = require('../helpers/dbHelpers');

router.post('/upload', async (req, res) => {
  console.log('Upload request received...');

  const csvFilePath = path.resolve(__dirname, '..', process.env.CSV_FILE_PATH);
  if (!fs.existsSync(csvFilePath)) {
    console.error('File does not exist:', csvFilePath);
    return res.status(500).send({ message: 'Error: File not found.' });
  }

  let headers = [];
  let isFirstLine = true;
  let batch = [];
  const BATCH_SIZE = 1000;

  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  try {
    for await (const line of rl) {
      if (isFirstLine) {
        headers = line.split(',');
        isFirstLine = false;
      } else {
        const values = line.split(',');
        let rowObject = {};
        headers.forEach((header, i) => setNestedProperty(rowObject, header, values[i]));
        batch.push(transformForDb(rowObject));

        if (batch.length >= BATCH_SIZE) {
          await insertDataBatch(batch);
          batch = [];
        }
      }
    }

    if (batch.length > 0) await insertDataBatch(batch);

    console.log('Data upload complete.');
    res.status(200).send({ message: 'File processing complete. Data inserted.' });

    calculateAndPrintAgeDistribution(); // Run after response
  } catch (err) {
    console.error('Error during upload:', err);
    if (!res.headersSent) res.status(500).send({ message: 'Error processing upload.' });
  }
});

module.exports = router;
