<template>
    <div class="sale-statistics">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>销售统计</span>
            </div>
            <div class="text item">
                <!-- 报表容器 -->
                <div id="main" style="height:400px"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
// 引入moment
import moment from "moment";
// 引入echarts
import echarts from 'echarts';

export default {
    // 这个生命周期可以获取dom
    mounted () {
        // 基于准备好的dom，初始化echarts图表
        var myChart = echarts.init(document.getElementById('main'));

        // 配置对象 （关键就是发送ajax请求 获取到后端数据 使用后端数据 来修改这份配置）
        var option = {
            tooltip: {
                show: true
            },
            legend: {
                data:['销量']
            },
            xAxis : [
                {
                    type : 'category',
                    data : ["家居日用类","食品类","电器类","饮料类"]
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    "name":"销量",
                    "type":"line",
                    "data":[] // 没有数据
                }
            ]
        }

        // 为echarts对象加载数据 
        myChart.setOption(option);  

        // 发送ajax给后端 获取到一份销量数据
        let sales = [600, 1000, 3200, 980];
        myChart.setOption({  
             series : [
                {
                    "name":"销量",
                    "data":sales
                }
            ]
        })

    }
}
</script>

<style lang="less">
.sale-statistics{
    .el-card {
        .el-card__header {
            text-align-last: left;
            font-size: 18px;
            font-weight: 600;
            background-color: #f1f1f1;
        }
    }
}
</style>