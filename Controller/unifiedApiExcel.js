var Excel = require("exceljs");
var workbook = new Excel.Workbook();
const axios = require("axios");
const url = "https://api-eu.dhl.com/track/shipments?trackingNumber=";

const REQUEST_CONFIG = {
  headers: {
    "Content-Type": "application/json",
    "DHL-API-Key": "secret",
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function queryAccess(file) {
  return new Promise((resolve, reject) => {
    let status = ["Status"];
    try {
      workbook.xlsx
        .readFile("./" + file)
        .then(async function () {
          var worksheet = workbook.getWorksheet(1);

          let trackingNum = worksheet.getColumn(4).values;
          console.log(trackingNum);
          trackingNum2 = trackingNum.splice(2);
          console.log(trackingNum2);

          for (let tn of trackingNum2) {
            await delay(1200);
            try {
              let response = await axios.get(`${url}${tn}`, REQUEST_CONFIG);
              let statusOfShippment =
                response.data["shipments"][0].status.description;

              let x = status.push(statusOfShippment);
              console.log(x);
              worksheet.getColumn(6).values = status;
            } catch (error) {
              if (
                error &&
                error.response &&
                error.response.data &&
                error.response.data.detail
              ) {
                let errorStatus = error.response.data.detail;
                status.push(errorStatus);
                worksheet.getColumn(6).values = status;
                console.log(errorStatus);
              }
            }
          }
          //   worksheet.getColumn(6).values = status;

          const resTrack = workbook.xlsx.writeFile("./" + file);
          resolve("finished");
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

// queryAccess();
module.exports = queryAccess;
