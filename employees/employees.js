import { checkAuth, getProfiles, logout } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    logout();
});

const employeeListEl = document.querySelector('.employee-list');

window.addEventListener('load', async () => {
    const profiles = await getProfiles();

    for (let profile of profiles) {
        const div = document.createElement('div');
        const pRating = document.createElement('p');
        const anchorEmail = document.createElement('a');

        div.classList.add('employee-list-item');
        anchorEmail.classList.add('employee-link');
        pRating.classList.add('performance-rating');

        pRating.textContent = `🤑${profile.karma}`;
        anchorEmail.textContent = `${profile.email}`;
        //Once we create employee file, dont forget to lin
        anchorEmail.href = `../employee/?id=${profile.id}`;
        //disable-eslint-next-line
        div.append(anchorEmail, pRating);

        employeeListEl.append(div);
    }
});