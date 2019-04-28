
const { join } = require("path");

const app = require("./package.json");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackbarPlugin = require("webpackbar");
const HtmlPlugin = require("html-webpack-plugin");
const HtmlTemplate = require("html-webpack-template");
const { EnvironmentPlugin, LoaderOptionsPlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssNano = require("cssnano");

const ENV = process.env.NODE_ENV || "development";
const SHA = process.env.CI_COMMIT_SHORT_SHA || "0";
const PRD = (ENV === "production");
const MIN = PRD ? ".min" : "";

const DIR = __dirname;
const OUT = join(DIR, "./out");
const SRC = join(DIR, "./src");

const config = module.exports = {
  target: "web",
  context: SRC,
  entry: {
    app: SRC,
  },
  mode: ENV,
  output: {
    path: OUT,
    filename: `[name].${SHA}.js`,
    publicPath: "/",
    strictModuleExceptionHandling: true,
  },
  node: {
    console: false,
    process: true,
    global: true,
    __filename: true,
    __dirname: true,
    Buffer: true,
    setImmediate: true,
  },
  profile: true,
  resolve: {
    extensions: [ ".ts", ".js" ],
    alias: {
      "@": DIR,
      "$": SRC,
      "vue$": `vue/dist/vue.runtime${MIN}.js`,
      "vue-router$": `vue-router/dist/vue-router${MIN}.js`,
      "vuetify$": `vuetify/dist/vuetify${MIN}.js`
    },
    plugins: [
      new TsconfigPathsPlugin({
        configFile: join(DIR, "./tsconfig.json"),
      }),
    ],
  },
  module: {
    rules: [
      { parser: { amd: false } },
      template("pug|html", "pug-html-loader"),
      style("css"),
      style("styl", {
        loader: "stylus-loader",
        options: {
          preferPathResolver: "webpack",
        },
      }),
      loader("ts", {
        loader: "ts-loader",
        options: {
          configFile: join(DIR, "./tsconfig.json"),
        },
      }),
      loader("ya?ml", "js-yaml-loader"),
      loader("(png|jpg|webp|svg|woff2?)(\\?[a-z0-9]+)?", "url-loader"),
    ],
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new WebpackbarPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: ENV,
    }),
    new MiniCssExtractPlugin({
      filename: `[name].${SHA}.css`,
      chunkFilename: `[name].[id].${SHA}.css`,
    }),
    new HtmlPlugin({
      title: app.title || app.name || "App",
      filename: "index.html",
      lang: "en-US",
      template: HtmlTemplate,
      hash: true,
      inject: false,
      minify: { },
      meta: [ {
        name: "viewport",
        content: "width=device-width,initial-scale=1.0",
      }, ],
    }),
  ],
};

if (!PRD) {
  config.cache = true;
  config.devtool = "#cheap-module-inline-source-map";
  config.output.pathinfo = true;
  config.devServer = {
    contentBase: OUT,
    noInfo: true,
    overlay: true,
    historyApiFallback: true,
  };
  config.plugins.push(new LoaderOptionsPlugin({
    debug: true,
    sourceMap: true,
  }));
} else {
  config.optimization.concatenateModules = false;
  config.optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
      extractComments: true,
      terserOptions: {
        ecma: 6,
        mangle: true,
        toplevel: true,
      },
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: CssNano,
      cssProcessorPluginOptions: {
        preset: [ "advanced", {
          csseclarationSorter: true,
          zindex: false,
          discardComments: { removeAll: true, },
        }, ],
      },
      canPrint: true,
    }),
  ];
  config.optimization.splitChunks = {
    chunks: "all",
    minSize: 32768,
    maxSize: 524288,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialsREquests: 3,
    automaticNameDelimiter: "~",
    name: true,
    cacheGroups: {
      vendors: {
        test: /node_modules/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  };
}

function loader ( ext, use = `${ext}-loader`, base = { }) {
  base.test = ext instanceof RegExp ? ext : new RegExp(`\\.(${ext})$`);
  base.use = (use instanceof Array ? use : [ use, ]).map(function ( rule ) {
    if (typeof rule === "string") {
      if (!/-loader$/.test(rule)) { rule += "-loader"; }
      return { loader: rule };
    }
    return rule;
  });
  return base;
}

function template ( ext, use = `${ext}-loader`) {
  return loader(ext, [ {
    loader: "vue-template-loader",
    options: {
      transformAssetUrls: {
        img: "src",
      },
    },
  }, ].concat(use));
}

function style ( ext, use = [ ] ) {
  return loader(ext, [ {
    loader: MiniCssExtractPlugin.loader
  }, {
    loader: "css-loader",
    options: {
      importLoaders: use.length
    }
  } ].concat(use));
}
