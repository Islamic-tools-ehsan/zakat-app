export const calculateZakat = (vals: any, nisabMode: string) => {
  const goldPrice = vals.goldPrice || 70;
  const silverPrice = vals.silverPrice || 0.9;
  
  // Calculate total wealth
  const totalWealth = 
    (vals.cash || 0) + 
    ((vals.gold || 0) * goldPrice) + 
    ((vals.silver || 0) * silverPrice) + 
    (vals.stocks || 0) + 
    (vals.inventory || 0) - 
    (vals.debts || 0);

  // Nisab thresholds (Standard: 87.48g Gold / 612.36g Silver)
  const nisabGold = 87.48 * goldPrice;
  const nisabSilver = 612.36 * silverPrice;
  const currentNisab = nisabMode === 'gold' ? nisabGold : nisabSilver;

  if (totalWealth >= currentNisab) {
    return {
      total: totalWealth * 0.025,
      isEligible: true,
      wealth: totalWealth
    };
  }

  return { total: 0, isEligible: false, wealth: totalWealth };
};

export const getLivestockZakat = (count: number) => {
  if (count < 40) return "No Zakat due";
  if (count < 121) return "1 Sheep/Goat";
  return "2 Sheep/Goats";
};
