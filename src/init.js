import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./app";

const PORT = process.env.PORT || 4000;
const handleListen = () => console.log(`server listening... Port : ${PORT}`);

app.listen(PORT, handleListen);
