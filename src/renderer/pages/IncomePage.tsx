import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassSelect } from '../components/ui/GlassSelect';
import { GlassButton } from '../components/ui/GlassButton';
import { Toast } from '../components/common/Toast';
import { useAuthStore } from '../stores/authStore';
import { useTransactionStore } from '../stores/transactionStore';
import { mn } from '../i18n/mn';

export const IncomePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { incomeCategories, loadCategories, addIncome } = useTransactionStore();

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (shouldPrint: boolean) => {
    if (!user) return;

    setLoading(true);
    
    const result = await addIncome({
      category_id: parseInt(categoryId),
      amount: parseFloat(amount),
      donor_name: donorName || undefined,
      description: description || undefined,
      payment_method: paymentMethod,
      user_id: user.id,
    });

    if (result.success) {
      setToast({ message: mn.messages.saveSuccess, type: 'success' });
      
      // Print if requested
      if (shouldPrint && result.transaction) {
        const printResult = await window.api.printReceipt(result.transaction, 'income');
        if (printResult.success) {
          setToast({ message: mn.messages.printSuccess, type: 'success' });
        } else {
          setToast({ message: printResult.error || mn.messages.printError, type: 'error' });
        }
      }

      // Reset form
      setCategoryId('');
      setAmount('');
      setDonorName('');
      setDescription('');
      setPaymentMethod('cash');
    } else {
      setToast({ message: result.error || mn.messages.saveError, type: 'error' });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <GlassCard>
        <h1 className="text-3xl font-bold text-white mb-6">{mn.income.title}</h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <GlassSelect
            label={mn.income.category}
            value={categoryId}
            onChange={setCategoryId}
            options={incomeCategories.map(cat => ({
              value: cat.id.toString(),
              label: cat.name_mn,
            }))}
            placeholder={mn.income.category}
            required
          />

          <GlassInput
            type="number"
            label={mn.income.amount}
            value={amount}
            onChange={setAmount}
            placeholder="0"
            required
            min={0}
            step={1}
          />

          <GlassInput
            type="text"
            label={`${mn.income.donorName} ${mn.common.optional}`}
            value={donorName}
            onChange={setDonorName}
            placeholder={mn.income.donorName}
          />

          <GlassInput
            type="text"
            label={`${mn.income.description} ${mn.common.optional}`}
            value={description}
            onChange={setDescription}
            placeholder={mn.income.description}
          />

          <GlassSelect
            label="Төлбөрийн хэлбэр"
            value={paymentMethod}
            onChange={(val) => setPaymentMethod(val as 'cash' | 'transfer')}
            options={[
              { value: 'cash', label: mn.paymentMethod.cash },
              { value: 'transfer', label: mn.paymentMethod.transfer },
            ]}
            required
          />

          <div className="flex gap-4">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => handleSubmit(false)}
              disabled={loading || !categoryId || !amount}
              className="flex-1"
            >
              {mn.common.save}
            </GlassButton>

            <GlassButton
              variant="gold"
              size="lg"
              onClick={() => handleSubmit(true)}
              disabled={loading || !categoryId || !amount}
              className="flex-1"
            >
              {mn.common.saveAndPrint}
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
