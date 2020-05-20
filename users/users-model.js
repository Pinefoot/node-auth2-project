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
    .select('users.id', 'users.username', 'roles.name')
    .orderBy('users.id')
    // .where()
}

function findBy(filter){
    console.log('FILLLLLLLLLLLLLLLLLLTER',filter)
    return db('users')
    //.join('roles', 'users.role', 'roles.id')
    
    //.select('users.id', "users.username", "roles.name", 'users.password')
    .where('users.username', filter.username)
    //.orderBy('users.id')
}

async function add(user){
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