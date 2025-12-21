"use client";
import React, { useState } from 'react';
import { calculateZakat, getLivestockZakat } from '@/lib/zakatEngine';
import { LANGUAGES, CURRENCIES } from '@/lib/constants';
import { Download, RotateCcw, Book, Globe, Coins, Info, X } from 'lucide-react';
import jsPDF from 'jspdf';
// 1. IMPORT THE REFERENCES
import references from '../references.json';

export default function ZakatApp() {
  const [vals, setVals] = useState({ 
    cash: 0, gold: 0, silver: 0, stocks: 0, 
    inventory: 0, debts: 0, goldPrice: 70, 
    silverPrice: 0.90, sheep: 0 
  });
  const [nisabMode, setNisabMode] = useState('silver');
  const [activeLang, setActiveLang] = useState('en');
  const [activeCurrency, setActiveCurrency] = useState('USD');
  
  // 2. MODAL STATE FOR PROOF
  const [proofData, setProofData] = useState(null);
  
  const res = calculateZakat(vals, nisabMode);
  const selectedCurrency = CURRENCIES.find(c => c.code === activeCurrency) || CURRENCIES[0];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 128, 0);
    doc.text("Zakat Calculation Report", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Currency: ${activeCurrency}`, 20, 45);
    doc.text(`Nisab Basis: ${nisabMode.toUpperCase()}`, 20, 55);
    
    doc.line(20, 60, 190, 60);
    
    doc.text(`Total Net Wealth: ${selectedCurrency.symbol}${res.netWealth.toFixed(2)}`, 20, 75);
    doc.setFontSize(16);
    doc.text(`ZAKAT DUE: ${selectedCurrency.symbol}${res.total.toFixed(2)}`, 20, 90);
    
    doc.setFontSize(12);
    doc.text(`Livestock Due: ${getLivestockZakat(vals.sheep, 'sheep')}`, 20, 105);
    
    doc.setFontSize(10);
    doc.text("Calculated based on Quranic principles and Sunnah.", 20, 130);
    doc.save("my-zakat-report.pdf");
  };

  // 3. SHOW PROOF FUNCTION
  const showProof = (key) => {
    const data = references[key];
    if (data) setProofData(data);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl flex flex-col font-sans relative">
      
      {/* 4. SCHOLARLY PROOF MODAL (POPUP) */}
      {proofData && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border-t-4 border-emerald-600">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-emerald-800 font-bold text-lg flex items-center gap-2">
                <Book size={20}/> Evidence
              </h3>
              <button onClick={() => setProofData(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
            </div>
            <p className="text-slate-700 italic text-sm leading-relaxed mb-4">"{proofData.verse_en}"</p>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full inline-block">
              Source: {proofData.source}
            </div>
          </div>
        </div>
      )}

      {/* HEADER WITH DROP-DOWNS */}
      <header className="bg-emerald-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1 bg-emerald-800 p-1.5 rounded-lg border border-emerald-600">
            <Globe size={14} className="text-emerald-300"/>
            <select 
              className="bg-transparent text-xs outline-none cursor-pointer" 
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value)}
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code} className="text-black">{l.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-emerald-800 p-1.5 rounded-lg border border-emerald-600">
            <Coins size={14} className="text-emerald-300"/>
            <select 
              className="bg-transparent text-xs outline-none cursor-pointer" 
              value={activeCurrency}
              onChange={(e) => setActiveCurrency(e.target.value)}
            >
              {CURRENCIES.map(c => <option key={c.code} value={c.code} className="text-black">{c.code} ({c.symbol})</option>)}
            </select>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">Islamic Zakat Calculator</h1>
        <p className="text-emerald-100 text-sm mt-1 opacity-90 italic">Calculated according to Quran & Sunnah</p>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 flex-1 space-y-6">
        
        {/* Wealth Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Book size={18} className="text-emerald-600"/> Wealth Details
            </h2>
            <div className="flex bg-slate-200 p-1 rounded-lg text-[10px] font-bold">
               <button 
                 onClick={() => setNisabMode('gold')}
                 className={`px-2 py-1 rounded ${nisabMode === 'gold' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
               >GOLD</button>
               <button 
                 onClick={() => setNisabMode('silver')}
                 className={`px-2 py-1 rounded ${nisabMode === 'silver' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
               >SILVER</button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input type="number" placeholder="Cash (Bank + Hand)" className="w-full border-slate-200 border p-3 pl-10 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black" onChange={e => setVals({...vals, cash: +e.target.value})} />
              <span className="absolute left-3 top-3.5 text-slate-400 text-sm">{selectedCurrency.symbol}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Gold (Grams)" className="w-full border-slate-200 border p-3 rounded-xl outline-none text-black" onChange={e => setVals({...vals, gold: +e.target.value})} />
              <input type="number" placeholder="Silver (Grams)" className="w-full border-slate-200 border p-3 rounded-xl outline-none text-black" onChange={e => setVals({...vals, silver: +e.target.value})} />
            </div>

            <input type="number" placeholder="Stocks / Investments" className="w-full border-slate-200 border p-3 rounded-xl outline-none text-black" onChange={e => setVals({...vals, stocks: +e.target.value})} />
            
            <div className="pt-2">
               <label className="text-[10px] uppercase font-bold text-red-500 mb-1 block">Deductions</label>
               <input type="number" placeholder="Debts & Overdue Bills" className="w-full border-red-100 border p-3 rounded-xl bg-red-50 outline-none text-black" onChange={e => setVals({...vals, debts: +e.target.value})} />
            </div>
          </div>

          <h2 className="font-bold text-slate-700 pt-4 border-t border-slate-100">Livestock (An-Na'am)</h2>
          <input type="number" placeholder="Number of Sheep/Goats" className="w-full border-slate-200 border p-3 rounded-xl outline-none text-black" onChange={e => setVals({...vals, sheep: +e.target.value})} />
        </section>

        {/* RESULTS CARD */}
        <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10 text-center">
            <p className="text-emerald-300 font-medium uppercase text-[10px] tracking-widest flex items-center justify-center gap-1">
              Estimated Zakat Owed
              {/* 5. ADDED VIEW PROOF BUTTON */}
              <button onClick={() => showProof('residuary')} className="p-1 bg-emerald-800 rounded-full hover:bg-emerald-700 transition">
                <Info size={12}/>
              </button>
            </p>
            <p className="text-5xl font-black mt-1">
              {selectedCurrency.symbol}{res.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <div className="mt-4 flex flex-col gap-1 items-center">
               <span className="text-[11px] bg-emerald-800 px-3 py-1 rounded-full border border-emerald-700">
                 Animal Zakat: {getLivestockZakat(vals.sheep, 'sheep')}
               </span>
               {!res.eligible && (
                 <p className="text-[10px] text-emerald-400 mt-2 italic flex items-center gap-1">
                   <Info size={10}/> Total wealth is currently below the Nisab threshold.
                 </p>
               )}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-800 rounded-full opacity-50"></div>
        </div>
      </main>

      {/* FOOTER ACTIONS */}
      <footer className="p-6 bg-white border-t border-slate-100 flex gap-4">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-slate-100 text-slate-600 p-4 rounded-2xl flex justify-center hover:bg-slate-200 transition active:scale-90"
          title="Reset All"
        >
          <RotateCcw size={24}/>
        </button>
        <button 
          onClick={downloadPDF} 
          className="bg-emerald-600 text-white p-4 rounded-2xl font-bold flex justify-center items-center gap-2 grow shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition active:scale-95"
        >
          <Download size={20}/> Download PDF Report
        </button>
      </footer>
    </div>
  );
}
