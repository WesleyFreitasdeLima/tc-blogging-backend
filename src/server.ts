const PORT = parseInt(`${env.API_PORT || 3000}`);

import app from "./app.js";
import { env } from "./env/index.js";

app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
