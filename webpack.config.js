
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
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
        new webpack.DefinePlugin({
            "process.env.API_BASE_URL": JSON.stringify(
                process.env.API_BASE_URL ?? ""
            ),
            "process.env.SERVER_URL": JSON.stringify(
                process.env.SERVER_URL ?? ""
            ),
            "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify(
                process.env.STRIPE_PUBLISHABLE_KEY ?? ""
            ),
        }),

        new HtmlWebpackPlugin({
            template: "./webpack.index.html",
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
