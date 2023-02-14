var axios = require("axios");

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
    method: "put",
    url: `${url}/${flagId}`,
    body: {
      is_archived: true,
    },
    headers: {
      Authorization: auth,
    },
  };
  return axios(config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
}

module.exports = { getFlagsmithFlags, getArchivedFlags, archiveFlags };
