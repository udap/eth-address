const through2 = require('through2');
const csv2 = require('csv2');
const {isValidChecksumAddress} = require('ethereumjs-util');
const fs = require('fs');
const path = require('path');

fs.createReadStream(path.join(__dirname, '/data/sheet.csv'))
  .pipe(csv2())
  .pipe(through2.obj(function (chunk, enc, cb) {
    const data = {
      address: chunk[0],
      amount: chunk[1]
    };
    this.push(data);
    cb();
  }))
  .on('data', ({address}) => {
    if (address.length !== 42 || (/[A-F]/.test(address) && !isValidChecksumAddress(address))) {
      console.log(`invalid: ${address}`);
    }
  })
  .on('end', () => {
    console.log('done!');
  });
