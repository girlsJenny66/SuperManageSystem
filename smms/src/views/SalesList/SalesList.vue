<template>
  <div class="sales-list">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>销售明细</span>
      </div>
      <div class="text item">
        <!-- 销售明细表单 -->
        <el-form
          size="mini"
          style="text-align:left;"
          :inline="true"
          :model="salesListForm"
          class="demo-form-inline"
          label-position="left"
        >
          <!-- 开始时间 -->
          <el-form-item
            label="开始时间："
          >
            <div class="block">
                <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </div>
          </el-form-item>
          <!-- 结束时间 -->
          <el-form-item
            label="结束时间："
          >
            <div class="block">
                <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </div>
          </el-form-item><br>
          <!-- 搜索 -->
          <el-form-item
            prop="serch"
            label="搜索："
          >
            <el-input
              type="text"
              v-model="salesListForm.search"
              autocomplete="off"
              style="width:200px;"
            ></el-input>商品名称，订单号，客户名字，会员卡号
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
            >查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 销售明细表格 -->
        <el-table
          ref="multipleTable"
          :data="salesListTableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            prop="ordernum"
            label="订单号"
          >
          </el-table-column>
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
            label="实际售价"
          >
          </el-table-column>
          <el-table-column
            prop="discount"
            label="优惠（促销/会员）"
          >
          </el-table-column>
          <el-table-column
            prop="refund"
            label="退款"
          >
          </el-table-column>
          <el-table-column
            prop="salestime"
            label="销售时间"
          >
          </el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                <i class="el-icon-delete"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top: 20px; text-align: left;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        
      salesListForm: {
        
      },
      salesListTableData: [
        {
          ordernum: 11111111,
          goodsname: "海飞丝去屑洗发水",
          member: 3,
          price: 24,
          discount: "2.00元/无",
          refund: "无退款",
          salestime: 2019-1-31
        },
        {
          ordernum: 11111111,
          goodsname: "海飞丝去屑洗发水",
          member: 3,
          price: 24,
          discount: "2.00元/无",
          refund: "无退款",
          salestime: 2019-1-31
        },
        {
          ordernum: 11111111,
          goodsname: "海飞丝去屑洗发水",
          member: 3,
          price: 24,
          discount: "2.00元/无",
          refund: "无退款",
          salestime: 2019-1-31
        }      
      ],
      total: 100,
      currentPage: 1,
      pageSize: 5
    };
  },
  methods: {
    onSubmit() {},
    handleEdit() {},
    handleDelete() {},
    handleSelectionChange(val) {},
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>

<style lang="less">
.sales-list {
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