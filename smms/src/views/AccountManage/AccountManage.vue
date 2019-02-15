<template>
  <div class="account-manage">
    <!-- 面板组件 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>账号管理</span>
      </div>
      <div class="text item">
        <!-- 账号管理表格 -->
        <el-table
          ref="multipleTable"
          :data="accountData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>

          <el-table-column
            prop="username"
            label="用户名"
          >
          </el-table-column>

          <el-table-column
            prop="usergroup"
            label="用户组"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column label="创建日期">
            <template slot-scope="scope">{{ scope.row.cdate }}</template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              ><i class="el-icon-edit"></i> 编辑 </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              ><i class="el-icon-delete"></i> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountData: [
        {
            username:"凤凰",
            usergroup:"高级管理员",
            cdate:"2019-2-10"
        },
        {
            username:"张三",
            usergroup:"普通会员",
            cdate:"2019-2-11"
        },
        {
            username:"李四",
            usergroup:"高级管理员",
            cdate:"2019-2-12"
        },
        {
            username:"王五",
            usergroup:"普通会员",
            cdate:"2019-2-13"
        }
      ]
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(){},
    handleDelete(){}
  }
};
</script>

<style lang="less">
.account-manage {
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