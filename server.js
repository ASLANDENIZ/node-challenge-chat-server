const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
//Body Parser Middleware

// app.use(express.urlencoded({ extended: false }));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// ## Level 1 Challenge - make the chat server

// At this first level, your API must allow a client to:

//Level 5 - Optional - add message update functionality
app.put("messages/:id", (req,res) => {
  const found = messages.some(message => message.id === req.params.id.parseInt())
  const newMessage = req.body
  if(found) {
messages.map(message => {
if (message.id === req.params.id.parseInt())
message.text = newMessage.text? newMessage.text : message.text
message.from = newMessage.from? newMessage.from : message.from
})
  } else res.status(400).json({ msg: `There is no message with this id: ${req.params.id.parseInt()}`})
})


// Read only the most recent 10 messages: /messages/latest
app.get("/messages/latest", (req, res) => {
  const latestMessages = messages.slice(Math.max(arr.length - 10, 0))
  res.json(latestMessages)
})

// Read only messages whose text contains a given substring: /messages/search?text=express
app.get("/messages/search", (req, res) => {
  const searchTerm = req.query.text.toLowerCase()
  const found = messages.some(message => message.text.toLowerCase().includes(searchTerm))
  if (found) {
    const filteredMessages = messages.filter(message => message.text.toLowerCase().includes(searchTerm))
    res.json(filteredMessages)
  } else res.json({ msg: `No message with that search term!` })
});

// Create a new message
app.post("/messages", (req, res) => {
  const newMessage = {
    id: uuidv4(),
    from: req.body.from,
    text: req.body.text,
    timeSent: new Date().toLocaleString()
  }
  if (!newMessage.from || !newMessage.text || !newMessage) {
    res.status(400).json({ msg: `something is missing` })
  } else res.json(messages.push(newMessage))

})

// Read one message specified by an ID
app.get("/messages/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const found = messages.some(message => message.id === id)
  if (found) {
    const filteredMessage = messages.filter(message => message.id === id)
    res.status(200).json(filteredMessage)
  } else {
    res.status(404).json({ msg: `No member with the id of ${id}` })
  }
})
// Delete a message, by ID
app.delete("/messages/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const found = messages.some(message => message.id === id)
  if (found) {
    messages.map(message => {
      message.id === id ? messages.splice(id, 1) : null;
    })
    res.status(200).json({ msg: `message with id: ${id} is deleted` })
  } else res.status(400).json({ msg: `there is no message with id: ${id}` })
})



// Read all messages
app.get("/messages", (req, res) => {
  res.json(messages)
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
