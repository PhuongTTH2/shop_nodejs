"use strict";

const { findById, createDummKey } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    // await createDummKey ()
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error 1",
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error 2",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permisstion = (permission) => {

  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permisstions denied 1",
      });
    }

    console.log('permisstions',req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission)
    if(!validPermission){
      return res.status(403).json({
        message: "Permisstions denied 2",
      });
    }

    return next()
  };
};

const asyncHandler = fn =>{
  return (req, res, next) =>{
    fn(req, res, next).catch(next)
  }
}
module.exports = {
  apiKey,
  permisstion,
  asyncHandler
};
