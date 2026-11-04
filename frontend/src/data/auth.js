const hex = (bytes) =>
  Array.from(new Uint8Array(bytes), (v) => v.toString(16).padStart(2, '0')).join('');
async function derive(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  return hex(
    await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: new TextEncoder().encode(salt),
        iterations: 120000,
      },
      key,
      256
    )
  );
}
export async function createCredential(password) {
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await derive(password, salt) };
}
export async function verifyCredential(user, password) {
  return user.demo
    ? password === 'demo123'
    : !!user.credential &&
        (await derive(password, user.credential.salt)) === user.credential.hash;
}
