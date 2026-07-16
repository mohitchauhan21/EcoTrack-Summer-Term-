// Shared list of supported operating countries.
// Used by CompanyProfilePage.tsx and CompanyBoundariesStep.tsx so both
// dropdowns always stay in sync with each other and with the backend enum
// (server/models/Company.ts -> VALID_REGIONS).
// If you add/remove a country here, update VALID_REGIONS in Company.ts too.

export const COUNTRIES = [
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

export type Country = typeof COUNTRIES[number];