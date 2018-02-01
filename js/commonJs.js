//常用正则表达式
var publicRegx = {
    chinese : /[\u4e00-\u9fa5]/,
    emial : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
    password : /(^.*?[a-zA-Z]+.*?\d+.*?$)|(^.*?\d+.*?[a-zA-Z]+.*?$)/,  //密码不能为纯数字或纯英文且不能为中文
    trim : /^\s+|\s+$/g,
    contOneSpace : /\s+/g
};


var publicRegxMethod = {
    
    trim : function(str){
        return str.replace(publicRegx.trim,'');
    },
    contOneSpace : function(str){
        str = this.trim(str);
        return str.replace(publicRegx.contOneSpace,' ');
    },
    inputOnlyNum : function(jq_el){
    	
    	var val = jq_el.val();
    	//var val = parseInt(jq_el.val());
    	
    	if(val.indexOf('.') !== -1){
    		val = parseFloat(val);
    	}
    	else{
    		val = parseInt(val);
    	}

		if( isNaN(val)){
			val = '';
		}
		jq_el.val(val);
    },
    getFileName : function(filePath,type){
    	var fName,
    		ind,
    		extName;
    	
    	if( !publicIsType('string',filePath) ){
    		return;
    	}	
    	
    	ind = filePath.lastIndexOf('/');
    	
    	if(ind === -1){
    		fName = filePath.split('.');
    		if(fName.length >= 1){
    			return;
    		}
    		extName = fName[1];
    		fName = fName[0];
    		
    	}
    	else{
    		fName = filePath.slice(-ind).split('.');
    		extName = fName[1];
    		fName = fName[0];
    	}
    	
    	if(type){
    		return {fName:fName+'.'+extName,name:fName,ext:extName};
    	}
    	else{
    		return fName+'.'+extName;
    	}
 
    },
    formatIndSrt : function(arr){
    	if(!publicIsType('array',arr)){
    		return '';
    	}
    	
    	return ';'+(arr.join(';'))+';';
    	
    }
    
};

function publicIsType(type,obj){
    
    var ObjProtoStr =  Object.prototype.toString;
    
    if(!type || ObjProtoStr.call(obj) === '[object String]'){
        return;
    }
    
    switch(type){
    
        case 'string' : return ObjProtoStr.call(obj) === '[object String]';
            break;
        case 'object' : return ObjProtoStr.call(obj) === '[object Object]';
            break;
        case 'array' : return ObjProtoStr.call(obj) === '[object Array]';
            break;
    
    }   
    
}
    

//校验表单方法
/*
function validateRequire(className,name){
    var val = obj.val();
    if("" == val){
        alert(name+" 不能为空!");
        return false;
    }
    return true;
}*/
//校验手机号/固话
function validatePhone(tel){
    var mobile = /^1[3|5|8]\d{9}$/;
    var phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
}

//检查是否是中文
function isChinese(str){
    var s = ''+str;
    return publicRegx.chinese.test(s);
}

function _selfMagerParm(opts,optParm){
    
    if( Object.prototype.toString.call(opts) !== '[object Object]' || Object.prototype.toString.call(optParm) !== '[object Object]' ){
        return;
    }
    
    var key;
    
    for (key in opts) {

        if(opts.hasOwnProperty(key)){

            if( Object.prototype.toString.call(key) === '[object Aarray]'){
                var len = key.length;

                for(;len--;){
                    if(optParm[key][len]){
                        opts[key][len] = optParm[key][len];
                    }
                }
            }
            else if(optParm[key] || optParm[key] === 0){
                opts[key] = optParm[key];
            }

        }
    }
}


/*
* bootstrap 弹窗方法
* 参数
*   opt 类型为 obeject
*
* 参数说明
*   til 标题
*   msg、 tpls模板
*   btnNum 按钮数量 0为没有按钮
*   size  弹窗尺寸 值为'wide'时为宽尺寸
*   btnName 按钮名字 小标为零的为确认按钮，小标为1的为取消按钮 类型为数组 (只有一个按钮的情况下默认按钮名为确定，改功能未测试) 换名字的时候 opt.btnName = ['关闭']；此时btnNum的值一定为1，不然超过1就会报错
*   ready 弹窗展示时执行的回调
*   fasleFn 点击弹窗取消按钮的回调  (回调报错是能关闭弹窗，改功能未测试)
*   trueFn 点击弹窗确认按钮的回调 (回调报错是能关闭弹窗，改功能未测试)
*   cb 弹窗关闭执行的回调（有两个个按钮的情况下，点击确定按钮才能执行回调）
* 
*/
function PublicPop(opt){
    
    if(!opt || Object.prototype.toString.call(opt) !== '[object Object]' ){
        return;
    }

    var opts = {
            til : '提示',
            msg : '',
            tpls : '',
            size : '',
            btnName : ['确定','取消'],
            btnNum : 2,
            ready : function(tplJqObj){},
            fasleFn : function(){},
            trueFn : function(){},
            cb : function(){}
        },
        key,
        btnObj,
        $content = null;

    function runFn(fn){
        try{
            return fn();
        }
        catch(e){
            console.log(e.message);//不支持IE6，如要支持if(console){console.log(e.message);}else{alert(e.message);}
            return false;
        }
    }

    for (key in opts) {

        if(opts.hasOwnProperty(key)){

            if( Object.prototype.toString.call(key) === '[object Aarray]'){
                var len = key.length;

                for(;len--;){
                    if(opt[key][len]){
                        opts[key][len] = opt[key][len];
                    }
                }

            }
            else if(opt[key] || opt[key] === 0){
                opts[key] = opt[key];
            }

        }
    }
    if(opts.btnNum === 2){
        btnObj = [{
            label: opts.btnName[0],
            cssClass: 'btn-primary',
            action: function (dialog) {

                if(!runFn(opts.trueFn)){
                    dialog.close();
                }  

                opts.cb();

            }
        }, {
            label: opts.btnName[1],
            action: function (dialog) {

                if( !runFn(opts.fasleFn)){
                    dialog.close();
                }
   
            }
        }];
    }
    else if(opts.btnNum === 1){ 
        btnObj = [{
            label: opts.btnName[0],
            cssClass: 'btn-primary',
            action: function (dialog) {
                dialog.close();
            }
        }];
    }
    else if(opts.btnNum == 0){ 
        btnObj = [];
    }

    BootstrapDialog.show({
        title: opts.til,
        message: function (dialog){
            
            if(opts.tpls){
                $content = opts.tpls;
            }
            else if(opts.msg){
                $content = $(opts.msg);
            }

            if(opts.size === 'wide'){
                dialog.setSize(BootstrapDialog.SIZE_WIDE);
            }
            return $content;
        },
        onshown: function(dialogRef){
            opts.ready(dialogRef,$content);
        },
        buttons: btnObj
    });
}

function publicIsEmail(email){
    return publicRegx.emial.test(email);
}



/*获取密码强度*/

//测试某个字符是属于哪一类
function ckeckPwd_CharMode(iN) {
   if (iN>=48 && iN <=57) //数字
    return 1;
   if (iN>=65 && iN <=90) //大写字母
    return 2;
   if (iN>=97 && iN <=122) //小写
    return 4;
   else
    return 8; //特殊字符
}
//bitTotal函数
//计算出当前密码当中一共有多少种模式
function ckeckPwd_bitTotal(num) {
   modes=0;
   for (i=0;i<4;i++) {
    if (num & 1) modes++;
     num>>>=1;
    }
   return modes;
}
//sPW密码，len至少要达到的长度，默认为0
//返回值false表示长度达不到，数值表示强度

function ckeckPwd_checkStrong(sPW,len) {
    var str_len = len || 0,
        Modes = 0; 
    
    if (sPW.length < str_len){
        return false; //密码太短
    }
        
    
    for (i=0;i<sPW.length;i++) {
     //测试每一个字符的类别并统计一共有多少种模式
     Modes|=ckeckPwd_CharMode(sPW.charCodeAt(i));
   }
   return ckeckPwd_bitTotal(Modes);
}
/*获取密码强度 end*/


/*加载遮罩*/
var $honeLoading = $('#homeLoadding');

function publicLoadingShow(){
    $honeLoading.show();
}

function publicLoadingHide(){
    $honeLoading.hide();
}


function publicSupport_css3(prop){
   var div = document.createElement('div'),
       vendors = 'Ms O Moz Webkit'.split(' '),
       len = vendors.length;
   
   if ( prop in div.style ) return true;
   
   prop = prop.replace(/^[a-z]/, function(val) {
      return val.toUpperCase();
   });
   
   while(len--) {
       if ( vendors[len] + prop in div.style ) {
          return true;
       } 
   }
   return false;
   
}

function PublicSetSelfIframeHei(opt){

    if( Object.prototype.toString.call(opt) !== '[object Object]' ){
        return;
    }
    
    /*var opts = {
     * 
     	parent : 'window.parent.document'
        ifm_id : '',
        set_hei : '',
        ajust_hei : ''
    }*/
    
    if( (!opt.parent && !opt.ifm_id) || ( (!opt.set_hei && opt.set_hei != 0) && !opt.ajust_hei)){
        return;
    }
    
    var temp = opt.ajust_hei ? opt.ajust_hei : opt.set_hei,
        fullHei = $(window.top.document).find('.consoleWarpBox').height();
    
    temp = opt.ajust_hei ? String(fullHei - opt.ajust_hei) :  ''+temp;
  
    if( temp.indexOf('%') === -1 ){
        if(temp.indexOf('px') === -1){
            temp += 'px';
        }
    }

    if(opt.parent){
    	opt.parent.style.height = temp;
    }
    else{
    	window.parent.contentWindow.document.getElementById(opt.ifm_id).style.height = temp;
    }
     
}


