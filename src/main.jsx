var React=require("react");
var ReactDOM=require("react-dom");
var Controls=require("./controls.jsx");
var CodeMirror=require("ksana-codemirror").Component;

var ire=require("ksana-ire");
var IREPreview=ire.IREPreview;
var IREView=ire.IREView;
var IREMARKER="⿿";
var Maincomponent = React.createClass({
	getInitialState:function() {
		return {value:"abc\nabc⿿婆女卡哈哈⿿婆女卡哈哈\nabc⿿婆女卡哈哈⿿婆女卡哈哈\nabc",
		inIRE:false,IRELine:-1,coord:{}}
	},
	componentDidMount:function() {
		this.doc=this.refs.cm.getCodeMirror().getDoc();
		this.IRE2Image(this.doc);
		this.doc.markText({line:0,ch:0},{line:0,ch:3},{atomic:true,readOnly:true,className:"hl"})

	}	
	,textUntilEOL : function(cm) {

	}
	,onIREViewClick:function(e){
		var domnode=e.target;
		while (domnode && !domnode.dataset) {
			domnode=domnode.parentElement;
		}
		if (!domnode) return;
		var cur=domnode.dataset.cur;
		var pos=cur.split(",");
		var doc=this.refs.cm.getCodeMirror().getDoc();
		var at={line:parseInt(pos[0]),ch:parseInt(pos[1])+1};
		var mrks=doc.findMarksAt(at);
		if (mrks.length) {
			mrks[0].clear();
			doc.setCursor(at);
			doc.getEditor().focus();
		}
	}
	,markLine:function(doc,i){
		var line=doc.getLine(i);
		var reg=new RegExp(IREMARKER,"g");
		line.replace( reg,function(m,idx){
			var text=line.substr(idx+1);
			var ch=text.indexOf(IREMARKER); 
			if (ch>-1) text=text.substr(0,ch);
			var text=ire.getIRE(text);
			var element=document.createElement("SPAN");
			var height=doc.getEditor().defaultTextHeight()-8;
			console.log(height)
			//element.innerHTML="hi"
			ReactDOM.render(<IREView height={height} cur={[i,idx]} onClick={this.onIREViewClick}/>,element);
			doc.markText({line:i,ch:idx},{line:i,ch:idx+text.length+1},{replacedWith:element,clearOnEnter:true});
		}.bind(this));
	}
	,IRE2Image:function(doc) {
		for (var i=0;i<doc.lineCount();i++) {
			this.markLine(doc,i);
		}
	}
	,cursorInIRE:function(pos) {
		var line=this.doc.getLine(pos.line);
		var i=line.lastIndexOf(IREMARKER,pos.ch);
		if (i==-1)return false;

		var text=ire.getIRE(line.substr(i+1));
		if (i+1+text.length>=pos.ch){
			return [i,i+1+text.length];
		}
		return ;
	}
	,onCursorActivity: function(cm) {
		clearTimeout(this.timer1);
		this.timer1=setTimeout(function(){
			var pos=cm.getCursor();
			var inIRE=this.cursorInIRE(pos);
			if ( (( this.state.IRELine!==pos.line) ||
				   (JSON.stringify(this.state.inIRE)!=JSON.stringify(inIRE))) 
			&& this.state.inIRE) {
				if (this.state.IRELine>-1) this.markLine(this.doc,this.state.IRELine);
				var mrk=this.doc.findMarksAt({line:pos.line,ch:this.state.inIRE[0]});
				if (mrk) mrk.map(function(m){
					if (m.className==="ire")m.clear();
				});
				this.setState({inIRE:null,IRELine:-1,ire:null});
			}
			if (inIRE) {
				var ire=this.doc.getRange({line:pos.line,ch:inIRE[0]+1},{line:pos.line,ch:inIRE[1]});
				var coord=this.doc.getEditor().charCoords({line:pos.line,ch:inIRE[0]});
				coord.top+=this.doc.getEditor().defaultTextHeight();
				this.setState({IRELine:pos.line,inIRE:inIRE,ire:ire,coord:coord});
				this.doc.markText({line:pos.line,ch:inIRE[0]},{line:pos.line,ch:inIRE[1]},{className:"ire"});
			}			
		}.bind(this),50);
	}
	,onChange :function() {

	}
	,componentDidUpdate: function() {
		if (this.refs.cm) this.refs.cm.codeMirror.setSize("100%",1000); 
	}
  ,render: function() {
    return <div>
			<IREPreview ire={this.state.ire} coord={this.state.coord}/>
			<CodeMirror ref="cm" value={this.state.value}
				onCursorActivity={this.onCursorActivity}
				onChange={this.onChange}/>
    </div>;
  }
});
module.exports=Maincomponent;