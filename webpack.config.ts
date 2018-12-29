import path from "path";
import webpack from "webpack";

const config: webpack.Configuration = {
  entry: "./src/demo-vr.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    publicPath: "/built/",
    path: path.resolve(__dirname, "dist", "built")
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: '0.0.0.0',
    port: 9000,
  }
};

export default (_env: string, argv: { [key: string]: string }) => {
  if (!argv.mode) {
    config.mode = "development";
  }

  return config;
};
