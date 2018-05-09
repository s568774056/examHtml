var baseurl = "http://192.168.165.4:7080";
//定义Beautifier的构造函数
var Beautifier = function(ele, opt) {
	this.$element = ele,
		this.defaults = {
			'url': '', //请求地址   必传
			'column_name': '', //字段名 必传
			'title_name': '', //th第一行的表头名称
			'size': '10', //每页行数
			'data': {}, //请求参数
			'table_id': ' ', //自定义 table的id
			'is_add': true, //是否显示添加按钮
			'is_operate': true, //是否显示操作 默认为true
			'operate': '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal">修改</button><button type="button" class="btn btn-danger btn-sm">删除</button>', //操作内容
			'is_paging': true, //是否分页 默认为true
			'table_class': '', //自定义table样式
			'totalCount': 0, //共多少条数据 不传
			'nowPage': 1, //当前页 不传
			'modalId': '', //模态框Id  填写模态框Id后可根据按钮文本内容修改模态框标题
			'action': 'update', //提交动作 insert/update
			'selectData':{}
		},
		this.options = $.extend({}, this.defaults, opt)
	if(this.options.data.size != undefined) {
		this.options.size = this.options.data.size;
	}
}
//定义Beautifier的方法
Beautifier.prototype = {
	addThead: function() { //添加表头
		var title_name = this.splitparam(this.options.title_name);
		var column_name = this.splitparam(this.options.column_name);
		if(title_name == '') {
			return;
		}
		if(title_name.length <= 1 || column_name <= 1 || title_name.length != column_name.length) {
			console.error("自动生成表格参数[title_name或column_name]长度不一致且长度不能小于2");
			return;
		}
		if(title_name.length > 1) {
			var table_class = (this.options.table_class != '') ? this.options.table_class : "table table-striped";
			var table_id = (this.options.table_id != '') ? this.options.table_id : "";
			var html = '<table class="' + table_class + '" id="' + table_id + '"><thead><tr>';
			var title_len = title_name.length;
			for(var i = 0; i < title_len; i++) {
				html += '<th>' + title_name[i];
				if(i == 0 && (this.options.is_add == true || this.options.is_add == 'true')) {
					html += '<a href="#" id="addTb" data-toggle="modal" data-target="#' + this.options.modalId + '"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>添加</a></th>';
				}
				if(i + 1 == title_len && (this.options.is_operate == true || this.options.is_operate == 'true')) {
					html += '<th>操作</th>';
				}
			}
			$(this.$element).append(html + '</tr></thead></table>');
		}
	},
	getData: function() { //请求数据

		var column_name = this.splitparam(this.options.column_name);
		var table_body = $(this.$element).find("tbody");
		$.ajax({
			type: "POST",
			url: baseurl + this.options.url,
			data: this.options.data,
			dataType: "json",
			success: function(result) {
				if(result.code != 0) {
					return;
				}
				this.options.selectData= result.data;
				var data = result.data;
				this.options.totalCount = result.totalCount;
				this.pagination();
				var is_operate = this.options.is_operate;
				var operate = this.options.operate;
				var modalId = this.options.modalId;
				$(data).each(function(index, element) {
					var html = '<tr>';
					for(var i = 0; i < column_name.length; i++) {
						if(i == 0) {
							html += '<th';
						} else {
							html += '<td';
						}
						if(i == 0) {
							html += '  scope="row"';
						}
						
						if(column_name[i].indexOf("Fun") >= 0) {

							var str=eval(column_name[i])(element);
							html += '>' + str;
						}else{
							html += '>' + element[column_name[i]];
						}
						
						if(i == 0) {
							html += '</th>';
						} else {
							html += '</td>';
						}
					}
					if(is_operate == true || is_operate == 'true') {
						html += '<td>' + operate + '</td>';
					}
					html += '</tr>';
					$(table_body).append(html);
					$(table_body).find("button").attr('data-target', '#' + modalId);
				});
				if(data==""){
					$(table_body).append("暂无数据");
					$(this.$element).find("#nav_paging").hide();
				}else{
					$(this.$element).find("#nav_paging").show();
				}
			}.bind(this),
			error: function(jqXHR) {

			}
		});
	},
	splitparam: function(data) { //分割字符串
		var fruit = data.split(",");
		if(fruit.length < 1) {
			fruit = test.split("|");
		}
		return fruit;
	},
	pagination: function() { //设置页码
		$(this.$element).find("tbody").html("");
		var startPage = 1 * 1; //ul 页码中的第一个
		var endPage = 0;
		var nowPage = this.options.nowPage * 1;
		var totalCount = this.options.totalCount * 1;
		var pageSize = Math.ceil(totalCount / this.options.size);
		var mainThis = this;
		var nav_paging=$(this.$element).find("#nav_paging");
		var nav_ul = $(nav_paging).find("ul");
		var page_li = $(this.$element).find(".page_li a");
		if(page_li.html() != undefined) {
			startPage = $(page_li).first().html() * 1;
			endPage = $(page_li).last().html() * 1;
			if(nowPage < startPage || nowPage > endPage) { //如果是点击跳转按钮
				if(nowPage - 2 < 1) {
					startPage = 1;
				} else if(nowPage + 2 <= pageSize) {
					startPage = nowPage - 2;
				} else if(nowPage + 1 <= pageSize) {
					startPage = nowPage - 3;
				} else {
					startPage = nowPage - 4;
				}
			} else { //如果是点击其他页码，判断是否点了第几个页码

				var centre = endPage - nowPage;
				var centre2 = nowPage - startPage;
				if(centre == 0) { //第五位
					if(endPage + 2 <= pageSize) {
						startPage = endPage - 2;
					} else {
						startPage = (pageSize - 4) > 1 ? (pageSize - 4) : 1;
					}
				} else if(centre == 1) { //第四位
					if(endPage + 1 <= pageSize) {
						startPage = endPage - 3;
					} else {
						startPage = (pageSize - 4) > 1 ? (pageSize - 4) : 1;
					}
				} else if(centre == centre2) { //
					startPage = nowPage - 2;
				} else {
					var sum = 1;
					if(centre2 == 0) {
						sum = startPage - 2;
					} else if(centre2 == 1) {
						sum = startPage - 1;
					}
					if(sum >= 1) {
						startPage = sum;
					} else {
						startPage = 1;
					}
				}
			}
		} else { //初次生成
			nowPage = 1;
		}
		$(nav_paging).show().find("bdi").html("共" + pageSize + "页");
		var html = '';
		if(pageSize > 5) {
			endPage = startPage + 4;
		} else {
			endPage = pageSize;
		}
		for(var i = startPage; i <= endPage; i++) {
			html += '<li class="page_li"><a href="#"';
			if(i == nowPage) {
				html += ' style="color: red;"';
			}
			html += '>' + i + '</a></li>';
		}
		//		console.log('[startPage:]'+startPage+'  [endPage:]'+endPage+'  [html:]'+html);

		$(nav_ul).html(html);
	},
	paging: function(data) { //添加分页
		var html = '<center><nav id="nav_paging" style="display: inline-block;"><ul class="pagination" style="display: inline; margin: 5px;">';

		html += '</ul>' +
			'<input class="form-control" style="width: 40px;display:inline;padding: 2px;text-align:center;"> <button class="btn btn-info" type="submit">GO!</button> <bdi ></bdi ></nav></center>';
		$(this.$element).append(html);
		$(this.$element).find("#nav_paging").hide();
	},
	onPageClick: function() {

		var mainThis = this;
		var nav_paging=$(this.$element).find("#nav_paging");
		$(nav_paging).on("click","a",function() {
			
			mainThis.options.nowPage = $(this).html();
			if(mainThis.options.data.page != undefined) {
				mainThis.options.data.page = ($(this).html() * 1 - 1);
				mainThis.getData();
			} else {
				mainThis.pagination();
			}
		});

		$(nav_paging).find("button").on("click", function() {

			var value = $($(nav_paging).find("input")).val() * 1;
			if(value < 1) {
				return;
			}
			mainThis.options.nowPage = value;

			var totalCount = mainThis.options.totalCount;
			var pageSize = Math.ceil(totalCount / mainThis.options.size);
			if(value > pageSize) {
				return;
			}
			if(mainThis.options.data.page != undefined) {
				mainThis.options.data.page = (value - 1);
				mainThis.getData();
			} else {
				mainThis.pagination();
			}
		});

		$(nav_paging).find("input").on("click", function() {
			$(this).val("");
		});

		$('#' + this.options.modalId).on('show.bs.modal', function(event) {

			var html = $(event.relatedTarget).text(); // Button that triggered the modal
			
			if(html == ""||html == "添加") {
				mainThis.options.action = 'insert';
				html="添加";
			} else {
				mainThis.options.action = 'update';
			}
			$(this).find(".modal-title").html(html + '数据');
		});

		$('#' + this.options.modalId).on('hide.bs.modal', function(event) { //恢复Form状态
			try {
				$('#' + mainThis.options.modalId + ' form').data('bootstrapValidator').resetForm(true);
			} catch(err) {
				console.log("[base.js error:]" + err);
			}
		});

	},
	updateParamData: function(param) { //更新请求参数

		this.options.nowPage = 1;
		this.options.data = $.extend({}, this.options.data, param);
		this.options.data.page = 0;
		//this.options.data = param;
		this.getData();
	}

}
//创建Beautifier对象
$.fn.myPlugin = function(options) {
	//创建Beautifier的实体
	var beautifier = new Beautifier(this, options);
	//调用其方法
	beautifier.addThead();
	$(this).find("table").append('<tbody></tbody>'); //添加BODY
	beautifier.getData();
	beautifier.paging();
	beautifier.onPageClick();
	return beautifier;
}