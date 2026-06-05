// NOTE: Any API route that renders this PDF must include the following at the top of the file:
//   export const runtime = 'nodejs';
// @react-pdf/renderer uses Node.js-only APIs and is incompatible with the Edge runtime.

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

/* ─────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────── */
export type OfferTerms = {
  step?: number;
  buyerType?: string;
  state?: string;
  firstTime?: boolean;
  propertyConfirmed?: boolean;
  offerPrice?: number;
  financeType?: string;
  preApproved?: boolean | null;
  preApprovalPath?: string | null;
  downPct?: number;
  earnestPct?: number;
  closingDays?: number;
  inspectionContingency?: boolean | null;
  inspectionDays?: number;
  appraisalContingency?: boolean | null;
  financingContingency?: boolean | null;
  financingDays?: number;
  escalation?: boolean | null;
  escIncrement?: number;
  escMax?: number;
  sellerCredits?: number;
  personalLetter?: boolean | null;
  personalLetterText?: string;
  signatureDataUrl?: string;
  signatureDate?: string;
  signatureName?: string;
};

export type OfferRow = {
  id: string;
  user_id: string;
  property_id?: string | null;
  status: string;
  tier: string;
  offer_price?: number | null;
  address?: string | null;
  list_price?: number | null;
  property_address?: string | null;
  terms: OfferTerms;
  created_at: string;
  updated_at?: string | null;
  pdf_url?: string | null;
};

export type PropertyRow = {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  dom?: number | null;
  agent_name?: string | null;
  agent_email?: string | null;
  brokerage?: string | null;
};

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function fmtFinanceType(ft: string): string {
  switch (ft) {
    case "conventional": return "Conventional Loan";
    case "fha": return "FHA Loan";
    case "va": return "VA Loan";
    case "cash": return "All Cash";
    default: return ft;
  }
}

function fmtBuyerType(bt: string): string {
  switch (bt) {
    case "first": return "First-Time Buyer";
    case "experienced": return "Experienced Buyer";
    case "investor": return "Real Estate Investor";
    default: return bt;
  }
}

function fmtSignatureDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  } catch {
    return isoDate;
  }
}

function stateFormName(stateCode: string): string {
  switch (stateCode) {
    case "IL": return "Illinois Residential Purchase & Sale Agreement";
    case "TX": return "Texas TREC One to Four Family Residential Contract";
    case "CA": return "California Residential Purchase Agreement";
    case "NY": return "New York Standard Form Purchase Agreement";
    case "FL": return "Florida FAR/BAR As Is Residential Contract";
    default: return `${stateCode} Residential Purchase Agreement`;
  }
}

/* ─────────────────────────────────────────────────
   STYLES — Helvetica only (no font fetching)
───────────────────────────────────────────────── */
const colors = {
  blue: "#2563eb",
  blueLight: "#eff6ff",
  gray900: "#0f172a",
  gray700: "#334155",
  gray500: "#64748b",
  gray300: "#cbd5e1",
  gray100: "#f1f5f9",
  white: "#ffffff",
  green: "#16a34a",
  amber: "#d97706",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.gray700,
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    lineHeight: 1.5,
  },
  // Header
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
    borderBottomStyle: "solid",
  },
  headerLabel: {
    fontSize: 8,
    color: colors.blue,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headerAddress: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
    marginBottom: 4,
  },
  headerPrice: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.blue,
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 9,
    color: colors.gray500,
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
    borderBottomStyle: "solid",
  },
  // Two-column row
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    borderBottomStyle: "solid",
  },
  rowLabel: {
    width: "45%",
    fontSize: 9,
    color: colors.gray500,
  },
  rowValue: {
    width: "55%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
  },
  rowValueWarning: {
    width: "55%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.amber,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    borderTopStyle: "solid",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: colors.gray500,
  },
  // Verified Buyer badge
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderStyle: "solid",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  verifiedBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#16a34a",
    letterSpacing: 0.4,
  },
  // Personal letter page
  letterPage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.gray700,
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 64,
    paddingRight: 64,
    lineHeight: 1.7,
  },
  letterTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
    borderBottomStyle: "solid",
  },
  letterBody: {
    fontSize: 11,
    lineHeight: 1.8,
    color: colors.gray700,
  },
  // Signature page
  signaturePage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.gray700,
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 64,
    paddingRight: 64,
    lineHeight: 1.5,
  },
  signatureTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
    borderBottomStyle: "solid",
  },
  signatureSubtitle: {
    fontSize: 10,
    color: colors.gray500,
    marginBottom: 24,
  },
  signatureImageBox: {
    border: "1pt solid #cbd5e1",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#ffffff",
    marginBottom: 12,
    width: 280,
  },
  signatureImage: {
    width: 264,
    height: 88,
  },
  signatureMetaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  signatureMetaLabel: {
    fontSize: 9,
    color: colors.gray500,
    width: 80,
  },
  signatureMetaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
    flex: 1,
  },
  sellerSignatureSection: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    borderTopStyle: "solid",
  },
  sellerSignatureLabel: {
    fontSize: 8,
    color: colors.gray500,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  sellerSignatureLine: {
    flexDirection: "row",
    gap: 32,
    marginTop: 8,
  },
  sellerSignatureField: {
    flex: 1,
  },
  sellerSignatureUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray700,
    borderBottomStyle: "solid",
    height: 24,
    marginBottom: 4,
  },
  sellerSignatureFieldLabel: {
    fontSize: 8,
    color: colors.gray500,
  },
  // Escalation addendum page
  addendumPage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.gray700,
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    lineHeight: 1.5,
  },
  addendumTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
    marginBottom: 8,
  },
  addendumSubtitle: {
    fontSize: 10,
    color: colors.gray500,
    marginBottom: 24,
  },
  addendumBox: {
    backgroundColor: colors.blueLight,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  addendumBoxLabel: {
    fontSize: 8,
    color: colors.blue,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  addendumBoxValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.gray900,
  },
  addendumGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  addendumGridItem: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: 4,
    padding: 12,
  },
});

/* ─────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────── */
function DataRow({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={warn ? styles.rowValueWarning : styles.rowValue}>{value}</Text>
    </View>
  );
}

/* ─────────────────────────────────────────────────
   MAIN PDF COMPONENT
───────────────────────────────────────────────── */
export interface OfferSummaryPdfProps {
  offer: OfferRow;
  property?: PropertyRow | null;
  isVerified?: boolean;
}

export function OfferSummaryPdf({ offer, property, isVerified }: OfferSummaryPdfProps) {
  const t = offer.terms ?? {};
  const isCash = t.financeType === "cash";

  // Derived values
  const offerPrice = offer.offer_price ?? t.offerPrice ?? 0;
  const listPrice = offer.list_price ?? (property?.price) ?? 0;
  const earnestAmt = offerPrice > 0 && (t.earnestPct ?? 0) > 0
    ? Math.round(offerPrice * (t.earnestPct ?? 0) / 100)
    : 0;
  const downAmt = offerPrice > 0 && !isCash && (t.downPct ?? 0) > 0
    ? Math.round(offerPrice * (t.downPct ?? 0) / 100)
    : 0;
  const closingDate = offer.created_at && (t.closingDays ?? 0) > 0
    ? addDays(offer.created_at, t.closingDays ?? 0)
    : null;

  // Address
  const fullAddress =
    property
      ? `${property.address}, ${property.city}, ${property.state} ${property.zip}`
      : offer.address ?? offer.property_address ?? "Property Address";

  const stateCode = t.state ?? property?.state ?? "";

  // sellerCredits: -1 = unanswered / None; 0 = none; >0 = dollar amount
  const sellerCreditsDisplay =
    !t.sellerCredits || t.sellerCredits <= 0
      ? "None"
      : fmt(t.sellerCredits);

  const submittedDate = new Date(offer.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title="Offer Summary"
      author="HomeOfferDirect"
      subject={`Offer for ${fullAddress}`}
    >
      {/* ── Main Summary Page ── */}
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>HomeOfferDirect — Offer Summary</Text>
          <Text style={styles.headerAddress}>{fullAddress}</Text>
          <Text style={styles.headerPrice}>{offerPrice > 0 ? fmt(offerPrice) : "—"}</Text>
          <Text style={styles.headerMeta}>
            Submitted {submittedDate}
            {stateCode ? `  ·  ${stateFormName(stateCode)}` : ""}
          </Text>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>
                ✓ Verified Buyer — Government ID &amp; proof of funds on file
              </Text>
            </View>
          )}
        </View>

        {/* ── 1. Property Details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          <DataRow label="Property address" value={fullAddress} />
          {listPrice > 0 && <DataRow label="List price" value={fmt(listPrice)} />}
          {stateCode && <DataRow label="State" value={stateCode} />}
          {property?.beds != null && (
            <DataRow label="Beds / Baths" value={`${property.beds} bd · ${property.baths} ba${property.sqft ? " · " + property.sqft.toLocaleString() + " sqft" : ""}`} />
          )}
          {property?.agent_name && (
            <DataRow
              label="Listing agent"
              value={`${property.agent_name}${property.brokerage ? " · " + property.brokerage : ""}`}
            />
          )}
        </View>

        {/* ── 2. Offer Terms ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Terms</Text>
          <DataRow label="Offer price" value={offerPrice > 0 ? fmt(offerPrice) : "—"} />
          {listPrice > 0 && offerPrice > 0 && (
            <DataRow
              label="vs. list price"
              value={
                offerPrice >= listPrice
                  ? `+${fmt(offerPrice - listPrice)} above asking`
                  : `-${fmt(listPrice - offerPrice)} below asking`
              }
            />
          )}
          {earnestAmt > 0 && (
            <DataRow
              label="Earnest money deposit"
              value={`${t.earnestPct}% · ${fmt(earnestAmt)}`}
            />
          )}
          {t.escalation === true && (
            <>
              <DataRow label="Escalation clause" value="Yes" />
              {(t.escIncrement ?? 0) > 0 && (
                <DataRow label="Escalation increment" value={fmt(t.escIncrement ?? 0)} />
              )}
              {(t.escMax ?? 0) > 0 && (
                <DataRow label="Escalation cap" value={fmt(t.escMax ?? 0)} />
              )}
            </>
          )}
          {t.escalation === false && <DataRow label="Escalation clause" value="No" />}
          <DataRow label="Seller credits" value={sellerCreditsDisplay} />
        </View>

        {/* ── 3. Contingencies ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contingencies</Text>
          {t.inspectionContingency === true ? (
            <DataRow
              label="Inspection contingency"
              value={`Yes · ${t.inspectionDays ?? 10}-day window`}
            />
          ) : t.inspectionContingency === false ? (
            <DataRow label="Inspection contingency" value="Waived" warn />
          ) : null}
          {t.appraisalContingency === true && (
            <DataRow label="Appraisal contingency" value="Yes" />
          )}
          {t.appraisalContingency === false && (
            <DataRow label="Appraisal contingency" value="Waived" warn />
          )}
          {!isCash && t.financingContingency === true && (
            <DataRow
              label="Financing contingency"
              value={`Yes · ${t.financingDays ?? 21}-day window`}
            />
          )}
          {!isCash && t.financingContingency === false && (
            <DataRow label="Financing contingency" value="Waived" warn />
          )}
          {isCash && (
            <DataRow label="Financing contingency" value="N/A (cash offer)" />
          )}
        </View>

        {/* ── 4. Financing ── */}
        {!isCash && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financing</Text>
            {t.financeType && (
              <DataRow label="Loan type" value={fmtFinanceType(t.financeType)} />
            )}
            {t.preApproved === true && <DataRow label="Pre-approval" value="Yes" />}
            {t.preApproved === false && (
              <DataRow label="Pre-approval" value="Not yet obtained" warn />
            )}
            {downAmt > 0 && (
              <DataRow
                label="Down payment"
                value={`${t.downPct}% · ${fmt(downAmt)}`}
              />
            )}
          </View>
        )}

        {isCash && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financing</Text>
            <DataRow label="Payment type" value="All Cash" />
          </View>
        )}

        {/* ── 5. Closing ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Closing</Text>
          {(t.closingDays ?? 0) > 0 && (
            <DataRow label="Closing window" value={`${t.closingDays} days from acceptance`} />
          )}
          {closingDate && (
            <DataRow
              label="Target closing date"
              value={`On or before ${closingDate}`}
            />
          )}
        </View>

        {/* ── 6. Buyer Info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buyer Info</Text>
          {t.buyerType && (
            <DataRow label="Buyer type" value={fmtBuyerType(t.buyerType)} />
          )}
          {t.personalLetter === true && (
            <DataRow label="Personal letter" value="Included (see attached)" />
          )}
          {t.personalLetter === false && (
            <DataRow label="Personal letter" value="Not included" />
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            HomeOfferDirect — Offer ID: {offer.id}
          </Text>
          <Text style={styles.footerText}>
            HomeOfferDirect is not a law firm. This document is for informational purposes only.
          </Text>
        </View>
      </Page>

      {/* ── Escalation Addendum Page ── */}
      {t.escalation === true && (t.escIncrement ?? 0) > 0 && (
        <Page size="LETTER" style={styles.addendumPage}>
          <Text style={styles.addendumTitle}>Escalation Clause Addendum</Text>
          <Text style={styles.addendumSubtitle}>
            This addendum is attached to and forms part of the Purchase Agreement for{"\n"}
            {fullAddress}
          </Text>

          <View style={styles.addendumGrid}>
            <View style={styles.addendumGridItem}>
              <Text style={styles.addendumBoxLabel}>Base Offer Price</Text>
              <Text style={styles.addendumBoxValue}>
                {offerPrice > 0 ? fmt(offerPrice) : "—"}
              </Text>
            </View>
            <View style={styles.addendumGridItem}>
              <Text style={styles.addendumBoxLabel}>Escalation Increment</Text>
              <Text style={styles.addendumBoxValue}>{fmt(t.escIncrement ?? 0)}</Text>
            </View>
            <View style={styles.addendumGridItem}>
              <Text style={styles.addendumBoxLabel}>Maximum Cap</Text>
              <Text style={styles.addendumBoxValue}>{fmt(t.escMax ?? 0)}</Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 10, lineHeight: 1.7, color: colors.gray700 }}>
              Buyer agrees to increase the purchase price above any bona fide competing offer
              received by the Seller by {fmt(t.escIncrement ?? 0)} increments, up to a maximum
              purchase price of {fmt(t.escMax ?? 0)}. Seller must provide written documentation
              of any competing offer triggering escalation. This clause shall not apply if no
              competing offer is received.
            </Text>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              HomeOfferDirect — Escalation Addendum · Offer ID: {offer.id}
            </Text>
            <Text style={styles.footerText}>
              HomeOfferDirect is not a law firm.
            </Text>
          </View>
        </Page>
      )}

      {/* ── Personal Letter Page ── */}
      {t.personalLetter === true && t.personalLetterText && (
        <Page size="LETTER" style={styles.letterPage}>
          <Text style={styles.letterTitle}>Personal Letter to the Seller</Text>
          <Text style={styles.letterBody}>{t.personalLetterText}</Text>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              HomeOfferDirect — Personal Letter · Offer ID: {offer.id}
            </Text>
            <Text style={styles.footerText}>
              HomeOfferDirect is not a law firm.
            </Text>
          </View>
        </Page>
      )}

      {/* ── Buyer Signature Page ── */}
      <Page size="LETTER" style={styles.signaturePage}>
        <Text style={styles.signatureTitle}>Buyer Signature</Text>
        <Text style={styles.signatureSubtitle}>
          Electronic signature for offer on {fullAddress}
        </Text>

        {/* Buyer signature */}
        <Text style={{ fontSize: 9, color: colors.gray500, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
          Buyer
        </Text>
        {t.signatureDataUrl ? (
          <View style={styles.signatureImageBox}>
            <Image style={styles.signatureImage} src={t.signatureDataUrl} />
          </View>
        ) : (
          <View style={{ ...styles.signatureImageBox, height: 88, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 9, color: colors.gray500 }}>No signature provided</Text>
          </View>
        )}

        <View style={styles.signatureMetaRow}>
          <Text style={styles.signatureMetaLabel}>Buyer:</Text>
          <Text style={styles.signatureMetaValue}>{t.signatureName || "—"}</Text>
        </View>
        <View style={styles.signatureMetaRow}>
          <Text style={styles.signatureMetaLabel}>Date:</Text>
          <Text style={styles.signatureMetaValue}>
            {t.signatureDate ? fmtSignatureDate(t.signatureDate) : "—"}
          </Text>
        </View>

        {/* Seller signature section */}
        <View style={styles.sellerSignatureSection}>
          <Text style={styles.sellerSignatureLabel}>Seller (to complete upon receipt)</Text>
          <View style={styles.sellerSignatureLine}>
            <View style={styles.sellerSignatureField}>
              <View style={styles.sellerSignatureUnderline} />
              <Text style={styles.sellerSignatureFieldLabel}>Seller: ___________________</Text>
            </View>
            <View style={{ width: 140 }}>
              <View style={styles.sellerSignatureUnderline} />
              <Text style={styles.sellerSignatureFieldLabel}>Date: ___________</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            HomeOfferDirect — Signature Page · Offer ID: {offer.id}
          </Text>
          <Text style={styles.footerText}>
            HomeOfferDirect is not a law firm.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default OfferSummaryPdf;
