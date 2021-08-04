import { returnGithubIssueLink } from "../templates/github-issue.templates";

function returnDeveloperMessage(options) {
  const message = options.message.replaceAll("|", "<br>");
  return `
    <br>
    <code>${message}</code>
    <br>
  `;
}

function returnFileInfoBlock(options) {
  if (options?.lineNumber || options?.fileName || options?.columnNumber) {
    return `
     <br>
     <code>
      <u>FILE INFO</u><br>
      ${options?.lineNumber ? "LINE: " + options?.lineNumber : ""}
      ${options?.columnNumber ? "COL: " + options?.columnNumber : ""}
      ${options?.fileName ? "FILE: " + options?.fileName : ""}
    </code>
  `;
  } else {
    return "";
  }
}

function returnErrorMessage(options) {
  let statusCode = "";
  if (options?.statusCode) {
    statusCode = `(${options?.statusCode})`;
  }

  return `
     <br>
     ${options.message}
     ${returnFileInfoBlock(options)}   
      <div class="py-3">
          <a target="_blank" href="${returnGithubIssueLink(
            options
          )}"><button class="btn btn-success"><i class="fab fa-github"></i> Report to Github!</button>
          </a>
      </div>
      <div class="alert alert-info small" role="alert">
        The button above requires a github account, <a href="${returnGithubIssueLink(
          options
        )}">Create one here!</a> 
      </div>
  `;
}

export { returnErrorMessage, returnDeveloperMessage };
