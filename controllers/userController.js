const User = require("../models/User");
const CriptoJS = require("crypto-js");

const encPass = (password) => {
  return CriptoJS.AES.encrypt(
    password,
    process.env.PASSWORD_SECRET_KEY
  ).toString();
};

const userController = {
  changeAvatar: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        avatar: req.body.image,
      });
      if (!user) return res.status(400).json("Không tìm thấy người dùng");
      return res
        .status(200)
        .json({ message: "Cập nhật ảnh đại diện thành công" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).json("Không tìm thấy người dùng");

      const { username, email, phone } = req.body;

      // Check if username exists
      const existingUsername = await User.findOne({ username });
      if (
        existingUsername &&
        existingUsername._id.toString() !== req.params.id
      ) {
        return res.status(400).json({
          errors: [
            {
              path: "username",
              msg: "Tên người dùng đã được sử dụng",
            },
          ],
        });
      }

      // Check if phone number exists
      const existingPhone = await User.findOne({ phone });
      if (existingPhone && existingPhone._id.toString() !== req.params.id) {
        return res.status(400).json({
          errors: [
            {
              path: "phone",
              msg: "Số điện thoại đã được sử dụng",
            },
          ],
        });
      }

      // Check if email exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== req.params.id) {
        return res.status(400).json({
          errors: [
            {
              path: "email",
              msg: "Email đã được sử dụng",
            },
          ],
        });
      }

      if (req.body.password) {
        if (req.body.password.length < 8 || req.body.password.length > 50) {
          return res.status(400).json({
            errors: [
              {
                path: "password",
                msg: "Mật khẩu yêu cầu tối thiểu 8 ký tự",
              },
            ],
          });
        }
        req.body.password = encPass(req.body.password);
      } else {
        req.body.password = user.password;
      }
      const updateUser = await User.findByIdAndUpdate(user._id, req.body, {
        new: true,
      });
      return res.status(200).json(updateUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(400).json("User not found");
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findOneAndDelete(req.params.id, {
        avatar: req.body.image,
      });
      if (!user) return res.status(400).json("Không tìm thấy người dùng");
      return res.status(200).json({ message: "Đã xóa thành công người dùng" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = userController;
