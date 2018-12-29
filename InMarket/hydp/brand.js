var wrapObj = {
  changeTable:function(){}
};
var btnStr = '<div class="sort"><i class="bot subsort"></i><i class="top subsort"></i></div>';
var maochao='/maochao/';
(function(){
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
            var mon = date.getMonth();
            mon = mon>=10?mon:'0'+mon;
            return year+'-'+mon;
        }
    }
    //时间段处理
    function currentyear(data){
        var date = new Date();
        var year = date.getFullYear(); 
        var mon = date.getMonth()+1;
        var mon1 = date.getMonth();
        mon = mon>=10?mon:'0'+mon;
        mon1 = mon1>=10?mon1:'0'+mon1;
        if(data == 1){
            return year-1+'-'+mon;
        }else{
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
        url:'/maochao/market/listMarketCategory ',
        type:'POST',
        dataType:'json',
        async:false,
        success:function(data){
            lmdataAll = data.data;
           lmshow(data.data);
        }
    });

    //默认日期赋值
    $createStart.val(currentMonth());
    var mainQueryParams = function (params) {
      if(!params){
        params.limit = 1;
        params.offset = 10;
      }
        var time = $createStart.val().split('-');
        return {
            pageSize: params.limit,   //页面大小
            pageNumber: (params.offset / params.limit) + 1,  //页码
            classId : $category.attr('data-pid'),
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
          url: maochao + "market/listMarketData",
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
          pageList: [10,50, 100, 300, 1000],  //可供选择的每页的行数（*）
          sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
          clickToSelect: true,                //是否启用点击选中行
          searchOnEnterKey: true,				//设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
          searchText: true,					//初始化搜索文字
          showRefresh: false,	//刷新
          maintainSelected: true,		//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
          contentType: "application/x-www-form-urlencoded",
          columns: [
            {
                field:'brand_name', 
                title:'品牌名称'+btnStr,
                align:'center',
                valign:'middle'
            },{
                field:'uv_rank_no',
                title:'排名'+btnStr,
                formatter :function(value, row, index){
                    return row.uv_rank_no?row.uv_rank_no:0;
                },
                align:'center',
                valign:'middle'
            },{
                field:'cycle_cqc',
                title:'排名升降'+btnStr,
                formatter :function(value, row, index,data){
                  if(row.cycle_cqc>0){
                    return "上升"+row.cycle_cqc+"名";
                  }else if(row.cycle_cqc<0){
                    return "下降"+Math.abs(row.cycle_cqc)+"名";
                  }else{
                    return "保持";
                  }
                   
                },
                align:'center',
                valign:'middle'
            },{
                field:'sale',
                title:'交易额'+btnStr,
                align:'center',
                valign:'middle'
            },{
                field:'trade_index_percent',
                title:'交易增长幅度'+btnStr,
                formatter :function(value, row, index,data){
                   return  (Number(row.trade_index_percent)*100).toFixed(2)+'%';
                },
                align:'center',
                valign:'middle'
            },{
              field:'pay_rate_index',
              title:'支付转化指数'+btnStr,
              align:'center',
              valign:'middle'
            },{
              field:'uv_index',
              title:'流量指数'+btnStr,
              formatter :function(value, row, index,data){
                  return row.uv_index?row.uv_index:'0';
              },
              align:'center',
              valign:'middle'
            },{
              field:'pvuv_hits',
              title:'搜索人气'+btnStr,
              formatter :function(value, row, index,data){
                return row.pvuv_hits?row.pvuv_hits:'0';
              },
              align:'center',
              valign:'middle'
            },{
                field:null,
                title:'操作',
                formatter :function(value, row, index){
                    return '<a class="btn  btn-success" id="showechart" data-classid="'+row.class_id+'" data-brandid="'+row.brand_id+'" style="padding:1px 3px;">趋势</a>';
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
              if(fn){
                var el = $mainTable.find('th[data-field='+ field +']');
                fn(el);
            }
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
        if(field === 'brand_name' || field === 'uv_rank_no' || field === 'cycle_cqc' || field === 'sale' || field === 'trade_index_percent' || field === 'pay_rate_index' || field === 'uv_index' || field === 'pvuv_hits'){
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
        for(var i=0;i<data.length;i++){
            if(data[i].level == 1){
                province.push(data[i]);
            }
        }
        $category.val(province[0].name);
        $category.attr('data-pid',province[0].t_id);
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
            areaCont += '<li data-id = "'+city[i].id+'" data-tid="'+city[i].t_id+'" data-name="'+city[i].name+'" class="selectc" style="height:35px;line-height:35px;cursor:pointer">' + city[i].name + '</li>';
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
            areaCont += '<li data-id = "'+district[i].id+'" data-tid="'+district[i].t_id+'" data-name="'+district[i].name+'" class="selectd" style="height:35px;line-height:35px;cursor:pointer">' + district[i].name + '</li>';
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
        var classId = $(this).attr('data-classid'),
            brandId = $(this).attr('data-brandid');
        $('.songpid').html(classId);
        $('.songcid').html(brandId);
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            pageSize: 1000,   //页面大小
            pageNumber: 1,  //页码
            classId :  classId,
            brandId :  brandId,
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
            pageSize: 1000,   //页面大小
            pageNumber: 1,  //页码
            classId :   $('.songpid').html(),
            brandId :  $('.songcid').html(),
            startMonth :  time[0]+time[1],
            endMonth :  time1[0]+time1[1],
            channel : $('#ditchecharts').val()
        }
        showecharts(data);
    });
    $('#start').on('change',function(){
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            pageSize: 1000,   //页面大小
            pageNumber: 1,  //页码
            classId :   $('.songpid').html(),
            brandId :  $('.songcid').html(),
            startMonth :  time[0]+time[1],
            endMonth :  time1[0]+time1[1],
            channel : $('#ditchecharts').val()
        }
        showecharts(data);
    });
    $('#end').on('change',function(){
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            pageSize: 1000,   //页面大小
            pageNumber: 1,  //页码
            classId :   $('.songpid').html(),
            brandId :  $('.songcid').html(),
            startMonth :  time[0]+time[1],
            endMonth :  time1[0]+time1[1],
            channel : $('#ditchecharts').val()
        }
        showecharts(data);
    });

    //趋势图数据请求
    function showecharts(data){
        //处理有效月
        var month = new Array();
        month = getMonthAll($('#start').val(),$('#end').val());
        $.ajax({
            url: maochao + "market/listMarketData",
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
        console.log(dateArry);
        return dateArry;
    }
    
    //数据处理
    //数据处理
    function showData(datashow,timeData){
        console.log(datashow); 
        var data1 = new Array(), //交易指数
            data2 = new Array(), //交易增长指数
            data3 = new Array(), //支付转化指数
            data4 = new Array(), //流量指数
            data5 = new Array(); //搜索人气
        //获取总额    
        for(let j=0;j<timeData.length;j++){
            for(let i=0;i<datashow.length;i++){
                if(timeData[j] == datashow[i].data_date){
                    data1.push({'time':timeData[j],value:datashow[i].trade_index?datashow[i].trade_index:0}); //交易指数
                    data2.push({'time':timeData[j],value:datashow[i].trade_index_percent?datashow[i].trade_index_percent:0}); //交易增长指数
                    data3.push({'time':timeData[j],value:datashow[i].pay_rate_index?datashow[i].pay_rate_index:0}); //支付转化指数
                    data4.push({'time':timeData[j],value:datashow[i].uv_index?datashow[i].uv_index:0}); //流量指数
                    data5.push({'time':timeData[j],value:datashow[i].pvuv_hits?datashow[i].pvuv_hits:0}); //搜索人气
                }
            }
            data1.push({'time':timeData[j],value:0});
            data2.push({'time':timeData[j],value:0});
            data3.push({'time':timeData[j],value:0});
            data4.push({'time':timeData[j],value:0});
            data5.push({'time':timeData[j],value:0});
        }
        data1 = heavy1(data1,'num');
        data2 = heavy1(data2,'pct');
        data3 = heavy1(data3,'num');
        data4 = heavy1(data4,'num');
        data5 = heavy1(data5,'num');

        
        var mychartsale= echarts.init(document.getElementById('main'));
        option = {
            title: {
                text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data:['交易指数','交易增长指数','支付转化指数','流量指数','搜索人气']
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
                    name: '指数',
                    type : 'value',
                    scale:true,
                },
                {
                    name: '百分比',
                    type : 'value',
                    scale:true,
                    min: -100,
                    max: 100,        // 计算最大值
                    interval: 100 / 5,   //  平均分为5份
                    axisLabel: {  
                        show: true,    
                        formatter: '{value} %'  
                    }
                }
            ],
            series: [
                {
                    name:'交易指数',
                    type:'line',
                    stack: '',
                    data:data1,
                    yAxisIndex:0
                },
                {
                    name:'交易增长指数',
                    type:'line',
                    stack: '',
                    data:data2,
                    yAxisIndex:1,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                positiong: 'top',
                                formatter: '{c}%'
                            }
                        }
                    }
                },
                {
                    name:'支付转化指数',
                    type:'line',
                    stack: '',
                    data:data3,
                    yAxisIndex:0
                },
                {
                    name:'流量指数',
                    type:'line',
                    stack: '',
                    data:data4,
                    yAxisIndex:0
                },
                {
                    name:'搜索人气',
                    type:'line',
                    stack: '',
                    data:data5,
                    yAxisIndex:0
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
        
        console.log(array)
        return array;
    }
})();
