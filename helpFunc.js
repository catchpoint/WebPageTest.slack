exports.runTest = (wpt, url, options) => {
    // clone options object to avoid WPT wrapper issue
    let tempOptions = JSON.parse(JSON.stringify(options));

    return new Promise((resolve, reject) => {
        console.info(`Submitting test for ${url}...`);
        wpt.runTest(url, tempOptions, async(err, result) => {
            try {
                if (result) {
                    return resolve({'result':result,'err':err});
                } else {
                    return reject(err);
                }
            } catch (e) {
                console.info(e);
            }
        })
    });
}

exports.getLocations = (wpt,options) => {
    // clone options object to avoid WPT wrapper issue
    let tempOptions = JSON.parse(JSON.stringify(options));

    return new Promise((resolve, reject) => {
        console.info(`Getting Locations...`);
        wpt.getLocations(tempOptions, async(err, result) => {
            try {
                if (result) {
                    return resolve({'result':result,'err':err});
                } else {
                    return reject(err);
                }
            } catch (e) {
                console.info(e);
            }
        })
    });
}

const connectivityOptions = [
    {
      "text": {
        "type": "plain_text",
        "text": "DSL - 1.5 Mbps down, 384 Kbps up, 50 ms first-hop RTT",
        "emoji": true
      },
      "value":  "DSL"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "Cable - 5 Mbps down, 1 Mbps up, 28ms first-hop RTT",
        "emoji": true
      },
      "value":  "Cable"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "FIOS - 20 Mbps down, 5 Mbps up, 4 ms first-hop RTT",
        "emoji": true
      },
      "value":  "FIOS"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "Dial - 49 Kbps down, 30 Kbps up, 120 ms first-hop RTT",
        "emoji": true
      },
      "value":  "Dial"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "Edge - 240 Kbps down, 200 Kbps up, 840 ms first-hop RTT",
        "emoji": true
      },
      "value":  "Edge"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "2G - 280 Kbps down, 256 Kbps up, 800 ms first-hop RTT",
        "emoji": true
      },
      "value":  "2G"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "3GSlow - 400 Kbps down and up, 400 ms first-hop RTT",
        "emoji": true
      },
      "value":  "3GSlow"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "3G - 1.6 Mbps down, 768 Kbps up, 300 ms first-hop RTT",
        "emoji": true
      },
      "value":  "3G"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "3GFast - 1.6 Mbps down, 768 Kbps up, 150 ms first-hop RTT",
        "emoji": true
      },
      "value":  "3GFast"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "4G - 9 Mbps down and up, 170 ms first-hop RTT",
        "emoji": true
      },
      "value":  "4G"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "LTE - 12 Mbps down and up, 70 ms first-hop RTT",
        "emoji": true
      },
      "value":  "LTE"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "Native - No synthetic traffic shaping applied",
        "emoji": true
      },
      "value":  "Native"
    }
  ]
const  generateLocationOptions = (allLocations)=>{

    let options = [];
    for(let i=0;i<allLocations.length;i++)
    {
        let optionsObject = {
          "text": {
            "type": "plain_text",
            "text": allLocations[i].Label,
            "emoji": true
          },
          "value":  allLocations[i].location
        }
        options.push(optionsObject);
    }

    return options;
}
exports.getDialogView = (allLocations) =>{

    return {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'WebPageTest',
        },
        submit: {
          type: 'plain_text',
          text: 'Submit',
        },
        callback_id: 'webpagetest',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'Enter below details to get back WPT response',
              emoji: true,
            },
          },
          {
            type: 'divider',
          },

          {
            type: 'input',
            block_id: 'url',
            label: {
              type: 'plain_text',
              text: 'URL',
              emoji: true,
            },
            element: {
              type: 'plain_text_input',
              multiline: true,
              action_id: 'url',
            },
          },
          {
            type: "input",
            block_id: 'location',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true
              },
              options: generateLocationOptions(allLocations),
              action_id: "location"
            },
            label: {
              type: "plain_text",
              text: "Locations",
              emoji: true
            }
          },
          {
            type: "input",
            block_id: 'connectivity',
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true
              },
              options: connectivityOptions,
              action_id: "connectivity"
            },
            label: {
              type: "plain_text",
              text: "Connectivity",
              emoji: true
            }
          },
          {
            type: "section",
            block_id: 'emulateMobile',
            text: {
              type: "plain_text",
              text: "Emulate Mobile"
            },
            accessory: {
              type: "radio_buttons",
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "True",
                    emoji: true
                  },
                  value: "true"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "False",
                    emoji: true
                  },
                  value: "false"
                }
              ],
              action_id: "emulateMobile"
            }
          }
        ],
      }
}

exports.getBlockResult = (url,summary,waterfallLink) =>{

    return [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "WebPageTest Run Details",
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "URL Tested Link"
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "URL Link",
              "emoji": true
            },
            "value": "click_me_123",
            "url": url,
            "action_id": "button-action"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Find your test details here."
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "WebPageTest",
              "emoji": true
            },
            "value": "click_me_123",
            "url": summary,
            "action_id": "button-action"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "Waterfall Model",
            "emoji": true
          },
          "image_url": waterfallLink,
          "alt_text": "marg"
        }
      ]
}