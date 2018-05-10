var userPlugin,paperUserPlugin;
//两个查询，两个删除，两个添加
$(document).ready(function() {
	
	 paperUserPlugin = $('#paperUser_table').myPlugin({
		'title_name': 'Id,用户名', //th第一行的表头名称
		'column_name': 'id,name', //字段名
		'url': '/paperUser/select',
		'operate': '<button type="button" class="btn btn-danger btn-sm">删除</button>', //操作内容
		'modalId': 'userLiModal',
		'data': {
			page: 0,
			size: 10
		}, //请求参数
	});
	
	userPlugin = $('#userDiv').myPlugin({
		'title_name': 'Id,题目名称', //th第一行的表头名称
		'column_name': 'id,name', //字段名
		'url': '/paperUser/selectUser',
		'operate': '<button type="button" class="btn btn-danger btn-sm">添加</button>', //操作内容
		'is_add': false,
		'data': {
			page: 0,
			size: 10
		}, //请求参数
	});
	

	//删除
	$('#paperUser_table table').on('click', 'tr button:first-child', function() {

		$('#deUserModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deUserModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});
	


	//确认删除
	$('#deUserModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/paperUser/delete/" + deleteId,
			data: '',
			dataType: "json",
			success: function(result) {
				console.log(result.code + '   ' + (result.code == 0));
				if(result.code == 0) {
					showMessage('删除成功');
					$('#deUserModal').modal('hide');
					paperUserPlugin.getData();
				} else {
					showMessage('删除失败:【<a style="color:red">' + result.msg + "</a>】");
				}
			}
		});
	});


	$('.paperUserSeach button').on('click', function() {
		selectUser();
	});
	
	$('.userSeach button').on('click', function() {

		userPlugin.updateParamData({
			name: $("#userName").val(),
			paperId:paperId
		});
	});
	
	$('#paperUser_table #addTb').on('click', function() {

		userPlugin.updateParamData({
			name: $("#userName").val(),
			paperId:paperId
		});
	});
	

	$('#userLiModal table').on('click', 'tr button', function() {

		var userId =$(this).parents('tr').children().eq(0).html();
		addUser(userId,$(this).parents('tr'));
	});

});

function selectUser(){
	paperUserPlugin.updateParamData({
		name: $("#paper_user_name").val(),
		paperId:paperId
	});
}
	


function addUser(topicId,obj){
			$.ajax({
			type: "POST",
			url: baseurl +  '/paperUser/add',
			data: "userId=" + topicId + "&paperId=" +paperId,
			dataType: "json",
			success: function(result) {
				if(result.code == 0) {
					showMessage('操作成功');
					$(obj).remove();
				} else {
					showMessage('操作失败:' + result.msg);
				}
			},
			error: function(result) {
				$.each(result, function(key, val) {
					console.log("error  " + key + "  " + val);
				});
				changeDisabled(true);
			}
		});
}