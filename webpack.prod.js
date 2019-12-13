const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizerCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name]-[contentHash].bundle.js", //the files that is created
    path: path.resolve(__dirname, "./dist") // where is it created __dirname allows for a relative creation of files
  },
  optimization: {
    minimizer: [new OptimizerCssAssetsPlugin(), new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        //the loader ar executed back to front (lifo)
        use: [
          MiniCssExtractPlugin.loader, //make css file
          "css-loader", //css to into commonjs
          "sass-loader" //scss to css
        ]
      },
      {
        test:/\.(js)$/,
        exclude:/node_modules/, //The files that should be ignored
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contentHash].css" }),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new CleanWebpackPlugin()
  ]
});
