var axios = require("axios");
const core = require("@actions/core");

async function getFlagsmithFlags(url, auth) {
  var config = {
    method: "GET",
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

async function getArchivedFlags(url, auth) {
  var config = {
    method: "GET",
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

async function archiveFlags(url, auth, flagId) {
  var config = {
    method: "PUT",
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
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
}

module.exports = { getFlagsmithFlags, getArchivedFlags, archiveFlags };
