import express from "express"
import { deleteProduct,productController,getProduct,getProductById,updateProduct } from "../Controllers/productcontroller.js";
import categoryControll from "../Controllers/categorycontroller.js";
import upload from "../Middlewares/filemiddleware.js";
import addToCart from "../Controllers/cartcontroller.js"
import { getUser, getUserById, loginWithPhone, sendOtp, updateUserProfile, verifyOtp } from "../Controllers/UserController.js";
import { placeOrder } from "../Controllers/BookingController.js";
import { authenticateToken } from "../Middlewares/jwtauthentication.js";
import { uploads } from "../Middlewares/MulterS3.js";
import { SaveLocation , Map } from "../Controllers/MapController.js";





const router = express.Router();




router.post("/product",upload.single("image"), productController);
router.delete("/product",upload.single("image"), deleteProduct);
router.get("/product",getProduct)
router.get("/product/:id",getProductById)
router.put("/product",upload.single("image"),updateProduct)



router.post("/category", uploads.single("image"), categoryControll);




router.post("/cart",addToCart)
router.post("/order",placeOrder)



router.post("/generateOtp",sendOtp)
router.post("/verify",authenticateToken,verifyOtp)
router.put("/updateUser",upload.array("images", 5),updateUserProfile)
router.post("/login",loginWithPhone)

router.get("/user/:id",getUserById)
router.get("/user",getUser)

router.post("/save-location",SaveLocation)
router.get("/map",Map)


export default router;