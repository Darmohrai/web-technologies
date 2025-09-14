const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // очищає dist перед новою збіркою
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/, // для .css та .scss
                use: [
                    MiniCssExtractPlugin.loader, // або 'style-loader' для вставки в <style>
                    'css-loader',
                    'sass-loader'
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css', // файл зі стилями в dist/
        }),
    ],
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 9000,
        hot: true,
    },
    devtool: 'source-map', // для дебагу
};
