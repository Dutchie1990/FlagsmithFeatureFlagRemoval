const axios = require("axios");
const divider = {
  type: "divider",
};

function createMessage(deletedFlags, archivedFlags, ref, dryRun) {
  const project = ref.split("-")[1];
  var message = {};
  var blocks = [];

  let deleteHeaderText =
    dryRun === false
      ? `:put_litter_in_its_place: ${deletedFlags.length} Flags has been removed from the ${project}`
      : `:put_litter_in_its_place: ${deletedFlags.length} Flags ready to be removed from the ${project}`;

  const deleteHeader = {
    type: "header",
    text: {
      type: "plain_text",
      text: deleteHeaderText,
      emoji: true,
    },
  };

  blocks.push(deleteHeader);
  blocks.push(divider);

  for (let index = 0; index < deletedFlags.length; index++) {
    const flagName = deletedFlags[index];
    const teamName = deletedFlags[index].split("-")[0];

    var deleteMessage = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${teamName.toUpperCase()}* - ${flagName}`,
      },
    };
    blocks.push(deleteMessage);
  }

  let archiveHeaderText =
    dryRun === false
      ? `:file_folder: ${archivedFlags.length} Flags has been archived in the ${project}`
      : `:file_folder: ${archivedFlags.length} Flags ready to be archived in the ${project}`;

  const archiveHeader = {
    type: "header",
    text: {
      type: "plain_text",
      text: archiveHeaderText,
      emoji: true,
    },
  };

  blocks.push(archiveHeader);
  blocks.push(divider);

  for (let index = 0; index < archivedFlags.length; index++) {
    const flagName = archivedFlags[index];
    const teamName = archivedFlags[index].split("-")[0];

    var archiveMessage = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${teamName.toUpperCase()}* - ${flagName}`,
      },
    };
    blocks.push(archiveMessage);
  }
  message.blocks = blocks;
  return message;
}

async function sendMessage(message, to) {
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  return axios
    .post(to, JSON.stringify(message), { headers: headers })
    .then((res) => {
      console.log(res.status);
    })
    .catch((res) => {
      throw new Error(`Request failed with status ${res.status}`);
    });
}

module.exports = { createMessage, sendMessage };
