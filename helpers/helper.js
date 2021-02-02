const xss = require("xss")

module.exports={
    escapeHtml: function(html){
        return html.replace(/</g, "&lt;").replace(/>/g,"&lt;")
    },
    cleanInput: function(input){
        var html = xss(input.trim());
        return html.replace(/</g, "&lt;").replace(/>/g,"&gt;")
    },
}