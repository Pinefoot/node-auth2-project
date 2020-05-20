const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = require('express').Router();

const Users = require('../users/users-model')
const {isValid} = require('../users/users-services')


router.post('/register', (req, res)=>{
    const credentials = req.body;

    if(isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcryptjs.hashSync(credentials.password, rounds)

        credentials.password = hash;

        Users.add(credentials)
        .then(user =>{
            res.status(201).json({data: user})
        })
        .catch(err =>{
            res.status(500).json({message: err.message})
        })
    }else{
        res.status(400).json({
            message: 'please provide username, password, and department.'
        })
    }
})


router.post('/login', (req, res) =>{
    const {username, password} = req.body;

    if(isValid(req.body)){
        Users.findBy({username})
        .then(([user])=>{
            console.log('COMING FROM IF FROM FINDBY', user)
            if (user && bcryptjs.compareSync(password, user.password)){
                const token = createToken(user);
                res.status(200).json({message: 'welcome to the forbidden zone yee scoundrel!', token})
            }else{
                res.status(401).json({message: 'Invalid credentials'})
            }
        })
        .catch(error =>{
            res.status(500).json({message: error.message})
            console.log('this is the error you want', error)
        })
    }else{
        res.status(400).json({
            message: "please provide username and password!"
        })
    }
})

function createToken(user){
    const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
    }
    const secret = process.env.JWT_SECRET || 'fakepasswordisfakebecauseitisfake'

    const options = {
        expiresIn: '4h'
    }
    return jwt.sign(payload, secret, options)
}

module.exports = router;