export function shortenAddress(s: string) {
  return s ? s.slice(0, 4) + "..." + s.slice(-4) : "";
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
