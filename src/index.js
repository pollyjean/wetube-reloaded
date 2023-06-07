import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./app";

const PORT = 4000;
const handleListen = () => console.log(`server listening.. on a next level http://localhost:${PORT}`);

app.listen(PORT, handleListen);
