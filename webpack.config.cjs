const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BASE_JS = "./src/assets/js/";

module.exports = {
  entry: {
    main: `${BASE_JS}main.js`,
    videoPlayer: `${BASE_JS}videoPlayer.js`,
    recorder: `${BASE_JS}recorder.js`,
    commentArea: `${BASE_JS}commentArea.js`
  },
  mode: "development",
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
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