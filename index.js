var nraw = require('nraw')
var reddit = new nraw('Alexa /r/showerthoughts skill')
var alexa = require('alexa-sdk')

var APP_ID = 'amzn1.ask.skill.0bd0b536-4938-4294-9193-98e57cb6431a'

exports.handler = function(event, context, callback) {
	var app = alexa.handler(event, context)
	app.APP_ID = APP_ID
	app.registerHandlers(handlers)
	app.execute
}

var handlers = {
	'LaunchRequest': function() {
		this.emit('GetShowerThought')
	},
	'GetNewShowerThoughtIntent': function () {
		this.emit('GetShowerThought')
	},
	'GetShowerThought': function () {
		getThoughtTitle(function(data) {
			var speech = 'Here is your shower thought: ' + data
			this.emit(':tellWithCard', speech, '/r/showerthoughts', data)
		})
	},
	'AMAZON.HelpIntent': function() {
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
	reddit.subreddit('showerthoughts').hot().exec(function(res) {
		var threads = res['data']['children']
		var rnd = Math.floor((Math.random() * threads.length))
		return callback(threads[rnd]['data']['title'])
	})
}