/* eslint-disable no-console */
/* eslint-disable quotes */
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra3ViZGVpanZybnRkbXVucWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc1NTM1MTcsImV4cCI6MTk2MzEyOTUxN30.qE-NCGctQQqftyEJnJ49hNdOGf4jDNo61YYMlpDAr2g';
const SUPABASE_URL = 'https://wkkubdeijvrntdmunqer.supabase.co';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


export async function uploadImage(myImageFile) {
    const response = await client
        .storage
        .from('my-message-images')
        .upload(myImageFile.name, myImageFile, {
            cacheControl: '3600',
            upsert: false
        });
    return checkError(response);
}

export function makeImageUrl(imageKey) {
    return `${SUPABASE_URL}/storage/v1/object/public/${imageKey}`;
}


export async function getProfiles() {
    const response = await client
        .from('profiles')
        .select();

    return checkError(response);
}

export async function getProfile(id) {
    const response = await client
        .from('profiles')
        .select('*, messages (*)')
        .match({ id })
        .single();

    return checkError(response);
}

export async function createProfile(email) {
    const response = await client
        .from('profiles')
        .insert({ email });

    return checkError(response);
}

export async function getMyProfile() {
    const user = getUser();
    const response = await client
        .from('profiles')
        .select()
        .match({ email: user.email })
        .single();

    return checkError(response);
}

export async function sendMessage(message) {
    const response = await client
        .from('messages')
        .insert(message);

    return checkError(response);
}

export async function getMessagesByRecipient(id) {
    const response = await client
        .from('messages')
        .select('*, profiles:from_email (*)')
        .match({ recipient_id: id });

    return checkError(response);
}

export async function incrementRating(id) {
    const profile = await getProfile(id);
    const response = await client
        .from('profiles')
        .update({ karma: profile.karma + 1 })
        .match({ id })
        .select();

    return checkError(response);
}

export async function decrementRating(id) {
    const profile = await getProfile(id);
    const response = await client
        .from('profiles')
        .update({ karma: profile.karma - 1 })
        .match({ id })
        .select();

    return checkError(response);
}

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./employees');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });
    await createProfile(email);
    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
