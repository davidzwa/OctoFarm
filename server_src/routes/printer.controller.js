const { ensureAuthenticated } = require("../middleware/auth");
const { createController } = require("awilix-express");
const Logger = require("../handlers/logger.js");
const { validateMiddleware, validateInput } = require("../handlers/validators");
const {
  idRules,
  updateSortIndexRules,
  updatePrinterConnectionSettingRules
} = require("./validation/printer-controller.validation");
const { AppConstants } = require("../app.constants");
const { convertHttpUrlToWebsocket } = require("../utils/url.utils");

class PrinterController {
  #printersStore;
  #jobsCache;
  #connectionLogsCache;
  #fileCache;

  #logger = new Logger("OctoFarm-API");

  constructor({ printersStore, connectionLogsCache, jobsCache, fileCache }) {
    this.#printersStore = printersStore;
    this.#jobsCache = jobsCache;
    this.#connectionLogsCache = connectionLogsCache;
    this.#fileCache = fileCache;
  }

  /**
   * Previous printerInfo action (not a list function)
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async get(req, res) {
    const id = req.params.id;
    const foundPrinter = this.#printersStore.getPrinterFlat(id);
    res.send(foundPrinter);
  }

  async list(req, res) {
    const listedPrinters = this.#printersStore.listPrintersFlat();
    res.send(listedPrinters);
  }

  async delete(req, res) {
    const data = await validateInput(req.params, idRules);
    const printerId = data.id;
    this.#logger.info("Deleting printer with id", printerId);

    const entityRemoved = await this.#printersStore.deletePrinter(printerId);

    res.send({ printerRemoved: entityRemoved });
  }

  /**
   * Update the printer network connection settings like URL or apiKey - nothing else
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async updateConnectionSettings(req, res) {
    const data = await validateMiddleware(req, updatePrinterConnectionSettingRules, res);

    const printerId = data.printer.id;
    const newEntity = await this.#printersStore.updatePrinterConnectionSettings(
      printerId,
      data.printer
    );

    res.send({
      printerURL: newEntity.printerURL,
      camURL: newEntity.camURL,
      apiKey: newEntity.apiKey,
      webSocketURL: newEntity.webSocketURL
    });
  }

  async updateSortIndex(req, res) {
    const data = await validateMiddleware(req, updateSortIndexRules, res);

    this.#logger.info("Sorting printers according to provided order", JSON.stringify(data));

    this.#printersStore.updateSortIndex(data.sortList);
    res.send({});
  }

  async reconnectOctoPrint(req, res) {
    const printerID = req.params.id;
    this.#logger.info("Reconnecting OctoPrint instance: ", printerID);
    this.#printersStore.reconnectOctoPrint(printerID, true);

    res.send({ success: true, message: "Printer will reconnect soon" });
  }

  async createPrinter(req, res) {
    const newPrinter = req.body;
    if (!newPrinter.webSocketURL) {
      newPrinter.webSocketURL = convertHttpUrlToWebsocket(newPrinter.printerURL);
    }
    this.#logger.info("Add printer", newPrinter);

    // Has internal validation, but might add some here above as well
    const printerState = await this.#printersStore.addPrinter(req.body);
    res.send({ printerState: printerState.toFlat() });
  }

  // TODO === The big todo line ===
  async setStepChange(req, res) {
    const step = req.body;
    // TODO Validate
    await Runner.stepRate(step.printer, step.newSteps);
    res.send("success");
  }

  async setFlowChange(req, res) {
    const step = req.body;
    // TODO Validate
    await Runner.flowRate(step.printer, step.newSteps);
    res.send("success");
  }

  async setFeedChange(req, res) {
    const step = req.body;
    // TODO Validate
    Runner.feedRate(step.printer, step.newSteps);
    res.send("success");
  }

  async updateSettings(req, res) {
    const settings = req.body;
    // TODO Validate body
    this.#logger.info("Update printers request: ", settings);
    const updateSettings = await Runner.updateSettings(settings);
    res.send({ status: updateSettings.status, printer: updateSettings.printer });
  }

  async refreshSettings(req, res) {
    const id = req.body.i;
    if (!id) {
      this.#logger.error("Printer Settings: No ID key was provided");
      res.statusMessage = "No ID key was provided";
      res.sendStatus(400);
      return;
    }
    try {
      await Runner.getLatestOctoPrintSettingsValues(id);
      let printerInformation = PrinterClean.getPrintersInformationById(id);
      res.send(printerInformation);
    } catch (e) {
      this.#logger.error(`The server couldn't update your printer settings! ${e}`);
      res.statusMessage = `The server couldn't update your printer settings! ${e}`;
      res.sendStatus(500);
    }
  }

  async killPowerSettings(req, res) {
    const printerID = req.params.id;
    // TODO Validate
    const updateSettings = await Runner.killPowerSettings(printerID);
    res.send({ updateSettings });
  }

  async connectionLogs(req, res) {
    let id = req.params.id;
    this.#logger.info("Grabbing connection logs for: ", id);
    let connectionLogs = await this.#connectionLogsCache.returnPrinterLogs(id);
    res.send(connectionLogs);
  }

  async pluginList(req, res) {
    let id = req.params.id;
    if (id !== "all") {
      this.#logger.info("Grabbing plugin list for: ", id);
      let pluginList = await Runner.returnPluginList(id);
      res.send(pluginList);
      return;
    }
    this.#logger.info("Grabbing global plugin list");
    let pluginList = await Runner.returnPluginList();
    res.send(pluginList);
  }
}

// prettier-ignore
module.exports = createController(PrinterController)
  .prefix(AppConstants.apiRoute + "/printer")
  .before([ensureAuthenticated])
  .get("/", "list")
  .get("/:id", "get")
  .delete("/:id", "delete")
  .post("/update", "updateConnectionSettings")
  .post("/updateSortIndex", "updateSortIndex")
  .post("/create", "createPrinter")
  // WIP line
  // TODO line
  .post("/stepChange", "setStepChange")
  .post("/flowChange", "setFlowChange")
  .post("/feedChange", "setFeedChange")
  .post("/updateSettings", "updateSettings")
  .post("/refreshSettings", "refreshSettings")
  .post("/reconnectOctoPrint/:id", "reconnectOctoPrint")
  .get("/connectionLogs/:id", "connectionLogs")
  .get("/pluginList/:id", "pluginList")
  .post("/killPowerSettings/:id", "killPowerSettings");
