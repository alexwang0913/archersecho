(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0ba8e7"],{"385a":function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"vx-row"},[r("div",{staticClass:"vx-col w-full lg:w-1/2 vs-con-loading__container",attrs:{id:"div-loading"}},[r("vx-card",{attrs:{title:"Detail"}},[r("vs-row",[r("vs-col",{staticClass:"mb-4"},[r("vs-input",{attrs:{"label-placeholder":"Name"},model:{value:e.user.name,callback:function(t){e.$set(e.user,"name",t)},expression:"user.name"}})],1),r("vs-col",{staticClass:"mb-4"},[r("vs-input",{attrs:{"label-placeholder":"User Id"},model:{value:e.user.userId,callback:function(t){e.$set(e.user,"userId",t)},expression:"user.userId"}})],1),r("vs-col",{staticClass:"mb-4"},[e.editProfileImage?r("vs-upload",{attrs:{action:"http://archersecho.com/api/upload",text:"Upload profile image",fileName:"file"},on:{"on-success":e.successUpload,"on-error":e.failUpload}}):r("div",[r("vs-avatar",{attrs:{size:"150px",src:"http://archersecho.com/"+e.user.profileUrl}}),r("span",{staticStyle:{cursor:"pointer"},on:{click:function(t){e.editProfileImage=!0}}},[e._v("edit")])],1)],1),r("vs-col",{attrs:{"vs-offset":"8","vs-type":"flex","vs-justify":"center","vs-align":"center","vs-w":"4"}},[r("vs-button",{on:{click:e.updateDetail}},[e._v("Save")])],1)],1)],1)],1),r("div",{staticClass:"vx-col w-full lg:w-1/2"},[r("vx-card",{attrs:{title:"Update Password"}},[r("vs-row",[r("vs-col",{staticClass:"mb-4"},[r("vs-input",{attrs:{"label-placeholder":"Old Password",type:"password"},model:{value:e.oldPassword,callback:function(t){e.oldPassword=t},expression:"oldPassword"}})],1),r("vs-col",{staticClass:"mb-4"},[r("vs-input",{attrs:{"label-placeholder":"New Password",type:"password"},model:{value:e.newPassword,callback:function(t){e.newPassword=t},expression:"newPassword"}})],1),r("vs-col",{staticClass:"mb-4"},[r("vs-input",{attrs:{"label-placeholder":"Confirm Password",type:"password"},model:{value:e.confirmPassword,callback:function(t){e.confirmPassword=t},expression:"confirmPassword"}})],1),r("vs-col",{attrs:{"vs-offset":"8","vs-type":"flex","vs-justify":"center","vs-align":"center","vs-w":"4"}},[r("vs-button",{on:{click:e.updatePassword}},[e._v("Save")])],1)],1)],1)],1)])},a=[],n=(r("96cf"),r("3b8d")),o=r("b39f"),c=function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["a"])({method:"GET",url:"/api/users/".concat(t)});case 2:return r=e.sent,e.abrupt("return",r.data);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),i=function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t,r){var s;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["a"])({method:"PUT",url:"/api/users/".concat(t),data:r});case 2:return s=e.sent,e.abrupt("return",s.data);case 4:case"end":return e.stop()}},e)}));return function(t,r){return e.apply(this,arguments)}}(),u=function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["a"])({method:"GET",url:"/api/users/getOthers/".concat(t)});case 2:return r=e.sent,e.abrupt("return",r.data);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),l=function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["a"])({method:"POST",url:"/api/users/updatePassword",data:t});case 2:return r=e.sent,e.abrupt("return",r.data);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(t){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["a"])({method:"POST",url:"/api/users/updateSocketId",data:t});case 2:return r=e.sent,e.abrupt("return",r.data);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),p={getById:c,update:i,getOtherUsers:u,updatePassword:l,updateSocketId:d},v=r("ed08"),f={data:function(){return{user:{},editProfileImage:!1,oldPassword:"",newPassword:"",confirmPassword:""}},mounted:function(){this.getProfile()},methods:{successUpload:function(e){this.user.profileUrl=e.srcElement.response},failUpload:function(e){console.log(e)},updateDetail:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,p.update(Object(v["b"])("user").id,this.user);case 2:this.$vs.notify({color:"success",title:"Success",text:"Success in update profile"});case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),getProfile:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.$vs.loading({container:"#div-loading"}),e.next=3,p.getById(Object(v["b"])("user").id);case 3:this.user=e.sent,console.log(this.user),this.$vs.loading.close("#div-loading > .con-vs-loading");case 6:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),updatePassword:function(){var e=Object(n["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.newPassword===this.confirmPassword){e.next=3;break}return this.$vs.notify({color:"danger",title:"Error",text:"Confirm password is incorrect"}),e.abrupt("return");case 3:return e.prev=3,e.next=6,p.updatePassword({id:Object(v["b"])("user").id,oldPassword:this.oldPassword,newPassword:this.newPassword});case 6:this.$vs.notify({color:"success",title:"Success",text:"Success in update password"}),e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](3),this.$vs.notify({color:"danger",title:"Failed",text:"Failed in update password"});case 12:this.oldPassword="",this.newPassword="",this.confirmPassword="";case 15:case"end":return e.stop()}},e,this,[[3,9]])}));function t(){return e.apply(this,arguments)}return t}()}},w=f,h=r("2877"),m=Object(h["a"])(w,s,a,!1,null,"d78eca46",null);t["default"]=m.exports}}]);
//# sourceMappingURL=chunk-2d0ba8e7.2660fd82.js.map