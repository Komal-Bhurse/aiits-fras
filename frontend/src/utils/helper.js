
export function maskAadhaar(aadhaar) {
  return "****"+" "+"****"+" "+aadhaar.slice(8);
}