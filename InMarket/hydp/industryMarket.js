var wrapObj = {
  changeTable:function(){}
};
var maochao='/maochao/survey/';
(function(){
    var $cancalDitch1 = $('#cancalGoodsDitch1'),$createStart = $('#createStart'),$category = $('#category');
    var $mainTable = $('#mainTable');
    var ditch = 'maochao';
    var rows = [];
    var lmdataAll = [];
    var province = [],city = [],district = [];
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
        url:'/maochao/survey/replenishment/selectleimudata',
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
        var time = $createStart.val().split('-');
        return {
            pid : $category.attr('data-pid'),
            date:time[0]+time[1],
            ditch : $cancalDitch1.val()
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
    function mainTable(){
        $mainTable.bootstrapTable('destroy');
        $mainTable.bootstrapTable({
            url: maochao + "replenishment/selectleimu",
            method: 'POST',
            queryParams: mainQueryParams,
            search: false, //不显示 搜索框
            uniqueId: "id",      //每一行的唯一标识，一般为主键列
            detailView: false,     //是否显示父子表
            showToggle: false,     //是否显示详细视图和列表视图的切换按钮
            cardView: false,     //是否显示详细视图
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            sortable: true,
            pagination: true,     //是否显示分页（*）
            pageNumber: 1,      //初始化加载第一页，默认第一页
            pageSize: 10000,      //每页的记录行数（*）
            pageList: [10000],  //可供选择的每页的行数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            clickToSelect: true,                //是否启用点击选中行
            searchOnEnterKey: true,				//设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
            searchText: true,					//初始化搜索文字
            showRefresh: false,	//刷新
            maintainSelected: true,		//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
            contentType: "application/x-www-form-urlencoded",
            responseHandler: function(data){
                var index2All = 0,index9All=0;
                var array = new Array();
                if(data.length>0){
                    //求总量
                    for(var i=0;i<data.length;i++){
                        index2All+=Number(data[i].index2);
                        index9All+=Number(data[i].index9);
                    }
                    //赋值处理求百分比
                    for(var i=0;i<data.length;i++){
                        array.push({cid:data[i].cid,index2:data[i].index2,index2pce:(Number(data[i].index2)/index2All*100).toFixed(2),index9:data[i].index9,index9pec:(Number(data[i].index9)/index9All*100).toFixed(2),name:data[i].name});
                    }
                }
                console.log(array);

                return array;
            },
            columns: [
                {
                    field:'name',
                    title:'类目名称',
                    align:'center',
                    valign:'middle',
                    sortable: true
                },{
                    field:'index2',
                    title:'销量',
                    formatter :function(value, row, index){
                        return toThousands(row.index2,2);
                    },
                    align:'center',
                    valign:'middle',
                    sortable: true
                },{
                    field:'index2pce',
                    title:'销量行业占比',
                    formatter :function(value, row, index){
                        return row.index2pce+'%';
                    },
                    align:'center',
                    valign:'middle',
                    sortable: true
                },{
                    field:'index9',
                    title:'销售额',
                    formatter :function(value, row, index){
                        return toThousands(row.index9,2);
                    },
                    align:'center',
                    valign:'middle',
                    sortable: true
                },{
                    field:'index9pec',
                    title:'销售额行业占比',
                    formatter :function(value, row, index){
                        return row.index9pec+'%';
                    },
                    align:'center',
                    valign:'middle',
                    sortable: true
                },{
                    field:null,
                    title:'操作',
                    formatter :function(value, row, index){
                        return '<a class="btn  btn-success" id="songlm" data-name="'+row.name+'" data-pid="'+row.cid+'" style="padding:1px 3px;">子类目</a>&nbsp;&nbsp;<a class="btn  btn-success" id="showechart" data-cid="'+row.cid+'" style="padding:1px 3px;">趋势</a>';
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
    //百分比排序处理
    function percentSort(a, b) {
        var value_a = a.substr(0, a.length-1)
        var value_b = b.substr(0, b.length-1)
        return value_b-value_a;
    }
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
            if(data[i].level == 2){
                province.push(data[i]);
            }
        }
        $category.val("全部");
        $category.attr('data-pid',1);
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
			areaCont += '<li data-id = "'+province[i].cid+'" data-name="'+province[i].name+'" class="selectP" style="height:35px;line-height:35px;cursor:pointer">' + province[i].name + '</li>';
		}
		$("#sort1").html(areaCont);
	}
	intProvince();
    //一级类目处理
    $('.selectP').on('click',function(){
        var id = $(this).attr('data-id'),
        name =  $(this).attr('data-name');
        city.length=0;
        for(var i=0;i<lmdataAll.length;i++){
            if(lmdataAll[i].pid == id){
                city.push(lmdataAll[i]);
            }  
        }
        areaCont = "";
        for (var i=0; i<city.length; i++) {
            areaCont += '<li data-id = "'+city[i].cid+'" data-name="'+city[i].name+'" class="selectc" style="height:35px;line-height:35px;cursor:pointer">' + city[i].name + '</li>';
        }
        $("#sort2").html(areaCont).show();
        $("#sort3").hide();
        $(this).addClass("active").siblings("li").removeClass("active");
        $("#releaseBtn").removeAttr("disabled");
        $category.val(name);
        $category.attr('data-pid',id);
    });
    //二级类目处理
    $('.wareSort').on('click','.selectc',function(){
        var id = $(this).attr('data-id'),
        name =  $(this).attr('data-name');
        $category.val(name);
        $category.attr('data-pid',id);
        $(this).addClass("active").siblings("li").removeClass("active");
    });
    //确认请求
    $('.oklm').on('click',function(){
        mainTable();
        $('.lmdata').hide();
    });

    //子类目处理
    $mainTable.on('click','#songlm',function(){
        var pid = $(this).attr('data-pid');
        var name = $(this).attr('data-name');
        $category.val(name);
        $category.attr('data-pid',pid);
        mainTable();
    });

    //展示趋势图
    $mainTable.on('click','#showechart',function(){
        $('#Modal').modal('show');
        $('#start').val(currentyear(1));
        $('#end').val(currentyear(2));
        var cid = $(this).attr('data-cid'),
        pid = '';
        for(var i=0;i<lmdataAll.length;i++){
            if(lmdataAll[i].cid == cid){
                pid = lmdataAll[i].pid;
            }
        }
        $('.songpid').html(pid);
        $('.songcid').html(cid);
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            cid :  $('.songcid').html(),
            pid :  $('.songpid').html(),
            date1 :  time[0]+time[1],
            date2 :  time1[0]+time1[1],
            ditch : $('#ditchecharts').val()
        }
        echartsShow(data);
    });

    //监听渠道，时间筛选处理
    $('#ditchecharts').on('change',function(){
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            cid :  $('.songcid').html(),
            pid :  $('.songpid').html(),
            date1 :  time[0]+time[1],
            date2 :  time1[0]+time1[1],
            ditch : $('#ditchecharts').val()
        }
        echartsShow(data);
    });

    $('#start').on('change',function(){
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            cid :  $('.songcid').html(),
            pid :  $('.songpid').html(),
            date1 :  time[0]+time[1],
            date2 :  time1[0]+time1[1],
            ditch : $('#ditchecharts').val()
        }
        echartsShow(data);
    });
    
    $('#end').on('change',function(){
        var time = $('#start').val().split('-'),time1 = $('#end').val().split('-');
        var data = {
            cid : cid,
            pid : pid,
            date1 :  time[0]+time[1],
            date2 :  time1[0]+time1[1],
            ditch : $('#ditchecharts').val()
        }
        echartsShow(data);
    });

    //趋势图数据请求
    function echartsShow(data){
        console.log(data);
        var cid = data.cid,pid = data.pid;
        //处理有效月
        var month = new Array();
        month = getMonthAll($('#start').val(),$('#end').val());
        $.ajax({
            url:'/maochao/survey/replenishment/selectleimuqushi',
            type:'POST',
            data : data,
            dataType:'json',
            async:false,
            success:function(data){
               //数据处理
               var data1 = new Array();
               var data2 = new Array();
               for(var i=0;i<data.length;i++){
                if(data[i].cid == pid){
                    data1.push(data[i]);
                }else{
                    data2.push(data[i]);
                }
               }
               showData(month,data1,data2);
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
    function showData(timeData,datashow,showdatas){
        var data1 = new Array(), //销量总
            data2 = new Array(), //销售额总
            data3 = new Array(), //销量
            data4 = new Array(), //销售额
            data5 = new Array(); //流水客户半年月均销售额
            data6 = new Array(); //流水客户半年月均销售额
        //获取总额    
        for(let j=0;j<timeData.length;j++){
            for(let i=0;i<datashow.length;i++){
                if(timeData[j] == datashow[i].data_date){
                    data1.push({'time':timeData[j],value:datashow[i].index2?Number(datashow[i].index2):0}); //目标销售额
                    data2.push({'time':timeData[j],value:datashow[i].index9?Number(datashow[i].index9):0}); //完成销售额
                }
            }
            data1.push({'time':timeData[j],value:0});
            data2.push({'time':timeData[j],value:0});
        }
        for(let j=0;j<timeData.length;j++){
            for(let i=0;i<showdatas.length;i++){
                if(timeData[j] == showdatas[i].data_date){
                    data3.push({'time':timeData[j],value:showdatas[i].index2?Number(showdatas[i].index2):0}); //目标销售额
                    data4.push({'time':timeData[j],value:showdatas[i].index9?Number(showdatas[i].index9):0}); //完成销售额
                }
            }
            data3.push({'time':timeData[j],value:0});
            data4.push({'time':timeData[j],value:0});
        }
        data3 = heavy1(data3);
        data4 = heavy1(data4);
        data1 = heavy1(data1);
        data2 = heavy1(data2);
        data5 = percent(data1,data3);
        data6 = percent(data2,data4);

        var mychartsale= echarts.init(document.getElementById('main'));
        option = {
            title: {
                text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['销量','销售额','销量占比','销售额占比']
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
                    name: '销量/销售额',
                    type : 'value',
                    scale:true,
                },{
                    name: '占比',
                    type: 'value',
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
                    data:data3
                },
                {
                    name:'销售额',
                    type:'line',
                    stack: '',
                    data:data4,
                },
                {
                    name:'销量占比',
                    type:'line',
                    stack: '',
                    data:data5,
                    // itemStyle: {
                    //     normal: {
                    //         label: {
                    //             show: true,
                    //             positiong: 'top',
                    //             formatter: '{c}%'
                    //         }
                    //     }
                    // }
                },
                {
                    name:'销售额占比',
                    type:'line',
                    stack: '',
                    data:data6,
                    // itemStyle: {
                    //     normal: {
                    //         label: {
                    //             show: true,
                    //             positiong: 'top',
                    //             formatter: '{c}%'
                    //         }
                    //     }
                    // }
                }
            ]
        };

        mychartsale.setOption(option);
        window.addEventListener("resize",function(){
            mychartsale.resize(); 
        });

    }

    //获取数据去重后赋值,
    function heavy1(data){
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
        for(var m=0;m<data.length;m++){
            array.push(data[m].value);
        }
        return array;
    }

    //折线图百分比计算
    function percent(data1,data2){
        var array = new Array();
        for(var i=0;i<data1.length;i++){
            for(var j=0;j<data2.length;j++){
                if(i==j){
                    var num = data2[i]/data1[j];
                    if(!isNaN(num)){
                        array.push(num*100);
                    }else{
                        array.push(0);
                    }
                   
                }
            }
        }
        return array;
    }
})();
