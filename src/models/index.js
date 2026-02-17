import db from "../services/db/index.js";

class Base {

    async pong() {
        return await db.query("select * from users;");
    }

}

export default new Base();

