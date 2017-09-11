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

// for Facebook verification
// app.get('/webhook/', function (req, res) {
//  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
//    res.send(req.query['hub.challenge'])
//  }
//  res.send('Error, wrong token')
// })

// const feelBetterImage = {
//   attachment: {
//     type: "template",
//     payload: {
//       template_type: "generic",
//       elements: [
//         {
//           title: "Hope this will cheer you up 🐶",
//           imageUrl: "https://i.pinimg.com/736x/f6/89/d9/f689d9982937ba09ad634f9ec6443258.jpg",
//           default_action: {
//             type: "web_url",
//             url: "https://i.pinimg.com/736x/f6/89/d9/f689d9982937ba09ad634f9ec6443258.jpg",
//             messenger_extensions: true,
//             webview_height_ratio: "tall",
//             fallback_url: "https://peterssendreceiveapp.ngrok.io/"
//           }
//         },
//         buttons: [
//           {
//             type: "web_url",
//             url: "https://petersfancybrownhats.com",
//             title: "View Website"
//           },
//           {
//             type: "postback",
//             title: "Start Chatting",
//             payload: "DEVELOPER_DEFINED_PAYLOAD"
//           }
//         ]
//       ]
//     }
//   }
// }

const feelBetterImage = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [{
        "title": "Welcome to Peter\'s Hats",
        "image_url": "https://petersfancybrownhats.com/company_image.png",
      }]
    }
  }
}

const thankYouMessage = {
  text: 'No problem, how else can I help you?'
}

const unknownMessage = {
  text: 'I\'m sorry, I\'m not human yet. Let\'s stick to our existing story 🦄'
}

function getMessageData (sender, text) {
  const content = text.split(' ')
  let message
  content.forEach(function (text) {
    switch (text) {
      case 'thanks':
      case 'thank':
        message = thankYouMessage
        break
      case 'sad':
      case 'nervous':
        message = feelBetterImage
        break
      default:
        message = unknownMessage
    }
  })
  return message
}

function sendTextMessage(sender, text) {
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
    json: {
      recipient: { id: sender },
      message: getMessageData(sender, text),
    }
  }, function(error, response, body) {
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      }
    })
}

const token = process.env.FB_PAGE_ACCESS_TOKEN

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
    }
    res.sendStatus(200)
})

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

