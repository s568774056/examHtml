var update_id = '';
var deleteId = '';	var paperPlugin,topicPlugin,paperId;
$(document).ready(function() {
	 paperPlugin = $('#paperTopic_table').myPlugin({
		'title_name': 'Id,题目名称', //th第一行的表头名称
		'column_name': 'id,name', //字段名
		'url': '/paperTopic/select',
		'operate': '<button type="button" class="btn btn-danger btn-sm">删除</button><button type="button" class="btn btn-info btn-sm">查看题目</button>', //操作内容
		'modalId': 'topicLiModal',
		'data': {
			page: 0,
			size: 3
		}, //请求参数
	});

	//查询试题
	topicPlugin = $('#topicDiv').myPlugin({
		'title_name': 'Id,题目名称', //th第一行的表头名称
		'column_name': 'id,name', //字段名
		'url': '/paperTopic/selectTopic',
		'operate': '<button type="button" class="btn btn-danger btn-sm">添加</button>', //操作内容
		'modalId': 'topicLiModal',
		'is_add': false,
		'data': {
			page: 0,
			size: 3
		}, //请求参数
	});
 

	//删除
	$('#paperTopic_table table').on('click', 'tr button:first-child', function() {

		$('#deModal').modal('show');
		var tr = $(this).parents('tr');
		$('#deModal .modal-body em').html("【" + $(tr).children().eq(1).html() + "】");
		deleteId = $(tr).children().eq(0).html();
	});
	
	//查看题目
	$('#paperTopic_table table').on('click', 'tr button:last-child', function() {
		$('#topicModal').modal('show');
		var indexTr = $(this).parents('tr').index();
		var topicObj=paperPlugin.options.selectData[indexTr];console.log(topicObj);
		console.log("..........................................."+topicObj[name]);
		$("#topicName").html(topicObj.name);
		$("#topicType").html(topicObj.name=="0"?"单选":"多选");
		
    	$("#topicModal .optionDiv").html("");
		verdictOption('optiona',topicObj.optiona);
		verdictOption('optionb',topicObj.optionb);
		verdictOption('optionc',topicObj.optionc);
		verdictOption('optiond',topicObj.optiond);
		verdictOption('optione',topicObj.optione);
		verdictOption('optionf',topicObj.optionf);
	});


	//确认删除
	$('#deModal button:last-child').on('click', function() {
		$.ajax({
			type: "POST",
			url: baseurl + "/paperTopic/delete/" + deleteId,
			data: '',
			dataType: "json",
			success: function(result) {
				console.log(result.code + '   ' + (result.code == 0));
				if(result.code == 0) {
					showMessage('删除成功');
					$('#deModal').modal('hide');
					paperPlugin.getData();
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
	
	
	
	$('.paperTopicSeach button').on('click', function() {
		paperPlugin.updateParamData({
			name: $("#topic_name").val(),
			paperId:paperId
		});
	});
	
	$('.topicSeach button').on('click', function() {
		topicPlugin.updateParamData({
			name: $("#toName").val(),
			subjectId:$("#su_type").val(),
			paperId:paperId
		});
	});
	
	$('#paperTopic_table #addTb').on('click', function() {

		topicPlugin.updateParamData({
			name: $("#toName").val(),
			subjectId:$("#su_type").val(),
			paperId:paperId
		});
	});
	
	
	
	$('#topicLiModal table').on('click', 'tr button', function() {

		var topicId =$(this).parents('tr').children().eq(0).html();
		addPaper(topicId,$(this).parents('tr'));
	});

});
	function selectTopic(){
		paperPlugin.updateParamData({
			name: $("#paper_name").val(),
			paperId:paperId
		});
	}
	
function verdictOption(opName,data){
	if(data==''){
		return;
	}
	var html='<div class="form-group"><label class="col-sm-2 control-label">'+switc(opName)+'</label><div class="col-sm-10"><label class="radio-inline" style="padding-left: 20px;" >'+data+'</label></div></div>';
	
	$("#topicModal .optionDiv").append(html);
}

function switc(opName){
var html='';
console.log(opName);
switch(opName) {
	case 'optiona':
		html = '选项A:';
		break;
	case 'optionb':
		html = '选项B:';
		break;
	case 'optionc':
		html = '选项C:';
		break;
	case 'optiond':
		html = '选项D:';
		break;
	case 'optione':
		html = '选项E:';
		break;
	case 'optionf':
		html = '选项F:';
		break;
	default:
		break;
}
	return html;
}



function addPaper(topicId,obj){
			$.ajax({
			type: "POST",
			url: baseurl +  '/paperTopic/add',
			data: "topicId=" + topicId + "&paperId=" +paperId,
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