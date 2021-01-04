const Hapi = require('@hapi/hapi');

let users;

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    users = [];

    await server.start();
    console.log('Server running!');
};

init();