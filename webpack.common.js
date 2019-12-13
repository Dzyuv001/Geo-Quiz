// const path = require("path");
module.exports = {
  entry: { main: "./src/js/index.js", vendor: "./src/js/vendor.js" },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.(apng|bmp|gif|jpeg|png|avf|tif|tiff|webp)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "assets"
          }
        }
      }
    ]
  }
};
