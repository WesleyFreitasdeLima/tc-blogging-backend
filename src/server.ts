const PORT = parseInt(`${env.API_PORT || 3000}`);

import app from "./app.js";
import { connectDatabase } from "./database/typeorm.js";
import { env } from "./env/index.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
}

bootstrap();
