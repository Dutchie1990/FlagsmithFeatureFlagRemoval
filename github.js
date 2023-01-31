const { Octokit } = require("@octokit/rest");

async function getGithubConfigFlags(auth, owner, repo, path) {
  const flags = [];

  const client = new Octokit({
    auth,
  });
  return client
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      mediaType: {
        format: "raw",
      },
    })
    .then((response) => {
      const extractedValues = response.data.split(",");
      extractedValues.forEach((el) => {
        var mySubString = el.substring(
          el.indexOf("'") + 1,
          el.lastIndexOf("'")
        );
        flags.push(mySubString);
      });
      flags.pop();
      return flags;
    })
    .catch((er) => {
      console.log(er);
    });
}

module.exports = getGithubConfigFlags;
