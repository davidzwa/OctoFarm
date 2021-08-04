const {
  returnErrorMessage,
  returnDeveloperMessage
} = require("./templates/error-message.templates");

const octoFarmErrorModalElement = "#octofarmErrorModal";
const octoFarmErrorModalDefaultStyle = "modal-header text-dark";
const developerErrorMessage = {
  name: "OctoFarm Developer Error",
  type: "DEVELOPER ISSUE",
  color: "warning"
};

function openErrorModal(options) {
  const errorTitle = document.getElementById("errorTitle");
  const errorBody = document.getElementById("errorBody");
  const octofarmErrorModalBanner = document.getElementById("octofarmErrorModalBanner");

  errorTitle.innerHTML = ` ${options.name}`;
  errorTitle.innerHTML = ` ${options.name}`;

  switch (options.type) {
    case developerErrorMessage.type:
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
    //TODO: Stringed error events seem to be usually developer issues ie. missing imports, unresolved imports so far...
    developerErrorMessage.message = event;
    openErrorModal(developerErrorMessage);
  } else if (!event.reason) {
    openErrorModal(event);
  } else {
    openErrorModal(event.reason);
  }
}

window.onunhandledrejection = function (event) {
  handleEvent(event);
};
window.onerror = function (event) {
  handleEvent(event);
};
