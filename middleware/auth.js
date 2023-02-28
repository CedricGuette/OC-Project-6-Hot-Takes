const jwt = require('jsonwebtoken')

// Using jsonwebtoken to verify athentification session with a token
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]
       const decodedToken = jwt.verify(token, '^Nc##iz33!HftR#S7#hj9058$6jOyZ')
       const userId = decodedToken.userId
       req.auth = {
           userId: userId
       }
	next()
   } catch(error) {
       res.status(401).json({ error })
   }
}
