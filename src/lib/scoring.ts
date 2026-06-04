export interface ScoringInput {
  offerPrice: number;
  listPrice: number;
  inspectionContingency: boolean;
  financingContingency: boolean;
  appraisalContingency: boolean;
  cashOffer: boolean;
  closingDays: number;        // lower = faster = better for sellers
  escalation: boolean;
  escalationIncrement: number;
  escalationCap: number;
  emdPercent: number;         // earnest money as % of price
  sellerCredits: number;      // -1 = unanswered, treat as 0
  preApprovalUploaded: boolean; // whether a pre-approval PDF was uploaded
}

export interface ScoringResult {
  score: number;          // 0–100
  tier: "strong" | "competitive" | "weak";
  breakdown: { label: string; points: number; maxPoints: number; tip?: string }[];
}

export function scoreOffer(input: ScoringInput): ScoringResult {
  const {
    offerPrice,
    listPrice,
    inspectionContingency,
    financingContingency,
    appraisalContingency,
    cashOffer,
    closingDays,
    escalation,
    escalationCap,
    emdPercent,
    sellerCredits,
    preApprovalUploaded,
  } = input;

  const breakdown: ScoringResult["breakdown"] = [];

  // ── Price vs list (30 pts) ──────────────────────────────────────────
  const pricePct = listPrice > 0 ? (offerPrice - listPrice) / listPrice : 0;
  let pricePoints: number;
  let priceTip: string | undefined;
  if (pricePct >= 0.05) {
    pricePoints = 30;
  } else if (pricePct >= 0) {
    pricePoints = 20;
    priceTip = "Offering at or slightly above asking is solid. Bidding 5%+ over list maximises acceptance odds in competitive markets.";
  } else if (pricePct >= -0.04) {
    pricePoints = 12;
    priceTip = "You're slightly below asking — offering at or above list price significantly improves acceptance odds.";
  } else if (pricePct >= -0.09) {
    pricePoints = 5;
    priceTip = "Your offer is meaningfully below asking. Consider closing the gap to be more competitive.";
  } else {
    pricePoints = 0;
    priceTip = "Offers 10%+ below asking are rarely accepted in normal markets. Increase your offer price to be considered.";
  }
  breakdown.push({ label: "Price vs. list price", points: pricePoints, maxPoints: 30, tip: priceTip });

  // ── Contingencies (25 pts) ──────────────────────────────────────────
  // Cash offer auto-removes financing & appraisal (+15), don't double-count
  let contingencyPoints = 0;
  let contingencyTip: string | undefined;

  // No inspection = +10
  if (!inspectionContingency) contingencyPoints += 10;

  if (cashOffer) {
    // Cash removes both financing and appraisal automatically (+15 total for those two)
    contingencyPoints += 15;
  } else {
    if (!financingContingency) contingencyPoints += 10;
    if (!appraisalContingency) contingencyPoints += 5;
  }

  // Cap at 25
  contingencyPoints = Math.min(25, contingencyPoints);

  if (contingencyPoints < 25) {
    const missing: string[] = [];
    if (inspectionContingency) missing.push("waiving inspection");
    if (!cashOffer) {
      if (financingContingency) missing.push("waiving financing contingency");
      if (appraisalContingency) missing.push("waiving appraisal contingency");
    }
    if (missing.length > 0) {
      contingencyTip = `Consider ${missing.join(" and ")} to strengthen your offer, but only if you're comfortable with the added risk.`;
    }
  }
  breakdown.push({ label: "Contingencies", points: contingencyPoints, maxPoints: 25, tip: contingencyTip });

  // ── Closing speed (15 pts) ──────────────────────────────────────────
  let closingPoints: number;
  let closingTip: string | undefined;
  if (closingDays <= 21) {
    closingPoints = 15;
  } else if (closingDays <= 30) {
    closingPoints = 10;
    closingTip = "A closing timeline of 21 days or fewer scores maximum points and is very attractive to motivated sellers.";
  } else if (closingDays <= 45) {
    closingPoints = 5;
    closingTip = "Shortening your closing to 30 days or fewer would significantly strengthen your offer.";
  } else {
    closingPoints = 0;
    closingTip = "A closing timeline over 45 days is unattractive to most sellers. Aim for 30 days or fewer if possible.";
  }
  breakdown.push({ label: "Closing speed", points: closingPoints, maxPoints: 15, tip: closingTip });

  // ── Earnest money (10 pts) ──────────────────────────────────────────
  let emdPoints: number;
  let emdTip: string | undefined;
  if (emdPercent >= 3) {
    emdPoints = 10;
  } else if (emdPercent >= 2) {
    emdPoints = 7;
    emdTip = "Increasing your earnest money to 3% or more signals extra commitment to the seller.";
  } else if (emdPercent >= 1) {
    emdPoints = 3;
    emdTip = "A deposit of 2–3% of the purchase price is standard and significantly strengthens your offer.";
  } else {
    emdPoints = 0;
    emdTip = "Put down at least 1% earnest money to show you're a serious buyer.";
  }
  breakdown.push({ label: "Earnest money deposit", points: emdPoints, maxPoints: 10, tip: emdTip });

  // ── Escalation clause (10 pts) ──────────────────────────────────────
  let escalationPoints = 0;
  let escalationTip: string | undefined;
  if (escalation) {
    escalationPoints = 8;
    // Bonus +2 if cap is >= 5% over list, capped at 10
    if (listPrice > 0 && escalationCap >= listPrice * 1.05) {
      escalationPoints = 10;
    } else if (escalation) {
      escalationTip = "Setting your escalation cap at 5%+ above list price earns a bonus 2 points.";
    }
  } else {
    escalationTip = "Adding an escalation clause keeps you competitive in a multi-offer situation without revealing your true ceiling.";
  }
  breakdown.push({ label: "Escalation clause", points: escalationPoints, maxPoints: 10, tip: escalationTip });

  // ── Seller credits (5 pts) ──────────────────────────────────────────
  // -1 = unanswered, treat as 0 (no credits)
  const effectiveCredits = sellerCredits === -1 ? 0 : sellerCredits;
  const creditsPoints = effectiveCredits <= 0 ? 5 : 0;
  const creditsTip = effectiveCredits > 0
    ? "Requesting seller credits weakens your offer. Removing them earns back 5 points and signals a cleaner deal."
    : undefined;
  breakdown.push({ label: "Seller credits", points: creditsPoints, maxPoints: 5, tip: creditsTip });

  // ── Pre-approval (5 pts) ────────────────────────────────────────────
  // Cash offers don't need pre-approval — they always get full points
  const preApprovalPoints = cashOffer || preApprovalUploaded ? 5 : 0;
  const preApprovalTip = !cashOffer && !preApprovalUploaded
    ? "Uploading a pre-approval letter adds 5 points and significantly increases seller confidence in your financing."
    : undefined;
  breakdown.push({ label: "Pre-approval on file", points: preApprovalPoints, maxPoints: 5, tip: preApprovalTip });

  // ── Total ───────────────────────────────────────────────────────────
  const score = breakdown.reduce((sum, row) => sum + row.points, 0);

  let tier: ScoringResult["tier"];
  if (score >= 70) {
    tier = "strong";
  } else if (score >= 45) {
    tier = "competitive";
  } else {
    tier = "weak";
  }

  return { score, tier, breakdown };
}
