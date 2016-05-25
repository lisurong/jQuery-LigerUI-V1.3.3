// 创建一个闭包  
(function($) {
	// 插件的定义  
	$.fn.zqGrid = function(options) {
		// build main options before element iteration  
		var opts = $.extend({}, $.fn.zqGrid.defaults, options);
		// iterate and reformat each matched element  
		return this.each(function() {
			$this = $(this);
			// 配置信息
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			$this.config = o;
			//console.log(o);
			//初始化总局
			initLayout();
			//初始化按钮
			if (opts.showAddRow) {
				buildAddRowBtn();
			}
			if (opts.showAddCol) {
				buildAddColBtn();
				
			}
			if (opts.showDelCol) {
				buildDelColBtn();
			}
			//初始化事件
			initEvent();
			//初始化表格
			var body = $this.find(".grid-body");
			if (o.showOption) {
				var opt = {
					display: '操作',
					isSort: false,
					render: function(rowdata, rowindex, value) {
						var h = "";
						if (!rowdata._editing) {
							h += "<a class='btn-row-edit' rowindex='" + rowindex + "'>修改</a> ";
							h += "<a class='btn-row-del' rowindex='" + rowindex + "'>删除</a> ";
						} else {
							h += "<a class='btn-row-edit-submit' rowindex='" + rowindex + "'>提交</a> ";
							h += "<a class='btn-row-edit-cancel' rowindex='" + rowindex + "'>取消</a> ";
						}
						return h;
					}
				}
				o.columns.push(opt);
			}
			$this.grid = $(body).ligerGrid(o);



		});
	};
	//绑定按钮比事件函数
	function initEvent() {
		$this.on('click', '.add-row-btn', showAddRow); //新增行
		$this.on('click', '.btn-row-edit', beginRowEdit); //修改行
		$this.on('click', '.btn-row-edit-submit', endEdit); //提交修改
		$this.on('click', '.btn-row-del', deleteRow); //删除行
		$this.on('click', '.btn-row-edit-cancel', cancelEdit); //取消行修改
		$this.on('click', '.add-col-btn', addCol); //新增列弹框
		$this.on('click', '.del-col-btn', delCol); //删除列弹框
		$(document).on('click', '.sure-col', addNewColUI); //保存新增列
		$(document).on('click', '.del-col', delColUI); //删除列

	}
	//点击修改
	function beginRowEdit(event) {
		var rowid = $(event.target).attr('rowindex');
		//console.log(rowid);
		$this.grid.beginEdit(rowid);
	}
	//点击取消
	function cancelEdit(event) {
		$this.grid.cancelEdit(rowid);
	}
	//提交修改
	function endEdit(event) {
		////console.log(rowid);
		var rowid = $(event.target).attr('rowindex');
		//console.log(rowid);
		$this.grid.endEdit(rowid);
		var o = $this.grid.getRow(rowid); //编辑后的数据
		//o是要提交到后台的数据
		if($this.config.onZQRowEdit){
			$this.config.onZQRowEdit(o);
		}
	}
	//删除行
	 function deleteRow(event) {
	 	var rowid = $(event.target).attr('rowindex');
        if (confirm('确定删除?')) {
        	var o = $this.grid.getRow(rowid); //编辑后的数据
            $this.grid.deleteRow(rowid);
            if($this.config.onZQRowDel){
            	$this.config.onZQRowDel(o);
            }

        }
    }
    //取消行修改
    function cancelEdit(event) {
    	var rowid = $(event.target).attr('rowindex');
        $this.grid.cancelEdit(rowid);
    }
    //新增行
	function showAddRow() {
		var grid = $this.grid;
		grid.addRow({});
	}
    //新增列
     function addCol(){/**点击新增**/
     	buildAddColUi();
        dialog = $.ligerDialog.open({ target: $("#target1") });

    }
    //保存新增列
    function addNewColUI(){/**点击保存**/
         //console.info('新增列');





    }
    //删除列
    function delCol(){//点击删除列按钮        
        // $('#select').empty();
        // $('#select').append(html);
        buildDelColUi();
        dialog = $.ligerDialog.open({ target: $("#target2") });
    }
    function delColUI(){//点击删除按钮
       //console.info('删除列');






    }

    //初始化两个容器
	function initLayout() {
		$this.append('<div class="grid-header"></div>');
		$this.append('<div class="grid-body"></div>');

	}
    //新增列弹框html
	function buildAddColUi() {
		var html = [];
		html.push('<div id="target1" style="width:200px; margin:3px; display:none;">');
		html.push('  <label class="add">表头名称：<input type="text" data-attr="display" value="" /></label>');
		html.push('  <label class="add">字段名字：<input type="text" data-attr="name" value="" /></label>');
		html.push('  <label class="add">数据类型：');
		html.push('      <select data-attr="type">');
		html.push('          <option value="int" selected="selected">整数</option>');
		html.push('          <option value="text">文本</option>');
		html.push('      </select>');
		html.push('  </label>');
		html.push('  <button id="sure" class="sure-col">保存</button>');
		html.push('</div>');
		$this.after(html.join(''));
	};
	//删除列弹框html
	function buildDelColUi() {
		var html = [];
		html.push('<div id="target2" style="width:200px; margin:3px; display:none;">');
		html.push('  <select id="select"></select>');
		html.push('  <button id="sure1" class="del-col">删除</button>');
		html.push('</div>');
		$this.after(html.join(''));
	};
	//新增行按钮
	function buildAddRowBtn() {
		$this.find(".grid-header").append('<a class="l-button add-row-btn" style="width:120px">新增行</a>');
	};
	//新增列按钮
	function buildAddColBtn() {
		$this.find(".grid-header").append('<a class="l-button add-col-btn" style="width:120px">新增列</a>');
	};

	function buildDelColBtn() {
		$this.find(".grid-header").append('<a class="l-button del-col-btn" style="width:120px">删除列</a>');
	};
	// //删除列按钮
	// function addRow(name) {
	// 	if (window.console && window.console.log)
	// 		window.//console.log('zqGrid selection count: ' + $obj.size());
	// 	if (config.addRowHandler) {
	// 		config.addRowHandler(row);
	// 	}
	// };
	// 定义暴露format函数  
	$.fn.zqGrid.format = function(txt) {
		return '<strong>' + txt + '</strong>';
	};
	// 插件的defaults  
	$.fn.zqGrid.defaults = {
		showAddRow: true,
		showAddCol: true,
		showDelCol: true,
		showOption: true,
	};
	// 闭包结束  
})(jQuery);