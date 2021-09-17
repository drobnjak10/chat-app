const socket = io();

// Elements
const $messageForm = document.querySelector('#form');
const $messageFormInput = document.querySelector('#msg');
const $messageFormBtn = document.querySelector('#btn');
const $locationBtn = document.querySelector('#locationBtn');
const $messages = document.querySelector('#messages');

// Templates 
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#users-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const autoscroll = () => {
    const $newMessage = $messages.lastElementChild;

    // Height of the last message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight
    
    // Height of message container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
};

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        msg: message.text, 
        createdAt:moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML( 'beforeend', html )
    autoscroll();
})

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        url: location.url, 
        createdAt: moment(location.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // disable form

    $messageFormBtn.setAttribute('disabled', 'disabled');

    // const message = e.target.elements.message.value
    
    socket.emit('sendMessage', $messageFormInput.value, (error) => {
        // enable
        $messageFormBtn.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error) {
            return console.log(error);
        }

        console.log('Message was delivered!');
    });
})



$locationBtn.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    $locationBtn.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            if(error) {
                return console.log(error)
            }
            $locationBtn.removeAttribute('disabled');
            console.log('Location shared!');
        });
    })


})

socket.on('roomData', ({room, users}) => {
    console.log(room)
    console.log(users)

    const html = Mustache.render(sidebarTemplate, {
        room,
        users, 
    });
    document.querySelector('#sidebar').innerHTML = html;
})

socket.emit('join', { username, room }, ( error ) => {
    if (error) {
        alert(error);
        location.href = '/';
    }

})