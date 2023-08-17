const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

const orderController = {
  gets: async (req, res) => {
    const { userId } = req.params;
    try {
      const orders = await Order.findOne({ "user._id": userId });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  create: async (req, res) => {
    const { userId } = req.params;
    const { order, user } = req.body;
    try {
      let newOrder;
      const checkOrder = await Order.findOne({ "user._id": userId });
      if (!checkOrder) {
        newOrder = await Order.create({
          user,
          orders: [order],
        });
      } else {
        newOrder = await Order.findOneAndUpdate(
          { "user._id": userId },
          {
            $push: {
              orders: order,
            },
          },
          { new: true }
        );
      }
      await Cart.findOneAndDelete({ user: userId });

      const newOrderInfo = newOrder.orders[newOrder.orders.length - 1];

      return res.status(201).json(newOrderInfo);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updateStatusOfOrder: async (req, res) => {
    const { userId, orderId } = req.params;
    const { status } = req.body;
    try {
      await Order.findOneAndUpdate(
        {
          "user._id": userId,
          "orders._id": orderId,
        },
        { status }
      );
      return res.status(200).json({ message: "Updated order successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    const { userId } = req.params;
    try {
      await Order.findOneAndDelete({ "user._id": userId });
      return res.status(200).json({ message: "Deleted order successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getOrders: async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await User.findById(id);
      if (!admin || admin.role !== ("admin" || "superAdmin"))
        return res.status(401).json({ message: "You are not admin" });
      const orders = await Order.find();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = orderController;
