// controllers/logoutController.js
const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ Status: "success" });
  };
  
  export default logout;
  