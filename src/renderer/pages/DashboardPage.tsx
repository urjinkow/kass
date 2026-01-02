import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassTable } from '../components/ui/GlassTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { mn } from '../i18n/mn';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

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

  const summaryCards = [
    {
      title: mn.dashboard.openingBalance,
      value: summary?.summary.opening_balance || 0,
      color: 'text-blue-400',
    },
    {
      title: mn.dashboard.totalIncome,
      value: summary?.summary.total_income || 0,
      color: 'text-green-400',
    },
    {
      title: mn.dashboard.totalExpense,
      value: summary?.summary.total_expense || 0,
      color: 'text-red-400',
    },
    {
      title: mn.dashboard.currentBalance,
      value: summary?.summary.closing_balance || 0,
      color: 'text-gold',
    },
  ];

  const recentTransactions = [
    ...(summary?.income_transactions || []).slice(0, 5).map((t: any) => ({
      ...t,
      type: 'Орлого',
      type_color: 'text-green-400',
    })),
    ...(summary?.expense_transactions || []).slice(0, 5).map((t: any) => ({
      ...t,
      type: 'Зарлага',
      type_color: 'text-red-400',
    })),
  ].sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()).slice(0, 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{mn.nav.dashboard}</h1>
        <p className="text-text-secondary">{mn.dashboard.today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <GlassCard key={index} hover>
            <div>
              <p className="text-text-secondary text-sm mb-2">{card.title}</p>
              <p className={`text-3xl font-bold ${card.color}`}>
                {formatCurrency(card.value)}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h2 className="text-2xl font-bold text-white mb-4">{mn.dashboard.recentTransactions}</h2>
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
              key: 'transaction_date', 
              label: 'Огноо',
              render: (value) => new Date(value).toLocaleString('mn-MN')
            },
          ]}
          data={recentTransactions}
          emptyMessage="Өнөөдөр гүйлгээ байхгүй"
        />
      </GlassCard>
    </div>
  );
};
