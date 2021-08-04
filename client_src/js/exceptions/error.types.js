const errorTypes = {
  CLIENT: "CLIENT",
  SERVER: "SERVER",
  OCTOPRINT: "OCTOPRINT",
  NETWORK: "NETWORK",
  DEVELOPER: "DEVELOPER",
  UNKNOWN: "UNKNOWN"
};

const errorGithubIssueMap = {
  CLIENT: "client bug",
  SERVER: "server bug",
  OCTOPRINT: "octoprint",
  NETWORK: "server bug",
  DEVELOPER: "bug",
  UNKNOWN: "bug"
};

export { errorTypes, errorGithubIssueMap };
