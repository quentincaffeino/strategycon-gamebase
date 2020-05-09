
// import XLSX from 'xlsx-style/xlsx.js';


// XMLHttpRequest in promise format
function makeRequest(method, url, success, error) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", url, true);
  httpRequest.responseType = "arraybuffer";

  httpRequest.open(method, url);
  httpRequest.onload = function () {
    success(httpRequest.response);
  };
  httpRequest.onerror = function () {
    error(httpRequest.response);
  };
  httpRequest.send();
}

function convertDataToWorkbook(data) {
  /* convert data to binary string */
  let dataArray = new Uint8Array(data);
  let arr = new Array();

  for (let i = 0; i !== dataArray.length; ++i) {
    arr[i] = String.fromCharCode(dataArray[i]);
  }

  let bstr = arr.join("");

  return XLSX.read(bstr, { type: "binary" });
}


/**
 * @param {string} url 
 * @returns {Workbook}
 */
export function importExcel(url) {
  return new Promise((resolve, reject) => {
    makeRequest(
      "GET",

      url,

      // success
      (data) => resolve(convertDataToWorkbook(data)),

      reject
    );
  })
}
