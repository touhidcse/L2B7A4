import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";



const PORT = config.port;
async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to database successfully");
        console.log(config.stripe_product_price_id);
        console.log(config.stripe_secret_key.slice(0, 20));

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Error starting the server", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();