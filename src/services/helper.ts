import CryptoJS from "crypto-js";

type DecryptResult = any;

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function getDateAfterMonths(
  dateStr: string,
  monthRange: number
): string {
  console.log("monthRange", monthRange);
  console.log("dateStr", dateStr);
  const date = new Date(dateStr);
  const originalDay = date.getDate();

  // Add the month range
  date.setMonth(date.getMonth() + monthRange);

  // Adjust if day is overflowed (e.g., from 31st to next month)
  if (date.getDate() < originalDay) {
    date.setDate(0); // Go to last day of previous month
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  console.log("${year}-${month}-${day}", year, "-", month, "-", day);
  return `${year}-${month}-${day}`;
}

const decrypt = (
  encryptedData: string,
  iv: string,
  key: string
): DecryptResult => {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
  });

  // Perform decryption
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decryptedString);
};

export default decrypt;

export const formatRupees = (amount: number | string): string => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return "₹0.00";

  return numericAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
};
