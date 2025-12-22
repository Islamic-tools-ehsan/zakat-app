// lib/zakatEngine.ts

/**
 * Modernized Zakat Engine
 * Updated to handle structured state objects from the UI
 */

export const calculateZakat = (vals: any, nisabType: 'gold' | 'silver' = 'silver') => {
  // Extract values with defaults to prevent NaN errors
  const cash = Number(vals.cash) || 0;
  const gold = (Number(vals.gold) || 0) * (Number(vals.goldPrice) || 70);
  const silver = (Number(vals.silver) || 0) * (Number(vals.silverPrice) || 0.9);
  const stocks = Number(vals.stocks) || 0;
  const debts = Number(vals.debts) || 0;

  const totalWealth = cash + gold + silver + stocks - debts;
  
  // Standard Zakat rate is 2.5%
  const totalDue = totalWealth > 0 ? totalWealth * 0.025 : 0;

  return {
    total: totalDue,
    wealthBreakdown: { cash, gold, silver, stocks }
  };
};

export const getLivestockZakat = (vals: any) => {
  const results: { animal: string; due: string }[] = [];
  
  // Sheep/Goat Logic
  const sheep = Number(vals.sheep) || 0;
  if (sheep >= 40 && sheep < 121) results.push({ animal: "Sheep/Goats", due: "1 Sheep" });
  else if (sheep >= 121 && sheep < 201) results.push({ animal: "Sheep/Goats", due: "2 Sheep" });
  
  // Cow/Buffalo Logic
  const cows = Number(vals.cows) || 0;
  if (cows >= 30 && cows < 40) results.push({ animal: "Cows/Buffalo", due: "1 Tabi' (1yr old)" });
  else if (cows >= 40) results.push({ animal: "Cows/Buffalo", due: "1 Musinnah (2yr old)" });

  return results;
};
