# Bermex Dashboard - Full Microsoft Login Version

Repository: Production
Workflow file: .github/workflows/azure-static-web-apps-witty-smoke-0ce2eed10.yml

## Upload structure
Upload the CONTENTS of this ZIP into the root of your Production GitHub repository. Do not upload the ZIP file itself.

Repo root should show:
.github/
api/
docs/
frontend/
README.md

## Required GitHub secret
Create this repository secret:
AZURE_STATIC_WEB_APPS_API_TOKEN

Value: paste the deployment token copied from the Azure Static Web App.

## Microsoft login
The dashboard is locked down by frontend/staticwebapp.config.json.
Login route: /login
Logout route: /logout

## Access list
Edit api/shared/access.js and replace placeholder emails with real Microsoft login emails.

Roles:
- admin: full access
- supervisor: full access
- locator: only sees assigned locator data

For first testing, unknown authenticated users are allowed as supervisor. After real emails are entered, add this Azure Static Web App application setting:
REQUIRE_ACCESS_LIST=true

## API endpoints
GET  /api/me
GET  /api/dashboard
POST /api/uploadData
POST /api/clearData

## Test
After GitHub Actions turns green:
https://witty-smoke-0ce2eed10.7.azurestaticapps.net/api/dashboard

Then open:
https://witty-smoke-0ce2eed10.7.azurestaticapps.net

Upload the sample CSVs from the docs folder.
