import { errorGithubIssueMap } from "../exceptions/error.types";
import { ClientErrors } from "../exceptions/octofarm-client.exceptions";

const githubIssueBaseURL = "https://github.com/octofarm/octofarm/issues/new?";
const githubSignUpURL = "https://github.com/signup";

// Issue needs more work, difficult formatting properly to send over URL. Might be scrapped and just go to the Issue Report Form with new labels.
const newLine = "%0D%0A";

function returnGithubIssueBody(options) {
  let cleanMessage = ClientErrors[options.code].message.replaceAll('"', "");
  cleanMessage = cleanMessage.replaceAll("/", "-");
  if (options?.lineNumber || options?.fileName || options?.columnNumber) {
    return `
     ${cleanMessage}${newLine}  
      FILE INFO${newLine}  
      ${options?.lineNumber ? "LINE: " + options?.lineNumber : ""}${newLine}  
      ${options?.columnNumber ? "COL: " + options?.columnNumber : ""}${newLine}  
      ${options?.fileName ? "FILE: " + options?.fileName : ""}${newLine}  
  `;
  } else {
    return `${cleanMessage}`;
  }
}

function returnGithubIssueTitle(options) {
  const cleanMessage = ClientErrors[options.code].code;
  return `${options.type} ERROR ${cleanMessage}`;
}

function returnGithubIssueLink(options) {
  return `https://github.com/OctoFarm/OctoFarm/issues/new?assignees=&labels=${
    errorGithubIssueMap[options.type]
  }&template=issue-report.yml`;
}

export { returnGithubIssueLink };
