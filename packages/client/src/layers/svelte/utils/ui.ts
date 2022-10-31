export function shortenAddress(s: string) {
  return s ? s.slice(0, 4) + "..." + s.slice(-4) : "";
}
