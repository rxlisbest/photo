global_swipe_lock = 0;

(function(){
	var utils = {
		    addEvent: function(el, type, fn, capture){
				el.addEventListener(type, fn, !!capture);
			},
			removeEvent: function(el, type, fn, capture){
				el.removeEventListener(type, fn, !!capture);
			},
			winW: $(window).width(),
			winH: $(window).height(),
			noop: function(){}
		},
		support = (window.Modernizr && Modernizr.touch === true) || (function () {
	        return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
	    })(),
	    eventName = {
	    	start: support ? 'touchstart' : 'mousedown',
	    	move: support ? 'touchmove' : 'mousemove',
	    	end: support ? 'touchend' : 'mouseup'
	    };


	function Swipe(el, opts){
		this.el = typeof el === 'string' ? document.querySelector(el) : el;
		this.slides = this.el.querySelectorAll('li');
		this.isVertical = opts.dir == 'vertical' ? true : false;
		this.cur = opts.cur;
		this.success = opts.success || function(){};

		if(this.slides.length < 2) return;
		if(!this.el){
			throw Error('element is not defined..');
			return;
		}
		this.init();
	}

	Swipe.prototype = {
		init: function(){
			$(this.slides[this.cur]).addClass('cur');
			utils.addEvent(this.el, eventName.start, this);
			this.success.call(this.el);
		},
		start: function(e){
			// console.log(global_swipe_lock);
			if(global_swipe_lock == 1) return;

			if(e.target.tagName == 'A') return;

			if(this.moveing){
				e.preventDefault();
				return false;
			}

			var touches = support ? e.touches[0] : e;
		
			this.data = {
				startX: touches.pageX,
				startY: touches.pageY,
				distX: 0, // 移动距离
				distY: 0,
				time: +new Date
			}

			// console.log(this.data);

			utils.addEvent(this.el, eventName.move, this);
			utils.addEvent(this.el, eventName.end, this);
		},
		move: function(e){

			var tmp = $(e.target).parent();
			var tmp = tmp.attr('id');
			if(tmp == 'notUp'){
				if(this.data['distY'] > 0){
					// console.log(this.data['distY']);
					return;
				}
			}
			if(tmp == 'ilast'){
				var tmp = $('#notUp');
				tmp.attr('id','up');
			}
			// console.log(this.data['distY']);

			var touches = support ? e.touches[0] : e,
				data = this.data;
			
			data.distX = touches.pageX - data.startX;
			data.distY = touches.pageY - data.startY;

			// console.log(this.data);

			this.translate(this.isVertical ? data.distY : data.distX, this.isVertical ? utils.winH : utils.winW);

			e.preventDefault();
		},
		end: function(e){
			this.animate();

			utils.removeEvent(this.el, eventName.move, this);
			utils.removeEvent(this.el, eventName.end, this);
		},
		reset: function(){
			console.log('reset');
		},
		animate: function(){
			var _this = this,
				data = this.data,
				duration = +new Date - data.time
				curObj = $(this.slides[this.cur]),
				nextObj = $(this.nextSlide);
				isRevert = duration < 50 || Math.abs(this.getDisValue(data.distX, data.distY)) < 60; // 确定是否触发上一个或下一个幻灯片

			$(this.nextSlide).addClass('animated');
			curObj.addClass('animated');

			if(this.isVertical){
				this.translate((data.distY > 0 ? 1 : -1 ) * utils.winH, utils.winH, isRevert)
			}else{
				this.translate((data.distX > 0 ? 1 : -1 ) * utils.winW, utils.winW, isRevert);
			}

			this.moveing = true;
			setTimeout(function(){
				if(!isRevert) _this.cur = _this.nextIndex;
				_this.moveing = false;

				(isRevert ? curObj : nextObj).removeAttr('style').attr('class', 'cur').siblings().removeAttr('style').removeAttr('class');
				
				if(!isRevert){

					var cur_li = $('#swipe').find('li.cur').eq(0);

					var flag = cur_li.find('.inner_swipe').length;

					// var index = $('#swipe').find('li.cur').index();
					var index = true;

					if(flag && index){
						// console.log('aa');
					    // 获取遮罩图信息

					    var cur_li_inner_div  = cur_li.find('.inner_swipe').eq(0);
					    var inner_bg = getSrcGlobal(cur_li_inner_div);

					    var enable_swipe = cur_li.find('.enable_swipe').eq(0).val().trim();
					    var swipe_tips   = cur_li.find('.swipe_tips').eq(0).val().trim();
					    if(swipe_tips == ''){
					    	swipe_tips = '用手擦一擦';
					    }

					    // 遮罩图画板
					    var cur_li_canvas_div = cur_li.find('.lottery').eq(0);
    
					    // 开启蒙版
					    if(enable_swipe == 'ok'){

			                imgLoad(inner_bg, function(){
                    
			                	cur_li_canvas_div.lottery({
			                		coverType: 'image',
		                            cover: inner_bg,
		                            showText: swipe_tips,
		                            width: 640,
		                            height: $(window).height(),
		                            callback: function(percent){
		                            	// 结束
		                            	if( percent > 30 ){
		                            		$(this).parent().removeClass('show').on('webkitTransitionEnd', function(){
		                            			// 消除遮罩和过渡
		                            			$('#swipe').find('li.cur').eq(0).find('.inner_swipe').eq(0).remove();
			                            		$(this).hide();
			                            		// 解锁
			                            		global_swipe_lock = 0;
		                            		});
		                            	}
		                            },
		                            success: function(){
		                            	// 生成遮罩成功

		                            	// 锁住滑动
		                            	global_swipe_lock = 1;

		                            	// 显示生成好的遮罩图
		                            	$('#swipe').find('li.cur').eq(0).find('.lottery').eq(0).show();

		                            	// 消除过渡候补图
		                            	$('#swipe').find('li.cur').eq(0).find('.inner_swipe').eq(0).remove();

		                            	$(this.conNode).addClass('show').on('webkitTransitionEnd', function(){
		                            		$('#swipe').find('li.cur').eq(0).find('.inner_swipe').eq(0).remove();
		                            		// $('#swipe li').eq(config.swipeCur).show(); ???
		                            	});
		                            }
			                	});
    
			                }, function(){ 
			                	$('#swipe').find('li.cur').eq(0).find('.inner_swipe').eq(0).remove();
			                	$('#swipe').find('li.cur').eq(0).find('.lottery').eq(0).hide(); 
			                });
					    }

				    }

				}

			}, 300);
		},
		getDisValue: function(x, y){
			return this.isVertical ? y : x;
		},
		/* 
		 * dis: 鼠标移动距离 
		 * win: 根据滑动方向得到的window的width/height
		 * isRevert: 是否需要复位
		*/
		translate: function(dis, win, isRevert){
			// var index = this.cur + ((this.dir == 'vertical' ? distY : distX) < 0 ? +1 : -1 );
			var isVertical = this.isVertical,
				slideLength = this.slides.length,
				dir = dis < 0 ? 1 : -1 ,
				getValue = function(n){
					var v = n || (dir * win + (isRevert ? 0 :dis));
					return isVertical ? '0, '+ v +'px' : v + 'px, 0';
				},
				index = this.cur + dir,
				scale = isRevert ? 1 : (1 - Math.abs(.2 * dis / win)).toFixed(6),
				scaleV =  getValue((-dir * win * (1 - scale) / 2).toFixed(6));

			if(index < 0) index += slideLength;
			if(index > slideLength - 1) index = 0;

			this.nextIndex = index;
			this.nextSlide = this.slides[index];

			$(this.slides[index]).addClass('action').siblings().removeClass('action');

			this.nextSlide.style.webkitTransform = 'translate('+ getValue() +')';
			this.slides[this.cur].style.webkitTransform = 'translate('+ scaleV +') scale('+ scale +')';
		},
		handleEvent: function(e){
			switch(e.type){
    			case 'touchstart':
    			case 'mousedown':
    				this.start(e);
    				break;
    			case 'touchmove':
    			case 'mousemove':
    				this.move(e);
    				break;
    			case 'touchend':
    			case 'mouseup':
    				this.end(e);
    				break;
    		}
		}
	}

	$.fn.swipe = function(opts){
		var defaults = {
			cur: 0,
			dir: 'vertical' // vertical or horizontal
		}
		return this.each(function(){
			$(this).data('swipe', new Swipe(this, $.extend(defaults, opts)));
			return this;
		});
	}
})();