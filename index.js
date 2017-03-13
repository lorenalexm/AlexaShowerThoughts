var nraw = require('nraw')
var reddit = new nraw('Alexa /r/showerthoughts skill')
var alexa = require('alexa-sdk')

var APP_ID = 'amzn1.ask.skill.0bd0b536-4938-4294-9193-98e57cb6431a'

exports.handler = function(event, context, callback) {
	var app = alexa.handler(event, context)
	app.APP_ID = APP_ID
	app.registerHandlers(handlers)
	app.execute()
}

var handlers = {
	'LaunchRequest': function() {
		console.log('Emitting request for GetShowerThought')
		this.emit('GetShowerThought')
	},
	'GetNewShowerThoughtIntent': function () {
		console.log('Emitting request for GetShowerThought')
		this.emit('GetShowerThought')
	},
	'GetShowerThought': function () {
		console.log('Requesting title of thought');
		var self = this
		getThoughtTitle(function(data) {
			console.log('Building speech to be emitted')
			var speech = 'Here is your shower thought: ' + data
			self.emit(':tellWithCard', speech, '/r/showerthoughts', data)
		})
	},
	'AMAZON.HelpIntent': function() {
		console.log('Building help prompt to be emitted')
		var help = 'You can say tell me something, or, you can say exit... What can I help you with?'
		var prompt = 'What can I help you with?'
		this.emit(':ask', help, prompt)
	},
	'AMAZON.CancelIntent': function() {
		this.emit(':tell', 'Goodbye!')
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye!')
	}
}

function getThoughtTitle(callback) {
	console.log('Attempting to pull data from Reddit')
	reddit.subreddit('showerthoughts').hot().exec(function(res) {
		console.log('Data successfully pulled')
		var threads = res['data']['children']
		var rnd = Math.floor((Math.random() * threads.length))
		return callback(threads[rnd]['data']['title'])
	})
}