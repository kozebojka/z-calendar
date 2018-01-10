function zCalendar(parameters){
	parameters = parameters||{};

	var d = new Date();
	d.setDate(d.getDate() + 1);

	this.month = parameters.month||(d.getMonth()+1);
	this.year = parameters.year||d.getFullYear();
	this.formname = parameters.formname||'calendar';
	this.navigation = parameters.navigation!==false;
	this.onSelect = parameters.onSelect||function(){};

	this.container = $('<div class="calendar" date-f="" date-y="" date-m=""></div>');

	this.draw = function() {
		this.container.children().remove();

		this.container.append('<div class="calendar_monthhead"><b></b>, <span></span></div>');
		if(this.navigation){
			this.container.find('.calendar_monthhead').append($('<i class="fa fa-angle-left"></i>').click({obj:this},function(event){
				event.data.obj.setCalendar(event.data.obj.year,event.data.obj.month-1);
			}));
			this.container.find('.calendar_monthhead').append($('<i class="fa fa-angle-right"></i>').click({obj:this},function(event){
				event.data.obj.setCalendar(event.data.obj.year,event.data.obj.month+1);
			}));
		}
		this.container.append('<div class="calendar_weekheader"><i>Пн</i><i>Вт</i><i>Ср</i><i>Чт</i><i>Пт</i><i>Сб</i><i>Вс</i></div>');
		this.container.append('<div class="calendar_day"></div>');

		for(var i = 1; i<=31; i++) this.container.find('.calendar_day').append('<label><input type="'+(this.multiselect?'checkbox':'radio')+'" name="'+this.formname+(this.multiselect?'[]':'')+'">'+i+'</label>');

		this.container.find('.calendar_day input').click(function(){
			if(parameters.onChange && parameters.onChange($(this))===false) return false;
		});

		this.container.find('.calendar_day input').change({obj:this},function(event){
			event.data.obj.reActive();
			event.data.obj.onSelect();
		});
		this.reActive();

		return this.container;
	};
	this.reActive = function () {
		this.container.find('label').removeClass('active disabled');
		this.container.find('input:checked').parent().addClass('active');
		this.container.find('input:disabled').parent().addClass('disabled');
	};
	this.setCalendar = function(year,month){
		if(month<1){year=year-1;}
		if(month>12){year=year+1;}
		month = ((month+11)%12)+1;

		this.year = year;
		this.month = month;

		this.container.find('.calendar_monthhead span').html(this.year);
		this.container.attr('date-y',(this.year)).attr('date-m',(this.month)).attr('date-f',this.getFDay(this.year,this.month));

		var inps = this.container.find('input');

		for(var i=0; i < inps.length; i++){
			var timestamp = new Date(this.year, this.month-1, this.container.find('label').eq(i).text()).valueOf();
			inps.eq(i).val(timestamp/1000);
		}

	};
	this.getFDay = function(year,month){ return ((((new Date(year, month-1, 1).getDay())+6)%7)+1); };

	this.getSelected = function () {
		var ret = new Array();
		var inps = this.container.find('input:checked');
		for(var i=0; i < inps.length; i++){
			ret.push(inps.eq(i).val());
		}
		return ret;
	};

	this.draw();
	this.setCalendar(this.year, this.month);

	return this;
}
