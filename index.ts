import express, {Request, Response} from "express";
const app = express();


app.get('/', (req:Request, res:Response) => {
    res.send("Welcome to my API. Browse documentation on http://localhost/8080")
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');  
});
