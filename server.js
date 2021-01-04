const Hapi = require('@hapi/hapi');
const uuid = require('uuid');

let users;
const PASSWORD = "octopus";

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
        path: '/users/:id',
        handler: (req, res) => {
            const id = req.params.id;
            const index = getUserByID(id);
            if (index == -1){
                return res.response("Id not found").code(400);
            }
            return res.response(users[index]).code(200);
        }
})

server.route({
    method: 'GET',
        path: '/users/team/{team}',
        handler: (req, res) => {
            
            const team = req.params.team;
            const team_users = users.filter((user) => {return user.team == team});
            if (team_users.length == 0){
                return res.response("No users found in the team").code(400);
            }
            return res.response(team_users).code(200);
        }
})

server.route({
    method: 'POST',
        path: '/users',
        handler: (req, res) => {
            const password = req.headers.password;
            if (password === null || password != PASSWORD){
                return res.response("Authentication error").code(401);
            }
            const id = uuid.v1();
            const data = req.payload;
            if (!data){
                return res.response("Please enter user data").code(400);
            }
            if (!(data.name && data.team)){
                return res.response("Missing data").code(400);
            }
            const user = {id:id,name:data.name, team: data.team}
            users.push(user);
            return res.response(user).code(200);
        }
})

server.route({
    method: 'PUT',
        path: '/users/{id}',
        handler: (req, res) => {
            const password = req.headers.password;
            if (password === null || password != PASSWORD){
                return res.response("Authentication error").code(401);
            }
            const id = req.params.id;
            const index = getUserByID(id);
            if (index == -1){
                return res.response("No user with selected id").code(400);
            }
            const data = req.payload;
            if (!(data.name && data.team)){
                return res.response("Missing data").code(400);
            }
            deleteUser(id);
            const user = {id:id,name:data.name, team: data.team}
            users.push(user);
            return res.response(user).code(200);
        }
})

server.route({
    method: 'DELETE',
        path: '/users/{id}',
        handler: (req, res) => {
            const password = req.headers.password;
            if (password === null || password != PASSWORD){
                return res.response("Authentication error").code(401);
            }
            const id = req.params.id;
            const index = getUserByID(id);
            if (index == -1){
                return res.response("No user with selected id").code(400);
            }
            deleteUser(id);
            return res.response("User "+ id +" deleted from the system").code(200);
        }
})


const init = async () => {

    users = [];

    await server.start();
    console.log('Server running!');
};

function getUserByID(id){
    const getIndex = users => users.id === id;
    return users.findIndex(getIndex);
}

function deleteUser(id){
    users.splice(id, 1);
}

init();

