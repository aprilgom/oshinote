const common_config = {
}

module.exports={
    entry: './src/index.js',
    output: {
        filename: 'index-bundle.js',
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