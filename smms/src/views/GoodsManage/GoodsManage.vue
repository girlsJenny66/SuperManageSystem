<template>
  <div class="goods-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <div class="text item">
        <!-- 商品管理表单 -->
        <el-form size="mini" :inline="true" :model="goodsmanage" class="demo-form-inline" label-position="left">
          <!-- 选择分类 -->
          <el-form-item>
            <el-select v-model="goodsmanage.categories" placeholder="--请选择分类--" label-width="50px">
              <el-option label="家居日用" value="家居日用"></el-option>
              <el-option label="食品" value="食品"></el-option>
              <el-option label="电器" value="电器"></el-option>
              <el-option label="饮料" value="饮料"></el-option>
            </el-select>
          </el-form-item>
          <!-- 关键字 -->
          <el-form-item prop="serch" label="关键字">
            <el-input type="text" v-model="goodsmanage.search" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 商品管理表格 -->
        <el-table ref="multipleTable" :data="manageTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="barCode" label="商品条形码">
          </el-table-column>
          <el-table-column prop="goodsname" label="商品名称">
          </el-table-column>
          <el-table-column prop="classification" label="所属分类">
          </el-table-column>
          <el-table-column prop="price" label="售价(元)">
          </el-table-column>
          <el-table-column prop="saleprice" label="促销价(元)">
          </el-table-column>
          <el-table-column prop="marketPrice" label="市场价(元)">
          </el-table-column>
          <el-table-column prop="stockNum" label="库存">
          </el-table-column>
          <el-table-column prop="totalinven" label="库存总额(元)">
          </el-table-column>
          <el-table-column prop="totalsales" label="销售总额(元)">
          </el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsmanage: {
        categories: "",
        search: ""
      },
      manageTableData: [
        {
          barCode: "6911989262549",
          goodsname: "我的优乐美",
          classification: "饮料",
          price: "2.00",
          saleprice: "未促销",
          marketPrice: "4.00",
          stockNum: "0(缺)",
          totalinven: "0",
          totalsales: "436.00"
        },
        {
          barCode: "6911989262549",
          goodsname: "我的优乐美",
          classification: "饮料",
          price: "2.00",
          saleprice: "未促销",
          marketPrice: "4.00",
          stockNum: "0(缺)",
          totalinven: "0",
          totalsales: "436.00"
        },
        {
          barCode: "6911989262549",
          goodsname: "我的优乐美",
          classification: "饮料",
          price: "2.00",
          saleprice: "未促销",
          marketPrice: "4.00",
          stockNum: "0(缺)",
          totalinven: "0",
          totalsales: "436.00"
        }
      ]
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit() {},
    handleDelete() {}
  }
};
</script>
<style lang="less">
.goods-manage {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background: #f1f1f1;
    }
    .el-card__body {
      .text {
        .el-pagination {
          margin-top: 30px;
        }
        .el-form {
          margin-right: 1150px;
          .el-form-item {
            .el-form-item__content {
              .el-select {
                .el-input {
                  .el-input__inner {
                    text-align: center;
                    width: 150px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>