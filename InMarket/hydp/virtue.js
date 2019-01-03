var wrapObj = {
  changeTable:function(){}
};
var maochao='/maochao/';
var btnStr = '<div class="sort"><i class="bot subsort"></i><i class="top subsort"></i></div>';
(function(){
    $(function(){
        var DATAPICKERAPI = {
          // 默认input显示当前月,自己获取后填充
          activeMonthRange: function () {
            return {
              begin: moment().set({ 'date': 1, 'hour': 0, 'minute': 0, 'second': 0 }).format('YYYY-MM-DD HH:mm:ss'),
              end: moment().set({ 'hour': 23, 'minute': 59, 'second': 59 }).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          shortcutMonth: function () {
            // 当月
            var nowDay = moment().get('date');
            var prevMonthFirstDay = moment().subtract(1, 'months').set({ 'date': 1 });
            var prevMonthDay = moment().diff(prevMonthFirstDay, 'days');
            return {
              now: '-' + nowDay + ',0',
              prev: '-' + prevMonthDay + ',-' + nowDay
            }
          },
          // 注意为函数：快捷选项option:只能同一个月份内的
          rangeMonthShortcutOption1: function () {
            var result = DATAPICKERAPI.shortcutMonth();
            return [{
              name: '昨天',
              day: '-1,-1',
              time: '00:00:00,23:59:59'
            }, {
              name: '这一月',
              day: result.now,
              time: '00:00:00,'
            }, {
              name: '上一月',
              day: result.prev,
              time: '00:00:00,23:59:59'
            }];
          },
          // 快捷选项option
          rangeShortcutOption1: [{
            name: '最近一周',
            day: '-7,0'
          }, {
            name: '最近一个月',
            day: '-30,0'
          }, {
            name: '最近三个月',
            day: '-90, 0'
          }],
          singleShortcutOptions1: [{
            name: '今天',
            day: '0'
          }, {
            name: '昨天',
            day: '-1',
            time: '00:00:00'
          }, {
            name: '一周前',
            day: '-7'
          }]
        };
        //十分秒年月日单个
        $('.J-datepicker').datePicker({
        hasShortcut:true,
        min:'2018-01-01 04:00:00',
        max:'2019-04-29 20:59:59',
        shortcutOptions:[{
            name: '今天',
            day: '0'
        }, {
            name: '昨天',
            day: '-1',
            time: '00:00:00'
        }, {
            name: '一周前',
            day: '-7'
        }],
        hide:function(){
            console.info(this)
        }
        });
        
        //年月日单个
        $('.J-datepicker-day').datePicker({
        hasShortcut: true,
        format:'YYYY-MM-DD',
        shortcutOptions: [{
            name: '今天',
            day: '0'
        }, {
            name: '昨天',
            day: '-1'
        }, {
            name: '一周前',
            day: '-7'
        }]
        });
        
        //年月日范围
        $('.J-datepicker-range-day').datePicker({
        hasShortcut: true,
        format: 'YYYY-MM-DD',
        isRange: true,
        shortcutOptions: DATAPICKERAPI.rangeShortcutOption1
        });
    
        //十分年月日单个
        $('.J-datepickerTime-single').datePicker({
        format: 'YYYY-MM-DD HH:mm'
        });
        
        //十分年月日范围
        $('.J-datepickerTime-range').datePicker({
        format: 'YYYY-MM-DD HH:mm',
        isRange: true
        });
        
        //十分秒年月日范围，包含最大最小值
        $('.J-datepicker-range').datePicker({
        hasShortcut: true,
        min: '2018-01-01 06:00:00',
        max: '2019-04-29 20:59:59',
        isRange: true,
        shortcutOptions: [{
            name: '昨天',
            day: '-1,-1',
            time: '00:00:00,23:59:59'
        },{
            name: '最近一周',
            day: '-7,0',
            time:'00:00:00,'
        }, {
            name: '最近一个月',
            day: '-30,0',
            time: '00:00:00,'
        }, {
            name: '最近三个月',
            day: '-90, 0',
            time: '00:00:00,'
        }],
        hide: function () {
            console.info(this.$input.eq(0).val(), this.$input.eq(1).val())
        }
        });
        //十分秒年月日范围，限制只能选择同一月，比如2018-10-01到2018-10-30
        $('.J-datepicker-range-betweenMonth').datePicker({
        isRange: true,
        between:'month',
        hasShortcut: true,
        shortcutOptions: DATAPICKERAPI.rangeMonthShortcutOption1()
        });
        
        //十分秒年月日范围，限制开始结束相隔天数小于30天
        $('.J-datepicker-range-between30').datePicker({
        isRange: true,
        between: 30
        });
        //选择年
        $('.J-yearPicker-single').datePicker({
        format: 'YYYY',
        min: '2018',
        max: '2020'
        });
        
        //年月单个
        $('.J-yearMonthPicker-single').datePicker({
        format: 'YYYY-MM',
        min: '',
        max: '',
        hide: function () {
            if($('body').hasClass('modal-open')){
                betweenMonth();
            }else{
                mainTable();
            }
            
        }
        });
    });
    var $cancalDitch1 = $('#cancalGoodsDitch1'),$createStart = $('#createStart'),$category = $('#category');
    var $mainTable = $('#mainTable');
    var ditch = 'maochao';
    var rows = [];
    var lmdataAll = [];
    var province = [],city = [],district = [];
    var sort = {
        field:'',
        sorting:''
    };
    function currentMonth(time){
        if(time){
            return time;
        }else{
            var date = new Date();
            var year = date.getFullYear(); 
            var mon = date.getMonth()+1;
            if(mon == 1){
                year = year-1;
                mon = 12;
            }
            mon = mon>=10?mon:'0'+mon;
            return year+'-'+mon;
        }
    }
    //时间段处理
    function currentyear(data){
        var date = new Date();
        var year = date.getFullYear(); 
        var mon = date.getMonth()+1;
        var mon1 = date.getMonth()+1;
        mon = mon>=10?mon:'0'+mon;
        mon1 = mon1>=10?mon1:'0'+mon1;
        if(data == 1){
            return year-1+'-'+mon;
        }else{
            if(mon1 == 1){
                year = year-1;
                mon1 = 12;
            }
            return year+'-'+mon1;
        }
       
    }
    //千分位处理
    function toThousands(num,cent) {
        var isThousand=true;
        num = num.toString().replace(/\$|\,/g,'');
        // 检查传入数值为数值类型
        if(isNaN(num))num = "0";
        // 获取符号(正/负数)
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*Math.pow(10,cent)+0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
        var cents = num%Math.pow(10,cent);       // 求出小数位数值
        num = Math.floor(num/Math.pow(10,cent)).toString();  // 求出整数位数值
        cents = cents.toString();        // 把小数位转换成字符串,以便求小数位长度
        // 补足小数位到指定的位数
        while(cents.length<cent)cents = "0" + cents;
        if(isThousand) {
            // 对整数部分进行千分位格式化.
            for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
                num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
        }
        if (cent > 0)
            return (((sign)?'':'-') + num + '.' + cents);
        else
            return (((sign)?'':'-') + num);
    }

    //获取类目信息
    $.ajax({
        url:'/maochao/market/selectgongxiaoleimu',
        type:'POST',
        dataType:'json',
        async:false,
        success:function(data){
            lmdataAll = data;
           lmshow(data);
        }
    });

    //默认日期赋值
    $createStart.val(currentMonth());
    var mainQueryParams = function (params) {
      if(!params){
        params.limit = 1;
        params.offset = 10;
      }
      console.log($category.attr('data-pid'));
        var time = $createStart.val().split('-');
        return {
            pageSize: params.limit,   //页面大小
            pageNumber: (params.offset / params.limit) + 1,  //页码
            id : $category.attr('data-pid'),
            dataDate:time[0]+time[1],
            channel : $cancalDitch1.val(),
            sort:sort.field,
            direction:sort.sorting//升序  asc  降序 desc
        };
    };

    //监听类目是否点击
    $category.on('click',function(){
        $('.lmdata').show();
    });
    //隐藏类目相关的页面
    $('.canclelm').on('click',function(){
        $('.lmdata').hide();
    });

    wrapObj.changeTable = mainTable;
    //主表
    function mainTable(fn,field){
        $mainTable.bootstrapTable('destroy');
        $mainTable.bootstrapTable({
          url: maochao + "market/listQBTEffectData",
          method: 'POST',
          queryParams: mainQueryParams,
          search: false, //不显示 搜索框
          uniqueId: "id",      //每一行的唯一标识，一般为主键列
          detailView: false,     //是否显示父子表
          showToggle: false,     //是否显示详细视图和列表视图的切换按钮
          cardView: false,     //是否显示详细视图
          striped: true,      //是否显示行间隔色
          cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
          pagination: true,     //是否显示分页（*）
          pageNumber: 1,      //初始化加载第一页，默认第一页
          pageSize: 10,      //每页的记录行数（*）
          pageList: [10, 50, 100, 300, 1000],  //可供选择的每页的行数（*）
          sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
          clickToSelect: true,                //是否启用点击选中行
          searchOnEnterKey: true,				//设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
          searchText: true,					//初始化搜索文字
          showRefresh: false,	//刷新
          maintainSelected: true,		//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
          contentType: "application/x-www-form-urlencoded",
          columns: [
            {
                field:'name', 
                title:'属性名称'+btnStr,
                align:'center',
                valign:'middle'
            },{
                field:'sale',
                title:'销量'+btnStr,
                align:'center',
                valign:'middle'
            },{
                field:'sale_ratio',
                title:'销量行业占比'+btnStr,
                formatter :function(value, row, index){
                  return (row.sale_ratio*100).toFixed(1)+'%';
                },
                align:'center',
                valign:'middle'
            },{
                field:'sale_amount',
                title:'销售额'+btnStr,
                align:'center',
                valign:'middle'
            },{
                field:'sale_amount_ratio',
                title:'销售额行业占比'+btnStr,
                formatter :function(value, row, index){
                  return (row.sale_amount_ratio*100).toFixed(2)+'%';
                },
                align:'center',
                valign:'middle'
            },{
                field:null,
                title:'操作',
                formatter :function(value, row, index){
                    return '<a class="btn  btn-success" id="showechart" data-id="'+row.id+'" data-name="'+row.name+'" style="padding:1px 3px;">趋势</a>';
                },
                align:'center',
                valign:'middle'
            }
        ],
        formatNoMatches: function(){
            return "此类目没有数据,请重新选择类目或者当前时间没有数据,重新选择时间";
        },
          onLoadSuccess:function(row){
              rows = row.rows;
          },
          onExpandRow: function (index, row, $detail) {

          },
          onAll:function(){
              $mainTable.find('th[data-field=note]').css('min-width','100px')
              $mainTable.find('th[data-field=warehouseName]').css('min-width','100px')
              $mainTable.find('th[data-field=goodsName]').css('min-width','150px')
          }
      });
    }
     //升序降序
     function sortF(that){
        that.find('.subsort').hide();
        if(sort.sorting === 'desc'){
            that.find('.top').show();
        }else{
            that.find('.bot').show();
        }
    }
    $mainTable.on('click','th',function(){
        var _this = $(this),
            field = _this.attr('data-field');
        if(field === 'name' || field === 'sale' || field === 'sale_ratio' || field === 'sale' || field === 'sale_amount' || field === 'sale_amount_ratio'){
            $('.subsort').show();
            if(sort.field && sort.field === field){
                sort.sorting = sort.sorting === 'asc'? 'desc' : 'asc';
            }else{
                sort.field = field;
                sort.sorting = 'desc';
            }
            mainTable(sortF,field);
        }
    });
    //销量占比处理
    function allnumber(data,sale){
        var num1 = 0;
        for(var i=0;i<data.length;i++){
            num1+=Number(data[i].index2);
        }
        return (Number(sale)/num1*100).toFixed(2);
       
    }
    //销售额占比处理
    function allnumber1(data,sale){
        var num1 = 0;
        for(var i=0;i<data.length;i++){
            num1+=Number(data[i].index9);
        }
        return (Number(sale)/num1*100).toFixed(2);
    }
    mainTable();
    //操作
    (function(){
        var $export = $('#export');
        $export.on('click',function(){
            var option = mainQueryParams({});
            var str = '';
            for(var key in option){
                if(key !== 'pageSize' && key !== 'page'){
                    str+='&'+key+'='+option[key];
                }
            }
            str = str.slice(1);
            location.href=maochao + "outStock/getOutStockItemDetailsExcel?"+str;
        })
    })();

    /*定义三级分类数据*/ 
    //一级分类
    function lmshow(data){
        console.log(data);
        for(var i=0;i<data.length;i++){
            if(data[i].level == 1){
                province.push(data[i]);
            }
        }
        $category.val(province[0].name);
        $category.attr('data-pid',province[0].id);
        city.length = 0;
        for(var i=0;i<data.length;i++){
            if(data[i].pid == $category.attr('data-pid')){
                city.push(data[i]);
            }
        }

        var expressP, expressC, expressD, expressArea, areaCont;
        var arrow = " <font>&gt;</font> ";
    }
    /*初始化一级目录*/
	function intProvince() {
		areaCont = "";
		for (var i=0; i<province.length; i++) {
			areaCont += '<li data-id = "'+province[i].id+'" data-tid="'+province[i].t_id+'" data-name="'+province[i].name+'" class="selectP" style="height:35px;line-height:35px;cursor:pointer">' + province[i].name + '</li>';
		}
		$("#sort1").html(areaCont);
	}
	intProvince();
    //一级类目处理
    $('.selectP').on('click',function(){
        var id = $(this).attr('data-id'),
        tid = $(this).attr('data-tid'),
        name =  $(this).attr('data-name');
        city.length=0;
        for(var i=0;i<lmdataAll.length;i++){
            if(lmdataAll[i].pid == id){
                city.push(lmdataAll[i]);
            }  
        }
        areaCont = "";
        for (var i=0; i<city.length; i++) {
            areaCont += '<li data-id = "'+city[i].id+'" data-tid="'+city[i].id+'" data-name="'+city[i].name+'" class="selectc" style="height:35px;line-height:35px;cursor:pointer">' + city[i].name + '</li>';
        }
        $("#sort2").html(areaCont).show();
        $("#sort3").hide();
        $(this).addClass("active").siblings("li").removeClass("active");
        $("#releaseBtn").removeAttr("disabled");
        $category.val(name);
        $category.attr('data-pid',tid);
    });
    //二级类目处理
    $('.wareSort').on('click','.selectc',function(){
        var id = $(this).attr('data-id'),
        tid = $(this).attr('data-tid'),
        name =  $(this).attr('data-name');
        district.length=0;
        for(var i=0;i<lmdataAll.length;i++){
          if(lmdataAll[i].pid == id){
            district.push(lmdataAll[i]);
          }  
        }
        areaCont = "";
        for (var i=0; i<district.length; i++) {
            areaCont += '<li data-id = "'+district[i].id+'" data-tid="'+district[i].id+'" data-name="'+district[i].name+'" class="selectd" style="height:35px;line-height:35px;cursor:pointer">' + district[i].name + '</li>';
        }
        $("#sort3").html(areaCont).show();
        $category.val(name);
        $category.attr('data-pid',tid);
        $(this).addClass("active").siblings("li").removeClass("active");
    });
    //三级类目
    $('.wareSort').on('click','.selectd',function(){
      var id = $(this).attr('data-id'),
      tid = $(this).attr('data-tid'),
      name =  $(this).attr('data-name');
      $category.val(name);
      $category.attr('data-pid',tid);
      $(this).addClass("active").siblings("li").removeClass("active");
    });
    //确认请求
    $('.oklm').on('click',function(){
        mainTable();
        $('.lmdata').hide();
    });

    //子类目处理
    $mainTable.on('click','#songlm',function(){
        var pid = $category.attr('data-pid');
        var level = '';
        for(var i=0;i<lmdataAll.length;i++){
            if(lmdataAll[i].cid == pid){
                level = lmdataAll[i].level;
            }
        }
        if(level == 2){
            var html = '';
            for(var i=0;i<city.length;i++){
                html += '<option value="'+city[i].cid+'">'+city[i].name+'</option>'
            }
            $('#lm_value').html(html)
        }
        $('#topModal').modal('show');
    });

    //点击确认按钮数据进行查询
    $('.songOK').on('click',function(){
        $category.val($("#lm_value").find("option:selected").text());
        $category.attr('data-pid',$('#lm_value').val());
        $('#topModal').modal('hide');
        mainTable();
    });

    //展示趋势图
    $mainTable.on('click','#showechart',function(){
        $('#Modal').modal('show');
        $('#start').val(currentyear(1));
        $('#end').val(currentyear(2));
        var id = $('#category').attr('data-pid'),
            name = $(this).attr('data-name');
        $('.songpid').html(id);
        $('.songcid').html(name);
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
          id :   $('.songpid').html(),
          name :  $('.songcid').html(),
          startMonth :  time[0]+time[1],
          endMonth :  time1[0]+time1[1],
          channel : $('#ditchecharts').val()
        }
        showecharts(data);
    });

    //监听渠道，时间筛选处理
    $('#ditchecharts').on('change',function(){
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
          id :   $('.songpid').html(),
          name :  $('.songcid').html(),
          startMonth :  time[0]+time[1],
          endMonth :  time1[0]+time1[1],
          channel : $('#ditchecharts').val()
        }
        showecharts(data);
    });

    //月范围
    function betweenMonth(){
    var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
    var data = {
        cid :  $('.songcid').html(),
        pid :  $('.songpid').html(),
        date1 :  time[0]+time[1],
        date2 :  time1[0]+time1[1],
        ditch : $('#ditchecharts').val()
    }
    showecharts(data);
    }

    //趋势图数据请求
    function showecharts(data){
        //处理有效月
        var month = new Array();
        month = getMonthAll($('#start').val(),$('#end').val());
        $.ajax({
            url: maochao + "market/listQBTEffectDetailData",
            type:'POST',
            data : data,
            dataType:'json',
            async:false,
            success:function(data){
               //数据处理
               showData(data.rows,month);
            }
        });
    }

    //处理有效月
    function getMonthAll(begin,end) {
        var d1 = begin;
        var d2 = end;
        var dateArry = new Array();
        var s1 = d1.split("-");
        var s2 = d2.split("-");
        var mCount = 0;
        if (parseInt(s1[0]) < parseInt(s2[0])) {
            mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1])+1;
        } else {
            mCount = parseInt(s2[1]) - parseInt(s1[1])+1;
        }
        if (mCount > 0) {
            var startM = parseInt(s1[1]);
            var startY = parseInt(s1[0]);
            for (var i = 0; i < mCount; i++) {
                if (startM < 12) {
                    dateArry[i] = startY.toString() + (startM>9 ? startM : "0" + startM);
                    startM += 1;
                } else {
                    dateArry[i] = startY.toString() + (startM > 9 ? startM : "0" + startM);
                    startM = 1;
                    startY += 1;
                }
            }
        }
        return dateArry;
    }
    
    //数据处理
    //数据处理
    function showData(datashow,timeData){
        var data1 = new Array(), //销量
            data2 = new Array(), //销量占比
            data3 = new Array(), //销售额
            data4 = new Array(); //销售额占比
        //获取总额    
        for(let j=0;j<timeData.length;j++){
            for(let i=0;i<datashow.length;i++){
                if(timeData[j] == datashow[i].data_date){
                    data1.push({'time':timeData[j],value:datashow[i].sale?datashow[i].sale:0}); //销量
                    data2.push({'time':timeData[j],value:datashow[i].sale_ratio?datashow[i].sale_ratio:0}); //销量占比
                    data3.push({'time':timeData[j],value:datashow[i].sale_amount?datashow[i].sale_amount:0}); //销售额
                    data4.push({'time':timeData[j],value:datashow[i].sale_amount_ratio?datashow[i].sale_amount_ratio:0}); //流量指数
                }
            }
            data1.push({'time':timeData[j],value:0});
            data2.push({'time':timeData[j],value:0});
            data3.push({'time':timeData[j],value:0});
            data4.push({'time':timeData[j],value:0});
        }
        data1 = heavy1(data1,'num');
        data2 = heavy1(data2,'pec');
        data3 = heavy1(data3,'num');
        data4 = heavy1(data4,'pec');
        
        var mychartsale= echarts.init(document.getElementById('main'));
        option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['销量','销量占比','销售额','销售额占比']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timeData
            },
            yAxis : [
                {
                    name: '金额',
                    type : 'value',
                    scale:true,
                },
                {
                    name: '占比',
                    type : 'value',
                    scale:true,
                    min: 0,
                    max: 100,        // 计算最大值
                    interval: Math.ceil(100 / 5),   //  平均分为5份
                    axisLabel: {  
                        show: true,    
                        formatter: '{value} %'  
                    }
                }
            ],
            series: [
                {
                    name:'销量',
                    type:'line',
                    stack: '',
                    data:data1,
                    yAxisIndex:0
                },
                {
                    name:'销量占比',
                    type:'line',
                    stack: '',
                    data:data2,
                    yAxisIndex:1
                },
                {
                    name:'销售额',
                    type:'line',
                    stack: '',
                    data:data3,
                    yAxisIndex:0
                },
                {
                    name:'销售额占比',
                    type:'line',
                    stack: '',
                    data:data4,
                    yAxisIndex:1
                }
            ]
        };

        mychartsale.setOption(option);
        window.addEventListener("resize",function(){
            mychartsale.resize(); 
        });

    }

       //获取数据去重后赋值,
       function heavy1(data,data1){
        var array = new Array();
        for (var i = 0; i < data.length; i++) {
            for (var j =i+1; j <data.length; ) {
                if (data[i].time == data[j].time ) {
                    data.splice(j, 1);
                }else {
                    j++;
                }
            }
        }
        //去掉时间
        if(data1 == 'num'){
            for(var m=0;m<data.length;m++){
                array.push(data[m].value);
            } 
        }else{
            for(var m=0;m<data.length;m++){
                array.push(data[m].value*100);
            }
        }
        return array;
    }
})();
