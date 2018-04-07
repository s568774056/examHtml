var baseurl = "http://7c2zvu.natappfree.cc";
(function($) {
	// 插件的定义     
	$.fn.create_tb = function(options) {

		var opts = $.extend({}, $.fn.create_tb.defaults, options);
		// iterate and reformat each matched element
		addThead(this, opts); //添加表头
		$(this).find("table").append('<tbody></tbody>'); //添加BODY
		getData(this, opts); //添加内容
		return this;
	};
	// 私有函数:获取数据  
	function getData(obj, opts) {

		var column_name = splitparam(opts.column_name);
		var table_body=$(obj).find("tbody");
		$.ajax({
			type: "POST",
			url: baseurl + opts.url,
			data: opts.data,
			dataType: "json",
			success: function(data) {

				$(data).each(function(index, element) {
					var html = '<tr>';
					for(var i = 0; i < column_name.length; i++) {
						html += '<th';
						if(i == 0) {
							html += '  scope="row"';
						}
						html += '>' + element[column_name[i]] + '</th>';
					}
					html+='</tr>';
					$(table_body).append(html);
				});
			},
			error: function(jqXHR) {

			}
		});
	};

	function splitparam(param) {
		var fruit = param.split(",");
		if(fruit.length < 1) {
			fruit = test.split("|");
		}
		return fruit;
	};

	function addThead(obj, opts) { //添加表头

		var title_name = splitparam(opts.title_name);
		var column_name = splitparam(opts.column_name);
		if(title_name == '') {
			return;
		}
		if(title_name.length <= 1 || column_name <= 1 || title_name.length != column_name.length) {
			console.error("自动生成表格参数[title_name或column_name]长度不一致且长度不能小于2");
			return;
		}
		if(title_name.length > 1) {
			var table_class = (opts.table_class != '') ? opts.table_class : "table table-striped";
			var table_id = (opts.table_id != '') ? opts.table_id : "";
			var html = '<table class="' + table_class + '" id="' + table_id + '"><thead><tr>';
			for(var i = 0; i < title_name.length; i++) {
				html += '<th>' + title_name[i];
				if(i == 0 && (opts.is_add == true || opts.is_add == 'true')) {
					html += '<a href="#" id="addTb"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>添加</a></th>';
				}
			}
			$(obj).append(html + '</tr></thead></table>');
		}
	};
	// 定义暴露format函数     
	$.fn.create_tb.format = function(obj) {
		return '<strong>' + txt + '</strong>';
	};
	// 插件的defaults     
	$.fn.create_tb.defaults = {
		'title_name': '', //th第一行的表头名称
		'column_name': '', //字段名
		'linage': '10', //每页行数
		'url': '', //请求地址
		'data': {}, //请求参数
		'table_id': '', //自定义 table的id
		'is_add': true, //是否显示添加按钮
		'is_operate': true, //是否显示操作 默认为true
		'is_paging': true, //是否分页 默认为true
		'table_class': '' //自定义table样式
	};
	// 闭包结束     
})(jQuery);