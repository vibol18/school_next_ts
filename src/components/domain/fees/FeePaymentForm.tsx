import React, { useState } from "react";
import { CreditCard, DollarSign, Calendar, FileText, CheckCircle2 } from "lucide-react";

interface FeePaymentFormProps {
  invoiceId?: number;
  studentId?: number;
  totalAmount?: number;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function FeePaymentForm({ invoiceId, studentId, totalAmount = 0, onSubmit, isLoading }: FeePaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: totalAmount,
    paymentMethod: "CASH",
    referenceNumber: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      invoiceId,
      studentId,
      paymentDate: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-100" />
          Record Fee Payment
        </h2>
        <p className="text-emerald-100 text-sm mt-1">Process a new payment for student fees</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Amount Due</p>
            <p className="text-3xl font-black text-slate-800">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Payment Amount ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={handleChange}
                className="pl-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Payment Method</label>
            <select
              name="paymentMethod"
              required
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none"
            >
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Transaction Reference (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              placeholder="e.g. TXN-123456789"
              className="pl-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Additional Notes</label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any comments regarding this payment..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none"
          />
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || formData.amount <= 0}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          {isLoading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </form>
  );
}
