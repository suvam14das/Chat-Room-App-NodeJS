users = [] 

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room}) => {

    // Clean data
    username = username.trim().toLowerCase() 
    room = room.trim().toLowerCase() 

    // Validate input 
    if(!username || !room) 
    return {
        error: "Username and room required !" 
    }
    
    // Check existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username  
    }) 
    if(existingUser) 
        return {
            error: "Username already exists !"
        }
    
    // Adding users 
    const user = {id, username, room}
    users.push(user) 
    return {user} 
    
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index>=0) 
        return users.splice(index, 1)[0]  
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id) 
    return user
}

const getUsersInRoom = (room) => {
    
    room = room.trim().toLowerCase() 
    const usersinroom = users.filter((user) => user.room === room) 
    return usersinroom 
}

module.exports = { 
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
}