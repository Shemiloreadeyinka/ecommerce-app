const jwt= require('jsonwebtoken')

const authentication= (req,res,next)=>{
    const {token}= req.cookies;
    if(!token) res.send('please login to your account')
    jwt.verify(token,process.env.jWT_SECRET,(err,payload)=>{
        if (err)  {console.log('error confirming token'); return res.send('invalid token')}
        req.user={id:payload.id}
        next()
    })

}
module.exports=authentication