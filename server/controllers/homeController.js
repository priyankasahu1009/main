

const homeController= (req, res) => {
  if (req.email) {
    // If user is authenticated, render the home page with username
    return res.status(200).json({ Status: "Success", email: req.email });
  } else {
    // If user is not authenticated, return an error message
    return res.status(401).json({ Error: "Unauthorized 401" });
  }
};

export default homeController;
