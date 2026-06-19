const PROJECTS = {
  alabama: {
    id: "alabama",
    displayName: "Alabama",
    shortName: "AL",
    dataSource: "utilisphere",
    filterValueEnv: "UTILISPHERE_ALABAMA_VALUE"
  },
  ohio: {
    id: "ohio",
    displayName: "Ohio",
    shortName: "OH",
    dataSource: "utilisphere",
    filterValueEnv: "UTILISPHERE_OHIO_VALUE"
  }
};

function getProject(projectId) {
  return PROJECTS[String(projectId || "").toLowerCase()] || null;
}

function getProjectIds() {
  return Object.keys(PROJECTS);
}

function getProjectFilter(projectId) {
  const project = getProject(projectId);
  if (!project) return null;

  return {
    field: process.env.UTILISPHERE_PROJECT_FIELD || "",
    value: process.env[project.filterValueEnv] || ""
  };
}

module.exports = { PROJECTS, getProject, getProjectIds, getProjectFilter };
