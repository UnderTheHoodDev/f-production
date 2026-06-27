/** Display number derived from the atomic `seq` counter, e.g. 59 -> "BG-0059". */
export function formatQuoteNumber(seq: number): string {
  return `BG-${String(seq).padStart(4, "0")}`;
}
