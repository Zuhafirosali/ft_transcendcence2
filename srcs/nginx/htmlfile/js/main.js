function createPingPongBall() {
    const ball = document.createElement('div');
    ball.classList.add('idx-ping-pong-ball');
    document.body.appendChild(ball);

    const startX = Math.random() * window.innerWidth;
    const endX = Math.random() * window.innerWidth;
    const duration = Math.random() * 3000 + 2000;

    ball.style.left = `${startX}px`;
    ball.style.top = '-20px';

    ball.animate([
        { transform: `translate(0, -20px)` },
        { transform: `translate(${endX - startX}px, ${window.innerHeight + 20}px)` }
    ], {
        duration: duration,
        iterations: Infinity,
        delay: Math.random() * 2000
    });
}

for (let i = 0; i < 6; i++) {
    createPingPongBall();
}


// New section for handling About Team Popup
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('about-team-popup');
    const popupContent = document.querySelector('.popup-about-team-content');

    // Event listener for opening the popup
    document.querySelector('.about-team').addEventListener('click', function(event) {
        event.preventDefault();
        popup.style.display = 'flex';
    });

    // Event listener for closing the popup when clicking the cross button
    document.querySelector('.close-btn').addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Event listener for closing the popup when clicking outside of the popup content
    popup.addEventListener('click', function(event) {
        if (!popupContent.contains(event.target)) {  // Check if the click is outside the content area
            popup.style.display = 'none';
        }
    });
});


async function initWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already open.');
        return;
    }
    token = getCookie('access_token')
    if(!token) {
        console.log('User is not logged in, WebSocket connection not established.');
        return;
    }

    ws = new WebSocket(`${window.location.origin.replace(/^http/, 'ws')}/ws/friend-list/?token=${getCookie('access_token')}`);
    ws.onopen = function(event) {
        console.log('WebSocket connection opened.');
    };

    ws.onmessage = async function(event) {
        const data = JSON.parse(event.data);
        if(data['type'] == 'activity'){
            const friend = {
                'username': data['user'],
                'photo': data['photo'],
                'status': data['status'],
                'room_name': data['room_name'],
                'blocked': data['blocked'],
                'who_blocked': data['who_blocked']
            }
            friends.push(friend);
            populateFriendList(friend);
        }
        else if (data['type'] == 'friend_status'){
            const statusDiv = document.getElementById('status.' + data['username']);
            const newStatus = data['status']
            if (statusDiv) {
                statusDiv.className = newStatus === 'ON' ? 'chat-friend-status ON' : 'chat-friend-status OF';
            }
        }
        else if(data['type'] == 'request_list'){
            pendingRequests = []
            const friend = {
                'username': data['user'],
                'photo': data['photo']
            }
            pendingRequests.push(friend);
            addFriendRequest(friend);
        }
        else if(data['type'] == 'friend_request_response'){
            if(data['Response'] == 'accepted'){
                ws.send(JSON.stringify({
                    'type' : 'list_request',
                }));
            }
            ws.send(JSON.stringify({
                'type' : 'friend_request_list',
            }));
        }
        else if(data['type'] == 'error')
        {
            console.log("Message : ", data['message']);
        }
        else if(data['type'] == 'block' || data['type'] == 'unblock'){
            const div_name = '.chat-friend.' + data['message'];
            const friendDivs = document.querySelector(div_name);
            friends = friends.filter(friend => friend.username !== data['message']);
            friendDivs.remove();
            await sendListRequest();
        }
        else if(data['type'] == 'new_tournament'){
            if(chat_ws && chat_ws.readyState === WebSocket.OPEN){
                chat_ws.send(JSON.stringify({
                    'type': data['type'],
                    'chat_room': 'global-chat',
                    'message': 'Created tournament ' + data['tournament_name'] + '. Creator: ' + data['creator_alias'],
                }))
            }
        }
    };

    ws.onclose = function(event) {
        console.log('WebSocket connection closed.');
    };

    ws.onerror = function(event) {
        console.error('WebSocket error:', event);
    };
}

function closeWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
}
