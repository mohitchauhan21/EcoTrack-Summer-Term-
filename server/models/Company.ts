import mongoose, { Schema, Document, Types } from "mongoose";

// Keep this list in sync with src/constants/regions.ts (COUNTRIES) on the frontend.
export const VALID_REGIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "Italy",
  "Sweden",
  "India",
  "China",
  "Japan",
  "Singapore",
  "South Korea",
  "Australia",
  "New Zealand",
  "Brazil",
  "Mexico",
  "Argentina",
  "South Africa",
  "United Arab Emirates",
  "Saudi Arabia",
  "Nigeria",
  "Kenya",
  "Israel"
] as const;

export type Region = typeof VALID_REGIONS[number];

export interface ICompany extends Document {
  name: string;
  region: Region;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true, trim: true },
  region: { type: String, required: true, enum: VALID_REGIONS },
  createdAt: { type: Date, default: Date.now }
});

export const Company = mongoose.model<ICompany>("Company", CompanySchema);