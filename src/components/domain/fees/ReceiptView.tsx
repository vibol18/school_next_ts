import React from "react";
import { CheckCircle2, Download, Printer } from "lucide-react";

interface ReceiptViewProps {
  payment: any;
  student: any;
}

export function ReceiptView({ payment, student }: ReceiptViewProps) {
  if (!payment) return null;

  return (
    <div className="bg-white max-w-2xl mx-auto rounded-2xl border border-slate-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
      
      <div className="p-8 pb-0 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payment Receipt</h1>
          </div>
          <p className="text-sm font-semibold text-slate-400">Receipt No: <span className="text-slate-700">#{payment.id || "0001"}</span></p>
          <p className="text-sm font-semibold text-slate-400 mt-0.5">Date: <span className="text-slate-700">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}</span></p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg font-bold tracking-widest text-sm uppercase">
            REAL SCHOOL
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">123 Education Lane<br/>Cityville, State 12345</p>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-8 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
            <h2 className="text-lg font-bold text-slate-800">{student?.firstName} {student?.lastName}</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">ID: {student?.studentCode || `STU-${student?.id}`}</p>
            <p className="text-sm font-medium text-slate-500">{student?.className || "Class Not Set"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Paid</p>
            <h2 className="text-4xl font-black text-emerald-500">${(payment.amount || 0).toFixed(2)}</h2>
          </div>
        </div>

        <table className="w-full text-left text-sm mb-8">
          <thead>
            <tr className="border-b-2 border-slate-100 text-slate-400 font-bold uppercase text-xs tracking-wider">
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Payment Method</th>
              <th className="pb-3 text-right">Reference</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 font-medium">
            <tr>
              <td className="py-4 border-b border-slate-50">School Fee Payment</td>
              <td className="py-4 border-b border-slate-50 text-right">{payment.paymentMethod || "CASH"}</td>
              <td className="py-4 border-b border-slate-50 text-right">{payment.referenceNumber || "-"}</td>
              <td className="py-4 border-b border-slate-50 text-right font-bold">${(payment.amount || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {payment.notes && (
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">{payment.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm font-medium text-slate-500 flex-1 text-center sm:text-left">
          Thank you for your payment!
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
