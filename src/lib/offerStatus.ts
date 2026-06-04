/**
 * Shared offer status constants.
 * Import these wherever offer status labels or colours are rendered
 * so that display strings stay in one place.
 */

export const OFFER_STATUS_LABEL: Record<string, string> = {
  draft:            "Draft",
  submitted:        "Submitted",
  pending:          "Pending review",
  pending_response: "Pending Response",
  accepted:         "Accepted",
  rejected:         "Not accepted",
  withdrawn:        "Withdrawn",
  counter:          "Counter-offer received",
};

export const OFFER_STATUS_COLOR: Record<string, string> = {
  pending:          "text-amber-700 bg-amber-50",
  pending_response: "bg-blue-100 text-blue-700",
  draft:            "text-slate-600 bg-slate-100",
  accepted:         "text-green-700 bg-green-50",
  rejected:         "text-red-600 bg-red-50",
  submitted:        "bg-blue-100 text-blue-700",
  withdrawn:        "bg-slate-100 text-slate-500",
};
