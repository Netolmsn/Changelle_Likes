const axios = require('axios');

const POST_ID = "d9967509-cf64-4050-8b99-523235cc2b28";
const URL = `http://localhost:3001/posts/${POST_ID}/like`;

async function runStressTest() {
    console.log(`Simulando 100 usuários diferentes curtindo o post...`);
    const promises = [];

    for (let i = 0; i < 100; i++) {
        promises.push(axios.post(URL, { userId: `user_unique_${i}` }));
    }

    const results = await Promise.allSettled(promises);
    const success = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Requests aceitas pela API: ${success}`);
    console.log(`Verifique o terminal do NestJS para o processamento da fila...`);
}

runStressTest();