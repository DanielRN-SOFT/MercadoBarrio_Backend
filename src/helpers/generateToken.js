  /*
  @desc Libreria para la generacion del token, ademas de la cookie http only del lado del servidor
  */
  import jwt from "jsonwebtoken";

  const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // el JWT como una  HTTP-Only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Previene ataques CSRF
      maxAge: 4 * 60 * 60 * 1000, // 4 horas 
    });
  };

  export default generateToken;   
