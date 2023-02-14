const core = require("@actions/core");
const getGithubConfigFlags = require("./github");
const flagsmithAPI = require("./flagsmith");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const flagsReadyToArchive = [];
    const FLAGSMITHBASEURL = "https://api.flagsmith.com/api/v1";

    // secrets
    const githubAuth = core.getInput("access_token");
    const flagsmithToken = core.getInput("apitokenflagsmith");

    // github context
    const owner = core.getInput("owner");
    const repo = core.getInput("repo");

    // matrix
    const flagsmithProjectId = core.getInput("flagsmithprojectid");
    const path = core.getInput("path");
    const ref = core.getInput("ref");

    const flagsmithUrl = `${FLAGSMITHBASEURL}/projects/${flagsmithProjectId}/features/`;

    core.info(`values: ${flagsReadyToArchive}  ...`);
    core.info(`values: ${flagsmithUrl}  ...`);
    core.info(`values: ${flagsmithToken}  ...`);
    core.info(`values: ${owner}  ...`);
    core.info(`values: ${repo}  ...`);
    core.info(`values: ${path}  ...`);
    core.info(`values: ${githubAuth}  ...`);
    core.info(`values: ${flagsmithProjectId}  ...`);

    const githubFlags = await getGithubConfigFlags(
      githubAuth,
      owner,
      repo,
      path,
      ref
    );

    core.info(`Flags defined in the Sales CRM: ${githubFlags}`);

    const flagsmithFlags = await flagsmithAPI.getFlagsmithFlags(
      flagsmithUrl,
      flagsmithToken
    );

    for (const key in flagsmithFlags) {
      if (Object.hasOwnProperty.call(flagsmithFlags, key)) {
        const element = flagsmithFlags[key];
        if (!githubFlags.includes(element.name)) {
          flagsReadyToArchive.push(element);
          core.info(`flag ready to archive ${element.name}`);
        } else {
          core.info(`flag still exists on both places ${element.name}`);
        }
      }
    }

    core.info(`Flags defined in flagssmith: ${flagsmithFlags}`);

    for (const key in flagsReadyToArchive) {
      if (Object.hasOwnProperty.call(flagsReadyToArchive, key)) {
        const flag = flagsReadyToArchive[key];
        core.info(`Flags ready to archive: ${flag.name} - ${flag.id}`);
        core.info(JSON.stringify(flag));
        const response = await flagsmithAPI.archiveFlag(
          flagsmithUrl,
          flagsmithToken,
          flag.id
        );
        core.info(JSON.stringify(response));
      }
    }

    const archivedFlags = await flagsmithAPI.getArchivedFlags(
      flagsmithUrl,
      flagsmithToken
    );

    const flagsForDeletion = [];
    var date = new Date();
    date.setMonth(date.getMonth() - 2);

    for (const key in archivedFlags) {
      if (Object.hasOwnProperty.call(archivedFlags, key)) {
        const flag = archivedFlags[key];
        if (flag.created_date > date.toISOString()) {
          const response = await flagsmithAPI.archiveFlag(
            flagsmithUrl,
            flagsmithToken,
            flag.id
          );
          core.info(JSON.stringify(response));
          flagsForDeletion.push(flag.name);
        }
      }
    }

    for (const key in flagsForDeletion) {
      if (Object.hasOwnProperty.call(flagsForDeletion, key)) {
        const element = flagsForDeletion[key];
        core.info(`Flags ready to delete: ${element.name}`);
      }
    }

    core.info("Done");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
