<template>
    <div class="sales-list">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>销售列表</span>
            </div>
            <div class="text item">
                内容
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less">
.sales-list{
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