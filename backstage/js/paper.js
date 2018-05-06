var update_id = '';
var deleteId = '';
$(document).ready(function() {
	getSubject();
	var myPlugin = $('#paper_table').myPlugin({
		'title_name': 'Id,科目类型,试卷名称,创建时间', //th第一行的表头名称
		'column_name': 'id,subName,name,create_date', //字段名
		'url': '/paper/select',
		'modalId': 'myModal',
		'operate': '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal">修改</button><button type="button" class="btn btn-danger btn-sm">删除</button><button type="button" class="btn btn-info btn-sm">关联题目</button>', //操作内容
		'data': {
			page: 0,
			size: 3
		}, //请求参数
	});
 

	//修改
	$('#paper_table table').on('click', 'tr button:first-child', function() {

		$("#defaultForm")[0].reset();
		var tr = $(this).parents('tr');
		update_id = $(tr).children().eq(0).html();
		 $("#defaultForm select").find("option:contains('"+$(tr).children().eq(1).html()+"')").attr("selected",true);
		$("#defaultForm input[name='name']").val($(tr).children().eq(2).html());
	});
	//删除
	$('#paper_table table').on('click', 'tr button:nth-child(2)', function() {
		$('#deleteModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deleteModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});
	//关联题目
	 $('#paper_table table').on('click', 'tr button:last-child', function() {
		
		$(".breadcrumb li:eq(1)").removeClass("active");
		$(".breadcrumb li:eq(2)").addClass("active").show();
		update_id = $(this).parents('tr').children().eq(0).html();
		$("#paper_div").hide();
		selectTopic();
		$("#paperTopic_div").show();
		
	 });

	//确认删除
	$('#deleteModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/paper/delete/" + deleteId,
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
		var post_url = '';
		if(myPlugin.options.action == 'insert') {
			post_url = '/paper/add';
		} else {
			post_url = '/paper/update/' + update_id;
		}
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
	
	$('.seach button').on('click', function() {
		myPlugin.updateParamData({
			name: $("#paper_name").val(),
			subjectId: $("#subject_type").val()
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


function getSubject(){
		$.ajax({
			type: "POST",
			url: baseurl + "/subject/findAll",
			data: "",
			dataType: "json",
			success: function(result) {
				$(result.data).each(function(index, element) {
					
					$("select[name='subject_type']").append("<option value='"+element["id"]+"'>"+element["name"]+"</option>");
				});
			},
			error: function(result) {
			}
		});
}
