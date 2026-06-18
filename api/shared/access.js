// Replace these placeholder emails with each user's real Microsoft login email.
// Roles: admin = full access, supervisor = full access, locator = only their own data.
// For first testing, unknown authenticated users are allowed as supervisor unless REQUIRE_ACCESS_LIST=true.
const ACCESS_LIST = {
  "replace.with.steven.email@company.com": { role: "admin", displayName: "Steven Strickland", locatorName: null },
  "adam.kusiak@company.com": { role: "locator", displayName: "Adam Kusiak", locatorName: "Adam Kusiak" },
  "brittany.johnson@company.com": { role: "locator", displayName: "Brittany Johnson", locatorName: "Brittany Johnson" },
  "david.lopez@company.com": { role: "locator", displayName: "David Lopez", locatorName: "David Lopez" },
  "douglas.parker@company.com": { role: "locator", displayName: "Douglas Parker", locatorName: "Douglas Parker" },
  "eber.serrano@company.com": { role: "locator", displayName: "Eber Serrano", locatorName: "Eber Serrano" },
  "edwin.tejada@company.com": { role: "locator", displayName: "Edwin Tejada", locatorName: "Edwin Tejada" },
  "jimmy.gravlee@company.com": { role: "locator", displayName: "Jimmy Gravlee", locatorName: "Jimmy Gravlee" },
  "joel.tejada@company.com": { role: "locator", displayName: "Joel Tejada", locatorName: "Joel Tejada" },
  "josue.gutierrez@company.com": { role: "locator", displayName: "Josue Gutierrez", locatorName: "Josue Gutierrez" },
  "kevin.ardon@company.com": { role: "locator", displayName: "Kevin Ardon", locatorName: "Kevin Ardon" },
  "patrick.davis@company.com": { role: "locator", displayName: "Patrick Davis", locatorName: "Patrick Davis" },
  "robert.recinos@company.com": { role: "locator", displayName: "Robert Recinos", locatorName: "Robert Recinos" },
  "yailyn.campos@company.com": { role: "locator", displayName: "Yailyn Campos", locatorName: "Yailyn Campos" }
};
function normalizeEmail(email){ return String(email || "").trim().toLowerCase(); }
function strict(){ return String(process.env.REQUIRE_ACCESS_LIST || "").toLowerCase() === "true"; }
function getAccessForEmail(email){
  const key = normalizeEmail(email);
  const a = ACCESS_LIST[key];
  if(a) return { email:key, role:a.role, displayName:a.displayName, locatorName:a.locatorName || null, isApproved:true };
  if(strict()) return { email:key, role:"blocked", displayName:key, locatorName:null, isApproved:false };
  return { email:key, role:"supervisor", displayName:key, locatorName:null, isApproved:true, warning:"Unknown authenticated user allowed for setup. Set REQUIRE_ACCESS_LIST=true after emails are entered." };
}
function canUpload(user){ return user && ["admin","supervisor"].includes(user.role); }
module.exports = { getAccessForEmail, canUpload };
