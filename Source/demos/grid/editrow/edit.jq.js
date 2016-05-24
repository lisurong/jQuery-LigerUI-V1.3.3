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
			console.log(o);
			//初始化总局
			initLayout($this);
			//初始化按钮
			var header = $(".grid-header");//$this.find(".grid-header");
			if(opts.showAddRow){
				buildAddRowBtn(header);
			}
			if(opts.showAddCol){
				buildAddColBtn(header);
			}
			if(opts.showDelCol){
				buildDelColBtn(header);
			}
			
			
			
			//初始化表格
			var body = $this.find(".grid-body");
			if (o.showOption) {
				var opt = {
					display: '操作',
					isSort: false,
					render: function(rowdata, rowindex, value) {
						var h = "";
						if (!rowdata._editing) {
							h += "<a class='btn-row-edit'>修改</a> ";
							h += "<a class='btn-row-del'>删除</a> ";
						} else {
							h += "<a class='btn-row-edit-submit'>提交</a> ";
							h += "<a class='btn-row-edit-cancel'>取消</a> ";
						}
						return h;
					}
				}
				o.columns.push(opt);
			}
			$grid = $(body).ligerGrid(o);



		});
	};

	function initLayout(el) {
		$(el).before('<div class="grid-header"></div>');
		$(el).append('<div class="grid-body"></div>');
	}



	function buildAddRowBtn(el) {
		$(el).append('<a class="l-button" style="width:120px" onclick="addNewRow()">新增行</a>');
	};

	function buildAddColBtn(el) {
		$(el).append('<a class="l-button" style="width:120px" onclick="addCol()">新增列</a>');
	};

	function buildDelColBtn(el) {
		$(el).append('<a class="l-button" style="width:120px" onclick="showDelColUI()">删除列</a>');
	};

	function addRow(name) {
		if (window.console && window.console.log)
			window.console.log('zqGrid selection count: ' + $obj.size());
		if (config.addRowHandler) {
			config.addRowHandler(row);
		}
	};
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