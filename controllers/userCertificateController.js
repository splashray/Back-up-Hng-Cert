const User = require("../models/certificateModel");
const jwt = require("jsonwebtoken");
const csvToJson = require("csvtojson");
const { isValidJsonOutput } = require("../utils/validation");

const addCertificate = async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({ error: "No credentials sent!" });
  }

  const token = auth.split(" ")[1];
  const { userId } = jwt.decode(token);

  const files = req.files;
  if (!files) return res.status(400).json({ message: "bad request" }).end();
  const csvFile = files.file.data;
  const csvData = Buffer.from(csvFile).toString();
  const jsonData = await csvToJson().fromString(csvData);
  if (!isValidJsonOutput(jsonData))
    return res
      .status(400)
      .json({ message: "Invalid input from uploaded csv file" })
      .end();

  const user = await User.findOne({ userId }).exec();

  if (!user) {
    await User.create({
      userId: userId,
      records: jsonData,
    });
  }

  user.records = [...jsonData];
  user.save();

  res.status(200).json(jsonData);
};

const getAllCertificates = async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({ error: "No credentials sent!" });
  }

  const token = auth.split(" ")[1];
  const { userId } = jwt.decode(token);
  const user = await User.findOne({ userId }).exec();
  const certificates = user.records;

  res.status(200).json(certificates);
};

const getNumberOfCertificates = async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({ error: "No credentials sent!" });
  }

  const token = auth.split(" ")[1];
  const { userId } = jwt.decode(token);
  const user = await User.findOne({ userId }).exec();
  const cert = user.records;

  res.status(200).json({result: cert, count: cert.length});
};

module.exports = {
  getAllCertificates,
  addCertificate,
  getNumberOfCertificates
};
