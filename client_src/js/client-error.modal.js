const {
  returnErrorMessage,
  returnDeveloperMessage
} = require("./templates/error-message.templates");
const { ClientErrors } = require("./exceptions/octofarm-client.exceptions");

const octoFarmErrorModalElement = "#octofarmErrorModal";
const octoFarmErrorModalDefaultStyle = "modal-header text-white";

function openErrorModal(options) {
  const errorTitle = document.getElementById("errorTitle");
  const errorBody = document.getElementById("errorBody");
  const octofarmErrorModalBanner = document.getElementById("octofarmErrorModalBanner");

  errorTitle.innerHTML = `${options.type} ERROR`;

  switch (options.type) {
    case ClientErrors.DEVELOPER_CREATED_ISSUE:
      errorBody.innerHTML = returnDeveloperMessage(options);
      break;
    default:
      errorBody.innerHTML = returnErrorMessage(options);
  }

  octofarmErrorModalBanner.className = `${octoFarmErrorModalDefaultStyle} bg-${options?.color}`;
  $(octoFarmErrorModalElement).modal("show");
}

function handleEvent(event) {
  if (_.isString(event)) {
    console.log("DEV ERROR");
    //Stringed error events seem to be usually developer issues ie. missing imports, unresolved imports so far...
    ClientErrors.DEVELOPER_CREATED_ISSUE.message = event;
    openErrorModal(ClientErrors.DEVELOPER_CREATED_ISSUE);
  } else if (!event?.reason) {
    openErrorModal(event);
  } else {
    openErrorModal(event.reason);
  }
}

window.onunhandledrejection = function (event) {
  console.log("UNHANDLED");
  handleEvent(event);
  return false;
};
window.onerror = function (event) {
  console.log("ON ERROR");
  handleEvent(event);
  return false;
};
