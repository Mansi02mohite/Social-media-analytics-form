const clientId = '7cMg7tN-vvzoQUb9_NeG3w';
const clientSecret = 'A1_n9lDGqP_uJvAucihRtPnDzyjiqw';
const base64Encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
console.log(base64Encoded);
