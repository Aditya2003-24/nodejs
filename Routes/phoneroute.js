import express from "express"
// import {deleteNumber, getNumber, getNumbertById, numcontroller, updateNumber, verifyOtpController, updateUser,getUsers,createProfileController} from "../Controllers/numbercontroller.js"; 
import { deleteProduct,productController,getProduct,getProductById,updateProduct } from "../Controllers/productcontroller.js";
import categoryControll from "../Controllers/categorycontroller.js";
import upload from "../Middlewares/filemiddleware.js";
import addToCart from "../Controllers/cartcontroller.js"
import { getUser, getUserById, loginWithPhone, sendOtp, updateUserProfile, verifyOtp } from "../Controllers/UserController.js";
import { placeOrder } from "../Controllers/BookingController.js";





const router = express.Router();

// router.post("/phone", numcontroller); 
// // router.post("/verify", verifyOtpController);
// router.get("/phone",getNumber)
// router.get("/phone/:id",getNumbertById)
// router.put("/phone",updateNumber)
// router.delete("/phone",deleteNumber)


router.post("/product",upload.single("image"), productController);
router.delete("/product",upload.single("image"), deleteProduct);
router.get("/product",getProduct)
router.get("/product/:id",getProductById)
router.put("/product",upload.single("image"),updateProduct)



router.post("/category", upload.single("image"), categoryControll);


// router.post("/profile", upload.single("image"), createProfileController);
// router.get("/profile",getUsers)
// router.get("/profile/:id",getUserById)
// router.put("/profile/:id", upload.single("image"), updateUser);

router.post("/cart",addToCart)
router.post("/order",placeOrder)



router.post("/generateOtp",sendOtp)
router.post("/verify",verifyOtp)
router.put("/updateUser",upload.single("image"),updateUserProfile)
router.post("/login",loginWithPhone)

router.get("/user/:id",getUserById)
router.get("/user",getUser)


export default router;