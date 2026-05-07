import JD from "../controllers/jd.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAuthenticated, JD.store);
router.route("/:id").get(isAuthenticated, JD.get).delete(isAuthenticated, JD.delete);
router.route("/parse/:id").post(isAuthenticated, JD.parse);

export default router;