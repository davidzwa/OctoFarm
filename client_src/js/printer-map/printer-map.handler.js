import currentOperations from "../lib/modules/currentOperations";
import { setPrinterMapState } from "./printer-map.state";
import { initPrinterMap } from "./printer-map.updater";
import { getViewType } from "../monitoring/monitoring-view.state";

export async function printerMapSSEventHandler(data) {
  if (data != false) {
    //Update global variables with latest information...
    const printerInfo = data.printersInformation;
    const printerControlList = data.printerControlList;

    setPrinterMapState(printerInfo, printerControlList);

    await initPrinterMap(printerInfo, data.clientSettings, getViewType());
    if (event.data.clientSettings.panelView.currentOp) {
      const currentOperationsData = event.data.currentOperations;
      currentOperations(
        currentOperationsData.operations,
        currentOperationsData.count,
        printerInfo
      );
    }
  }
}
