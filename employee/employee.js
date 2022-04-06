import { makeImageUrl, uploadImage, getUser, sendMessage, checkAuth, getProfile, incrementRating, decrementRating, logout } from '../fetch-utils.js';

import { renderMessages, renderRating } from '../render-utils.js';

checkAuth();
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const upButton = document.querySelector('.up-vote');
const downButton = document.querySelector('.down-vote');
const return2ProfilesButton = document.getElementById('back-to-profiles');
const profileContainer = document.querySelector('.profile-container');
const usernameHeader = document.querySelector('.username-header');
const usernameEl = document.querySelector('.username');
const form = document.querySelector('form');

const logoutButton = document.getElementById('logout');

window.addEventListener('load', async ()=>{

    await fetchAndDisplay(); //write this!

});

return2ProfilesButton.addEventListener('click', ()=>{
    window.location.href = '../employees';
});

upButton.addEventListener('click', async ()=>{
    const profile = await incrementRating(profile.id);
    await fetchAndDisplay(profile);

});

downButton.addEventListener('click', async ()=>{
    const profile = await decrementRating(profile.id);
    await fetchAndDisplay(profile);
});

export async function fetchAndDisplay(){
    profileContainer.textContent = '';

    const profile = await getProfile(id);
    usernameHeader.textContent = profile.email;
    usernameEl.textContent = profile.email;

    const profileRatingEl = renderRating(profile);
    const messagesEl = renderMessages(profile);

    profileContainer.append(messagesEl, profileRatingEl);

}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const fromUser = await getUser();
    const imageFile = data.get('my-image');
    const uploadedImage = await uploadImage(imageFile);
    const URL = makeImageUrl(uploadedImage.Key);
    await sendMessage({
        text: data.get('text'),
        from_email: fromUser.email,
        recipient_id: id,
        image_url: URL
    });

    form.reset();

    await fetchAndDisplay();

});

logoutButton.addEventListener('click', () => {
    logout();
});