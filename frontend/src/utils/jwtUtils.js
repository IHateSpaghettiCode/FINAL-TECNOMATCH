export const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '=='.slice(0, (4 - base64.length % 4) % 4);
  return JSON.parse(atob(padded));
};

console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Cargada ✅" : "No cargada ❌");
