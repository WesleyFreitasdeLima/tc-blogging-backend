import "dotenv/config";

const PORT = parseInt(`${process.env.PORT || 3000}`);

import app from "./app.js";

app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
