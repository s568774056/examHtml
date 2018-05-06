var update_id = '';
var deleteId = '';	var paperPlugin ;
$(document).ready(function() {
	getSubject();
	 paperPlugin = $('#paperTopic_table').myPlugin({
		'title_name': 'Id,题目名称', //th第一行的表头名称
		'column_name': 'id,name', //字段名
		'url': '/paperTopic/select',
		'operate': '<button type="button" class="btn btn-danger btn-sm">删除</button><button type="button" class="btn btn-info btn-sm">查看题目</button>', //操作内容
		'modalId': 'topicModal',
		'is_add': false,
		'data': {
			page: 0,
			size: 3
		}, //请求参数
	});
 

	//删除
	$('#paperTopic_table table').on('click', 'tr button:first-child', function() {

		$('#deleteModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deleteModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});
	
	//查看题目
	$('#paperTopic_table table').on('click', 'tr button:nth-child(2)', function() {
		
	});

	//确认删除
	$('#deleteModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/paperTopic/delete/" + deleteId,
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
	$('#myModal button[class="btn btn-primary submit"]').on('click', function() {
		// Prevent form submission
		var post_url = '/paperTopic/add';
		
		$.ajax({
			type: "POST",
			url: baseurl + post_url,
			data: $("#defaultForm").serialize() + "&subjectId=" + $("#myModal select").val() + "&id=" + update_id,
			dataType: "json",
			success: function(result) {
				if(result.code == 0) {
					showMessage('操作成功');
					myPlugin.getData();
					$('#myModal').modal('hide');
					$("#defaultForm")[0].reset();
					changeDisabled(true);
				} else {
					showMessage('操作失败:' + result.msg);
				}
			},
			error: function(result) {
				$.each(result, function(key, val) {
					console.log("error  " + key + "  " + val);
				});
			}
		});
	})

});
	function selectTopic(){
		paperPlugin.updateParamData({
			name: $("#paper_name").val(),
			paperId:update_id
		});
	}