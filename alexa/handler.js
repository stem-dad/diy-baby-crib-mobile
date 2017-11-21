let exec = require('child_process').exec

/**
 * AlexaのDiscoveryリクエストにレスポンスする
 * https://developer.amazon.com/ja/docs/smarthome/steps-to-build-a-smart-home-skill.html のコードのコピペ
 * @param {*} request 
 * @param {*} context 
 */
function handleDiscovery(request, context) {
  let payload = {
    endpoints:
      [
        {
          endpointId: 'tv',
          manufacturerName: 'HAPT Lab.',
          friendlyName: 'テレビ',
          description: 'Smart Device Switch',
          displayCategories: ['SWITCH'],
          cookie: {
            key1: 'arbitrary key/value pairs for skill to reference this endpoint.',
            key2: 'There can be multiple entries',
            key3: 'but they should only be used for reference purposes.',
            key4: 'This is not a suitable place to maintain current endpoint state.'
          },
          capabilities:
            [
              {
                type: 'AlexaInterface',
                interface: 'Alexa',
                version: '3'
              },
              {
                interface: 'Alexa.PowerController',
                version: '3',
                type: 'AlexaInterface',
                properties: {
                  supported: [{
                    name: 'powerState'
                  }],
                  retrievable: true
                }
              }
            ]
        }
      ]
  }
  let header = request.directive.header
  header.name = 'Discover.Response'
  console.log('DEBUG', 'Discovery Response: ', JSON.stringify({ header: header, payload: payload }))
  context.succeed({ event: { header: header, payload: payload } })
}

/**
 * irkit APIに赤外線データをPOSTする
 * @param {String} commandFileName ir_signalsディレクトリ内にあるコマンドjsonのファイル名 
 */
function sendJsonCommandToIrkit(commandFileName) {
  return new Promise((resolve, reject) => {
    try {
      // JSONをインポートして1行の文字列に変換
      let commandJson = require(`./ir_signals/${commandFileName}.json`)
      let commandJsonString = JSON.stringify(commandJson)

      // irkitのAPIに赤外線コマンドjsonをPOSTして、我が家のirkitから指定の赤外線パターンを発信
      // http://getirkit.com/#toc_11 参照
      exec(
        `curl -i "https://api.getirkit.com/1/messages" ` + 
        `-d 'clientkey=${process.env.IRKIT_CLIENT_KEY}' ` +
        `-d 'deviceid=${process.env.IRKIT_DEVICE_ID}' ` +
        `-d 'message=${commandJsonString}'`,
        (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }
      )
    } catch(err) {
      console.log('sendJsonCommandToIrkit error', err)
      reject()
    }
  })
}

/**
 * Alexaからコールされるところ
 * @param {*} request 
 * @param {*} context 
 * @param {Function} callback 
 */
module.exports.alexa = (request, context, callback) => {
  if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
    console.log('DEGUG:', 'Discover request', JSON.stringify(request))
    handleDiscovery(request, context, '')
  }
  else if (request.directive.header.namespace === 'Alexa.PowerController') {
    if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
      console.log('DEBUG:', 'TurnOn or TurnOff Request', JSON.stringify(request))
      handlePowerControl(request, context, callback)
    }
  }

  function handlePowerControl(request, context, callback) {
    // get device ID passed in during discovery
    let requestMethod = request.directive.header.name
    // get user token pass in request
    // let requestToken = request.directive.payload.scope.token
    let powerResult

    console.log('###########', requestMethod)

    if (requestMethod === 'TurnOn') {
      sendJsonCommandToIrkit('tv_onoff')
        .then(() => {
          sendResponse()
        })
      powerResult = 'ON'
    }
    else if (requestMethod === 'TurnOff') {
      sendJsonCommandToIrkit('tv_onoff')
      .then(() => {
        sendResponse()
      })
      powerResult = 'OFF'
    }

    function sendResponse() {
      let contextResult = {
        properties: [{
          namespace: 'Alexa.PowerController',
          name: 'powerState',
          value: powerResult,
          timeOfSample: '2017-09-03T16:20:50.52Z', //retrieve from result.
          uncertaintyInMilliseconds: 50
        }]
      }
      let responseHeader = request.directive.header
      responseHeader.namespace = 'Alexa'
      responseHeader.name = 'Response'
      responseHeader.messageId = responseHeader.messageId + '-R'
      let endpoint = {
        scope: {
          type: 'BearerToken',
          token: 'Alexa-access-token'
        },
        endpointId: 'tv'
      }
      let response = {
        context: contextResult,
        event: {
          header: responseHeader
        },
        endpoint: endpoint,
        payload: {}
      }

      console.log('DEBUG', 'Alexa.PowerController ', JSON.stringify(response))
      context.succeed(response)
    }
  }
}
