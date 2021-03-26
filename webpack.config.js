const path = require("path")
module.exports={
    watch:true,
    mode: 'production',
    entry:['babel-polyfill',"./static/js/src"],
    "output":{
        path:__dirname+"/static/js/build",
        filename:"app.js"
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:[
                    {
                        loader: "babel-loader"
                    }
                ]
            }
        ]
    },
    plugins:[]
}