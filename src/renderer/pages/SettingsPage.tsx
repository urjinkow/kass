import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassSelect } from '../components/ui/GlassSelect';
import { Toast } from '../components/common/Toast';
import { useSettingsStore } from '../stores/settingsStore';
import { mn } from '../i18n/mn';

export const SettingsPage: React.FC = () => {
  const { printerPaperWidth, printerPort, setPrinterConfig, testPrint } = useSettingsStore();
  const [paperWidth, setPaperWidth] = useState<'58' | '80'>(printerPaperWidth);
  const [port, setPort] = useState(printerPort);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSaveConfig = async () => {
    await setPrinterConfig({ width: paperWidth, port });
    setToast({ message: mn.messages.saveSuccess, type: 'success' });
  };

  const handleTestPrint = async () => {
    const result = await testPrint();
    if (result.success) {
      setToast({ message: mn.messages.printSuccess, type: 'success' });
    } else {
      setToast({ message: result.error || mn.messages.printError, type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <GlassCard>
        <h1 className="text-3xl font-bold text-white mb-6">{mn.settings.title}</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{mn.settings.organization}</h2>
            <div className="space-y-2 text-text-secondary">
              <p>Нэр: {mn.app.organization}</p>
              <p>Хаяг: Улаанбаатар хот</p>
            </div>
          </div>

          <div className="border-t border-white border-opacity-10 pt-6">
            <h2 className="text-2xl font-bold text-white mb-4">{mn.settings.printer}</h2>
            
            <div className="space-y-4">
              <GlassSelect
                label={mn.printer.paperWidth}
                value={paperWidth}
                onChange={(val) => setPaperWidth(val as '58' | '80')}
                options={[
                  { value: '58', label: mn.printer.paperWidth58 },
                  { value: '80', label: mn.printer.paperWidth80 },
                ]}
              />

              <GlassSelect
                label="Принтерийн порт"
                value={port}
                onChange={setPort}
                options={[
                  { value: 'USB', label: 'USB' },
                  { value: 'COM1', label: 'COM1' },
                  { value: 'COM2', label: 'COM2' },
                  { value: 'COM3', label: 'COM3' },
                ]}
              />

              <div className="flex gap-4">
                <GlassButton variant="primary" onClick={handleSaveConfig}>
                  {mn.common.save}
                </GlassButton>
                <GlassButton variant="gold" onClick={handleTestPrint}>
                  {mn.printer.testPrint}
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-2xl font-bold text-white mb-4">Системийн мэдээлэл</h2>
        <div className="space-y-2 text-text-secondary">
          <p>Хувилбар: 1.0.0</p>
          <p>Үүсгэсэн: Gandandtegchinlen Monastery</p>
          <p>Database: SQLite (Offline)</p>
        </div>
      </GlassCard>
    </div>
  );
};
