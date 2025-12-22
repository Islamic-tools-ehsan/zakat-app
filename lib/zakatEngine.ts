export function calculateZakat(vals: any, nisabMode: string) {
  const goldValue = (vals.gold || 0) * (vals.goldPrice || 0);
  const silverValue = (vals.silver || 0) * (vals.silverPrice || 0);
  const totalWealth = (vals.cash || 0) + goldValue + silverValue + (vals.stocks || 0) + (vals.inventory || 0) - (vals.debts || 0);
  
  // Silver Nisab is the most authentic default for modern times
  const nisab = 612.36 * (vals.silverPrice || 0.90); 
  const isEligible = totalWealth >= nisab;
  
  return {
    total: isEligible ? totalWealth * 0.025 : 0,
    isEligible,
    nisabLimit: nisab
  };
}

export function getLivestockZakat(vals: any) {
  const due = [];
  const totalSmall = (vals.sheep || 0) + (vals.goats || 0);

  if (totalSmall >= 40) {
    if (totalSmall <= 120) due.push({ animal: "Sheep/Goat", due: "1 Sheep" });
    else if (totalSmall <= 200) due.push({ animal: "Sheep/Goat", due: "2 Sheep" });
    else due.push({ animal: "Sheep/Goat", due: "3 Sheep" });
  }

  if ((vals.cows || 0) >= 30) {
    if (vals.cows <= 39) due.push({ animal: "Cow/Buffalo", due: "1 Tabi' (1yr old)" });
    else due.push({ animal: "Cow/Buffalo", due: "1 Musinnah (2yr old)" });
  }

  return due;
}
