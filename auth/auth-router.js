const bcryptjs=require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = require('express').Router();

const Users = require('../users/users-model')
const {isValid} = require('../users/users-services')


router.post('/register', (req, res)=>{
    const credentials = req.body;

    if(isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 12;
        const hash = bcryptjs.hashSync(credentials.password, rounds)

        credentials.password = hash;

        Users.add(credentials)
        .then(user =>{
            res.status(201).json({data: user})
        })
        .catch(err =>{
            res.status(500).json({message: error.message})
        })
    }else{
        res.status(400).json({
            message: 'please provide username and password.'
        })
    }
})


router.post('/login', (req, res) =>{
    const {username, password} = req.body;

    if(isValid(req.body)){
        Users.findBy({'users.username': username})
        .then(([user])=>{
            if(user && bcryptjs.compareSync(password, user.password)){
                const token = createToken(user);
                res.status(200).json({message: 'welcome to the forbidden zone yee scoundrel!', token})
            }else{
                res.status(401).json({message: 'Invalid credentials'})
            }
        })
    }
})

function createToken(user){
    const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
    }
    const secret = process.env.JWT || '12345ab67cndaewqeodkcnbwodukc.a;sldjifqpriotuwoeirput207498'

    const options = {
        expiresIn: '4h'
    }
    return jwt.sign(payload, secret, options)
}

module.exports = router;