import { getDatabase } from '../database/connection';
import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';

interface PrinterConfig {
  type: string;
  interface: string;
  characterSet?: string;
  width?: number;
}

export class PrinterService {
  private config: PrinterConfig = {
    type: 'epson',
    interface: 'usb',
    characterSet: 'UTF8',
    width: 48
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const db = getDatabase();
    const paperWidth = db.prepare("SELECT value FROM settings WHERE key = 'printer_paper_width'").get() as { value: string } | undefined;
    const printerPort = db.prepare("SELECT value FROM settings WHERE key = 'printer_port'").get() as { value: string } | undefined;

    if (paperWidth) {
      this.config.width = paperWidth.value === '58' ? 32 : 48;
    }

    if (printerPort) {
      this.config.interface = printerPort.value.toLowerCase();
    }
  }

  async printReceipt(transaction: any, type: 'income' | 'expense'): Promise<{ success: boolean; error?: string }> {
    try {
      const db = getDatabase();
      const orgName = db.prepare("SELECT value FROM settings WHERE key = 'organization_name'").get() as { value: string };
      const orgAddress = db.prepare("SELECT value FROM settings WHERE key = 'organization_address'").get() as { value: string };
      const header = db.prepare("SELECT value FROM settings WHERE key = 'receipt_header'").get() as { value: string };
      const footer = db.prepare("SELECT value FROM settings WHERE key = 'receipt_footer'").get() as { value: string };

      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: this.config.interface as any,
        width: this.config.width,
        removeSpecialCharacters: false
      });

      const isConnected = await printer.isPrinterConnected();
      if (!isConnected) {
        return { success: false, error: 'Принтер холбогдоогүй байна' };
      }

      // Header
      printer.alignCenter();
      printer.bold(true);
      printer.println(header.value);
      printer.bold(false);
      printer.drawLine();
      printer.println(orgName.value);
      printer.println(orgAddress.value);
      printer.drawLine();
      printer.newLine();

      // Transaction type
      printer.bold(true);
      printer.setTextSize(1, 1);
      printer.println(type === 'income' ? 'ОРЛОГО' : 'ЗАРЛАГА');
      printer.setTextNormal();
      printer.bold(false);
      printer.newLine();

      // Transaction details
      printer.alignLeft();
      printer.println(`Дугаар: ${transaction.receipt_number}`);
      
      const date = new Date(transaction.transaction_date);
      printer.println(`Огноо: ${date.toLocaleString('mn-MN')}`);
      printer.newLine();

      printer.println(`Төрөл: ${transaction.category_name_mn}`);
      
      if (type === 'income' && transaction.donor_name) {
        printer.println(`Хандивлагч: ${transaction.donor_name}`);
      } else if (type === 'expense' && transaction.vendor_name) {
        printer.println(`Нийлүүлэгч: ${transaction.vendor_name}`);
      }

      if (transaction.description) {
        printer.println(`Тайлбар: ${transaction.description}`);
      }

      printer.drawLine();

      // Amount
      printer.alignCenter();
      printer.bold(true);
      printer.setTextSize(1, 1);
      printer.println(`ДҮН: ${this.formatCurrency(transaction.amount)}`);
      printer.setTextNormal();
      printer.bold(false);
      printer.drawLine();
      printer.newLine();

      // Footer
      const footerLines = footer.value.split('\n');
      footerLines.forEach(line => printer.println(line.trim()));
      
      printer.newLine();
      printer.newLine();
      printer.cut();

      await printer.execute();
      
      return { success: true };
    } catch (error) {
      console.error('Print error:', error);
      return { success: false, error: 'Хэвлэхэд алдаа гарлаа' };
    }
  }

  async printDailySummary(summaryData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const db = getDatabase();
      const orgName = db.prepare("SELECT value FROM settings WHERE key = 'organization_name'").get() as { value: string };

      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: this.config.interface as any,
        width: this.config.width,
        removeSpecialCharacters: false
      });

      const isConnected = await printer.isPrinterConnected();
      if (!isConnected) {
        return { success: false, error: 'Принтер холбогдоогүй байна' };
      }

      printer.alignCenter();
      printer.bold(true);
      printer.println(orgName.value);
      printer.println('ӨДРИЙН ТАЙЛАН');
      printer.bold(false);
      printer.drawLine();
      printer.println(`Огноо: ${summaryData.summary.summary_date}`);
      printer.drawLine();
      printer.newLine();

      printer.alignLeft();
      printer.println(`Эхний үлдэгдэл: ${this.formatCurrency(summaryData.summary.opening_balance)}`);
      printer.println(`Нийт орлого: ${this.formatCurrency(summaryData.summary.total_income)}`);
      printer.println(`Нийт зарлага: ${this.formatCurrency(summaryData.summary.total_expense)}`);
      printer.drawLine();
      printer.println(`Үлдэгдэл: ${this.formatCurrency(summaryData.summary.closing_balance)}`);
      
      if (summaryData.summary.cash_counted !== null) {
        printer.println(`Тоолсон мөнгө: ${this.formatCurrency(summaryData.summary.cash_counted)}`);
        printer.println(`Зөрүү: ${this.formatCurrency(summaryData.summary.difference)}`);
      }
      
      printer.newLine();
      printer.newLine();
      printer.cut();

      await printer.execute();
      
      return { success: true };
    } catch (error) {
      console.error('Print summary error:', error);
      return { success: false, error: 'Тайлан хэвлэхэд алдаа гарлаа' };
    }
  }

  async testPrint(): Promise<{ success: boolean; error?: string }> {
    try {
      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: this.config.interface as any,
        width: this.config.width
      });

      const isConnected = await printer.isPrinterConnected();
      if (!isConnected) {
        return { success: false, error: 'Принтер холбогдоогүй байна' };
      }

      printer.alignCenter();
      printer.println('TEST PRINT');
      printer.println('Тест хэвлэлт');
      printer.newLine();
      printer.println(`Цаасны өргөн: ${this.config.width === 32 ? '58мм' : '80мм'}`);
      printer.newLine();
      printer.newLine();
      printer.cut();

      await printer.execute();
      
      return { success: true };
    } catch (error) {
      console.error('Test print error:', error);
      return { success: false, error: 'Тест хэвлэхэд алдаа гарлаа' };
    }
  }

  private formatCurrency(amount: number): string {
    return amount.toLocaleString('mn-MN') + '₮';
  }

  updateConfig(config: Partial<PrinterConfig>) {
    const db = getDatabase();
    
    if (config.width !== undefined) {
      const paperWidth = config.width === 32 ? '58' : '80';
      db.prepare("UPDATE settings SET value = ? WHERE key = 'printer_paper_width'").run(paperWidth);
      this.config.width = config.width;
    }

    if (config.interface !== undefined) {
      db.prepare("UPDATE settings SET value = ? WHERE key = 'printer_port'").run(config.interface);
      this.config.interface = config.interface;
    }
  }
}
