(function(){	
	function Slider(node, arrayOfImages){
		this.node = node;
    	this.arrayOfImages = arrayOfImages.slice(); // копирование массива изображений чтоб при изменении не повлияло на работус салйдера
		this.Init(this.arrayOfImages); // добавление в ДОМ
		this.Behavior();
		this.position = 0;// init value for margin-left
		this.$images = $(this.node).find('.images ul');
		this.$buttons = $(this.node).find('.buttons ul li');
	}

	Slider.prototype.Init = function(arrayOfImages) {
		$(this.node).append("<div class='slider'><div class='buttons'><ul></ul></div><div class='images'><ul></ul></div></div>");
		for (var i = 0; i < arrayOfImages.length; i+=1) {
			$(this.node).find('.buttons > ul').append('<li id="li'+(i+1)+'"><div class="arrow"></div></li>');
			$(this.node).find('.images > ul').append('<li><img src="'+arrayOfImages[i]+'""></li>');
		}
		//set highlight first button
		$(this.node).find('.buttons > ul li').eq(0).addClass('current');
		$(this.node).find('.buttons > ul li').eq(0).find('.arrow').css("display", "block");	
	};
	Slider.prototype.Next = function(){
		(this.position===-1899) ? this.position=0 : this.position -= 633;
		var currentButton = Math.abs(this.position/633);
		//hightlight current button
		this.$buttons.removeClass('current');
		this.$buttons.closest('ul').find('.arrow').css("display", "none");
		this.$buttons.eq(currentButton).addClass('current');
		this.$buttons.eq(currentButton).find('.arrow').css("display", "block");
		//move image left
		this.$images.stop().animate({"margin-left":this.position+'px'},1000);

	};
	Slider.prototype.AutoScroll = function(){
		var self = this;
		return {
			startCarousel: function(){	
				//this -- Object{startCarousel,stopCarousel,waitCarousel}
				self.timer = setInterval(function(){
					self.Next();
				}, 1500);
			}, 
			stopCarousel: function(){
				clearInterval(self.timer);
				clearTimeout(self.timeout);
			},
			waitCarousel: function(){
				var returnedOb = this;
				self.timeout = setTimeout(function() {
					//this -- window
					returnedOb.startCarousel();
				} , 1000);
			}
		};
	};
	Slider.prototype.Behavior = function(){
		var self = this;//self - -Slider
		$(function(){
			//this -- htmlDocument
			//start carousel
			self.AutoScroll().startCarousel();

			$('.buttons').on('click', 'li', function(){
				//this -- elem which was clicked
				var item = parseInt($(this).attr('id').slice(2));
				self.$images.stop().animate({"margin-left":-(item-1)*633+'px'},1000);
				self.position = -(item-1)*633;
				//highlight seleccted button
				$(this).closest('ul').find('li').removeClass('current');
				$(this).closest('ul').find('.arrow').css("display", "none");
				$(this).addClass('current');
				$(this).find('.arrow').css("display", "block");
				//stop wait carousel
				self.AutoScroll().stopCarousel();
				self.AutoScroll().waitCarousel();
			});
		});
	};
	window.Slider = Slider;
})();