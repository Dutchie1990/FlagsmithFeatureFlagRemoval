var axios = require("axios");

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

async function archiveFlag(url, auth, flagId) {
  var data = JSON.stringify({
    is_archived: true,
  });
  var config = {
    method: "PATCH",
    url: `${url}${flagId}/`,
    data: data,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  };
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
}

async function deleteFlag(url, auth, flagId) {
  var config = {
    method: "DELETE",
    url: `${url}${flagId}/`,
    headers: {
      Authorization: auth,
    },
  };
  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
}

module.exports = {
  getFlagsmithFlags,
  getArchivedFlags,
  archiveFlag,
  deleteFlag,
};
