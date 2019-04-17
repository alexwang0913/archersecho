const { SupportTicket } = require("../database/models");

exports.update = async (req, res) => {
  const ticketId = req.params.ticketId;
  SupportTicket.update({ _id: ticketId }, { $set: req.body })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.delete = async (req, res) => {
  const ticketId = req.params.ticketId;
  SupportTicket.remove({ _id: ticketId })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.saveTicketMail = data => {
  const { ticketId, mail } = data;
  SupportTicket.update({ _id: ticketId }, { $set: { mail: mail } })
    .then(result => {
      console.log("Success in SaveTicketMail");
    })
    .catch(err => {
      console.log("Error from SaveTicketMail");
      console.log(err);
    });
};

exports.getTicketMail = (ticketId, cb) => {
  SupportTicket.findById(ticketId)
    .then(result => {
      cb(result.mail);
    })
    .catch(err => {
      console.log("Error from GetTicketMail");
      console.log(err);
    });
};

exports.add = (req, res) => {
  new SupportTicket(req.body)
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
