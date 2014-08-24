!function(){var a=location.hash;a&&("#"===a[0]&&(a=a.substr(1)),a=a.replace(/(^token|&token)=/,function(a){return("&"===a[0]?"&":"")+"access_token="}),location.hash=a);var b=function(a){return b.use(a)};b.utils={extend:function(a,b){for(var c in b)a[c]=b[c]}},b.utils.extend(b,{settings:{redirect_uri:window.location.href.split("#")[0],response_type:"token",display:"popup",state:"",oauth_proxy:"",timeout:2e4,default_service:null,force:!0},service:function(a){return"undefined"!=typeof a?this.utils.store("sync_service",a):this.utils.store("sync_service")},services:{},use:function(a){var b=this.utils.objectCreate(this);return b.settings=this.utils.objectCreate(this.settings),a&&(b.settings.default_service=a),b.utils.Event.call(b),b},init:function(a,b){var c=this.utils;if(!a)return this.services;for(var d in a)a.hasOwnProperty(d)&&"object"!=typeof a[d]&&(a[d]={id:a[d]});this.services=c.merge(this.services,a);for(d in this.services)this.services.hasOwnProperty(d)&&(this.services[d].scope=this.services[d].scope||{});return b&&(this.settings=c.merge(this.settings,b),"redirect_uri"in b&&(this.settings.redirect_uri=c.realPath(b.redirect_uri))),this},login:function(){var a=this.use(),b=a.utils,c=b.args({network:"s",options:"o",callback:"f"},arguments);a.args=c;var d,e=c.options=b.merge(a.settings,c.options||{});if(c.network=a.settings.default_service=c.network||a.settings.default_service,a.on("complete",c.callback),"string"!=typeof c.network||!(c.network in a.services))return a.emitAfter("error complete",{error:{code:"invalid_network",message:"The provided network was not recognized"}}),a;var f=a.services[c.network],g=!1,h=b.globalEvent(function(c){g=!0,c.error?a.emit("complete error failed auth.failed",{error:c.error}):(b.store(c.network,c),a.emit("complete success login auth.login auth",{network:c.network,authResponse:c}))});c.qs={client_id:f.id,response_type:e.response_type,redirect_uri:e.redirect_uri,display:e.display,scope:"basic",state:{client_id:f.id,network:c.network,display:e.display,callback:h,state:e.state,oauth_proxy:e.oauth_proxy}};var i=b.store(c.network),j=e.scope;if(j&&"string"!=typeof j&&(j=j.join(",")),j=(j?j+",":"")+c.qs.scope,i&&"scope"in i&&(j+=","+i.scope.join(",")),c.qs.state.scope=b.unique(j.split(/[,\s]+/)),c.qs.scope=j.replace(/[^,\s]+/gi,function(a){return a in f.scope?f.scope[a]:""}).replace(/[,\s]+/gi,","),c.qs.scope=b.unique(c.qs.scope.split(/,+/)).join(f.scope_delim||","),e.force===!1&&i&&"access_token"in i&&i.access_token&&"expires"in i&&i.expires>(new Date).getTime()/1e3){var k=b.diff(i.scope||[],c.qs.state.scope||[]);if(0===k.length)return a.emit("notice","User already has a valid access_token"),a.emitAfter("complete success login",{network:c.network,authResponse:i}),a}if(c.qs.redirect_uri=b.realPath(c.qs.redirect_uri),f.oauth&&(c.qs.state.oauth=f.oauth),c.qs.state=JSON.stringify(c.qs.state),"login"in f&&"function"==typeof f.login&&f.login(c),d=1===parseInt(f.oauth.version,10)?b.qs(e.oauth_proxy,c.qs):b.qs(f.oauth.auth,c.qs),a.emit("notice","Authorization URL "+d),"none"===e.display)b.append("iframe",{src:d,style:{position:"absolute",left:"-1000px",bottom:0,height:"1px",width:"1px"}},"body");else if("popup"===e.display){var l=e.window_height||550,m=e.window_width||500,n=window.open(c.qs.redirect_uri+"#oauth_redirect="+encodeURIComponent(encodeURIComponent(d)),"Authentication","resizeable=true,height="+l+",width="+m+",left="+(window.innerWidth-m)/2+",top="+(window.innerHeight-l)/2);n.focus();var o=setInterval(function(){n.closed&&(clearInterval(o),g||a.emit("complete failed error",{error:{code:"cancelled",message:"Login has been cancelled"},network:c.network}))},100)}else window.location=d;return a},logout:function(){var a=this.utils.args({name:"s",callback:"f"},arguments),b=this.use();if(b.on("complete",a.callback),a.name=a.name||b.settings.default_service,a.name&&!(a.name in b.services))return b.emitAfter("complete error",{error:{code:"invalid_network",message:"The network was unrecognized"}}),b;if(a.name&&b.utils.store(a.name))"function"==typeof b.services[a.name].logout&&b.services[a.name].logout(a),b.utils.store(a.name,"");else{if(a.name)return b.emitAfter("complete error",{error:{code:"invalid_session",message:"There was no session to remove"}}),b;for(var c in b.services)b.services.hasOwnProperty(c)&&b.logout(c);b.service(!1)}return b.emitAfter("complete logout success auth.logout auth",!0),b},getAuthResponse:function(a){return a=a||this.settings.default_service,a&&a in this.services?this.utils.store(a)||null:(this.emit("complete error",{error:{code:"invalid_network",message:"The network was unrecognized"}}),null)},events:{}}),b.utils.extend(b.utils,{qs:function(a,b){if(b){var c;for(var d in b)if(a.indexOf(d)>-1){var e="[\\?\\&]"+d+"=[^\\&]*";c=new RegExp(e),a=a.replace(c,"")}}return a+(this.isEmpty(b)?"":(a.indexOf("?")>-1?"&":"?")+this.param(b))},param:function(a){var b,c,d={};if("string"==typeof a){if(c=a.replace(/^[\#\?]/,"").match(/([^=\/\&]+)=([^\&]+)/g))for(var e=0;e<c.length;e++)b=c[e].match(/([^=]+)=(.*)/),d[b[1]]=decodeURIComponent(b[2]);return d}var f=a;d=[];for(var g in f)f.hasOwnProperty(g)&&f.hasOwnProperty(g)&&d.push([g,"?"===f[g]?"?":encodeURIComponent(f[g])].join("="));return d.join("&")},store:function(a,b){var c=JSON.parse(localStorage.getItem("__oa__"))||{};if(a&&"undefined"==typeof b)return c[a];if(a&&""===b)try{delete c[a]}catch(d){c[a]=null}else{if(!a)return c;c[a]=b}return localStorage.setItem("__oa__",JSON.stringify(c)),c},append:function(a,b,c){var d="string"==typeof a?document.createElement(a):a;if("object"==typeof b)if("tagName"in b)c=b;else for(var e in b)if(b.hasOwnProperty(e))if("object"==typeof b[e])for(var f in b[e])b[e].hasOwnProperty(f)&&(d[e][f]=b[e][f]);else"html"===e?d.innerHTML=b[e]:/^on/.test(e)?d[e]=b[e]:d.setAttribute(e,b[e]);return"body"===c?!function g(){document.body?document.body.appendChild(d):setTimeout(g,16)}():"object"==typeof c?c.appendChild(d):"string"==typeof c&&document.getElementsByTagName(c)[0].appendChild(d),d},merge:function(a,b){var c,d={};if("object"==typeof a&&"object"==typeof b){for(c in a)d[c]=a[c],c in b&&(d[c]=this.merge(a[c],b[c]));for(c in b)c in a||(d[c]=b[c])}else d=b;return d},args:function(a,b){var c={},d=0,e=null,f=null;for(f in a)if(a.hasOwnProperty(f))break;if(1===b.length&&"object"==typeof b[0]&&"o!"!=a[f])return b[0];for(f in a)if(a.hasOwnProperty(f))if(e=typeof b[d],"function"==typeof a[f]&&a[f].test(b[d])||"string"==typeof a[f]&&(a[f].indexOf("s")>-1&&"string"===e||a[f].indexOf("o")>-1&&"object"===e||a[f].indexOf("i")>-1&&"number"===e||a[f].indexOf("a")>-1&&"object"===e||a[f].indexOf("f")>-1&&"function"===e))c[f]=b[d++];else if("string"==typeof a[f]&&a[f].indexOf("!")>-1)return!1;return c},realPath:function(a){var b=window.location;for(0===a.indexOf("/")?a=b.protocol+"//"+b.host+a:a.match(/^https?\:\/\//)||(a=(b.href.replace(/#.*/,"").replace(/\/[^\/]+$/,"/")+a).replace(/\/\.\//g,"/"));/\/[^\/]+\/\.\.\//g.test(a);)a=a.replace(/\/[^\/]+\/\.\.\//g,"/");return a},diff:function(a,b){for(var c=[],d=0;d<b.length;d++)-1===this.indexOf(a,b[d])&&c.push(b[d]);return c},indexOf:function(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c++)if(a[c]===b)return c;return-1},unique:function(a){if("object"!=typeof a)return[];for(var b=[],c=0;c<a.length;c++)a[c]&&0!==a[c].length&&-1===this.indexOf(b,a[c])&&b.push(a[c]);return b},log:function(){"string"==typeof arguments[0]&&(arguments[0]="HelloJS-"+arguments[0]),"undefined"!=typeof console&&"undefined"!=typeof console.log&&("function"==typeof console.log?console.log.apply(console,arguments):console.log(Array.prototype.slice.call(arguments)))},isEmpty:function(a){if(!a)return!0;if(a&&a.length>0)return!1;if(a&&0===a.length)return!0;for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},objectCreate:function(){function a(){}return Object.create?Object.create:function(b){if(1!=arguments.length)throw new Error("Object.create implementation only accepts one parameter.");return a.prototype=b,new a}}(),Event:function(){this.parent={events:this.events,findEvents:this.findEvents,parent:this.parent,utils:this.utils},this.events={},this.on=function(a,b){if(b&&"function"==typeof b)for(var c=a.split(/[\s\,]+/),d=0;d<c.length;d++)this.events[c[d]]=[b].concat(this.events[c[d]]||[]);return this},this.off=function(a,b){return this.findEvents(a,function(a,c){b&&this.events[a][c]!==b||this.events[a].splice(c,1)}),this},this.emit=function(a){var b=Array.prototype.slice.call(arguments,1);b.push(a);for(var c=this;c&&c.findEvents;)c.findEvents(a,function(a,c){b[b.length-1]=a,this.events[a][c].apply(this,b)}),c=c.parent;return this},this.emitAfter=function(){var a=this,b=arguments;return setTimeout(function(){a.emit.apply(a,b)},0),this},this.success=function(a){return this.on("success",a)},this.error=function(a){return this.on("error",a)},this.complete=function(a){return this.on("complete",a)},this.findEvents=function(a,b){var c=a.split(/[\s\,]+/);for(var d in this.events)if(this.events.hasOwnProperty(d)&&this.utils.indexOf(c,d)>-1)for(var e=0;e<this.events[d].length;e++)b.call(this,d,e)}},globalEvent:function(a,b){return b=b||"_hellojs_"+parseInt(1e12*Math.random(),10).toString(36),window[b]=function(){var c=a.apply(this,arguments);if(c)try{delete window[b]}catch(d){}},b}}),b.utils.Event.call(b),b.subscribe=b.on,b.trigger=b.emit,b.unsubscribe=b.off,function(a){var b={},c={};!function d(){var e=(new Date).getTime()/1e3,f=function(b){a.emit("auth."+b,{network:g,authResponse:h})};for(var g in a.services)if(a.services.hasOwnProperty(g)){if(!a.services[g].id)continue;var h=a.utils.store(g)||{},i=a.services[g],j=b[g]||{};if(h&&"callback"in h){var k=h.callback;try{delete h.callback}catch(l){}a.utils.store(g,h);try{window[k](h)}catch(l){}}if(h&&"expires"in h&&h.expires<e){var m=!("autorefresh"in i)||i.autorefresh;!m||g in c&&!(c[g]<e)?m||g in c||(f("expired"),c[g]=!0):(a.emit("notice",g+" has expired trying to resignin"),a.login(g,{display:"none",force:!1}),c[g]=e+600);continue}if(j.access_token===h.access_token&&j.expires===h.expires)continue;!h.access_token&&j.access_token?f("logout"):h.access_token&&!j.access_token?f("login"):h.expires!==j.expires&&f("update"),b[g]=h,g in c&&delete c[g]}setTimeout(d,1e3)}()}(b),function(a,b){function c(a,c){if(d.store(c.network,c),!("display"in g)||"page"!==g.display){var e=b.opener||b.parent;if(e){var h=c.callback;try{delete c.callback}catch(i){}if(d.store(c.network,c),!(h in e))return void f("Error: Callback missing from parent window, snap!");try{e[h](c)}catch(i){return void f("Error thrown whilst executing parent callback",i)}}try{b.close()}catch(i){}return b.addEventListener("load",function(){b.close()}),void f("Trying to close window")}}var d=a.utils,e=b.location,f=function(a,b){d.append("p",{text:a},document.documentElement),b&&console.log(b)},g=d.merge(d.param(e.search||""),d.param(e.hash||""));if(g&&"state"in g){try{var h=JSON.parse(g.state);g=d.merge(g,h)}catch(i){f("Could not decode state parameter")}"access_token"in g&&g.access_token&&g.network?(g.expires_in&&0!==parseInt(g.expires_in,10)||(g.expires_in=0),g.expires_in=parseInt(g.expires_in,10),g.expires=(new Date).getTime()/1e3+(g.expires_in||31536e3),a.service(g.network),c(g.network,g)):"error"in g&&g.error&&g.network&&(g.error={code:g.error,message:g.error_message||g.error_description},c(g.network,g)),g&&g.callback&&"result"in g&&g.result&&g.callback in b.parent&&b.parent[g.callback](JSON.parse(g.result))}else if("oauth_redirect"in g)return void(b.location=decodeURIComponent(g.oauth_redirect));if(g=d.param(e.search),g.code&&g.state||g.oauth_token&&g.proxy_url){g.redirect_uri=e.href.replace(/[\?\#].*$/,"");var j=JSON.parse(g.state),k=(j.oauth_proxy||g.proxy_url)+"?"+d.param(g);b.location=k}}(b,window),b.api=function(){function a(a){if(c.data=e.clone(f),"get"===c.method){for(var g,h=/[\?\&]([^=&]+)(=([^&]+))?/gi;g=h.exec(a);)c.data[g[1]]=g[3];a=a.replace(/\?.*/,"")}var l=i[{"delete":"del"}[c.method]||c.method]||{},m=l[a]||l["default"]||a,n=function(a){a=a.replace(/\@\{([a-z\_\-]+)(\|.+?)?\}/gi,function(a,b,e){var f=e?e.replace(/^\|/,""):"";return b in c.data?(f=c.data[b],delete c.data[b]):"undefined"==typeof e&&d.emitAfter("error",{error:{code:"missing_attribute_"+b,message:"The attribute "+b+" is missing from the request"}}),f}),a.match(/^https?:\/\//)||(a=i.base+a);var f={},g=function(g,h){g&&("function"==typeof g?g(f):f=e.merge(f,g));var j=e.qs(a,f||{});d.emit("notice","Request "+j),b(c.network,j,c.method,c.data,i.querystring,h)};if(!e.isEmpty(c.data)&&!("FileList"in window)&&e.hasBinary(c.data))return e.post(g,c.data,"form"in i?i.form(c):null,j),d;if("delete"===c.method){var h=j;j=function(a,b){h(!a||e.isEmpty(a)?{success:!0}:a,b)}}if("withCredentials"in new XMLHttpRequest&&(!("xhr"in i)||i.xhr&&i.xhr(c,f))){var l=e.xhr(c.method,g,c.headers,c.data,j);l.onprogress=function(a){d.emit("progress",a)},l.upload.onprogress=function(a){d.emit("uploadprogress",a)}}else{if(c.callbackID=e.globalEvent(),"jsonp"in i&&i.jsonp(c,f),"api"in i&&i.api(a,c,{access_token:k.access_token},j))return;"post"===c.method?(f.redirect_uri=d.settings.redirect_uri,f.state=JSON.stringify({callback:c.callbackID}),e.post(g,c.data,"form"in i?i.form(c):null,j,c.callbackID,d.settings.timeout)):(f=e.merge(f,c.data),f.callback=c.callbackID,e.jsonp(g,j,c.callbackID,d.settings.timeout))}};"function"==typeof m?m(c,n):n(m)}function b(a,b,c,f,g,h){var i=d.services[a],j=k?k.access_token:null,l=i.oauth&&1===parseInt(i.oauth.version,10)?d.settings.oauth_proxy:null;if(l)return void h(e.qs(l,{path:b,access_token:j||"",then:"get"===c.toLowerCase()?"redirect":"proxy",method:c,suppress_response_codes:!0}));var m={access_token:j||""};g&&g(m),h(e.qs(b,m))}var c=this.utils.args({path:"s!",method:"s",data:"o",timeout:"i",callback:"f"},arguments),d=this.use(),e=d.utils;d.args=c,c.method=(c.method||"get").toLowerCase();var f=c.data=c.data||{};d.on("complete",c.callback),c.path=c.path.replace(/^\/+/,"");var g=(c.path.split(/[\/\:]/,2)||[])[0].toLowerCase();if(g in d.services){c.network=g;var h=new RegExp("^"+g+":?/?");c.path=c.path.replace(h,"")}c.network=d.settings.default_service=c.network||d.settings.default_service;var i=d.services[c.network];if(!i)return d.emitAfter("complete error",{error:{code:"invalid_network",message:"Could not match the service requested: "+c.network}}),d;c.timeout&&(d.settings.timeout=c.timeout),d.emit("notice","API request "+c.method.toUpperCase()+" '"+c.path+"' (request)",c);var j=function(b,e){if(i.wrap&&(c.path in i.wrap||"default"in i.wrap)){var f=c.path in i.wrap?c.path:"default",g=(new Date).getTime(),h=i.wrap[f](b,e,c);h&&(b=h),d.emit("notice","Processing took"+((new Date).getTime()-g))}d.emit("notice","API: "+c.method.toUpperCase()+" '"+c.path+"' (response)",b);var j=null;b&&"paging"in b&&b.paging.next&&(j=function(){a((b.paging.next.match(/^\?/)?c.path:"")+b.paging.next)}),d.emit("complete "+(!b||"error"in b?"error":"success"),b,j)};if(c.method in i&&c.path in i[c.method]&&i[c.method][c.path]===!1)return d.emitAfter("complete error",{error:{code:"invalid_path",message:"The provided path is not available on the selected network"}});var k=d.getAuthResponse(c.network);return a(c.path),d},b.utils.extend(b.utils,{isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},domInstance:function(a,b){var c="HTML"+(a||"").replace(/^[a-z]/,function(a){return a.toUpperCase()})+"Element";return window[c]?b instanceof window[c]:window.Element?b instanceof window.Element&&(!a||b.tagName&&b.tagName.toLowerCase()===a):!(b instanceof Object||b instanceof Array||b instanceof String||b instanceof Number)&&b.tagName&&b.tagName.toLowerCase()===a},clone:function(a){if("nodeName"in a)return a;var b,c={};for(b in a)c[b]="object"==typeof a[b]?this.clone(a[b]):a[b];return c},xhr:function(a,b,c,d,e){function f(a){for(var b,c={},d=/([a-z\-]+):\s?(.*);?/gi;b=d.exec(a);)c[b[1]]=b[2];return c}var g=this;if("function"!=typeof b){var h=b;b=function(a,b){b(g.qs(h,a))}}var i=new XMLHttpRequest,j=!1;"blob"===a&&(j=a,a="GET"),a=a.toUpperCase(),i.onload=function(){var b=i.response;try{b=JSON.parse(i.responseText)}catch(c){401===i.status&&(b={error:{code:"access_denied",message:i.statusText}})}var d=f(i.getAllResponseHeaders());d.statusCode=i.status,e(b||("DELETE"!==a?{error:{message:"Could not get resource"}}:{}),d)},i.onerror=function(){var a=i.responseText;try{a=JSON.parse(i.responseText)}catch(b){}e(a||{error:{code:"access_denied",message:"Could not get resource"}})};var k,l={};if("GET"===a||"DELETE"===a)g.isEmpty(d)||(l=g.merge(l,d)),d=null;else if(!(!d||"string"==typeof d||d instanceof FormData||d instanceof File||d instanceof Blob)){var m=new FormData;for(k in d)d.hasOwnProperty(k)&&(d[k]instanceof HTMLInputElement?"files"in d[k]&&d[k].files.length>0&&m.append(k,d[k].files[0]):d[k]instanceof Blob?m.append(k,d[k],d.name):m.append(k,d[k]));d=m}return b(l,function(b){if(i.open(a,b,!0),j&&("responseType"in i?i.responseType=j:i.overrideMimeType("text/plain; charset=x-user-defined")),c)for(var e in c)i.setRequestHeader(e,c[e]);i.send(d)}),i},jsonp:function(a,b,c,d){var e,f,g=this,h=0,i=document.getElementsByTagName("head")[0],j={error:{message:"server_error",code:"server_error"}},k=function(){h++||window.setTimeout(function(){b(j),i.removeChild(f)},0)},l=g.globalEvent(function(a){return j=a,!0},c);if("function"!=typeof a){var m=a;m=m.replace(new RegExp("=\\?(&|$)"),"="+l+"$1"),a=function(a,b){b(g.qs(m,a))}}a(function(a){for(var b in a)a.hasOwnProperty(b)&&"?"===a[b]&&(a[b]=l)},function(a){f=g.append("script",{id:l,name:l,src:a,async:!0,onload:k,onerror:k,onreadystatechange:function(){/loaded|complete/i.test(this.readyState)&&k()}}),window.navigator.userAgent.toLowerCase().indexOf("opera")>-1&&(e=g.append("script",{text:"document.getElementById('"+l+"').onerror();"}),f.async=!1),d&&window.setTimeout(function(){j={error:{message:"timeout",code:"timeout"}},k()},d),i.appendChild(f),e&&i.appendChild(e)})},post:function(a,b,c,d,e,f){var g=this,h=document;if("function"!=typeof a){var i=a;a=function(a,b){b(g.qs(i,a))}}var j,k=null,l=[],m=0,n=null,o=0,p=function(a){o++||d(a)};g.globalEvent(p,e);var q;try{q=h.createElement('<iframe name="'+e+'">')}catch(r){q=h.createElement("iframe")}if(q.name=e,q.id=e,q.style.display="none",c&&c.callbackonload&&(q.onload=function(){p({response:"posted",message:"Content was posted"})}),f&&setTimeout(function(){p({error:{code:"timeout",message:"The post operation timed out"}})},f),h.body.appendChild(q),g.domInstance("form",b)){for(k=b.form,m=0;m<k.elements.length;m++)k.elements[m]!==b&&k.elements[m].setAttribute("disabled",!0);b=k}if(g.domInstance("form",b))for(k=b,m=0;m<k.elements.length;m++)k.elements[m].disabled||"file"!==k.elements[m].type||(k.encoding=k.enctype="multipart/form-data",k.elements[m].setAttribute("name","file"));else{for(n in b)b.hasOwnProperty(n)&&g.domInstance("input",b[n])&&"file"===b[n].type&&(k=b[n].form,k.encoding=k.enctype="multipart/form-data");k||(k=h.createElement("form"),h.body.appendChild(k),j=k);var s,m;for(n in b)if(b.hasOwnProperty(n)){var t=g.domInstance("input",b[n])||g.domInstance("textArea",b[n])||g.domInstance("select",b[n]);if(t&&b[n].form===k)t&&b[n].name!==n&&(b[n].setAttribute("name",n),b[n].name=n);else{var u=k.elements[n];if(s)for(u instanceof NodeList||(u=[u]),m=0;m<u.length;m++)u[m].parentNode.removeChild(u[m]);s=h.createElement("input"),s.setAttribute("type","hidden"),s.setAttribute("name",n),s.value=t?b[n].value:g.domInstance(null,b[n])?b[n].innerHTML||b[n].innerText:b[n],k.appendChild(s)}}for(m=0;m<k.elements.length;m++)s=k.elements[m],s.name in b||s.getAttribute("disabled")===!0||(s.setAttribute("disabled",!0),l.push(s))}k.setAttribute("method","POST"),k.setAttribute("target",e),k.target=e,a({},function(a){k.setAttribute("action",a),setTimeout(function(){k.submit(),setTimeout(function(){try{j&&j.parentNode.removeChild(j)}catch(a){try{console.error("HelloJS: could not remove iframe")}catch(b){}}for(var c=0;c<l.length;c++)l[c]&&(l[c].setAttribute("disabled",!1),l[c].disabled=!1)},0)},100)})},hasBinary:function(a){var b=window;for(var c in a)if(a.hasOwnProperty(c)&&(this.domInstance("input",a[c])&&"file"===a[c].type||"FileList"in b&&a[c]instanceof b.FileList||"File"in b&&a[c]instanceof b.File||"Blob"in b&&a[c]instanceof b.Blob))return!0;return!1}}),function(a){var b=a.api,c=a.utils;c.extend(c,{dataToJSON:function(a){var b=this,c=window,d=a.data;if(b.domInstance("form",d)?d=b.nodeListToJSON(d.elements):"NodeList"in c&&d instanceof NodeList?d=b.nodeListToJSON(d):b.domInstance("input",d)&&(d=b.nodeListToJSON([d])),("File"in c&&d instanceof c.File||"Blob"in c&&d instanceof c.Blob||"FileList"in c&&d instanceof c.FileList)&&(d={file:d}),!("FormData"in c&&d instanceof c.FormData))for(var e in d)if(d.hasOwnProperty(e))if("FileList"in c&&d[e]instanceof c.FileList)1===d[e].length&&(d[e]=d[e][0]);else{if(b.domInstance("input",d[e])&&"file"===d[e].type)continue;b.domInstance("input",d[e])||b.domInstance("select",d[e])||b.domInstance("textArea",d[e])?d[e]=d[e].value:b.domInstance(null,d[e])&&(d[e]=d[e].innerHTML||d[e].innerText)}return a.data=d,d},nodeListToJSON:function(a){for(var b={},c=0;c<a.length;c++){var d=a[c];!d.disabled&&d.name&&(b[d.name]="file"===d.type?d:d.value||d.innerHTML)}return b}}),a.api=function(){var a=c.args({path:"s!",method:"s",data:"o",timeout:"i",callback:"f"},arguments);return c.dataToJSON(a),b.call(this,a)}}(b),function(a){var b;return b={readmoo:{name:"Readmoo",base:"https://api.readmoo.com/",oauth:{version:2,auth:"https://readmoo.com/member/oauth",logout:"https://readmoo.com/member/oauth/sign_out"},scope:{me:"me",reading:"reading",highlight:"highlight",like:"like",comment:"comment",library:"library"},get:{me:"me"},xhr:function(a){var b;return(b=localStorage.getItem("__oa__"))?(b=JSON.parse(b),b.readmoo&&b.readmoo.client_id?(a.data=a.data||{},a.data.client_id=b.readmoo.client_id,/^(?:post|put|delete)$/i.test(a.method)&&(a.data=a.data||{},a.data.access_token=b.readmoo.access_token),!0):!1):!1},logout:function(a){var b,c;return b=a.callback,c=new XMLHttpRequest,c.onreadystatechange=function(){if(c.readyState===c.DOME)switch(c.status){case 200:b(!0);break;default:b(!1)}},c.open("GET",this.oauth.logout,!0),c.send()}}},a.init(b)}(b);var c;c=function(){function a(a,c,d){this._clientId=a,this._redirectUri=c,d&&(d.scope&&this.setScope(d.scope),d.display&&this.setDisplay(d.display),d.responseType&&this.setResponseType(d.responseType)),b.init({readmoo:this._clientId},{redirect_uri:this._redirectUri}),this._inst_=b("readmoo")}return a.prototype._inst_=null,a.prototype._clientId=null,a.prototype._redirectUri=null,a.prototype._scope=["reading","highlight","like","comment","me","library"].join(","),a.prototype._response_type="token",a.prototype._display="popup",a.prototype._others=null,a.prototype.setClientId=function(a){return this._clientId=a},a.prototype.getClientId=function(){return this._clientId},a.prototype.setRedirectUri=function(a){return this._redirectUri=a},a.prototype.getRedirectUri=function(){return this._redirectUri},a.prototype.setScope=function(a){var b;return b=a instanceof Array?a.join(","):a,this._scope=b},a.prototype.getScope=function(){return this._scope.split(",")},a.prototype.setResponseType=function(a){return this._response_type=a},a.prototype.getResponseType=function(){return this._response_type},a.prototype.setDisplay=function(a){return this._display=a},a.prototype.getDisplay=function(){return this._display},a}();var d,e;e="_raoh_",function(){var a;a=localStorage.getItem(e),a&&(localStorage.removeItem(e),window.location.href=a)}(),d=function(){function a(a,b,d){this.config=new c(a,b,d),this._inst_=this.config._inst_,this.api._sp=this}return a.prototype._inst_=null,a.prototype.login=function(a){this.config.getRedirectUri()!==location.href&&localStorage.setItem(e,location.href),this._inst_.login("readmoo",{scope:this.config.getScope(),response_type:this.config.getResponseType(),display:this.config.getDisplay()},a)},a.prototype.logout=function(a){this._inst_.logout("readmoo",a)},a.prototype.online=function(){var a,b;return b=this._inst_.getAuthResponse(),a=(new Date).getTime()/1e3,b&&b.access_token&&b.expires>a},a.prototype.on=function(){return this._inst_.on.apply(this._inst_,arguments),this},a.prototype.off=function(){return this._inst_.off.apply(this._inst_,arguments),this},a.prototype.__a__=function(){var a;return a=Array.prototype.slice.call(arguments),this._inst_.api.apply(this._inst_,a)},a.prototype.api={},a}();var f;f={paramFilter:function(a,b){var c,d,e,f,g;for(null==a&&(a={}),c={},f=0,g=b.length;g>f;f++)d=b[f],a.hasOwnProperty(d)&&(e=a[d],"object"==typeof e&&(e=JSON.stringify(e)),c[d]=e);return c}},function(){var a;a=function(a){var b=this;return{get:function(){var c;return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("/bookmarks","GET",c)},getBookmarksByReadingId:function(){var c;if(!a.readingId)throw new TypeError("A reading id must be provided");return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("readings/"+a.readingId+"/bookmarks","GET",c)},getBookmarksByUserId:function(){var c;if(!a.userId)throw new TypeError("An user id must be provided");return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("users/"+a.userId+"/bookmarks","GET",c)},createBookmarkByReadingId:function(){var c;if(!a.readingId)throw new TypeError("A reading id must be provided.");return c=f.paramFilter(a,["bookmark[content]","bookmark[locators]","bookmark[position]","bookmark[bookmarked_at]","bookmark[device]"]),b._sp.__a__("readings/"+a.readingId+"/bookmarks","POST",c)},deleteBookmarkByBookmarkId:function(){if(!a.bookmarkId)throw new TypeError("A bookmark id must be provided");return b._sp.__a__("bookmarks/"+a.bookmarkId,"DELETE")}}},b.utils.extend(d.prototype.api,{bookmarks:a})}(),function(){var a;a=function(a){var b=this;return{getBookByBookId:function(){if(!a.book_id)throw new TypeError("A book id need provided");return b._sp.__a__("books/"+a.book_id)}}},b.utils.extend(d.prototype.api,{books:a})}(),function(){var a,c;a={},c=function(a){var b=this;return{getCommentByCommentId:function(){if(!a.commentId)throw new TypeError("A comment id must be provided");return b._sp.__a__("comments/"+a.commentId,"GET")},deleteCommentByCommentId:function(){if(!a.commentId)throw new TypeError("A comment id must be provided");return b._sp.__a__("comments/"+a.commentId,"DELETE")},getCommentsByHighlightId:function(){var c;if(!a.highlightId)throw new TypeError("A highlight id must be provided");return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("highlights/"+a.highlightId+"/comments","GET",c)},createCommentByHighlightId:function(){var c;if(!a.highlightId)throw new TypeError("A highlight id must be provided");return c=f.paramFilter(a,["comment[content]","comment[posted_at]"]),b._sp.__a__("highlights/"+a.highlightId+"/comments","POST",c)}}},b.utils.extend(c,a),b.utils.extend(d.prototype.api,{comments:c})}(),function(){var a;a=function(a){var b=this;return{send:function(){var c;return c=f.paramFilter(a,["type","url","subject","email","bug"]),b._sp.__a__("feedback","POST",c)},postWordsError:function(){if(a.bug="原文:"+a.original+"  回報:"+a.report,a.email&&a.subject&&a.url)return this.send();throw new Error("Have missing items in options")}}},b.utils.extend(d.prototype.api,{feedback:a})}(),function(){var a;a=function(a){var b=this;return{get:function(){var c;return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("highlights","GET",c)},getHighlightsByUserId:function(){var c;if(!a.userId)throw new TypeError("An user id must be provided");return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("users/"+a.userId+"/highlights","GET",c)},getHighlightsByReadingId:function(){var c;if(!a.readingId)throw new TypeError("A reading id must be provided");return c=f.paramFilter(a,["count","from","to","order"]),b._sp.__a__("readings/"+a.readingId+"/highlights","GET",c)},createHighlightByReadingId:function(){var c;if(!a.readingId)throw new TypeError("A reading id must be provided");return c=f.paramFilter(a,["highlight[content]","highlight[locators]","highlight[position]","highlight[highlight_at]","highlight[post_to[][id]]","comment[content]"]),b._sp.__a__("readings/"+a.readingId+"/highlights","POST",c)},deleteHighlightByHighlightId:function(){if(!a.highlightId)throw new TypeError("A highlight id must be provided");return b._sp.__a__("highlights/"+a.highlightId,"DELETE")}}},b.utils.extend(d.prototype.api,{highlights:a})}(),function(){var a;a=function(a){var b,c=this;return b={},{get:function(){if(!a)throw new TypeError("A library id need provided");return c._sp.__a__("me/library/"+a)},compare:function(a){return a||(a=[]),!a instanceof Array&&(a=[a]),b.local_ids=a?a.join(","):"",c._sp.__a__("me/library/compare","GET",b)}}},b.utils.extend(d.prototype.api,{library:a})}(),function(){var a,c;a={ORDER_TOUCHED_AT:"touched_at",ORDER_CREATED_AT:"created_at",ORDER_POPULAR:"popular",ORDER_FRIENDS_FIRST:"friends_first",FILTER_FOLLOWINGS:"followings",STATE_INTERESTING:"interesting",STATE_READING:"reading",STATE_FINISHED:"finished",STATE_ABANDONED:"abandoned"},c=function(b){var c=this;return{get:function(){var a;return a=f.paramFilter(b,["count","from","to","order","filter","highlights_count[from]","highlights_count[to]","states"]),c._sp.__a__("readings","GET",a)},getReadingsByUserIdWithMatch:function(){var a;if(!b.userId)throw new TypeError("An user id need provided");return a=f.paramFilter(b,["author","title","identifier","book_id"]),c._sp.__a__("users/"+b.userId+"/readings/match","GET",a)},getReadingByReadingId:function(){if(!b.readingId)throw new TypeError("An user id must be provided");return c._sp.__a__("readings/"+b.readingId)},getReadingsByUserId:function(){var a;if(!b.userId)throw new TypeError("A book id must be provided");return a=f.paramFilter(b,["count","from","to","order","filter","highlights_count[from]","highlights_count[to]","states"]),c._sp.__a__("users/"+b.userId+"/readings","GET",a)},createReadingByBookId:function(){var d,e,g;if(g=b["reading[state]"],d=b.book_id,!d)throw new TypeError("A book id need to provided");if(!g||g!==a.STATE_INTERESTING&&g!==a.STATE_READING)throw new TypeError("State value must be `interesting` or `reading`");return e=f.paramFilter(b,["reading[state]","reading[private]","reading[started_at]","reading[finished_at]","reading[abandoned_at]","reading[via_id]","reading[recommended]","reading[closing_remark]","reading[post_to[][id]]"]),c._sp.__a__("books/"+d+"/readings","POST",e)},updateReadingByReadingId:function(){var a,d,e;if(e=b["reading[state]"],d=b.reading_id,!d)throw new TypeError("A reading id need to provided");if(!e)throw new TypeError("A state need to be provided");return a=f.paramFilter(b,["reading[state]","reading[private]","reading[started_at]","reading[finished_at]","reading[abandoned_at]","reading[via_id]","reading[recommended]","reading[closing_remark]","reading[post_to[][id]]"]),c._sp.__a__("readings/"+d,"PUT",a)},finishReadingByReadingId:function(){return b["reading[state]"]=a.STATE_FINISHED,b["reading[finished_at]"]=(new Date).toISOString(),this.updateReadingByReadingId()},abandonedReadingByReadingId:function(){return b["reading[state]"]=a.STATE_ABANDONED,b["reading[abandoned_at]"]=(new Date).toISOString(),this.updateReadingByReadingId()},getReadingsByBookId:function(){var a;if(!b.bookId)throw new TypeError("A book id need provided");return a=f.paramFilter(b,["count","from","to","order","filter","highlights_count[from]","highlights_count[to]","states"]),c._sp.__a__("books/"+b.bookId+"/readings","GET",a)},ping:function(){var a;if(!b.readingId)throw new TypeError("A reading id must be provided");return a=f.paramFilter(b,["ping[identifier]","ping[progress]","ping[duration]","ping[occurred_at]","ping[lat]","ping[lng]","ping[cfi]"]),c._sp.__a__("readings/"+b.readingId+"/ping","POST",a)}}},b.utils.extend(c,a),b.utils.extend(d.prototype.api,{readings:c})}(),function(){var a,c;return a=function(){var a=this;return{get:function(){return a._sp.__a__("me")
}}},c=function(a){var b=this;return{get:function(){if(!a)throw new TypeError("An user id need provided");return b._sp.__a__("users/"+a)}}},b.utils.extend(d.prototype.api,{me:a,users:c})}();var g=window.readmoo;g||(g={}),g.OAuthAPI=d,window.readmoo=g}();