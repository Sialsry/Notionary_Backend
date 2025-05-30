exports.getCookie = (req, res, next) => {
  try {
    const { login_access_token } = req.cookies;
    // console.log("쿠키에서 가져온 토큰:", login_access_token);
    const { properties } = login_access_token;
    console.log("쿠키에서 가져온 properties:", properties);
    next();
  } catch (error) {
    console.log(error, " 쿠키 미들웨어 에러");
  }
};
