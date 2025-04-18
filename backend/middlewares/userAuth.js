import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, Login again" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log("Decoded token:", decoded) // Debugging

    // Validate token context: IP and User-Agent
    const userAgent = req.headers["user-agent"]
    const userIp = req.ip

    if (decoded.id && decoded.ip === userIp && decoded.userAgent === userAgent) {
      req.userId = decoded.id
      next()
    } else {
      return res.status(401).json({ message: "Unauthorized, context mismatch detected" })
    }
  } catch (error) {
    console.error("Error verifying token:", error) // Debugging
    return res.status(401).json({ message: "Invalid token" })
  }
}

export default userAuth;

