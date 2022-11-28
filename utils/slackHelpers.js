const connectivity = require("./connectivityOptions");
const mobileDevices = require("./mobileDevices.js");

const generateLocationOptions = (allLocations) => {
  let options = [];
  for (let i = 0; i < allLocations.length; i++) {
    const browsers = allLocations[i].Browsers.split(",");
    let browserOptions = [];
    for (let j = 0; j < browsers.length; j++) {
      let optionsObject = {
        text: {
          type: "plain_text",
          text: browsers[j],
          emoji: true,
        },
        value: allLocations[i].location + ":" + browsers[j],
      };
      browserOptions.push(optionsObject);
    }
    let locationOptionObject = {
      label: {
        type: "plain_text",
        text: allLocations[i].Label,
      },
      options: browserOptions,
    };

    options.push(locationOptionObject);
  }

  return options;
};

exports.dialogView = (allLocations, url, channel_id) => {
  let blocks = [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Enter below details to get back WPT response",
        emoji: true,
      },
    },
    {
      type: "section",
      block_id: "url",
      text: {
        type: "plain_text",
        text: url,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "input",
      block_id: "location",
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        option_groups: generateLocationOptions(allLocations),
        action_id: "location",
      },
      label: {
        type: "plain_text",
        text: "Locations",
        emoji: true,
      },
    },
    {
      type: "input",
      block_id: "connectivity",
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: connectivity.connectivityOptions,
        action_id: "connectivity",
      },
      label: {
        type: "plain_text",
        text: "Connectivity",
        emoji: true,
      },
    },
    {
      type: "section",
      block_id: "emulateMobile",
      text: {
        type: "plain_text",
        text: "Emulate Mobile",
      },
      accessory: {
        type: "radio_buttons",
        initial_option: {
          text: {
            type: "plain_text",
            text: "False",
            emoji: true,
          },
          value: "false",
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "True",
              emoji: true,
            },
            value: "true",
          },
          {
            text: {
              type: "plain_text",
              text: "False",
              emoji: true,
            },
            value: "false",
          },
        ],
        action_id: "emulateMobile",
      },
    },
    {
      type: "input",
      block_id: "mobiledevice",
      element: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: mobileDevices.mobileOptions,
        initial_option: {
          text: {
            type: "plain_text",
            text: "Motorola G (gen 4)",
            emoji: true,
          },
          value: "MotoG4",
        },
        action_id: "mobiledevice",
      },
      label: {
        type: "plain_text",
        text: "Mobile Device (Works only-if emulate mobile is true)",
        emoji: true,
      },
    },
  ];
  if (!url)
    blocks[1] = {
      type: "input",
      block_id: "url",
      label: {
        type: "plain_text",
        text: "URL",
        emoji: true,
      },
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: "url",
      },
    };

  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "WebPageTest",
    },
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    callback_id: channel_id,
    blocks: blocks,
  };
};

exports.testSubmissionBlock = (url) => {
  return [
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Test successfully submitted for " + url,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
  ];
};

exports.errorBlock = (code, message) => {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Error while submitting test",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Status Code : -  " + code,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Status Text : -  " + message,
        emoji: true,
      },
    },
  ];
};

exports.wptResponseBlock = (url, summary, waterfallLink) => {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "WebPageTest Run Details",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*URL Tested*",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "View Tested URL",
          emoji: true,
        },
        value: "click_me_123",
        url: url,
        action_id: "button-action",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Find your test details here.*",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "WebPageTest Results",
          emoji: true,
        },
        value: "click_me_123",
        url: summary,
        action_id: "button-action",
      },
    },
    {
      type: "divider",
    },
    {
      type: "image",
      title: {
        type: "plain_text",
        text: "Performance Waterfall",
        emoji: true,
      },
      image_url: waterfallLink,
      alt_text: "marg",
    },
  ];
};
