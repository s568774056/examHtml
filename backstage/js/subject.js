var update_id = '';
var deleteId = '';
$(document).ready(function() {
	var myPlugin = $('#subject_table').myPlugin({
		'title_name': 'Id,科目名称,说明', //th第一行的表头名称
		'column_name': 'id,name,detailed', //字段名
		'url': '/subject/select',
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
						message: '科目名称不能为空'
					}
				}
			},
			detailed: {
				message: 'The username is not valid',
				validators: {
				}
			}
		}
	});

	//修改
	$('#subject_table table').on('click', 'tr button:first-child', function() {

		$('#defaultForm').data('bootstrapValidator').resetForm(true); //初始化From
		var tr = $(this).parents('tr');
		update_id = $(tr).children().eq(0).html();
		$("#defaultForm input[name='name']").val($(tr).children().eq(1).html());
		$("#defaultForm textarea[name='detailed']").val($(tr).children().eq(2).html());
	});
	//删除
	$('#subject_table table').on('click', 'tr button:last-child', function() {
		$('#deleteModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deleteModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "及下属全部试题】");
		deleteId = $(tr).children().eq(0).html();
	});

	//确认删除
	$('#deleteModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/subject/delete/" + deleteId,
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
				post_url = '/subject/add';
			} else {
				post_url = '/subject/update/' + update_id;
			}
			$.ajax({
				type: "POST",
				url: baseurl + post_url,
				data: $form.serialize() + "&id=" + update_id,
				dataType: "json",
				success: function(result) {
					console.log('[result]:' + result);
					if(result.code == 0) {
						showMessage('修改成功');
						myPlugin.getData();
						$('#myModal').modal('hide');
					} else {
						showMessage('修改失败:' + result.msg);
					}
					$('#defaultForm').data('bootstrapValidator').resetForm(true);
				}
			});
		});
	$('.seach button').on('click', function() {
      myPlugin.updateParamData({
      	name:$("#subject_name").val()
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