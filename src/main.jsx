var React=require("react");
var Controls=require("./controls.jsx");
var CodeMirror=require("ksana-codemirror").Component;

var Maincomponent = React.createClass({
	getInitialState:function() {
		return {value:"abc"}
	}
	,onCursorActivity: function() {

	}
	,onChange :function() {

	}
	,componentDidUpdate: function() {
		this.refs.cm.setSize("100%",1000); 
	}
  ,render: function() {
    return <div>
			<CodeMirror ref="cm" value={this.state.value}
				onCursorActivity={this.onCursorActivity}
				onChange={this.onChange}/>
    </div>;
  }
});
module.exports=Maincomponent;