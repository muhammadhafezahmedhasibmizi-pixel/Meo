export type Worker = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  phone: string;
  district: string;
  thana: string;
  area: string | null;
  bio: string | null;
  experience_years: number;
  photo_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
export const CATEGORIES = [
  "ইলেকট্রিশিয়ান", "প্লাম্বার", "এসি টেকনিশিয়ান", "রাজমিস্ত্রি",
  "রংমিস্ত্রি", "টাইলস মিস্ত্রি", "কাঠমিস্ত্রি", "ওয়েল্ডার",
  "গৃহকর্মী", "পরিচ্ছন্নতাকর্মী", "অন্যান্য"
];
