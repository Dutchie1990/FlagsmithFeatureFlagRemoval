const core = require("@actions/core");
const getGithubConfigFlags = require("./github");
const flagsmithAPI = require("./flagsmith");

// most @actions toolkit packages have async methods
async function run() {
  try {
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
    var flagsReadyToArchive = [];
    var archivedFlags = [];
    var flagsReadyToDelete = [];
    var deletedFlags = [];

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

    for (const key in flagsReadyToArchive) {
      if (Object.hasOwnProperty.call(flagsReadyToArchive, key)) {
        const flag = flagsReadyToArchive[key];
        core.info(`Flags ready to archive: ${flag.name} - ${flag.id}`);
        const response = await flagsmithAPI.archiveFlag(
          flagsmithUrl,
          flagsmithToken,
          flag.id
        );
        archivedFlags.push(response.name);
      }
    }

    flagsReadyToDelete = await flagsmithAPI.getArchivedFlags(
      flagsmithUrl,
      flagsmithToken
    );

    var date = new Date();
    date.setMonth(date.getMonth() - 2);

    for (const key in flagsReadyToDelete) {
      if (Object.hasOwnProperty.call(flagsReadyToDelete, key)) {
        const flag = flagsReadyToDelete[key];
        if (flag.created_date > date.toISOString()) {
          const response = await flagsmithAPI.deleteFlag(
            flagsmithUrl,
            flagsmithToken,
            flag.id
          );
          deletedFlags.push(response.name);
        }
      }
    }
    core.info(`${archivedFlags.count()} are archived`);
    core.info(`${deletedFlags.count()} are deleted`);

    core.info("Done");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
