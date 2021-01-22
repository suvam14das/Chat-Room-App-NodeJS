const express = require('express')   
const http = require('http')
const path = require('path') 
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require("./utils/messages") 
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express() 
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const pathToAssets = path.join(__dirname, '../public') 

app.use(express.static(pathToAssets))



// server (emit) -> client (receive) - countUpdated
// server (receive) -> client (emit) - increment

io.on('connection', (socket) => { 
    
    // socket.emit('message', generateMessage('Welcome !')) 
    // socket.broadcast.emit('message', generateMessage("A new user has joined !") ) // --> send to all except current 

    socket.on('join', ({username, room} , callback) => {
        const {error, user} = addUser({id: socket.id, username, room })

        if(error) { 
            return callback({error})
        }
        
        socket.join(user.room) 
        // socket.emit, io.emit, socket.broadcast.emit 
        // io.to.emit, socket.broadcast.to.emit ----> specific for the room  

        socket.emit('message', generateMessage('Welcome '+user.username+' !', 'Wupfh')) 
        socket.broadcast.to(user.room).emit('message', generateMessage( user.username+' has joined !', 'Wupfh') ) 
        io.to(user.room).emit('roomData', {
            room: user.room, 
            users: getUsersInRoom(user.room) 
        })

        callback({welcome : "!! Welcome to WUPFH !!"})
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        // socket.emit('countUpdated', count)  // --> send only to current client        
        // --> all clients send
        const user = getUser(socket.id) 
        io.to(user.room).emit('message', generateMessage(filter.clean(message), user.username))           
        callback('Message Delivered !') 
    })

    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(position, user.username) ) 
        callback('Location shared !')
    })

    socket.on('disconnect', () => {
        
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessage(user.username+ ' has left !', 'Wupfh')) 
            io.to(user.room).emit('roomData', {
                room: user.room, 
                users: getUsersInRoom(user.room) 
            })
        }           
    })    
})


server.listen(port, () => {
    console.log("Listening to port ",port) 

})