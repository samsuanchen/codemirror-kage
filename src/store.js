var Reflux=require("reflux");
var actions=require("./actions");
var store=Reflux.createStore({
	listenables:actions
	,data:[]
	,onAdd:function(item) {
		this.data.push(item);
		this.trigger(this.data);
	}
	,onClear:function() {
		this.data=[];
		this.trigger(this.data);
	}
});

module.exports=store;