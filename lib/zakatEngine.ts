export const NISAB = { GOLD: 87.48, SILVER: 612.36 };

export function calculateZakat(vals: any, nisabType: string) {
  const cashWealth = Number(vals.cash) + Number(vals.stocks) + Number(vals.inventory);
  const metalWealth = (Number(vals.gold) * Number(vals.goldPrice)) + (Number(vals.silver) * Number(vals.silverPrice));
  const totalWealth = cashWealth + metalWealth - Number(vals.debts);
  
  const threshold = nisabType === 'gold' ? NISAB.GOLD * vals.goldPrice : NISAB.SILVER * vals.silverPrice;
  const isEligible = totalWealth >= threshold;
  
  return {
    total: isEligible ? totalWealth * 0.025 : 0,
    netWealth: totalWealth,
    eligible: isEligible
  };
}

export function getLivestockZakat(count: number, type: string) {
  if (type === 'sheep') {
    if (count < 40) return "None";
    if (count <= 120) return "1 Sheep";
    if (count <= 200) return "2 Sheep";
    return `${Math.floor(count / 100)} Sheep`;
  }
  if (type === 'cow') {
    if (count < 30) return "None";
    return count < 40 ? "1 Yearling Calf" : "1 Two-year-old Cow";
  }
  return "Contact local Imam for specific Camel ratios";
}
