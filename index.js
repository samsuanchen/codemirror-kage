var React=require("react");
var ReactDOM=require("react-dom");
if(window.location.origin.indexOf("//127.0.0.1")>-1) {
	require("ksana2015-webruntime/livereload")(); 
}
var ksanagap=require("ksana2015-webruntime/ksanagap");
ksanagap.boot("codemirror-kage",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=ReactDOM.render(Main,document.getElementById("main"));
});