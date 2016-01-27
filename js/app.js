// 图片加载时回调
//var imgLoad = (function(){
//	return function(url, callback, errorCb){
//		var img = new Image();
//		img.src = url;
//		if (img.complete) {
//          callback.call(img);
//          return;
//      };
//      img.onload = function () {
//      	callback.call(this);
//          img = img.onload = img.onerror = null;
//      };
//      img.onerror = errorCb || function(){};
//	}
//})();

//function multi_swipe(){
//	console.log('test');
//}

//function getSrcGlobal(obj){
//	return obj.css('background-image').replace(/^url\(|\)$/g, '');
//}

//function LoadMp3Callback(){
//
//}

//var lotteryEnd = false;

//	function getSrc(obj){
//		return obj.css('background-image').replace(/^url\(|\)$/g, '');
//	}

//	function initLottery(){
//		loadImg();
//		initSwipe();
//		$('#lottery').hide();
//	}

	// 清遮罩，载图
//	function loadImg(){
//		$('#swipe li').each(function(i){
//			if(i == config.swipeCur) return;
//
//			var src = getSrc($(this).find('div')),
//				img = new Image(),
//				_this = this;
//
//			if(src == 'none'){ return; }
//
//			img.src = src;
//
//			if($(this).data('role') == 'blur'){
//				img.onload = function(){
//					$(_this).stackBlur({img: img, radius: 10, callback: function(){
//						$(_this).data('role', '');
//					}});
//				}				
//			}
//		});
//	}

//	function initSwipe(){

//		if(config.enable_music){
//			audioPlayer._audio.play();
//		}

//		if(!config.enable_music){
//			audioPlayer.isPlay = false;
//			$(audioPlayer.el).removeClass('on');
//		}

//		var isInitSwipe = $('#swipe li').length > 1;
//
//		if(isInitSwipe){
//			$('#swipe').swipe({
//				cur: config.swipeCur,
//				dir: config.swipeDir,
//				success: function(){
//					$(this).find('li').eq(config.swipeCur).removeAttr('style');
//					// $('.f-hide').removeClass('f-hide');
//					//initPage(isInitSwipe);
//				}
//			});
//		}else{
//			$('#swipe li').eq(0).show();
//			//initPage(isInitSwipe);
//		}
//	}

	//function initPage(isInitSwipe){

		//$('#musicWrap').removeClass('f-hide');

		// 显示剪头
//		if(isInitSwipe){
//			$('#arrow' + (config.swipeDir == 'vertical' ? 'V' : 'H' )).removeClass('f-hide').children().addClass('move');
//		}

//		$('[data-role="video"]').each(function(){
//			new Media(this, function(){
//				if(audioPlayer.isPlay) audioPlayer._play();
//			} ,function(){
//				audioPlayer._play();
//			});
//		});

        // old_ygj_info = {};old_ygj_info.footer_title ="%E4%BA%91%E7%AE%A1%E5%AE%B6";old_ygj_info.footer_url ="http%3A%2F%2Fwww.ygj.com.cn%2F";

		// footer
//	    if( ! (typeof old_ygj_info == 'undefined') ){
//	    	var footer_url = decodeURIComponent(old_ygj_info.footer_url);
//	    	var footer_title = decodeURIComponent(old_ygj_info.footer_title);
//	    	console.log(footer_title,footer_url);
//	    	$("#ilast").append('<div style="padding-top:10px;padding-bottom:10px;position:absolute;bottom:0;left:0;background-color:#51c886;width:100%;height:54px;font-size:24px;text-align:center;z-index:9999;font-family:microsoft yahei;"><a style="color:white;" href="'+footer_url+'">由【 '+ footer_title + '】提供技术支持</a></div>');	    	
//	    }
	//}


$(function(){

    if(typeof audioPlayer == "undefined"){
    	audioPlayer = new Player($('#audioBtn'));
    }

	$('#swipe li').last().attr('id','ilast');

	//var lotteryEnd = false;
	// current swipe object
	//var	curObj = $('#swipe li').eq(config.swipeCur);
	// get img src
	//var curSrc = getSrc(curObj.find('div'));

// 解决ios safari 不自动播放的问题
//  $(document).one('touchstart', function(){
//    	if(config.enable_music){
//    		if(config.coverUrl){
//  	  		audioPlayer._audio.play();
//  	  		audioPlayer._audio.pause();
//    		}else{
//    	  		audioPlayer._audio.play();
//    		}
//    	}
//  });

	// 判断是否需要立刻 模糊初始化
//	if(curObj.data('role') == 'blur'){
//		imgLoad(curSrc, function(){
//			curObj.stackBlur({img: this, radius: 10, callback: function(){
//				curObj.data('role', '');
//				initLottery();
//			}});
//		}, initLottery);
//	} else {
//		imgLoad(curSrc, initLottery, initLottery);
//	}
	//loadImg();
	$('#swipe').swipe({
		cur: 0,
		success: function(){
			//console.log('完毕')
			//$(this).find('li').eq(config.swipeCur).removeAttr('style');
			// $('.f-hide').removeClass('f-hide');
			//initPage(isInitSwipe);
		}
	});
	
	// 开始之旅
	$('.open').on('click', function () {
		$('.welcome').hide().remove();
		audioPlayer._audio.play();
	})

});