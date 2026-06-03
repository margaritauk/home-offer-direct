# Wizard-to-PDF Field Mapping

Reference document for the PDF builder (#229) and offer summary email (#231).  
Describes every field collected in the offer-builder wizard, how it is persisted
in Supabase, and which logical section it belongs to in the generated PDF and
summary email.

---

## Sources

| Source file | Purpose |
|---|---|
| `src/app/offer-builder/page.tsx` | Wizard UI — all fields in the `D` type |
| `supabase/migrations/001_initial_schema.sql` | Core `offers` table columns |
| `supabase/migrations/002_offer_wizard_fields.sql` | Additional `offers` columns added in migration 002 |

---

## Wizard Step Map

| Step | Wizard Section | Screen Title |
|---|---|---|
| 0 | Setup | What best describes you? |
| 1 | Setup | Which state is the property in? |
| 2 | Setup | Do you have a mortgage pre-approval? |
| 3 | Your Property | Confirm the property |
| 4 | Offer Price | How much do you want to offer? |
| 5 | Financing | What type of loan are you using? |
| 6 | Financing | How much are you putting down? |
| 7 | Financing | How much earnest money will you deposit? |
| 8 | Timeline | When do you want to close? |
| 9 | Contingencies | Do you want an inspection contingency? |
| 10 | Contingencies | Do you want an appraisal contingency? |
| 11 | Contingencies | Do you want a financing contingency? |
| 12 | Extra Terms | Do you want an escalation clause? |
| 13 | Extra Terms | Are you requesting any seller credits? |
| 14 | Extra Terms (step 14) | Add a personal letter to the seller? |
| 15 | Review & Send | Review your offer |
| 16 | Review & Send | Get your offer package |

---

## Field Mapping Table

> **DB storage key:**
> - `offers.<column>` = top-level column in the `offers` table
> - `offers.terms.<key>` = key inside the `terms JSONB` column
> - `documents.storage_path` = Storage path recorded in the `documents` table

| Wizard Field (variable) | Step | Form Label / UI Description | DB Column / JSONB Key | PDF Section | Email Section |
|---|---|---|---|---|---|
| `d.buyerType` | 0 | "What best describes you?" — options: `first`, `experienced`, `investor` | `offers.terms.buyerType` | Buyer Info | Buyer Info |
| `d.state` | 1 | "Which state is the property in?" — 2-letter state code | `offers.terms.state` | Property Details | Property Details |
| `d.financeType` | 2 / 5 | Step 2: pre-approval gate sets `cash` or `conventional`; Step 5: full selection (`conventional`, `fha`, `va`, `cash`) | `offers.terms.financeType` | Financing | Financing |
| `d.preApproved` | 2 | "Do you have a mortgage pre-approval?" — `true`, `false`, or `null` (cash) | `offers.terms.preApproved` | Financing | Financing |
| `preApprovalPath` | 2 | Pre-approval PDF upload — storage path after upload | `documents.storage_path` (type = `pre_approval`) + cached in `offers.terms.preApprovalPath` | Financing (attachment) | Financing (link) |
| `property.address` | 3 | Confirmed property address (from `PROPERTIES` list) | `offers.address` (top-level) — also denormalized to `offers.property_address` via trigger | Property Details | Property Details |
| `property.city` | 3 | City portion of property address | Part of `offers.address` composite string | Property Details | Property Details |
| `property.state` | 3 | State portion of property address | Part of `offers.address` composite string | Property Details | Property Details |
| `property.zip` | 3 | ZIP code of property | Part of `offers.address` composite string | Property Details | Property Details |
| `property.price` | 3 | List price at time of offer creation | `offers.list_price` (top-level INTEGER) | Property Details | Property Details |
| `property.beds` | 3 | Beds (display only on property confirm screen) | NOT persisted — property row only | Property Details | Property Details |
| `property.baths` | 3 | Baths (display only on property confirm screen) | NOT persisted — property row only | Property Details | Property Details |
| `property.sqft` | 3 | Square footage (display only) | NOT persisted — property row only | Property Details | — |
| `property.dom` | 3 | Days on market (display only) | NOT persisted — property row only | — | — |
| `property.agent` | 3 | Listing agent name (display only; used in step 16 email delivery copy) | NOT persisted — property row only | Buyer Info (cover letter) | — |
| `property.brokerage` | 3 | Brokerage name (display only) | NOT persisted — property row only | Buyer Info (cover letter) | — |
| `d.offerPrice` | 4 | "How much do you want to offer?" — dollar amount | `offers.offer_price` (top-level INTEGER) + `offers.terms.offerPrice` | Offer Terms | Offer Terms |
| `d.downPct` | 6 | "How much are you putting down?" — percentage (3/5/10/20/25/30) | `offers.terms.downPct` | Financing | Financing |
| `d.earnestPct` | 7 | "How much earnest money will you deposit?" — percentage (1/2/3) | `offers.terms.earnestPct` | Offer Terms | Offer Terms |
| `d.closingDays` | 8 | "When do you want to close?" — days from today (21/30/45/60 or custom) | `offers.terms.closingDays` | Closing | Closing |
| `d.inspectionContingency` | 9 | "Do you want an inspection contingency?" — `true` or `false` | `offers.terms.inspectionContingency` | Contingencies | Contingencies |
| `d.inspectionDays` | 9 | Inspection window — 10 days (standard) or 7 days (short) | `offers.terms.inspectionDays` | Contingencies | Contingencies |
| `d.appraisalContingency` | 10 | "Do you want an appraisal contingency?" — `true` or `false` | `offers.terms.appraisalContingency` | Contingencies | Contingencies |
| `d.financingContingency` | 11 | "Do you want a financing contingency?" — `true`, `false`, or `null` (cash) | `offers.terms.financingContingency` | Contingencies | Contingencies |
| `d.financingDays` | 11 | Financing contingency window — hardcoded default 21 days (no UI to change) | `offers.terms.financingDays` | Contingencies | Contingencies |
| `d.escalation` | 12 | "Do you want an escalation clause?" — `true` or `false` | `offers.terms.escalation` | Offer Terms | Offer Terms |
| `d.escIncrement` | 12 | "Beat competing offers by" — dollar increment (default $2,500) | `offers.terms.escIncrement` | Offer Terms | Offer Terms |
| `d.escMax` | 12 | "Up to my maximum" — ceiling price for escalation (default $510,000) | `offers.terms.escMax` | Offer Terms | Offer Terms |
| `d.sellerCredits` | 13 | "Are you requesting any seller credits?" — 0 = none, >0 = dollar amount | `offers.terms.sellerCredits` | Offer Terms | Offer Terms |
| `d.personalLetter` | 14 | "Add a personal letter to the seller?" — `true` or `false` | `offers.terms.personalLetter` | Buyer Info | Buyer Info |
| `d.personalLetterText` | 14 | Free-text personal letter (max 500 chars) | `offers.terms.personalLetterText` | Buyer Info (letter page) | Buyer Info |
| `d.firstTime` | N/A | First-time buyer flag — set in `INITIAL_D` but no dedicated wizard step | `offers.terms.firstTime` | — | — |
| `d.propertyConfirmed` | 3 | Property confirmation flag — always `false` in `INITIAL_D`; no explicit setter | `offers.terms.propertyConfirmed` | — | — |

---

## DB Column Summary

### Top-level columns on `offers` (persisted as explicit columns)

| Column | Type | Source |
|---|---|---|
| `id` | UUID | Auto-generated |
| `user_id` | UUID | `user.id` from auth context |
| `property_id` | UUID | `propertyId` query param (only when a valid UUID) |
| `status` | TEXT | `'draft'` → `'submitted'` on final submit |
| `tier` | TEXT | `user.tier` from auth context |
| `offer_price` | INTEGER | `d.offerPrice` |
| `address` | TEXT | `"${property.address}, ${property.city}, ${property.state} ${property.zip}"` |
| `list_price` | INTEGER | `property.price` |
| `property_address` | TEXT | Populated by DB trigger from `address` or linked `properties` row |
| `terms` | JSONB | All remaining `D` fields + `step` + `preApprovalPath` (see below) |
| `ai_score` | INTEGER | Not set by wizard (reserved for AI scoring feature) |
| `ai_tips` | JSONB | Not set by wizard (reserved for AI scoring feature) |
| `created_at` | TIMESTAMPTZ | Auto |
| `updated_at` | TIMESTAMPTZ | Auto (trigger) |

### Keys inside `offers.terms` JSONB

All `D` type fields that are not promoted to top-level columns are stored here, plus two extras:

| JSONB Key | Type | Notes |
|---|---|---|
| `step` | number | Last wizard step reached — used to restore progress |
| `buyerType` | string | `'first'` \| `'experienced'` \| `'investor'` |
| `state` | string | 2-letter state code |
| `firstTime` | boolean | Always `false` in initial state; no wizard step to change it |
| `propertyConfirmed` | boolean | No explicit setter — always `false` |
| `financeType` | string | `'conventional'` \| `'fha'` \| `'va'` \| `'cash'` |
| `preApproved` | boolean \| null | `null` for cash buyers |
| `preApprovalPath` | string \| null | Supabase Storage path; set outside `d` state |
| `downPct` | number | Percentage integer |
| `earnestPct` | number | Percentage integer |
| `closingDays` | number | Days from acceptance to close |
| `inspectionContingency` | boolean \| null | |
| `inspectionDays` | number | 7 or 10 |
| `appraisalContingency` | boolean \| null | |
| `financingContingency` | boolean \| null | `null` for cash buyers |
| `financingDays` | number | Fixed at 21; no UI control |
| `escalation` | boolean \| null | |
| `escIncrement` | number | Default 2500 |
| `escMax` | number | Default 510000 |
| `sellerCredits` | number | `0` = none; `-1` = unanswered (initial state) |
| `personalLetter` | boolean \| null | |
| `personalLetterText` | string | Up to 500 characters |

---

## Fields NOT Persisted to DB (Gaps for #229 / #231)

The following data is displayed in the wizard or needed for document generation but is **not** stored as its own DB column and is **not** included in the `terms` JSONB payload sent to Supabase:

| Missing Field | Where Used | Impact on #229 PDF / #231 Email |
|---|---|---|
| `property.beds` | Step 3 property confirm card | PDF property details section will lack bed count unless fetched from `properties` table via `property_id` join |
| `property.baths` | Step 3 property confirm card | Same as above |
| `property.sqft` | Step 3 property confirm card | PDF property details section will lack square footage |
| `property.dom` | Step 3 property confirm card | Not needed in output docs but useful for context |
| `property.agent` | Step 3 confirm + Step 16 delivery copy | PDF cover letter needs listing agent name — must be fetched via `properties` join |
| `property.brokerage` | Step 3 confirm + Step 16 delivery copy | Same as above |
| Computed closing date | Step 8 (`closingDays` is stored but the absolute target date is not) | PDF/email should display `"on or before [DATE]"` — must compute `offer.created_at + closingDays` |
| Earnest money dollar amount | Derived: `offerPrice * earnestPct / 100` | PDF/email should show both the % and the dollar figure — derive at render time |
| Down payment dollar amount | Derived: `offerPrice * downPct / 100` | Same pattern |
| `d.financingDays` when cash | Step 11 skipped for cash buyers | `terms.financingDays` will be 21 (INITIAL_D default) even for cash offers; PDF/email must check `financeType === 'cash'` and suppress |
| `d.firstTime` | No wizard step sets it to `true` | The field is in `INITIAL_D` as `false` and is persisted to `terms`, but there is no step where the user sets it — it is always `false`. Consider removing or wiring to `buyerType === 'first'` |
| `d.propertyConfirmed` | No setter exists in any step | Always `false`; unused in validation; candidate for removal |
| State form name | Derived in step 3 UI from `d.state` switch | PDF builder needs the form title string (e.g. "Illinois Residential Purchase & Sale Agreement") — replicate the same switch logic in the PDF builder or extract to a shared utility |

---

## Notes for PDF Builder (#229) and Email (#231)

1. **Join `properties` when `property_id` is set.** Many property fields (beds, baths, sqft, agent, brokerage) are not duplicated into `offers.terms`. Always JOIN `public.properties` on `offers.property_id` when it is non-null to get the full property record.

2. **Standalone offers (no `property_id`).** When `property_id` is null, rely entirely on `offers.address` / `offers.list_price` and the `terms` JSONB. Beds/baths/agent fields will be unavailable.

3. **Compute derived values at render time.** Do not rely on pre-computed dollar amounts for earnest money, down payment, or closing date — derive them from stored primitives (`offerPrice`, `earnestPct`, `downPct`, `closingDays`, `created_at`).

4. **Suppress financing fields for cash buyers.** Check `terms.financeType === 'cash'` and skip Financing Contingency, Down Payment, and Pre-Approval sections in both PDF and email.

5. **Personal letter as a separate PDF page.** When `terms.personalLetter === true && terms.personalLetterText`, render the letter text on its own page after the main agreement in the PDF package.

6. **Escalation clause addendum.** When `terms.escalation === true`, include a separate escalation clause addendum page showing `escIncrement` and `escMax`.

7. **`sellerCredits === -1` means unanswered.** The initial state uses `-1` as a sentinel for "not yet answered". Treat `sellerCredits <= 0` as "no credits requested" in PDF/email output.
