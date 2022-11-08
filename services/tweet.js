const path = require("path");
const fs = require("fs");


String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const verifyFileFormat = (mimetype) => {
  if (
    mimetype != "image/png" &&
    mimetype != "image/jpeg" &&
    mimetype != "image/jpg"
  ) {
    return {
      erro: true,
      mensagem: "Formato de arquivo inválido",
    };
  }
  return false;
};

module.exports = class TweetSql {
  constructor(userId, connection) {
    this.userId = userId;
    this.connection = connection;
  }

  saveImage = async (image) => {
    const targetPath = path.join(
      __dirname,
      `../../Lookbook/public/images/users/${this.userId}/`
    );
    if (!fs.existsSync(targetPath)) {
      await fs.mkdirSync(targetPath);
    }
    const imageExtension = image.mimetype;
    const extension = imageExtension.split("image/");

    const imageName = `${new Date().getTime()}_${image.name.hashCode()}.${
      extension[1]
    }`;

    await fs.writeFile(path.join(targetPath, imageName), image.data, (err) => {
      return err;
    });
    return imageName;
  };

  getTweetsByData = async (page) => {
    try {
      const sqlCommand = `SELECT * FROM publicacao ORDER BY data_publicacao DESC LIMIT 10 OFFSET ${
        page * 10
      }`;

      return new Promise((resolve, reject) => {
        this.connection.query(sqlCommand, async (err, results, fields) => {
          if (err) {
            throw err;
          }
          if (results === undefined) {
            reject(new Error("Error rows is undefined"));
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  };

  insertSimpleTweet = async (text) => {
    try {
      const sqlCommand = `INSERT INTO publicacao (texto_publicacao, data_publicacao, cod_usuario) VALUES (?, ?, ?)`;

      const values = [text, new Date(), this.userId];

      this.connection.query(sqlCommand, values, (err, results) => {
        if (err) {
          throw err;
        }
        return results;
      });
    } catch (error) {
      throw error;
    }
  };

  deleteAllTweets = async (text) => {
    try {
      const sqlCommand = `TRUNCATE TABLE publicacao`;
      this.connection.query(sqlCommand, (err, results) => {
        if (err) {
          throw err;
        }
        console.log("Tweets deletes")
      });
    } catch (error) {
      throw error;
    }
  };

  insertImageTweet = async (text, image) => {
    try {
      const imagePath = await this.saveImage(image);

      const isNotImage = verifyFileFormat(image.mimetype);

      if (isNotImage) {
        return isNotImage;
      }

      const sqlCommand = `INSERT INTO publicacao (texto_publicacao, imagem_publicacao, data_publicacao, cod_usuario) VALUES (?, ?, ?, ?)`;

      const values = [text, imagePath, new Date(), this.userId];

      this.connection.query(sqlCommand, values, (err, results) => {
        if (err) {
          throw err;
        }
        return results;
      });
    } catch (error) {
      throw error;
    }
  };
};
