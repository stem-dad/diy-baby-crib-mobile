const AWS = require('aws-sdk')
const iotdata = new AWS.IotData({endpoint: 'a2mc9k1t7mtci4.iot.us-east-1.amazonaws.com'})

/**
 * AlexaのDiscoveryリクエストにレスポンスする
 * https://developer.amazon.com/ja/docs/smarthome/steps-to-build-a-smart-home-skill.html のコードのコピペ
 * @param {*} request 
 * @param {*} context 
 */
function handleDiscovery(request, context) {
  const payload = {
    endpoints:
      [
        require(__dirname + '/endpoints/mobile.json') 
      ]
  }
  let header = request.directive.header
  header.name = 'Discover.Response'
  console.log('DEBUG', 'Discovery Response: ', JSON.stringify({ header: header, payload: payload }))
  context.succeed({ event: { header: header, payload: payload } })
}


/**
 * ON/OFF系のコントロール
 * @param {*} request 
 * @param {*} context 
 * @param {Function} callback 
 */
function handlePowerControl(request, context, callback) {
  const requestMethod = request.directive.header.name
  const endpointId = request.directive.endpoint.endpointId    
  let powerResult = 'ON'

  console.log('########### requestMethod: ', requestMethod, ', endpointId: ', endpointId)

  if (requestMethod === 'TurnOn') {
    powerResult = 'ON'
  }
  else if (requestMethod === 'TurnOff') {
    powerResult = 'OFF'
  }

  switch (endpointId) {
    case 'mobile':
      console.log('YES mobile')
      const params = {
        topic: 'test',
        qos: 0,
        payload: 'hogehogehogege'
      }
      iotdata.publish(params, (err, data)=>{
        console.log(err, data)
        sendResponse()
      })
      break

    default:
      sendResponse()
  }

  function sendResponse() {
    const contextResult = {
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
    const endpoint = {
      scope: {
        type: 'BearerToken',
        token: 'Alexa-access-token'
      },
      endpointId: endpointId
    }
    const response = {
      context: contextResult,
      event: {
        header: responseHeader
      },
      endpoint: endpoint,
      payload: {}
    }

    // console.log('DEBUG', 'Alexa.PowerController ', JSON.stringify(response))
    context.succeed(response)
  }
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
      // console.log('DEBUG:', 'TurnOn or TurnOff Request', JSON.stringify(request))
      handlePowerControl(request, context, callback)
    }
  }
}
