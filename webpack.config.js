module.exports = {
    
    entry: './src/app.ts',

    output: {
        filename: 'app.js',
        path: __dirname+'/dist/'
    },

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
    
}