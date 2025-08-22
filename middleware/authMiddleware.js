const jwt= require('jsonwebtoken')

const authentication= (req,res,next)=>{
    const {token}= req.cookies;
    try {
        if(!token) return res.status(401).json({ message: 'please login to your account' })
        if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT secret not set' });

    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if (err)  {console.log('error confirming token'); return res.status(401).json({ message: 'invalid token' }) }
        req.user={id:payload.id}
        next()
    })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }


}
module.exports=authentication