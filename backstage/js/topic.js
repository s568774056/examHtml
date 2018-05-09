var update_id = '';
var deleteId = '';
var paperObj;
$(document).ready(function() {
	getSubject();
	getPaper();
	var myPlugin = $('#subject_table').myPlugin({
		'title_name': 'Id,题目名称,题目类型,选项A,选项B,选项C,选项D,选项E,选项F', //th第一行的表头名称
		'column_name': 'id,name,typeToStringFun,optionA,optionB,optionC,optionD,optionE,optionF', //字段名
		'operate': '<button type="button" class="btn btn-warning btn-sm" data-toggle="modal">修改</button><button type="button" class="btn btn-danger btn-sm">删除</button>', //操作内容
		'url': '/topic/select',
		'modalId': 'myModal',
		'data': {
			page: 0,
			size: 10
		}, //请求参数
	});
    $('#addTb').removeAttr("data-target");
	$('#addTb').on('click', function(event) {
		if($("#subject_type").val()==""){
			showMessage("请选择科目");
			return;
		}
		$("#defaultForm")[0].reset();
		$("#inlineRadio1").attr("checked", "checked");
		$("#inlineRadio2").removeAttr("checked");$('#myModal').modal("show");
	});

	//修改
	$('#subject_table table').on('click', 'tr button:first-child', function() {

		$("#defaultForm")[0].reset();
		var tr = $(this).parents('tr');
		update_id = $(tr).children().eq(0).html();

		if($(tr).children().eq(2).html() == "多选") {
			changeDisabled(false);
			$("#inlineRadio2").attr("checked", "checked");
			$("#inlineRadio1").removeAttr("checked");
			$("#defaultForm input[name='type']").val("1");
		} else {
			changeDisabled(true);
			$("#inlineRadio1").attr("checked", "checked");
			$("#inlineRadio2").removeAttr("checked");
			$("#defaultForm input[name='type']").val("0");
		}
		$("#defaultForm textarea[name='name']").val($(tr).children().eq(1).html());

		$("#defaultForm input[name='optionA']").val($(tr).children().eq(3).html());
		$("#defaultForm input[name='optionB']").val($(tr).children().eq(4).html());
		$("#defaultForm input[name='optionC']").val($(tr).children().eq(5).html());
		$("#defaultForm input[name='optionD']").val($(tr).children().eq(6).html());
		$("#defaultForm input[name='optionE']").val($(tr).children().eq(7).html());
		$("#defaultForm input[name='optionF']").val($(tr).children().eq(8).html());
	});
	//删除
	$('#subject_table table').on('click', 'tr button:nth-child(2)', function() {
		$('#deleteModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deleteModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});
	

	//确认删除
	$('#deleteModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/topic/delete/" + deleteId,
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
			post_url = '/topic/add';
		} else {
			post_url = '/topic/update/' + update_id;
		}
		 
		$.ajax({
			type: "POST",
			url: baseurl + post_url,
			data: $("#defaultForm").serialize() + "&subjectId=" + $("#subject_type").val() + "&type=" + $("input[name='inlineRadio']:checked").val()+ "&id=" + update_id,
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
				changeDisabled(true);
			}
		});
	});
	
	$('.seach button').on('click', function() {
		myPlugin.updateParamData({
			name: $("#topic_name").val(),
			type: $("#topic_type").val(),
			subjectId: $("#subject_type").val()
		});
	});
	
	//改变试题类型
	$('input[name="inlineRadio"]').on('change', function() {

		var disabled = $(this).attr("id"); //如果是多选

		disabled == "inlineRadio1" ? (disabled = true) : (disabled = false);
		changeDisabled(disabled);
	});
});


function changeDisabled(disabled) {

	$("input[name='optionB']").attr('disabled', disabled);
	$("input[name='optionC']").attr('disabled', disabled);
	$("input[name='optionD']").attr('disabled', disabled);
	$("input[name='optionE']").attr('disabled', disabled);
	$("input[name='optionF']").attr('disabled', disabled);
}

function showMessage(msg) {
	$("#message button").html('操作成功');
	if(msg != '') {
		$("#message button").html(msg);
	}
	$("#message").fadeToggle(1000);
	$("#message").fadeToggle(1000);
}

function typeToStringFun(obj) {
	if(obj['type'] == "0") {
		return '单选';
	} else {
		return '多选';
	}
}

function getSubject(){
		$.ajax({
			type: "POST",
			url: baseurl + "/subject/findAll",
			data: "",
			dataType: "json",
			success: function(result) {
				$(result.data).each(function(index, element) {
					
					$("#subject_type").append("<option value='"+element["id"]+"'>"+element["name"]+"</option>");
				});
			},
			error: function(result) {
			}
		});
}

function getPaper(){
		$.ajax({
			type: "POST",
			url: baseurl + "/paper/findAll",
			data: "",
			dataType: "json",
			success: function(result) {
				paperObj=result.data;
				$(result.data).each(function(index, element) {
					
					$("#paper").append("<option value='"+element["id"]+"'>"+element["name"]+"</option>");
				});
			},
			error: function(result) {
			}
		});
}