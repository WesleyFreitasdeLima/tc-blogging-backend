import app from "./app.js";
import { env } from "./env/index.js";

const PORT = env.API_PORT;

app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
