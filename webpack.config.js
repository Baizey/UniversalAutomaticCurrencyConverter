const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

const destination = "dist";

const config = {
  devtool: 'source-map',
  entry: {
    popup: path.join(__dirname, "src/popup.tsx"),
    content: path.join(__dirname, "src/content.tsx"),
    background: path.join(__dirname, "src/background.ts"),
    options: path.join(__dirname, "src/options.tsx")
  },
  output: { path: path.join(__dirname, destination), filename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.svg$/,
        use: "file-loader"
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  devServer: {
    contentBase: `./${destination}`
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." }
      ]
    }),
    new ZipPlugin({
      path: "../",
      filename: `${destination}.zip`
    })
  ]
};

module.exports = config;
