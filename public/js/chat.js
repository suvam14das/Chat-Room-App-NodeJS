const socket = io()

// Elements
const messages = document.getElementById("messages")
const sendLocatiionButton = document.getElementById("send-location")
const messageTemplate = document.getElementById("message-template").innerHTML 
const locationTemplate = document.getElementById("location-template").innerHTML
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML

// Username and room 
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix:true} )

const autoscroll = () => {

    // new message element 
    const newMessage = messages.lastElementChild

    // height of new message element
    const newMessageStyles = getComputedStyle(newMessage) 
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessageMargin + newMessage.offsetHeight 

    // visible height 
    const visibleHeight = messages.offsetHeight 

    // height of container 
    const containerHeight = messages.scrollHeight 

    // how far scrolled from top 
    const scrollOffset = messages.scrollTop + visibleHeight 

    if(containerHeight - scrollOffset <= newMessageHeight)
    {
        messages.scrollTop = containerHeight 
    }

}

socket.on('roomData', ({room, users}) => {
    console.log(room) 
    console.log(users)
    const html = Mustache.render(sidebarTemplate, {room, users})
    document.getElementById("sidebar").innerHTML = html
})

socket.on('message', (message) => {
    
    console.log(message) 
    const html = Mustache.render(messageTemplate, { 
        message: message.text, 
        username: message.username,         
        createdAt: moment(message.createdAt).format('h:mm a') }) 
    messages.insertAdjacentHTML('beforeend', html)   
    autoscroll()
})

socket.on('locationMessage', (location) => {
    
    console.log(location) 
    const html = Mustache.render(locationTemplate, { 
        location : location.url, 
        username : location.username,
        createdAt : moment(location.createdAt).format('h:mm a')                
    }) 
    messages.insertAdjacentHTML('beforeend', html)   
    autoscroll()
})


document.getElementById("chatbox").addEventListener("submit", (e) => {

    e.preventDefault()
    let message = document.getElementById("message") 
    socket.emit("sendMessage", message.value, (message) => {
        console.log('Message sent ! ', message) 
    }) 
    message.value= ""
    message.focus()
})


sendLocatiionButton.addEventListener('click', (e) => {
    
    sendLocatiionButton.setAttribute('disabled', 'disabled')
    
    if(! navigator.geolocation) 
        return alert('Geolocation service not available') 
    
    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude : position.coords.latitude, 
            longitude : position.coords.longitude
        }, (message) => {
            console.log(message) 
            sendLocatiionButton.removeAttribute('disabled')
        })

  
    })
    
})

socket.emit('join', {username, room}, ({welcome, error}) => {
    if(error) {
        location.href = '/'
        window.alert(error)        
        return
    } 

    window.alert(welcome)
    

})