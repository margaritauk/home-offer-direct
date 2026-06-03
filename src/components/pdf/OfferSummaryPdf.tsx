// NOTE: Any API route that renders this PDF must include the following at the top of the file:
//   export const runtime = 'nodejs';
// @react-pdf/renderer uses Node.js-only APIs and is incompatible with the Edge runtime.

import { Document, Page, Text } from '@react-pdf/renderer';

// Scaffold component — real offer content will be added in issue #229.
export function OfferSummaryPdf() {
  return (
    <Document>
      <Page>
        <Text>Hello PDF</Text>
      </Page>
    </Document>
  );
}

export default OfferSummaryPdf;
