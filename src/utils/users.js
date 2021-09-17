const users = [];

// addUser 
const addUser = ({ id, username, room }) => {
    // Clean the data 
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    });
    
    // Validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    return { user }
}




const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    
    // const user = users.find(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    };
    
    return {
        error: 'Something goes wrong'
    };
};

// const removedUser = removeUser(22);


const getUser = (id) => {
    const user = users.find(el => el.id === id);
    if(!user) {
        return {
            error: 'User not exist.'
        }
    }
    
    return user;
};

const user = getUser(37);



const getUsersInRoom = (room) => {
    const usersInRoom = users.filter(user => user.room === room);
    if(!usersInRoom.length) {
        return {
            message: 'Room is not exist..'
        }
    }

    return usersInRoom
}

const usersInRoom = getUsersInRoom('North phillaay');

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}