
module.exports={
    entry: './src/index.js',
    output: {
        filename: 'index-bundle.js',
        path: __dirname
    },
    mode: 'development',
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:"/node_modules",
                use:['babel-loader'],
            }
        ]
    }
}