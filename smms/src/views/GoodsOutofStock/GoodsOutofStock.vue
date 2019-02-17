<template>
    <div class="goods-outofstock">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品销售</span>
            </div>
            <div class="text item">
                <!-- 商品销售表单 -->
                <el-form size="mini" :model="goodsSalesForm" status-icon :rules="rules" ref="goodsSalesForm" label-width="100px" class="demo-ruleForm">         
                    <el-form-item label="商品条形码" prop="barCode">
                        <el-input v-model="goodsSalesForm.barCode"></el-input>       
                    </el-form-item>

                    <el-form-item label="数量" prop="number">
                        <el-input v-model="goodsSalesForm.outofstockNum"></el-input>
                        计重商品单位为千克
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onOrder('goodsSalesForm')">加入订单</el-button> 重新出库
                    </el-form-item>
                </el-form>

                <!-- 商品销售表格 -->
                <el-table
                ref="multipleTable"
                :data="goodsSalesTableData"
                tooltip-effect="dark"
                style="width: 100%;"
                empty-text="暂无商品"
                >
                    <el-table-column
                        prop="goodsname"
                        label="名称"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="member"
                        label="数量"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="单价（元）"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="totalPrice"
                        label="总价（元）"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="saleTotalPrice"
                        label="优惠总价（元）"
                    >
                    </el-table-column>
                </el-table><br>
                总价：0元，优惠：0元。小计：0元
                <br>
                <br>
                <!-- 商品销售表单 -->
                <el-form size="mini" :model="submitForm" status-icon :rules="rules" ref="submitForm" label-width="100px" class="demo-ruleForm">         
                    <el-form-item label="会员卡号" prop="memberCardNum">
                        <el-input v-model="submitForm.memberCardNum"></el-input>填写会员卡卡号       
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onsubmit()">确认提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            goodsSalesForm:{
                barCode:"",
                numeber:""
            },
            rules:{

            },
            goodsSalesTableData:[
                
            ],
            submitForm:{

            }
        }
    },
    methods:{
        onOrder(){

        },
        onsubmit(){

        }
    }
}
</script>

<style lang="less">
    .goods-outofstock{
        .el-card {
            .el-card__header {
            text-align-last: left;
            font-size: 18px;
            font-weight: 600;
            background-color: #f1f1f1;
            }
        }
        .el-card__body {
            text-align: left;
            .el-form {
                width: 290px;
                .el-form-item {
                margin-bottom: 24px;         
                }
            }
        }
    }
</style>