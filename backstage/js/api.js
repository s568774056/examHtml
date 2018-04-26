var update_id = '';
var deleteId = '';
$(document).ready(function() {
	var myPlugin = $('#api_table').myPlugin({
		'title_name': 'Id,名称,地址,说明', //th第一行的表头名称
		'column_name': 'id,name,address,detailed', //字段名
		'url': '/api/select',
		'modalId': 'myModal',
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
						message: '请求名称不能为空'
					}
				}
			},
			address: {
				message: 'The username is not valid',
				validators: {
					notEmpty: {
						message: '请求地址不能为空'
					}
				}
			}
		}
	});

	//修改
	$('#api_table table').on('click', 'tr button:first-child', function() {

		$('#defaultForm').data('bootstrapValidator').resetForm(true);//初始化From
		var tr = $(this).parents('tr');
		update_id = $(tr).children().eq(0).html();
		$("#defaultForm input[name='name']").val($(tr).children().eq(1).html());
		$("#defaultForm input[name='address']").val($(tr).children().eq(2).html());
	});
	//删除
	$('#api_table table').on('click', 'tr button:last-child', function() {
		$('#deleteModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deleteModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});

	//确认删除
	$('#deleteModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/api/delete/" + deleteId,
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
				post_url = '/api/add';
			} else {
				post_url = '/api/update/' + update_id;
			}
			$.ajax({
				type: "POST",
				url: baseurl + post_url,
				data: $form.serialize() + "&id=" + update_id,
				dataType: "json",
				success: function(result) {
					console.log('[result]:' + result);
					if(result.code == 0) {
						showMessage('操作成功');
						myPlugin.getData();
						$('#myModal').modal('hide');
					} else {
						showMessage('操作失败:' + result.msg);
					}
					$('#defaultForm').data('bootstrapValidator').resetForm(true);
				}
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