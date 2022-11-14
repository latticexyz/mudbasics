const firstNameList: string[] = [
  "billo",
  "bolk",
  "skint",
  "scol",
  "pigmang",
  "surto",
  "skree",
  "begor",
  "xaur",
  "bitwis",
];
const lastNameList: string[] = ["arbi", "cart", "whil", "bork", "scarp", "snok", "kantr", "uzko", "sverg", "sunwik"];

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function seedToName(seed: number) {
  if (!seed) return false;
  const seedAsString: string = Math.abs(seed).toString();
  const firstName: string = firstNameList[Number(seedAsString[0])];
  const lastName: string = lastNameList[Number(seedAsString[1])];
  const fullName = firstName + " " + lastName;
  return toTitleCase(fullName);
}
