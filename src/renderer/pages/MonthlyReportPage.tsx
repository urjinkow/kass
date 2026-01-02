import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MonthlyReportPage.css';

const MONTH_NAMES_MN = [
  '1-р сар', '2-р сар', '3-р сар', '4-р сар',
  '5-р сар', '6-р сар', '7-р сар', '8-р сар',
  '9-р сар', '10-р сар', '11-р сар', '12-р сар'
];

export const MonthlyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, [year, month]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await window.api.getMonthlyReport(year, month);
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
  };

  const exportToCSV = () => {
    if (!report) return;

    const rows = [
      ['Сарын тайлан', `${year} оны ${MONTH_NAMES_MN[month - 1]}`],
      [''],
      ['Дүн'],
      ['Нийт орлого', report.summary.totalIncome],
      ['Нийт зарлага', report.summary.totalExpense],
      ['Цэвэр орлого', report.summary.closingBalance],
      ['Гүйлгээний тоо', report.summary.transactionCount],
      [''],
      ['Орлого (төрлөөр)'],
      ['Төрөл', 'Дүн', 'Тоо', 'Хувь'],
      ...report.incomeByCategory.map((cat: any) => [
        cat.category_name,
        cat.total,
        cat.count,
        cat.percentage.toFixed(1) + '%'
      ]),
      [''],
      ['Зарлага (төрлөөр)'],
      ['Төрөл', 'Дүн', 'Тоо', 'Хувь'],
      ...report.expenseByCategory.map((cat: any) => [
        cat.category_name,
        cat.total,
        cat.count,
        cat.percentage.toFixed(1) + '%'
      ])
    ];

    const csv = '\uFEFF' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `monthly_report_${year}_${month}.csv`;
    link.click();
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return <div className="monthly-report-page" style={{ padding: '24px' }}>Ачааллаж байна...</div>;
  }

  return (
    <div className="monthly-report-page">
      <div className="report-header no-print">
        <h1>📊 САРЫН ТАЙЛАН</h1>
        <div className="header-controls">
          <select
            className="glass-input year-select"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            className="glass-input month-select"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {MONTH_NAMES_MN.map((name, idx) => (
              <option key={idx} value={idx + 1}>{name}</option>
            ))}
          </select>
          <button className="glass-button" onClick={printReport}>
            🖨️ Хэвлэх
          </button>
          <button className="glass-button" onClick={exportToCSV}>
            📥 CSV
          </button>
          <button className="glass-button" onClick={() => navigate(-1)}>
            Буцах
          </button>
        </div>
      </div>

      {report && (
        <div className="report-content glass-card">
          <div className="report-title">
            <h2>САРЫН ТАЙЛАН</h2>
            <p>{year} оны {MONTH_NAMES_MN[month - 1]}</p>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-label">Нийт орлого</div>
              <div className="summary-value text-success">
                {formatMoney(report.summary.totalIncome)}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Нийт зарлага</div>
              <div className="summary-value text-error">
                {formatMoney(report.summary.totalExpense)}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Цэвэр орлого</div>
              <div className={`summary-value ${report.summary.closingBalance >= 0 ? 'text-success' : 'text-error'}`}>
                {formatMoney(report.summary.closingBalance)}
              </div>
            </div>
          </div>

          <div className="category-section">
            <h3>ОРЛОГО (төрлөөр)</h3>
            <div className="category-list">
              {report.incomeByCategory.map((cat: any, idx: number) => (
                <div key={idx} className="category-item">
                  <span className="category-name">{cat.category_name}</span>
                  <div className="category-bar">
                    <div
                      className="category-fill income"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="category-amount">{formatMoney(cat.total)}</span>
                  <span className="category-percent">({cat.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>ЗАРЛАГА (төрлөөр)</h3>
            <div className="category-list">
              {report.expenseByCategory.map((cat: any, idx: number) => (
                <div key={idx} className="category-item">
                  <span className="category-name">{cat.category_name}</span>
                  <div className="category-bar">
                    <div
                      className="category-fill expense"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="category-amount">{formatMoney(cat.total)}</span>
                  <span className="category-percent">({cat.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
