import Http from "http";
import config from "./app/config/var/development";
import app from "./app/app";


export const server = Http.createServer(app);
export async function initServer() {
	server.listen(config.port, () => {
    console.log(`
              \n\n
              --------------------------------
              --------------------------------
    
              Finance App:
    
              Status: OK
              Port: ${config.port}
    
              --------------------------------
              -------------------------------- 
              \n\n`);
  });
}

if (process.env.NODE_ENV !== "test") {
  initServer();
}
