"use client";
import React, { useState } from 'react';
import { calculateZakat } from '@/lib/zakatEngine';
import { CURRENCIES } from '@/lib/constants';
import { Book, Info, X } from 'lucide-react';
import references from '../references.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. Define the shape of the data
interface ZakatProof {
  title: string;
  verse_en: string;
  source: string;
}

export default function ZakatApp() {
  const [vals, setVals] = useState({ 
    cash: 0, gold: 0, silver: 0, stocks: 0, 
    inventory: 0, debts: 0, goldPrice: 70, 
    silverPrice: 0.90, sheep: 0 
  });
  const [activeCurrency] = useState('USD');
  
  // 2. Explicitly tell the state it can hold a ZakatProof object
  const [proofData, setProofData] = useState<any>(null);
  
  const res = calculateZakat(vals, 'silver');
  const selectedCurrency = CURRENCIES.find(c => c.code === activeCurrency) || CURRENCIES[0];

  const chartData = {
    labels: ['Cash', 'Gold', 'Silver', 'Stocks'],
    datasets: [{
      data: [vals.cash, vals.gold * vals.goldPrice, vals.silver * vals.silverPrice, vals.stocks],
      backgroundColor: ['#10b981', '#fbbf24', '#94a3b8', '#3b82f6'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl flex flex-col font-sans relative">
      <AnimatePresence>
        {proofData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border-t-4 border-emerald-600"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-emerald-800 font-bold text-lg flex items-center gap-2 text-black">
                   <Book size={20}/> Evidence
                </h3>
                <button onClick={() => setProofData(null)} className="text-slate-400"><X size={20}/></button>
              </div>
              
              {/* FIXED LINE: We use optional chaining (?) to prevent the 'never' error */}
              <p className="text-slate-700 italic text-sm mb-4">
                "{proofData?.verse_en || "Loading..."}"
              </p>
              
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                Source: {proofData?.source || "General"}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-emerald-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Islamic Zakat Calculator</h1>
        <p className="text-emerald-100 text-sm mt-1 italic">World's Most Authentic Calculation</p>
      </header>

      <main className="p-6 flex-1 space-y-6">
        <section className="space-y-4">
          <input type="number" placeholder="Cash (Bank + Hand)" className="w-full border-slate-200 border p-3 rounded-xl text-black outline-none" onChange={e => setVals({...vals, cash: +e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Gold (Grams)" className="w-full border-slate-200 border p-3 rounded-xl text-black outline-none" onChange={e => setVals({...vals, gold: +e.target.value})} />
            <input type="number" placeholder="Silver (Grams)" className="w-full border-slate-200 border p-3 rounded-xl text-black outline-none" onChange={e => setVals({...vals, silver: +e.target.value})} />
          </div>
        </section>

        <motion.div 
          key={res.total}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4">
              <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <p className="text-emerald-300 font-medium uppercase text-[10px] tracking-widest">Total Zakat Due</p>
            <p className="text-5xl font-black mt-1">
              {selectedCurrency.symbol}{res.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <button 
              onClick={() => setProofData(references.residuary)} 
              className="mt-4 flex items-center gap-1 text-[10px] text-emerald-400 underline cursor-pointer"
            >
              <Info size={12}/> Why this amount? View Evidence
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
