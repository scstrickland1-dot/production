# Bermex Dashboard - Production Clean Start

Repository: Production
Workflow file: .github/workflows/azure-static-web-apps-witty-smoke-0ce2eed10.yml

Create one GitHub repository secret:

AZURE_STATIC_WEB_APPS_API_TOKEN

Paste the deployment token from the current Azure Static Web App into that secret.

Upload the contents of this ZIP to the root of the Production repo. Do not upload the ZIP itself.

Root should show:
.github/
api/
docs/
frontend/
README.md

Test after deployment:
https://YOUR-STATIC-APP-URL/api/dashboard

It should show JSON.
