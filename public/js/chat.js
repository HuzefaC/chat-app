const socket = io();

// HTML Elements
const $form = document.querySelector('form');
const $input = document.querySelector('#message-input');
const $btnForm = document.querySelector('#btn-message');
const $btnLocation = document.querySelector('#btn-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Query String
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  $newMessage.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });
};

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  $sidebar.innerHTML = html;
});

// Send Message Event
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  $btnForm.setAttribute('disabled', 'disabled');
  const message = $input.value;
  if (!message) return;
  socket.emit('sendMessage', message, (error) => {
    $btnForm.removeAttribute('disabled');
    $input.value = '';
    $input.focus();
    if (error) return console.log(error);
  });
});

// Send Location Event
$btnLocation.addEventListener('click', (e) => {
  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.');

  $btnLocation.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      socket.emit(
        'sendLocation',
        {
          latitude,
          longitude,
        },
        (error) => {
          $btnLocation.removeAttribute('disabled');
          if (error) return console.log(error);
        }
      );
    },
    undefined,
    { enableHighAccuracy: true }
  );
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
