const db = require('../database/connector')

module.exports = {
    add,
    find,
    findBy,
    findById,
}

function find(){
    return db('users')
    .join('roles', 'users.role', 'roles.id')
    .select('users.id', 'users.username', 'role.name')
    .orderBy('users.id')
}

function findBy(filter){
    console.log(filter)
    return db('users')
    .join('roles', 'users.role', 'roles.id')
    .where(filter)
    .select('users.id', "users.username", "roles.name", 'users.password')
    .orderBy('users.id')
}

async function add(users){
    try{
        const [id] = await db('users').insert(user, 'id')
        return findById(id)
    }catch(error){
        throw error;
    }
}

function findById(id){
    return db('users').where({id}).first()
}