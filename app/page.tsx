
"use client";
import React, { useState } from 'react';
import { calculateZakat, getLivestockZakat } from '@/lib/zakatEngine';
import { LANGUAGES, CURRENCIES } from '@/lib/constants';
import { Book, Info, X, Globe, Coins, Beef } from 'lucide-react';
import references from '../references.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ZakatApp() {
  const [activeTab, setActiveTab] = useState('wealth'); // 'wealth' or 'livestock'
  const [vals, setVals] = useState({ 
    cash: 0, gold: 0, silver: 0, stocks: 0, 
    inventory: 0, debts: 0, goldPrice: 70, 
    silverPrice: 0.90, sheep: 0, goats: 0, cows: 0, camels: 0
  });
  const [activeLang, setActiveLang] = useState('en');
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [proofData, setProofData] = useState<any>(null);
  
  const res = calculateZakat(vals, 'silver');
  const livestockRes = getLivestockZakat(vals);
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
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl flex flex-col font-sans relative text-slate-900">
      <AnimatePresence>
        {proofData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border-t-4 border-emerald-600">
              <div className="flex justify-between mb-4">
                <h3 className="text-emerald-800 font-bold flex items-center gap-2"><Book size={18}/> Evidence</h3>
                <button onClick={() => setProofData(null)}><X size={20}/></button>
              </div>
              <p className="text-slate-700 italic text-sm mb-4">"{proofData?.verse_en}"</p>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Source: {proofData?.source}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER WITH DROP-DOWNS */}
      <header className="bg-emerald-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold">ZakatApp</h1>
            <p className="text-emerald-100 text-[10px] italic">World's Most Authentic</p>
          </div>
          <div className="flex gap-2">
            <select value={activeLang} onChange={(e) => setActiveLang(e.target.value)} className="bg-emerald-800 text-[10px] p-1 rounded border border-emerald-600 outline-none">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
            </select>
            <select value={activeCurrency} onChange={(e) => setActiveCurrency(e.target.value)} className="bg-emerald-800 text-[10px] p-1 rounded border border-emerald-600 outline-none">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-emerald-800/50 p-1 rounded-xl">
          <button onClick={() => setActiveTab('wealth')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${activeTab === 'wealth' ? 'bg-white text-emerald-700 shadow' : 'text-emerald-100'}`}>
            <Coins size={14}/> Wealth
          </button>
          <button onClick={() => setActiveTab('livestock')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${activeTab === 'livestock' ? 'bg-white text-emerald-700 shadow' : 'text-emerald-100'}`}>
            <Beef size={14}/> Livestock
          </button>
        </div>
      </header>

      <main className="p-6 flex-1 space-y-6">
        {activeTab === 'wealth' ? (
          <section className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">{selectedCurrency.symbol}</span>
              <input type="number" placeholder="Cash on Hand" className="w-full border-slate-200 border p-3 pl-8 rounded-xl outline-none" onChange={e => setVals({...vals, cash: +e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Gold (grams)" className="w-full border-slate-200 border p-3 rounded-xl" onChange={e => setVals({...vals, gold: +e.target.value})} />
              <input type="number" placeholder="Silver (grams)" className="w-full border-slate-200 border p-3 rounded-xl" onChange={e => setVals({...vals, silver: +e.target.value})} />
            </div>
            {/* Results Card for Wealth */}
            <motion.div key="wealth-res" initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl flex flex-col items-center">
              <div className="w-24 h-24 mb-4"><Pie data={chartData} options={{ plugins: { legend: { display: false } } }} /></div>
              <p className="text-emerald-300 text-[10px] tracking-widest uppercase">Zakat Due</p>
              <p className="text-4xl font-black">{selectedCurrency.symbol}{res.total.toLocaleString()}</p>
              <button onClick={() => setProofData(references.residuary)} className="mt-4 text-[10px] text-emerald-400 underline flex items-center gap-1"><Info size={12}/> View Quranic Evidence</button>
            </motion.div>
          </section>
        ) : (
          <section className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-2">Sheep / Goats</label>
                <input type="number" className="w-full border-slate-200 border p-3 rounded-xl" placeholder="Count" onChange={e => setVals({...vals, sheep: +e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 ml-2">Cows / Buffalo</label>
                <input type="number" className="w-full border-slate-200 border p-3 rounded-xl" placeholder="Count" onChange={e => setVals({...vals, cows: +e.target.value})} />
              </div>
            </div>
            {/* Results for Livestock */}
            <div className="bg-white border-2 border-emerald-100 p-6 rounded-3xl space-y-4">
               <h3 className="font-bold text-emerald-800 text-sm">Livestock Due:</h3>
               {livestockRes.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <span className="text-sm font-medium text-slate-600">{item.animal}</span>
                   <span className="text-emerald-700 font-bold">{item.due}</span>
                 </div>
               ))}
               {livestockRes.length === 0 && <p className="text-xs text-slate-400 text-center italic">Below Nisab (No Zakat due yet)</p>}
               <button onClick={() => setProofData(references.livestock)} className="w-full text-[10px] text-slate-400 underline flex justify-center items-center gap-1"><Info size={12}/> View Hadith for Livestock</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
