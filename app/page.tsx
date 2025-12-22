"use client";
import React, { useState } from 'react';
import { calculateZakat, getLivestockZakat } from '@/lib/zakatEngine';
import { LANGUAGES, CURRENCIES } from '@/lib/constants';
import { Book, Info, X, Coins, Beef, Globe, Wallet } from 'lucide-react';
import references from '../references.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// 1. MULTI-LANGUAGE DICTIONARY (All languages from your screenshot)
const translations: any = {
  en: { title: "Islamic Zakat", subtitle: "Authentic & Precise", wealth: "Wealth", livestock: "Livestock", cashPlace: "Cash on Hand / Bank", goldLabel: "GOLD (GRAMS)", silverLabel: "SILVER (GRAMS)", totalDue: "Total Zakat Due", evidence: "View Evidence", sheepLabel: "Sheep / Goats", cowLabel: "Cows / Buffalo", dueHeader: "Livestock Zakat Due:", noZakat: "Below Nisab limit", hadithBtn: "View Hadith", evidenceTitle: "Divine Evidence" },
  ur: { title: "اسلامی زکوۃ", subtitle: "مستند اور درست", wealth: "دولت", livestock: "مویشی", cashPlace: "نقدی رقم / بینک", goldLabel: "سونا (گرام)", silverLabel: "چاندی (گرام)", totalDue: "کل واجب الادا زکوۃ", evidence: "ثبوت ملاحظہ کریں", sheepLabel: "بھیڑ / بکریاں", cowLabel: "گائے / بھینس", dueHeader: "واجب الادا زکوۃ:", noZakat: "نصاب سے کم", hadithBtn: "حدیث دیکھیں", evidenceTitle: "شرعی دلیل" },
  ar: { title: "الزكاة الإسلامية", subtitle: "أصيلة ودقيقة", wealth: "المال", livestock: "الأنعام", cashPlace: "نقداً / في البنك", goldLabel: "الذهب (غرام)", silverLabel: "الفضة (غرام)", totalDue: "إجمالي الزكاة المستحقة", evidence: "عرض الدليل", sheepLabel: "الغنم / الماعز", cowLabel: "البقر / الجاموس", dueHeader: "زكاة الأنعام المستحقة:", noZakat: "أقل من النصاب", hadithBtn: "عرض الحديث", evidenceTitle: "الدليل الشرعي" },
  tr: { title: "İslami Zekat", subtitle: "Otantik ve Hassas", wealth: "Varlıklar", livestock: "Hayvancılık", cashPlace: "Nakit / Banka", goldLabel: "ALTIN (GRAM)", silverLabel: "GÜMÜŞ (GRAM)", totalDue: "Toplam Zekat Borcu", evidence: "Kanıtı Görüntüle", sheepLabel: "Koyun / Keçi", cowLabel: "İnek / Manda", dueHeader: "Hayvancılık Zekatı:", noZakat: "Nisab sınırının altında", hadithBtn: "Hadisi Görüntüle", evidenceTitle: "İlahi Kanıt" },
  id: { title: "Zakat Islami", subtitle: "Otentik & Presisi", wealth: "Harta", livestock: "Peternakan", cashPlace: "Uang Tunai / Bank", goldLabel: "EMAS (GRAM)", silverLabel: "PERAK (GRAM)", totalDue: "Total Zakat", evidence: "Lihat Dalil", sheepLabel: "Domba / Kambing", cowLabel: "Sapi / Kerbau", dueHeader: "Zakat Ternak:", noZakat: "Di bawah batas Nisab", hadithBtn: "Lihat Hadist", evidenceTitle: "Dalil Ilahi" },
  fr: { title: "Zakat Islamique", subtitle: "Authentique & Précis", wealth: "Richesse", livestock: "Bétail", cashPlace: "Espèces / Banque", goldLabel: "OR (GRAMMES)", silverLabel: "ARGENT (GRAMMES)", totalDue: "Total Zakat Dû", evidence: "Voir les Preuves", sheepLabel: "Moutons / Chèvres", cowLabel: "Vaches / Buffles", dueHeader: "Zakat sur le Bétail:", noZakat: "Sous le seuil du Nisab", hadithBtn: "Voir le Hadith", evidenceTitle: "Preuve Divine" }
};

export default function ZakatApp() {
  const [activeTab, setActiveTab] = useState('wealth');
  const [activeLang, setActiveLang] = useState('en');
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [proofData, setProofData] = useState<any>(null);
  const [vals, setVals] = useState<any>({ cash: 0, gold: 0, silver: 0, goldPrice: 70, silverPrice: 0.90, sheep: 0, cows: 0 });

  const t = translations[activeLang] || translations.en;
  const isRTL = activeLang === 'ur' || activeLang === 'ar';
  
  const res = calculateZakat(vals as any, 'silver');
  const livestockRes = getLivestockZakat(vals as any);
  const selectedCurrency = CURRENCIES.find(c => c.code === activeCurrency) || CURRENCIES[0];

  const chartData = {
    labels: [t.cashPlace, 'Gold', 'Silver'],
    datasets: [{
      data: [vals.cash || 0, (vals.gold || 0) * 70, (vals.silver || 0) * 0.9],
      backgroundColor: ['#10b981', '#fbbf24', '#94a3b8'],
      hoverOffset: 4, borderRadius: 8
    }]
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* HEADER */}
      <header className="p-4">
        <div className="bg-emerald-700 text-white p-6 rounded-[2rem] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black">{t.title}</h1>
              <p className="text-emerald-200 text-xs">{t.subtitle}</p>
            </div>
            <div className="flex gap-2" dir="ltr">
              <select value={activeLang} onChange={(e) => setActiveLang(e.target.value)} className="bg-emerald-800 p-2 rounded-xl border border-emerald-600 outline-none text-[10px] font-bold">
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
              </select>
              <select value={activeCurrency} onChange={(e) => setActiveCurrency(e.target.value)} className="bg-emerald-800 p-2 rounded-xl border border-emerald-600 outline-none text-[10px] font-bold">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>

          <div className="flex bg-emerald-900/40 p-1.5 rounded-2xl">
            <button onClick={() => setActiveTab('wealth')} className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'wealth' ? 'bg-white text-emerald-700' : 'text-emerald-100'}`}>
              <Wallet size={16}/> {t.wealth}
            </button>
            <button onClick={() => setActiveTab('livestock')} className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'livestock' ? 'bg-white text-emerald-700' : 'text-emerald-100'}`}>
              <Beef size={16}/> {t.livestock}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 space-y-8 flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'wealth' ? (
            <motion.section key="wealth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="relative">
                  <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-4 text-emerald-600 font-black`}>{selectedCurrency.symbol}</span>
                  <input type="number" placeholder={t.cashPlace} className={`w-full bg-slate-50 p-4 ${isRTL ? 'pr-10' : 'pl-10'} rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20`} onChange={e => setVals({...vals, cash: +e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 px-1">{t.goldLabel}</label>
                    <input type="number" placeholder="0" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" onChange={e => setVals({...vals, gold: +e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 px-1">{t.silverLabel}</label>
                    <input type="number" placeholder="0" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" onChange={e => setVals({...vals, silver: +e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center">
                <div className="w-32 h-32 mb-6">
                  <Pie data={chartData} options={{ plugins: { legend: { display: false } }, cutout: '70%' }} />
                </div>
                <p className="text-emerald-400 text-[10px] tracking-widest uppercase font-black mb-1">{t.totalDue}</p>
                <h2 className="text-4xl font-black text-white">
                  {selectedCurrency.symbol}{res.total.toLocaleString(undefined, {minimumFractionDigits: 0})}
                </h2>
                <button onClick={() => setProofData(references.residuary)} className="mt-6 flex items-center gap-2 text-emerald-300 text-[10px] font-bold underline decoration-emerald-500/50">
                  <Info size={14}/> {t.evidence}
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.section key="livestock" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 px-1">{t.sheepLabel}</label>
                  <input type="number" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" placeholder="0" onChange={e => setVals({...vals, sheep: +e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 px-1">{t.cowLabel}</label>
                  <input type="number" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" placeholder="0" onChange={e => setVals({...vals, cows: +e.target.value})} />
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50">
                 <h3 className="font-black text-emerald-900 text-lg flex items-center gap-3 mb-6"><Beef size={24}/> {t.dueHeader}</h3>
                 <div className="space-y-3">
                   {livestockRes.map((item: any, idx: number) => (
                     <div key={idx} className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                       <span className="font-bold text-slate-600">{item.animal}</span>
                       <span className="text-emerald-700 font-black bg-emerald-100 px-4 py-2 rounded-xl text-sm">{item.due}</span>
                     </div>
                   ))}
                   {livestockRes.length === 0 && <p className="text-center py-10 text-slate-400 font-bold">{t.noZakat}</p>}
                 </div>
                 <button onClick={() => setProofData(references.livestock)} className="w-full mt-6 text-[10px] font-black text-slate-400 flex justify-center items-center gap-2">
                   <Info size={16}/> {t.hadithBtn}
                 </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* EVIDENCE POPUP */}
      <AnimatePresence>
        {proofData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-emerald-800 text-xl font-bold flex items-center gap-2"><Book size={22}/> {t.evidenceTitle}</h3>
                <button onClick={() => setProofData(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24}/></button>
              </div>
              <p className="text-slate-700 italic text-lg mb-6 leading-relaxed">"{activeLang === 'ur' || activeLang === 'ar' ? (activeLang === 'ur' ? proofData?.verse_ur : proofData?.verse_ar) : proofData?.verse_en}"</p>
              <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold inline-block">{proofData?.source}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
