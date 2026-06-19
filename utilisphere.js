/*
  Replace the placeholder Microsoft email addresses before enabling strict access.

  Roles:
    admin       - all projects, sync, upload, clear
    management  - all projects, read and sync
    supervisor  - assigned projects, sync, upload, clear

  No locator-only access is enabled in this version.
*/
const ACCESS_LIST = {
  "replace.with.steven.email@company.com": {
    displayName: "Steven Strickland",
    role: "admin",
    allowedProjects: ["all", "alabama", "ohio"]
  },

  "upper.manager@company.com": {
    displayName: "Upper Management",
    role: "management",
    allowedProjects: ["all", "alabama", "ohio"]
  },

  "alabama.supervisor@company.com": {
    displayName: "Alabama Supervisor",
    role: "supervisor",
    allowedProjects: ["alabama"]
  },

  "ohio.supervisor@company.com": {
    displayName: "Ohio Supervisor",
    role: "supervisor",
    allowedProjects: ["ohio"]
  }
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function strictAccessEnabled() {
  return String(process.env.REQUIRE_ACCESS_LIST || "false").toLowerCase() === "true";
}

function getAccess(email) {
  const key = normalizeEmail(email);
  const configured = ACCESS_LIST[key];

  if (configured) {
    return {
      email: key,
      displayName: configured.displayName,
      role: configured.role,
      allowedProjects: configured.allowedProjects || [],
      isApproved: true
    };
  }

  if (strictAccessEnabled()) {
    return {
      email: key,
      displayName: key,
      role: "blocked",
      allowedProjects: [],
      isApproved: false
    };
  }

  return {
    email: key,
    displayName: key || "Authenticated User",
    role: "admin",
    allowedProjects: ["all", "alabama", "ohio"],
    isApproved: true,
    warning: "Testing mode: unknown authenticated users are temporarily treated as admins."
  };
}

function canViewProject(user, projectId) {
  if (!user || !user.isApproved) return false;
  if (projectId === "all") return user.allowedProjects.includes("all");
  return user.allowedProjects.includes("all") || user.allowedProjects.includes(projectId);
}

function canSync(user) {
  return Boolean(user && ["admin", "management", "supervisor"].includes(user.role));
}

function canWrite(user) {
  return Boolean(user && ["admin", "supervisor"].includes(user.role));
}

module.exports = { getAccess, canViewProject, canSync, canWrite };
