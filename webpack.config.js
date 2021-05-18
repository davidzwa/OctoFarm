const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const WebpackBeforeBuildPlugin = require("before-build-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");

const buildDir = "views/assets/dist/";
const clientJSFolder = "./client_src/js/";
const clientCSSFolder = "./client_src/css/";
const dirContents = fs.readdirSync(clientJSFolder, { withFileTypes: true });
const dirCssContents = fs.readdirSync(clientCSSFolder, { withFileTypes: true });

const webpackEntries = _.fromPairs(
  dirContents
    .filter((dirEntry) => dirEntry.isFile())
    .map((file) => {
      return [path.parse(file.name).name, clientJSFolder + file.name];
    })
    .concat(
      dirCssContents
        .filter((file) => file.name.includes("css"))
        .map((file) => [
          path.parse(file.name).name,
          clientCSSFolder + file.name,
        ])
    )
);

webpackEntries["vendor"] = `${clientJSFolder}vendor/entry.js`;
webpackEntries["bootstrap"] = "bootstrap/dist/js/bootstrap.bundle";

module.exports = (env, options) => {
  return {
    entry: webpackEntries,
    output: {
      filename: "[name].min.js",
      path: path.resolve(__dirname, buildDir),
    },
    externals: {
      jquery: "jQuery",
      bootbox: "bootbox",
    },
    mode: "development",
    devtool: "source-map",
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    optimization: {
      minimize: env.production,
      minimizer: [
        // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: false, // leave url() intact
                importLoaders: 1,
                sourceMap: true,
              },
            },
          ],
        },
        // In case you want images to become dist assets use this
        // Then look at https://webpack.js.org/loaders/file-loader/
        // {
        //   test: /\.(png|jpe?g|gif)$/i,
        //   use: [
        //     'ignore-loader'
        //   ],
        //   // type: 'asset/resource',
        // },
      ],
    },
    plugins: [
      // new SourceMapDevToolPlugin(),
      new webpack.ProvidePlugin({
        // We dont bundle jquery
        // 'window.jQuery': 'jquery',
        Noty: "Noty",
        // 'bootbox': 'bootbox',
      }),
      new MiniCssExtractPlugin({
        // filename: dirCssContents[0].name,
        chunkFilename: "[id].css",
      }),
      new WebpackBeforeBuildPlugin(
        function (stats, callback) {
          const newlyCreatedAssets = webpackEntries;
          const unlinked = [];
          const dirContents = fs.readdirSync(path.resolve(buildDir), {
            withFileTypes: true,
          });
          dirContents.forEach((file) => {
            if (
              !newlyCreatedAssets[path.parse(file.name).name.split(".")[0]] &&
              file.isFile()
            ) {
              fs.unlinkSync(path.resolve(buildDir + file.name));
              unlinked.push(file.name);
            }
          });
          if (unlinked.length > 0) {
            console.warn("Removed old assets: ", unlinked);
          }

          callback();
        },
        ["done"]
      ),
    ],
  };
};
