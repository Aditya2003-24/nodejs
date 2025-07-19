import express from "express"
import numcontroller from "../Controllers/numbercontroller.js"; 
import verifyOtpController from "../Controllers/verifycontroller.js";
import { deleteProduct,productController,getProduct,getProductById,updateProduct } from "../Controllers/productcontroller.js";
import categoryControll from "../Controllers/categorycontroller.js";
import upload from "../Middlewares/filemiddleware.js";
import  { getUserById, updateUser,getUsers,createProfileController } from "../Controllers/profilecontroller.js";
import addToCart from "../Controllers/cartcontroller.js"




const router = express.Router();

router.post("/phone", numcontroller); 
router.post("/verify", verifyOtpController);


router.post("/product",upload.single("image"), productController);
router.delete("/product/:id",upload.single("image"), deleteProduct);
router.get("/product",getProduct)
router.get("/product/:id",getProductById)
router.put("/product/:id",upload.single("image"),updateProduct)



router.post("/category", upload.single("image"), categoryControll);


router.post("/profile", upload.single("image"), createProfileController);
router.get("/profile",getUsers)
router.get("/profile/:id",getUserById)
router.put("/profile/:id", upload.single("image"), updateUser);

router.post("/cart",addToCart)




export default router;