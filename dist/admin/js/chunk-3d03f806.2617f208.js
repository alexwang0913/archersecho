(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3d03f806"],{ca73:function(t,e,a){"use strict";var o=a("efcd"),n=a.n(o);n.a},d076:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("page-title-bar"),a("app-section-loader",{attrs:{status:t.loader}}),a("v-container",{attrs:{fluid:"","pt-0":"","grid-list-xl":""}},[a("v-layout",{attrs:{"align-center":"","justify-center":"",column:""}},[a("v-uploader",{attrs:{language:"en",buttonText:"Upload XML File",preview:!1,uploadFileUrl:t.uploadUrl,beforeUpload:t.beforeUpload},on:{done:t.uploadDone}}),a("v-layout",{attrs:{row:""}},[a("v-btn",{attrs:{color:"primary",disabled:t.uploadLoading,loading:t.convertLoading},on:{click:t.convert}},[t._v("Convert")])],1),a("v-card",{staticClass:"mx-auto",attrs:{width:"800"}},[a("v-card-text",[a("ul",t._l(t.treeData,function(e,o){return a("tree-item",{key:o,staticClass:"item",attrs:{item:e},on:{"make-folder":t.makeFolder,"add-item":t.addItem}})}),1)])],1)],1)],1)],1)},n=[],r=a("0f66"),l={data:function(){return{loader:!1,uploadLoading:!1,xmlUrl:"",treeData:[],convertLoading:!1,uploadUrl:"http://localhost:3000/api/upload/xml"}},computed:{},methods:{uploadDone:function(t){this.xmlUrl=t[0].url,this.uploadLoading=!1,this.$toast.success({title:"Congratulations",message:"Success in upload XML file"})},beforeUpload:function(){return this.uploadLoading=!0,!0},makeFolder:function(t){Vue.set(t,"children",[]),this.addItem(t)},addItem:function(t){t.children.push({name:"new stuff"})},convert:function(){var t=this,e={url:this.xmlUrl};this.convertLoading=!0,this.treeData=[],r["a"].post("/convert",e).then(function(e){t.convertLoading=!1,t.treeData=e.data}).catch(function(e){t.convertLoading=!1})},exportXml:function(){var t={xmlUrl:this.xmlUrl,structure:this.treeData};r["a"].post("/convert/export",t).then(function(t){console.log("success in export data"),console.log(t)}).catch(function(t){console.log("Failed in export data")})}}},i=l,c=(a("ca73"),a("2877")),d=Object(c["a"])(i,o,n,!1,null,"43f3f30f",null);e["default"]=d.exports},efcd:function(t,e,a){}}]);
//# sourceMappingURL=chunk-3d03f806.2617f208.js.map