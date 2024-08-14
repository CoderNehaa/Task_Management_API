import express, {Request, Response} from "express";
const app = express();

app.get('/', (req:Request, res:Response) => {
    res.json("Welcome to my API. Browse documentation on http://localhost/8001/api")
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');  
});

