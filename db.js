const { Sequelize } = require('sequelize');
const redis = require('ioredis');
const Minio = require('minio');
require('dotenv').config();

const config = require('./config/config.json')[
  process.env.NODE_ENV || 'development'
];

const dbConf = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    define: {
      timestamps: false,
    },
  }
);

const redisConf = redis.createClient({
  host: 'localhost',
  port: 6379,
});

async function handleRedisOperation(operation) {
  await operation();
}

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'AFecI0g7kPHen3pSTKp6',
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucket = 'semp';

const setupMinio = async () => {
  const exists = await minioClient.bucketExists(bucket);
  if (exists) {
    console.log('Bucket ' + bucket + ' exists.');
  } else {
    await minioClient.makeBucket(bucket);
    console.log('Bucket ' + bucket + ' created locally.');
  }
};

setupMinio();

module.exports = {
  dbConf,
  redisConf,
  handleRedisOperation,
  minioClient,
};
