import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassModal } from '../components/ui/GlassModal';
import { Toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { mn } from '../i18n/mn';

export const DailyClosePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [cashCounted, setCashCounted] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadDailySummary();
  }, []);

  const loadDailySummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await window.api.getDailySummary(today);
      setSummary(data);
    } catch (error) {
      console.error('Load summary error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDay = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await window.api.closeDay(
        today,
        parseFloat(cashCounted),
        notes || null,
        user.id
      );

      if (result.success) {
        setToast({ message: mn.messages.closeDaySuccess, type: 'success' });
        setShowConfirmModal(false);
        loadDailySummary();
      } else {
        setToast({ message: result.error || mn.messages.saveError, type: 'error' });
      }
    } catch (error) {
      console.error('Close day error:', error);
      setToast({ message: mn.messages.saveError, type: 'error' });
    }
  };

  const handlePrintSummary = async () => {
    try {
      const result = await window.api.printDailySummary(summary);
      if (result.success) {
        setToast({ message: mn.messages.printSuccess, type: 'success' });
      } else {
        setToast({ message: result.error || mn.messages.printError, type: 'error' });
      }
    } catch (error) {
      console.error('Print error:', error);
      setToast({ message: mn.messages.printError, type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('mn-MN') + '₮';
  };

  const difference = cashCounted ? parseFloat(cashCounted) - (summary?.summary.closing_balance || 0) : 0;
  const isClosed = summary?.summary.status === 'closed';

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
        <h1 className="text-3xl font-bold text-white mb-6">{mn.dailyClose.title}</h1>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-text-secondary mb-1">{mn.dashboard.openingBalance}</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(summary?.summary.opening_balance || 0)}
            </p>
          </div>
          <div>
            <p className="text-text-secondary mb-1">{mn.dashboard.totalIncome}</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(summary?.summary.total_income || 0)}
            </p>
          </div>
          <div>
            <p className="text-text-secondary mb-1">{mn.dashboard.totalExpense}</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(summary?.summary.total_expense || 0)}
            </p>
          </div>
          <div>
            <p className="text-text-secondary mb-1">{mn.dashboard.currentBalance}</p>
            <p className="text-2xl font-bold text-gold">
              {formatCurrency(summary?.summary.closing_balance || 0)}
            </p>
          </div>
        </div>

        {!isClosed && (
          <div className="space-y-4 border-t border-white border-opacity-10 pt-6">
            <GlassInput
              type="number"
              label={mn.dailyClose.cashCounted}
              value={cashCounted}
              onChange={setCashCounted}
              placeholder="0"
              min={0}
              step={1}
            />

            {cashCounted && (
              <div>
                <p className="text-text-secondary mb-1">{mn.dailyClose.difference}</p>
                <p className={`text-2xl font-bold ${difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(difference)}
                </p>
              </div>
            )}

            <GlassInput
              type="text"
              label={`${mn.dailyClose.notes} ${mn.common.optional}`}
              value={notes}
              onChange={setNotes}
              placeholder={mn.dailyClose.notes}
            />

            <div className="flex gap-4">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => setShowConfirmModal(true)}
                disabled={!cashCounted}
                className="flex-1"
              >
                {mn.dailyClose.closeDay}
              </GlassButton>

              <GlassButton
                variant="gold"
                size="lg"
                onClick={handlePrintSummary}
                className="flex-1"
              >
                {mn.dailyClose.printSummary}
              </GlassButton>
            </div>
          </div>
        )}

        {isClosed && (
          <div className="border-t border-white border-opacity-10 pt-6">
            <div className="p-4 rounded-lg bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 mb-4">
              <p className="text-green-300">Өдрийн хаалт хийгдсэн байна</p>
            </div>

            <GlassButton
              variant="gold"
              size="lg"
              onClick={handlePrintSummary}
              className="w-full"
            >
              {mn.dailyClose.printSummary}
            </GlassButton>
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-4">{mn.dailyClose.incomeSummary}</h2>
          <div className="space-y-2">
            {summary?.income_by_category.map((cat: any) => (
              <div key={cat.category_id} className="flex justify-between items-center">
                <span className="text-text-secondary">{cat.category_name_mn}</span>
                <span className="text-white font-medium">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-4">{mn.dailyClose.expenseSummary}</h2>
          <div className="space-y-2">
            {summary?.expense_by_category.map((cat: any) => (
              <div key={cat.category_id} className="flex justify-between items-center">
                <span className="text-text-secondary">{cat.category_name_mn}</span>
                <span className="text-white font-medium">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={mn.dailyClose.closeDay}
        footer={
          <>
            <GlassButton onClick={() => setShowConfirmModal(false)}>
              {mn.common.cancel}
            </GlassButton>
            <GlassButton variant="primary" onClick={handleCloseDay}>
              {mn.common.confirm}
            </GlassButton>
          </>
        }
      >
        <p className="text-white text-lg">{mn.messages.closeDayConfirm}</p>
      </GlassModal>
    </div>
  );
};
