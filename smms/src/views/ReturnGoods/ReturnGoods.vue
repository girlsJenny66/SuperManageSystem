<template>
  <div class="return-goods">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>商品退货</span>
      </div>
      <div class="text item">
        <el-form
          size="mini"
          ref="returnGoodsForm"
          :model="returnGoodsForm"
          label-width="100px"
          inline
          style="text-align:left;"
        >
          <!-- 搜索框 -->
          <el-form-item label="关键字：">
            <el-input v-model="returnGoodsForm.keywords"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item>
            <el-button type="success">查询</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      returnGoodsForm: {}
    };
  }
};
</script>

<style lang="less">
.return-goods {
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