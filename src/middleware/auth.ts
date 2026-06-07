import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import config from "../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import pool from "../db";
type ROLE = "contributor" | "maintainer";
const auth = (...roles: ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("This is protected route");
      // console.log(req.headers.authorization);
      const token = req.headers.authorization;
      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      const userData = await pool.query(
        `
        SELECT * FROM users WHERE id = $1
        `,
        [decoded.id],
      );

      if (userData.rows.length === 0) {
        sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User not found!",
        });
      }

      const user = userData.rows[0];
    //   console.log(user);
      if (roles.length > 0 && !roles.includes(user.role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden, You don't have permission with this role!",
        });
      }
      req.user = decoded;

      next();
    } catch (error) {
      //   next(error);
    }
  };
};
export default auth;
