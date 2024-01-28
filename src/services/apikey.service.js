"use strict";

const crypto = require("crypto");
const apikeyModel = require("../models/apikey.model");

const findById = async (key) => {
    // tao key
  const objKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objKey;
};
const createDummKey = async () => {
    // tao key
    console.log('11111111111111111111')
  const newKey = await apikeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: ["0000"],
  });
  console.log('newKey',newKey)
  return newKey;
};


module.exports = {
  findById,
  createDummKey
};
