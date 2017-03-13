var nraw = require('nraw')
var reddit = new nraw('Alexa /r/showerthoughts skill')
var alexa = require('alexa-sdk')

function getSubredditTitle(callback) {
	reddit.subreddit('showerthoughts').hot().exec(function(res) {
		var threads = res['data']['children']
		var rnd = Math.floor((Math.random() * threads.length))
		return callback(threads[rnd]['data']['title'])
	})
}

getSubredditTitle(function(data) {
	console.log(data)
})