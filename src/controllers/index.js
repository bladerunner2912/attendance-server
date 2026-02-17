import model from "../models/index.js";

class BaseController {
    async pong(req, res) {
        const data = await model.pong();
        if (!data) {
            throw new Error("Error in model");
        }
        return res.status(200).json(data);
    }
}

export default new BaseController();
