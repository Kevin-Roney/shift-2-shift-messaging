import { formatDate } from './date-utils.js';
import { decrementRating, incrementRating } from './fetch-utils.js';
import { fetchAndDisplay } from '../employee/employee.js';

export function renderMessages(profiles) {
    const messagesEl = document.createElement('div');
    const messagesHeader = document.createElement('h3');

    messagesHeader.textContent = `Leave a Message for ${profiles.email}`;
    messagesEl.classList.add('messages');
    messagesEl.append(messagesHeader);

    for (let message of profiles.messages) {
        const messageEl = document.createElement('p');
        const fromContainer = document.createElement('p');
        const fromEl = document.createElement('p');
        const atEl = document.createElement('p');
        const textEl = document.createElement('p');
        const imgEl = document.createElement('img');

        fromEl.textContent = `${message.from_email}`;
        atEl.textContent = formatDate(message.created_at);
        textEl.textContent = message.text;
        imgEl.src = message.image_url;

        fromEl.classList.add('from');
        textEl.classList.add('text');
        atEl.classList.add('at');
        messageEl.classList.add('message');

        fromContainer.append(fromEl, atEl);
        messageEl.append(fromContainer, textEl, imgEl);
        messagesEl.append(messageEl);
    }
    return messagesEl;
}

export function renderRating(profile) {
    const pTag = document.createElement('p');
    const downButton = document.createElement('button');
    const upButton = document.createElement('button');
    const profileRatingEl = document.createElement('div');

    profileRatingEl.classList.add('profile-rating');
    profileRatingEl.append(pTag, upButton, downButton);

    downButton.textContent = '🤬';
    upButton.textContent = '😇';
    pTag.classList.add('profile-name');
    pTag.textContent = `${profile.email} has ${profile.karma}🤑`;

    downButton.addEventListener('click', async () => {
        await decrementRating(profile.id);
        await fetchAndDisplay();
    });
    upButton.addEventListener('click', async () => {
        await incrementRating(profile.id);
        await fetchAndDisplay();
    });

    return profileRatingEl;
}