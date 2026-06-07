import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/Issues/issues.route";
import cors from "cors";

// Built-in middleware
const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:30000", // Replace with your frontend URL
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Issue Tracker API");
});

app.use("/api/auth", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

app.use(globalErrorHandler);

export default app;
