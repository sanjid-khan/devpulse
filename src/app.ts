import express, { 
    type Application,
    type Request,
    type Response 
} from "express";


import logger from "./middleware/logger";
import cookieParser from "cookie-parser";
import cors from  "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issues/issues.route";

const app : Application = express()

app.use(
    cors({ 
    origin: 'http://localhost:3000',
    credentials:true
    })
);



app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended:true}));
app.use(logger);



app.get('/', (req: Request, res: Response)=>{

   res.status(200).json({
        "message" : "DevPulse API is running",
        "author": "Next Level"
     })
})


app.use("/api/auth",authRoute);
app.use("/api/issues",issueRoute);


app.use(globalErrorHandler);

export default app;