const generateMessage = (text, username) => {

    return {
        text, 
        username,
        createdAt : new Date().getTime() 
    }
}

const generateLocationMessage = (position, username) => {
    return {
        url : 'https://google.com/maps?q='+position.latitude+','+position.longitude, 
        createdAt :  new Date().getTime(), 
        username 
    }
}

module.exports = {
    generateMessage, 
    generateLocationMessage
}