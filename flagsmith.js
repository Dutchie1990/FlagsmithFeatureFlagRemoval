var axios = require("axios");
const core = require("@actions/core");

function getFlagsmithFlags(url, auth) {
  var config = {
    method: "get",
    url: `${url}?sort_field=name&is_archived=false`,
    headers: {
      Authorization: auth,
    },
  };
  return axios(config)
    .then(function (response) {
      return response.data.results;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getArchivedFlags(url, auth) {
  var config = {
    method: "get",
    url: `${url}?is_archived=true`,
    headers: {
      Authorization: auth,
    },
  };
  return axios(config)
    .then(function (response) {
      return response.data.results;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function archiveFlags(url, auth, flagId) {
  var config = {
    method: "patch",
    url: `${url}${flagId}`,
    body: {
      is_archived: true,
    },
    headers: {
      Authorization: auth,
    },
  };
  core.info(config.url);
  return axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
}

module.exports = { getFlagsmithFlags, getArchivedFlags, archiveFlags };
