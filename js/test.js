/*var page={
	ins:document.getElementById("test"),
	sections:{
		"start"
	}
	getSect:function(file){
		var xmlHTTP=new XMLHttpRequest();
		xmlHTTP.open("GET","testPages/"+file+".html",false);
		xmlHTTP.send();
		this.ins.innerHTML=xmlHTTP.responseText;
	},
	formEdit:function(){
		alert('test');
	}
}*/

var DATA;
var page;

function Page(){
	this.ins=document.getElementById("test");
	this.currentSect=undefined;
	this.currentIndex=0;

	this.getSect=function(file){
		var xmlHTTP=new XMLHttpRequest();
		xmlHTTP.open("GET","testPages/"+file+".html",false);
		xmlHTTP.send();
		return xmlHTTP.responseText;
	}

	this.insertSect=function(name){
		$("#test").append(this.sections[name].text);
		this.sections[name].ref=$("#"+name)
		this.currentSect=this.sections[name];
		$('.ui.checkbox').checkbox();
	}

	this.sections={
		"start":new Section("start",this.getSect("start"),undefined),
		"passwords":new Section("passwords",this.getSect("passwords"),undefined),
		"facebook":new Section("facebook",this.getSect("facebook"),"facebook"),
		"instagram":new Section("instagram",this.getSect("instagram"),"instagram"),
		"twitter":new Section("twitter",this.getSect("twitter"),"twitter"),
		"snapchat":new Section("snapchat",this.getSect("snapchat"),"snapchat"),
		"googlePlus":new Section("googlePlus",this.getSect("googlePlus"),"googlePlus"),
		"tumblr":new Section("tumblr",this.getSect("tumblr"),"tumblr")
	}

	this.next=function(){
		if(this.currentIndex<Object.keys(this.sections).length-1){
			if(typeof this.sections[Object.keys(this.sections)[this.currentIndex+1]].condition !== 'undefined'){
				this.currentIndex++;
				for(;!($("input#"+this.sections[Object.keys(this.sections)[this.currentIndex]].condition)[0].checked);this.currentIndex++){
					if(this.currentIndex>=Object.keys(this.sections).length-1)
						end();
				}
			}else
				this.currentIndex++;
			this.insertSect(this.sections[Object.keys(this.sections)[this.currentIndex]].name);
		}else{
			end();
		}
	}
}

function end(){
	$("#next").addClass("hidden");
	$("#submit").removeClass("hidden");
}

function Section(_name,_text,_condition){
	this.text=_text;
	this.ref=undefined;
	this.name=_name;
	this.condition=_condition;
}

$(function(){
	init();
});

function init(){
	page=new Page();
	page.insertSect("start");
}

function submit(){
	NET_USED={
		facebook:$("input#facebook")[0].checked,
		instagram:$("input#instagram")[0].checked,
		twitter:$("input#twitter")[0].checked,
		snapchat:$("input#snapchat")[0].checked,
		googlePlus:$("input#googlePlus")[0].checked,
		tumblr:$("input#tumblr")[0].checked
	}

	DATA={
		networks_used:NET_USED,
		real_name:$("input#real_name")[0].checked,
		location_serivces:$("input#location_services")[0].checked,
		
		passwords:{
			length:$("input#pw_length")[0].value,
			words:$("input#pw_words")[0].value,
			charset:getRadio("pw_charset"),
			capitalization:getRadio("pw_case"),
			reuse:getRadio("pw_reuse")	
		},

		networks:{
			facebook:(NET_USED.facebook)?{
				security:{
					alert:$("input#sec_not")[0].checked,
					approve:$("input#sec_approve")[0].checked,
					two_factor:$("input#sec_tf")[0].checked
				},
				
				future_post:($("input#priv_post")[0].checked) ? "friends" : "public",
				
				timeline_tagging:{
					tag_visibility:getRadio("tag_vis"),
					others_post_visibility:getRadio("o_post_vis")
				}
			}:{},

			instagram:(NET_USED.instagram)?{
				private_account:$("input#priv_acc")[0].checked,
				activity:$("input#inst_activ")[0].checked
			}:{},

			twitter:(NET_USED.twitter)?{
				two_factor:$("input#sec_ver")[0].checked,
				photo_tag:getRadio("photo_tag"),
				tweet_privacy:$("input#tweet_privacy")[0].checked,
				location:$("input#tweet_location")[0].checked,
				profile_discover:$("input#profile_discoverability")[0].checked,
				tailor_tracking:$("input#tweet_tailor")[0].checked,
				promoted_content:$("input#promoted_content")[0].checked
			}:{},

			snapchat:(NET_USED.snapchat)?{
				story_view:($("input#view_story")[0].checked)?"friends":"public",
				activity:$("input#snapchat_activ")[0].checked	
			}:{},

			googlePlus:(NET_USED.googlePlus)?{
				shared_endorsement:$("input#shared_endorsement")[0].checked,
				albmum_geolocation:$("input#album_geolocation")[0].checked,
				prompt_tag:$("input#tag_prompt")[0].checked,
				location_sharing:$("input#location_sharing")[0].checked
			}:{},

			tumblr:(NET_USED.tumblr)?{
				activity:$("input#tumblr_activ")[0].checked,
				search:$("input#search_res")[0].checked
			}:{}
		}	
	};
	var _uName=prompt("Enter your first name, followed by your last initial. Ensure it is unique, for data logging purposes");
	var fbRef_users=new Firebase("https://olsec.firebaseio.com/users");
	try{
		fbRef_users.push({"uName":_uName,"data":DATA});
	}catch(e){
		$("#test").append("<h2>You missed a question. Go back and fix it, then click submit again. " + e);
	}
}



function getRadio(pName){
	var radios=$("input[name="+pName+"]");
	for(i=0;i<radios.length;i++){
		if(radios[i].checked)
			return radios[i].value;
	}
}