const router = require("express").Router();
const axios = require("axios");
// const {musicController} =require('../controllers');
// router.get("/", async (req, res) => {});

router.get("/unlink", async (req, res) => {
  try {
    // console.log(req.cookies, "req.cookies");
    const access_token = req.cookies.kakao_access_token;
    await axios.post(
      "https://kapi.kakao.com/v1/user/unlink",
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    res.clearCookie("login_access_token");
    res.clearCookie("kakao_access_token");
    res.redirect("http://localhost:3000");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = router;
