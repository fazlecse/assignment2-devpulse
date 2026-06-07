import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const creteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// const getAllUsers = async (req: Request, res: Response) => {
//   const result = await userService.getAllUsersFromDB();
//   try {
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Users retrieved successfully",
//       data: result.rows,
//     });
//   } catch (error: any) {
//     sendResponse(res, {
//       statusCode: 500,
//       success: false,
//       message: error.message,
//       error: error,
//     });
//   }
// };
export const userController = {
  creteUser,
  //   getAllUsers,
};
