import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Company } from "../models/Company.js";
import { Department } from "../models/Department.js";
import { EmissionLog } from "../models/EmissionLog.js";
import User from "../models/User.js";
import { calculateCarbonEquivalent } from "../utils/conversionFactors.js";

export async function seedData() {
  console.log("Seeding initial mock data...");
  try {
    const existingCompany = await Company.findOne();
    if (existingCompany) {
      console.log("Data already exists, skipping seed.");
      return;
    }

    console.log("Creating company...");
    const company = await Company.create({ name: "Acme Corporation", region: "India" });

    console.log("Creating departments...");
    const depts = await Department.insertMany([
      { companyId: company._id, name: "HR", active: true },
      { companyId: company._id, name: "Sales", active: true },
      { companyId: company._id, name: "Manufacturing", active: true },
      { companyId: company._id, name: "Logistics", active: true },
    ]);

    const deptMap = {
      HR: depts.find(d => d.name === "HR")!._id,
      Sales: depts.find(d => d.name === "Sales")!._id,
      Manufacturing: depts.find(d => d.name === "Manufacturing")!._id,
      Logistics: depts.find(d => d.name === "Logistics")!._id,
    };

    console.log("Generating 400 logs...");
    const logs = [];
    const activities = ["Travel", "Utilities", "Supply Chain", "Other"];
    const units = {
      "Travel": "miles",
      "Utilities": "kWh",
      "Supply Chain": "kg",
      "Other": "unit"
    };

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    for (let i = 0; i < 400; i++) {
      // Skew towards Logistics
      const randDept = Math.random();
      let dName = "HR";
      if (randDept > 0.9) dName = "Sales";
      else if (randDept > 0.6) dName = "Manufacturing";
      else if (randDept > 0.1) dName = "Logistics"; // 50% logistics

      const deptId = deptMap[dName as keyof typeof deptMap];

      const randActivity = Math.random();
      let activity = "Other";
      if (dName === "Logistics") {
        activity = randActivity > 0.5 ? "Supply Chain" : "Travel";
      } else if (dName === "Manufacturing") {
        activity = randActivity > 0.3 ? "Utilities" : "Supply Chain";
      } else {
        activity = randActivity > 0.5 ? "Utilities" : "Travel";
      }

      const unit = units[activity as keyof typeof units];
      
      let rawAmount = 100 + Math.random() * 1000;
      if (activity === "Supply Chain") rawAmount *= 10;
      if (activity === "Utilities") rawAmount *= 5;

      const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

      const carbonEquivalent = calculateCarbonEquivalent(activity, unit, rawAmount);

      logs.push({
        companyId: company._id,
        departmentId: deptId,
        date,
        activityType: activity,
        rawAmount,
        rawUnit: unit,
        carbonEquivalent,
        source: `Generated mock data ${i}`
      });
    }

    await EmissionLog.insertMany(logs);
    console.log(`Seeded ${logs.length} logs successfully!`);

    console.log("Seeding users...");
    // All seeded/demo accounts share this password so the whole team and grader
    // can log in and test the app. Never use a hardcoded password like this in production.
    const DEFAULT_PASSWORD = "Password123!";
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    await User.insertMany([
      { name: "Super Admin", email: "superadmin@ecotrack.com", password: hashedPassword, role: "superadmin", companyId: company._id },
      { name: "Company Admin", email: "admin@ecotrack.com", password: hashedPassword, role: "admin", companyId: company._id },
      { name: "Executive Viewer", email: "exec@ecotrack.com", password: hashedPassword, role: "executive", companyId: company._id },
      { name: "John Employee", email: "employee@ecotrack.com", password: hashedPassword, role: "employee", companyId: company._id, departmentId: deptMap["HR"] },
      { name: "Jane Logistics", email: "jane@ecotrack.com", password: hashedPassword, role: "employee", companyId: company._id, departmentId: deptMap["Logistics"] },
      { name: "Alice Mfg", email: "alice@ecotrack.com", password: hashedPassword, role: "employee", companyId: company._id, departmentId: deptMap["Manufacturing"] }
    ]);
    console.log("Seeded 6 users successfully!");
    console.log(`All seeded users share the password: ${DEFAULT_PASSWORD}`);

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

