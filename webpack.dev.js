const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name].bundle.js", //the files that is created
    path: path.resolve(__dirname, "./dist/"), // where is it created __dirname allows for a relative creation of files
    publicPath: "/"
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        //the loader ar executed back to front (lifo)
        use: [
          "style-loader", //inject styles into dom
          "css-loader?url=false", //  css to into commonjs
          "sass-loader" //scss to css
        ]
      }
    ]
  }
});
