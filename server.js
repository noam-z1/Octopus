const Hapi = require('@hapi/hapi');
const uuid = require('uuid');

let users;

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
        path: '/users',
        handler: (req, res) => {
            return res.response(users).code(400);
        }
})

server.route({
    method: 'GET',
        path: '/users/{id}',
        handler: (req, res) => {
            const id = req.params.id
            console.log(id);
            const getIndex = users => users.id === id;
            const index = users.findIndex(getIndex);
            if (index == -1){
                return res.response("Id not found").code(400);
            }
            return res.response(users[index]).code(200);
        }
})

server.route({
    method: 'POST',
        path: '/users',
        handler: (req, res) => {
            const id = uuid.v1();
            const data = req.payload;
            if (!data){
                return res.response("Please enter user data").code(400);
            }
            if (!(data.name && data.team)){
                return res.response("Missing data").code(400);
            }
            let user = {id:id,name:data.name, team: data.team}
            users.push(user);
            return res.response(user).code(200);
        }
})


const init = async () => {

    users = [];

    await server.start();
    console.log('Server running!');
};

init();

