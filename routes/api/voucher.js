const { body } = require("express-validator");
const voucherController = require("../../controllers/voucherController");
const validation = require("../../handlers/validationHandler");
const Voucher = require("../../models/Voucher");
const adminMiddleware = require("../../middlewares/adminMiddleware");

const router = require("express").Router();

router.get("/", voucherController.gets);
router.get("/:voucher", voucherController.get);
router.post(
  "/",
  adminMiddleware,
  body("voucher")
    .isLength({ min: 4 })
    .withMessage("Mã giảm giá yêu cầu tối thiểu là 4 kí tự"),

  body("voucher").isLength({ max: 10 }).withMessage("Mã giảm giá quá dài"),
  body("voucher").custom(async (voucher) => {
    const rs = await Voucher.findOne({ voucher });
    if (rs) {
      throw new Error("Mã giảm giá đã tồn tại");
    }
  }),
  validation,
  voucherController.create
);
router.put("/:id", adminMiddleware, voucherController.update);
router.patch("/:id", adminMiddleware, voucherController.delete);

module.exports = router;
