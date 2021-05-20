const connectivity = require('./connectivityOptions');

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


exports.dialogView = (allLocations) =>{

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
              options: connectivity.connectivityOptions,
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

exports.testSubmissionBlock = (url) =>{

    return [
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Test successfully submitted for "+url,
            "emoji": true
          }
        },
        {
          "type": "divider"
        }
      ]
}

exports.errorBlock = (code, message) =>{

    return [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Error while submitting test",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Status Code : -  " + code,
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Status Text : -  " + message,
          "emoji": true
        }
      }
    ]
}

exports.wptResponseBlock = (url,summary,waterfallLink) =>{

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
            "text": "*URL Tested Link*"
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
            "text": "*Find your test details here.*"
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
