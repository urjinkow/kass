import { registerAuthHandlers } from './auth.ipc';
import { registerTransactionHandlers } from './transaction.ipc';
import { registerReportHandlers } from './report.ipc';
import { registerPrinterHandlers } from './printer.ipc';

export function registerAllHandlers() {
  registerAuthHandlers();
  registerTransactionHandlers();
  registerReportHandlers();
  registerPrinterHandlers();
}
