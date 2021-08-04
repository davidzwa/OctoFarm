import { errorTypes } from "./error.types";

export const ClientErrors = {
  INVALID_SERVER_RESPONSE: {
    type: errorTypes.CLIENT,
    color: "danger",
    code: "INVALID_SERVER_RESPONSE",
    message: "Server responded with redirect! Invalid api endpoint detected"
  },
  NO_PATHNAME_SUPPLIED: {
    type: errorTypes.CLIENT,
    color: "danger",
    code: "NO_PATHNAME_SUPPLIED",
    message: "You need to supply a url / path to this command"
  },
  INVALID_PATHNAME: {
    type: errorTypes.CLIENT,
    color: "danger",
    code: "INVALID_PATHNAME",
    message: "Invalid pathname found"
  },
  DEVELOPER_CREATED_ISSUE: {
    type: errorTypes.CLIENT,
    name: "OctoFarm Developer Error",
    color: "warning",
    code: "DEVELOPER_CREATED_ISSUE",
    message: ""
  }
};
