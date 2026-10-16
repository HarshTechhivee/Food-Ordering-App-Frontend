
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import Dotenv from 'dotenv-webpack'
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export default {
    mode: "development",

    entry: "./src/main.tsx",

    output: {
        path: path.resolve(__dirname, "dist-webpack"),
        filename: "assets/[name].bundle.js",
        publicPath: "/",
        clean: true,
    },

    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        extensionAlias: {
            ".js": [".ts", ".tsx", ".js"],
            ".mjs": [".mts", ".mjs"],
            ".cjs": [".cts", ".cjs"],
        },
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.app.json",
                        transpileOnly: true,
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    plugins: [

        new Dotenv({
            systemvars: true,
        }),

        new HtmlWebpackPlugin({
            template: "./webpack.index.html",
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: "public/firebase-messaging-sw.js",
                    to: "firebase-messaging-sw.js",
                },
            ],
        }),
    ],

    devServer: {
        port: 5174,
        hot: true,
        open: false,
        historyApiFallback: true,
    },

    devtool: "source-map",
};
