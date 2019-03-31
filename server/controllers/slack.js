const Slack = require('slack-node')

exports.send = (req, res) => {
  const slack = new Slack()
  slack.setWebhook(req.body.uri)
  slack.webhook(
    {
      channel: req.body.channel,
      username: req.body.user,
      text: req.body.message
    },
    (err, response) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(response)
    }
  )
}
