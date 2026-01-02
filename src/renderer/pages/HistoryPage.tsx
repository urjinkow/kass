import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassTable } from '../components/ui/GlassTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { mn } from '../i18n/mn';

export const HistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Set default dates (last 7 days)
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(weekAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadHistory();
    }
  }, [startDate, endDate]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await window.api.getTransactionHistory(startDate, endDate);
      
      const allTransactions = [
        ...data.income.map((t: any) => ({
          ...t,
          type: 'Орлого',
          type_color: 'text-green-400',
        })),
        ...data.expense.map((t: any) => ({
          ...t,
          type: 'Зарлага',
          type_color: 'text-red-400',
        })),
      ].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('mn-MN') + '₮';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <GlassCard>
        <h1 className="text-3xl font-bold text-white mb-6">{mn.nav.history}</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <GlassInput
            type="date"
            label="Эхлэх огноо"
            value={startDate}
            onChange={setStartDate}
          />
          <GlassInput
            type="date"
            label="Дуусах огноо"
            value={endDate}
            onChange={setEndDate}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <GlassTable
            columns={[
              { key: 'receipt_number', label: 'Дугаар' },
              { 
                key: 'type', 
                label: 'Төрөл',
                render: (value, row) => (
                  <span className={row.type_color}>{value}</span>
                )
              },
              { key: 'category_name_mn', label: 'Ангилал' },
              { 
                key: 'amount', 
                label: 'Дүн',
                render: (value) => formatCurrency(value)
              },
              { 
                key: 'description', 
                label: 'Тайлбар',
                render: (value) => value || '-'
              },
              { 
                key: 'transaction_date', 
                label: 'Огноо',
                render: (value) => new Date(value).toLocaleString('mn-MN')
              },
            ]}
            data={transactions}
            emptyMessage="Гүйлгээ олдсонгүй"
          />
        )}
      </GlassCard>
    </div>
  );
};
