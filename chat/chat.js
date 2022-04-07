import { checkAuth, sendChat, client, getUser } from '../fetch-utils.js';
checkAuth();

const allChatsEl = document.querySelector('.all-chats');
const formEl = document.querySelector('form');
const currentUser = getUser();
formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(formEl);

    await sendChat({
        text: data.get('message'),
        sender_email: currentUser.email,
        user_id: currentUser.id,
        profile_id: 
    });
});

window.addEventListener('load', async () => {
    const currentUser = await getUser();
    await client
        .from('chats')
        .on('INSERT', (payload) => {
            const chatItemOuterEl = document.createElement('div');
            const chatMessageEl = document.createElement('p');
            const chatSenderEl = document.createElement('p');
            chatSenderEl.addEventListener('click', () => {
                window.location.href = `${currentUser.id}`;
            });
            chatSenderEl.classList.add('sender');
            
            if (payload.new.sender_email === currentUser.email) {
                chatSenderEl.classList.add('is-me');
            }
            chatItemOuterEl.classList.add('chat-message');
            chatSenderEl.textContent = payload.new.sender_email;
            chatMessageEl.textContent = payload.new.text;
            chatItemOuterEl.append(chatMessageEl, chatSenderEl);
            allChatsEl.append(chatItemOuterEl);
        })
        .subscribe();
});