require("dotenv").config(); // ✅ Load env before using process.env

const mongoose = require("mongoose"); // ✅ Required for ObjectId validation
const productModel = require("../models/productModel.js");
const categoryModel = require("../models/categoryModel.js");
const fs = require("fs"); // file system
const slugify = require("slugify");
const braintree = require("braintree");
const orderModel = require("../models/orderModel");

// Payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// =================== CREATE PRODUCT ===================
const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 10000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

// =================== GET ALL PRODUCTS ===================
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// =================== GET SINGLE PRODUCT ===================
const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

// =================== GET PRODUCT PHOTO (FIXED) ===================
const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ success: false, message: "Invalid Product ID" });
    }

    const product = await productModel.findById(pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).send({ success: false, message: "Photo not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

// =================== DELETE PRODUCT (FIXED) ===================
const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ success: false, message: "Invalid Product ID" });
    }

    await productModel.findByIdAndDelete(pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// =================== UPDATE PRODUCT (FIXED) ===================
const updateProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ success: false, message: "Invalid Product ID" });
    }

    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo should be less than 1MB" });
    }

    const products = await productModel.findByIdAndUpdate(
      pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

// =================== FILTER PRODUCTS ===================
const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};

// =================== PRODUCT COUNT ===================
const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// =================== PAGINATED PRODUCTS ===================
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page controller",
      error,
    });
  }
};

// =================== SEARCH PRODUCT ===================
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Search Product API",
      error,
    });
  }
};

// =================== RELATED PRODUCTS ===================
const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};

// =================== CATEGORY PRODUCTS ===================
const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

// =================== BRAINTREE TOKEN ===================
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.send({ clientToken: response.clientToken });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to generate Braintree token" });
  }
};

// =================== BRAINTREE PAYMENT ===================
const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          await new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Payment processing failed",
      error,
    });
  }
};

// =================== EXPORTS ===================
module.exports = {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  updateProductController,
  searchProductController,
  realtedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
};
