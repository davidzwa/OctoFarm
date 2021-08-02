const { UUID_LENGTH } = require("../../constants/service.constants");

const idRules = {
  id: "required|mongoId"
};

const updateSortIndexRules = {
  sortList: "required|array|minLength:1",
  "sortList.*": "required|mongoId"
};

const updatePrinterConnectionSettingRules = {
  printer: "required|object",
  "printer.id": "required|mongoId", // Changed from index to id
  "printer.printerURL": "required|httpurl",
  "printer.webSocketURL": "required|wsurl", // Changed from protocol to url
  "printer.camURL": "httpurl",
  "printer.apiKey": `required|minLength:${UUID_LENGTH}|maxLength:${UUID_LENGTH}`
};

module.exports = {
  idRules,
  updateSortIndexRules,
  updatePrinterConnectionSettingRules
};
