"use client";
import React, { useState } from 'react';
import { calculateZakat, getLivestockZakat } from '@/lib/zakatEngine';
import { Download, RotateCcw, Book, Globe, Coins } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ZakatApp() {
  const [vals, setVals] = useState({ cash: 0, gold: 0, silver: 0, stocks: 0, inventory: 0, debts: 0, goldPrice: 70, silverPrice: 0.90, sheep: 0 });
  const [nisabMode, setNisabMode] = useState('silver');
  
  const res = calculateZakat(vals, nisabMode);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Zakat Calculation Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Wealth: ${res.netWealth.toFixed(2)}`, 20, 40);
    doc.text(`Zakat Due: ${res.total.toFixed(2)}`, 20, 50);
    doc.text(`Livestock Due: ${getLivestockZakat(vals.sheep, 'sheep')}`, 20, 60);
    doc.save("zakat-report.pdf");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg flex flex-col">
      <header className="bg-emerald-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Islamic Zakat Calculator</h1>
        <p className="text-emerald-100 text-sm">Calculate according to Quran & Sunnah</p>
      </header>

      <main className="p-6 flex-1 space-y-6">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-slate-100 p-2 rounded-lg text-xs flex items-center gap-1"><Globe size={14}/> Language</div>
          <div className="flex-1 bg-slate-100 p-2 rounded-lg text-xs flex items-center gap-1"><Coins size={14}/> Currency</div>
        </div>

        <section className="space-y-4">
          <h2 className="font-bold flex items-center gap-2"><Book size={18} className="text-emerald-600"/> Wealth Details</h2>
          <input type="number" placeholder="Cash in Bank" className="w-full border p-3 rounded-xl" onChange={e => setVals({...vals, cash: +e.target.value})} />
          <input type="number" placeholder="Gold (Grams)" className="w-full border p-3 rounded-xl" onChange={e => setVals({...vals, gold: +e.target.value})} />
          <input type="number" placeholder="Silver (Grams)" className="w-full border p-3 rounded-xl" onChange={e => setVals({...vals, silver: +e.target.value})} />
          <input type="number" placeholder="Debts you owe" className="w-full border p-3 rounded-xl border-red-200" onChange={e => setVals({...vals, debts: +e.target.value})} />
          
          <h2 className="font-bold pt-4">Livestock (Animals)</h2>
          <input type="number" placeholder="Number of Sheep/Goats" className="w-full border p-3 rounded-xl" onChange={e => setVals({...vals, sheep: +e.target.value})} />
        </section>

        <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200 text-center">
          <p className="text-emerald-700 font-semibold uppercase text-xs tracking-widest">Total Zakat Due</p>
          <p className="text-4xl font-black text-emerald-900 mt-1">{res.total.toFixed(2)}</p>
          <p className="text-xs mt-2 text-emerald-600">Animal Zakat: {getLivestockZakat(vals.sheep, 'sheep')}</p>
        </div>
      </main>

      <footer className="p-6 bg-slate-50 flex gap-4">
        <button onClick={() => window.location.reload()} className="flex-1 bg-slate-200 p-4 rounded-xl flex justify-center"><RotateCcw/></button>
        <button onClick={downloadPDF} className="flex-3 bg-emerald-600 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 grow">
          <Download size={20}/> Download PDF
        </button>
      </footer>
    </div>
  );
}
