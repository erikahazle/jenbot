'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

const techTopic = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "list",
      "top_element_style": "compact",
      "elements": [
        {
          "title": "Lightful are taking tech world by storm",
          "subtitle": "Sign ups are going up as everyone wants to see what Lightful platform is all about.",
          "image_url": "https://daks2k3a4ib2z.cloudfront.net/58f86df185ceff1c5f410f61/5996e78e7488150001d1f191_iPhones-optimised.png"
        },
        {
          "title": "Charities: to Salesforce or not to Salesforce",
          "subtitle": "The good the bad and the ugly from the world of Salesforce and third sector",
          "image_url": "https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAgwAAAAJDNjZWExMGM0LWRhYTItNDNlOC1hMDU2LTk4NzU3NjZmOTY4NQ.png",
        },
        {
          "title": "Touch pay and donations",
          "subtitle": "Can Apple win the race to become the top donation device?",
          "image_url": "https://images.unsplash.com/photo-1493200754321-b1d3cbc969a8?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=adf18e73837a4fde34f10265f9858fa2",
        }
      ],
       "buttons": [
        {
          "title": "View More",
          "type": "postback",
          "payload": "payload"
        }
      ]
    }
  }
}

const causes = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
        {
          "title": "Hurricane Irma",
          "subtitle": "Hurricane Irma was still wreaking havoc in South Carolina late Monday after causing at least 10 deaths in Florida, Georgia and South Carolina."
          "image_url": "http://a.abcnews.com/images/International/st-johns-county-fire-rescue-house-ht-jt-170911_4x3_992.jpg",
          "buttons": [
            {
              "type": "postback",
              "title": "Donate £5",
              "payload": "DEVELOPER_DEFINED_PAYLOAD"
            },
            {
              "type": "postback",
              "title": "Donate £10",
              "payload": "DEVELOPER_DEFINED_PAYLOAD"
            }
          ]
        },
        {
          "title": "Rohingya crisis",
          "image_url": "https://ichef.bbci.co.uk/news/660/cpsprodpb/6938/production/_97763962_cab77ecb-f988-4fa5-859b-caf61855d504.jpg",
          "buttons": [
            {
              "type": "postback",
              "title": "Donate £5",
              "payload": "DEVELOPER_DEFINED_PAYLOAD"
            },
            {
              "type": "postback",
              "title": "Donate £10",
              "payload": "DEVELOPER_DEFINED_PAYLOAD"
            }
          ]
        }
      ]
    }
  }
}

const selectTopic = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
        {
          "title": "Tech for Good",
          "image_url": "https://images.unsplash.com/photo-1493200754321-b1d3cbc969a8?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=adf18e73837a4fde34f10265f9858fa2",
          "buttons": [
            {
              "type": "postback",
              "title": "Explore Tech for Good",
              "payload": "DEVELOPER_DEFINED_PAYLOAD"
            }
          ]
        },
        {
          "title": "World Peace",
          "image_url": "https://images.unsplash.com/photo-1485182317254-4d42489e041b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=9fb9d268fe3944e870e79035c1698244",
          "buttons": [
            {
              "type": "postback",
              "title": "Explore World Peace",
              "payload": "DEVELOPER_DEFINED_PAYLOAD"
            }
          ]
        },
        {
          "title": "Social Enterprises",
          "image_url": "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=111ce4c93bb29922945097ae8e534825",
          "buttons": [
            {
              "type": "postback",
              "title": "Explore Social Enterprises",
              "payload": "SELECT_ENTERPRISE"
            }
          ]
        }
      ]
    }
  }
}

const feelBetterImage = {
  attachment: {
    type: "template",
    payload: {
      template_type: "generic",
      elements: [{
        title: "Oh, I’m sure everything’s going to be alright.",
        subtitle: "Here’s something to cheer you up ☺️",
        image_url: "https://i.pinimg.com/736x/f6/89/d9/f689d9982937ba09ad634f9ec6443258.jpg"
      }]
    }
  }
}

const helloMessage = {
  text: 'Hey, good to see you! How are you doing today?'
}

const thankYouMessage = {
  text: 'No problem, is there anything else I can help you with?'
}

const unknownMessage = {
  text: 'I\'m sorry, I\'m not human yet. Let\'s stick to our script 😜🦄'
}

const enterpriseTopic = {
  text: 'Enterprise'
}

const donatedMessage = {
  text: 'Your donation has been sent via Lightful platform. We will keep you updated on the progress of the cause.'
}

function getMessageData (sender, text) {
  const content = text.split(' ')
  let message
  content.forEach(function (text) {
    switch (text.toLowerCase()) {
      case 'hey':
      case 'hi':
      case 'hello':
        message = helloMessage
        break
      case 'thanks':
      case 'thank':
        message = thankYouMessage
        break
      case 'sad':
      case 'nervous':
        message = feelBetterImage
        break
      case 'happening':
        message = selectTopic
        break
      case 'enterprises':
        message = enterpriseTopic
        break
      case 'tech':
        message = techTopic
        break
      case 'causes':
        message = causes
        break
      case 'donate':
        message = donatedMessage
        break
    }
  })

  if (!message) {
    message = unknownMessage
  }

  return message
}

function sendTextMessage (sender, text) {
    console.log('sender', sender)
    console.log('text', text)
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
    json: {
      recipient: { id: sender },
      message: getMessageData(sender, text),
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }

    // sendTextMessage(sender)

    console.log('response', response)
    console.log('body', body)
  })
}

const token = process.env.FB_PAGE_ACCESS_TOKEN

app.post('/webhook/', function (req, res) {
    // console.log('req.body -->', req.body.entry)
    let messaging_events = req.body.entry[0].messaging
    let standby_events = req.body.entry[0].standby
    // console.log('standby_events', standby_events)
    if (messaging_events) {
      for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
          let text = event.message.text
          sendTextMessage(sender, text.substring(0, 200))
        }
      }
    }

    if (standby_events) {
      let postbackData = standby_events[0]
      console.log('postbackData', postbackData)
      console.log('postbackData.sender', postbackData.sender)
      sendTextMessage(postbackData.sender.id, postbackData.postback.title)
    }
    res.sendStatus(200)
})

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})
