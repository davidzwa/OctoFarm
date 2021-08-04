function returnGithubIssueLink(options) {
  return `
    https://github.com/octofarm/octofarm/issues/new?title=[title]&assignee=[assignee]&body=[body]&labels=label1,label2
    `;
}

function returnDeveloperMessage(options) {
  const message = options.message.replaceAll("|", "<br>");
  return `
    <br>
    <code>${message}</code>
    <br>
  `;
}

function returnErrorMessage(options) {
  let statusCode = `(${options?.statusCode})`;
  if (!statusCode) statusCode = "";

  return `
     <br>
     ${options.type} ERROR ${statusCode}: 
     <br>
     ${options.message}
     <br>
     <code>
      <u>FILE INFO</u><br>
      LINE: ${options?.lineNumber}<br>
      COL: ${options?.columnNumber}<br>
      ${options?.fileName ? "FILE: " + options?.fileName : ""}
    </code>
    <div class="py-3">
        Please report this error to <a href="https://github.com/octofarm/octofarm/issues">OctoFarm Issues</a>!
    </div>
  `;
}

export { returnErrorMessage, returnDeveloperMessage, returnGithubIssueLink };
