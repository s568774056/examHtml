var update_id = '';
var deleteId = '';
$(document).ready(function() {
	var myPlugin = $('#user_table').myPlugin({
		'title_name': 'Id,用户名,性别,年龄', //th第一行的表头名称
		'column_name': 'id,name,sexFun,age', //字段名
		'url': '/user/select',
		'modalId': 'myModal',
		'operate': '<button type="button" class="btn btn-danger btn-sm">删除</button>', //操作内容
		'data': {
			page: 0,
			size: 10
		}, //请求参数
	});
	
  $('#defaultForm').bootstrapValidator({
		//        live: 'disabled',
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			name: {
				message: 'The username is not valid',
				validators: {
					notEmpty: {
						message: '科目名称不能为空'
					}
				}
			},
			password: {
				message: 'The username is not valid',
				validators: {
					notEmpty: {
						message: '密码不能为空'
					}
				}
			}
		}
	});

	//删除
	$('#user_table table').on('click', 'tr button:last-child', function() {
		$('#deleteModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deleteModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});

	//确认删除
	$('#deleteModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/user/delete/" + deleteId,
			data: '',
			dataType: "json",
			success: function(result) {
				console.log(result.code + '   ' + (result.code == 0));
				if(result.code == 0) {
					showMessage('删除成功');
					$('#deleteModal').modal('hide');
					myPlugin.getData();
				} else {
					showMessage('删除失败:【<a style="color:red">' + result.msg + "</a>】");
				}
			}
		});
	});

	//添加/修改
	$('#defaultForm').bootstrapValidator('validate')
		.on('success.form.bv', function(e) {
			// Prevent form submission
			e.preventDefault();
			var $form = $(e.target);
			var post_url = '';
			if(myPlugin.options.action == 'insert') {
				post_url = '/user/add';
			}
			$.ajax({
				type: "POST",
				url: baseurl + post_url,
				data: $form.serialize() + "&sex" + $("input[name='sex']:checked").val(),
				dataType: "json",
				success: function(result) {
					console.log('[result]:' + result);
					if(result.code == 0) {
						showMessage('添加成功');
						myPlugin.getData();
						$('#myModal').modal('hide');
						$('#defaultForm').data('bootstrapValidator').resetForm(true);
					} else {
						showMessage('添加失败:' + result.msg);
					}
				}
			});
		});
	$('.seach button').on('click', function() {
		myPlugin.updateParamData({
			name: $("#user_name").val()
		});
	});
});

function showMessage(msg) {
	$("#message button").html('操作成功');
	if(msg != '') {
		$("#message button").html(msg);
	}
	$("#message").fadeToggle(1000);
	$("#message").fadeToggle(1000);
}

function sexFun(obj) {
	if(obj['sex'] == "0") {
		return '男';
	} else {
		return '女';
	}
}