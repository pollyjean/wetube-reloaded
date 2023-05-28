const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/assets/js/main.js",
  mode: "development",
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  watch: true,
  plugins: [new MiniCssExtractPlugin({
    filename: "css/style.css"
  }
  )],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
    ],
  },
};