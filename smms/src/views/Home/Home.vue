<template>
  <div class="home">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>系统信息</span>
      </div>
      <div class="text item">
        <!-- 消息提示 -->
        <el-alert
          title="商品总数：5，已经销售的总金额：999.00，库存商品总价：13140.00"
          type="info"
          show-icon
        >
        </el-alert>
        <!-- 导入数据 -->
        <el-alert
          title="导入数据"
          type="success"
          show-icon
        >
        </el-alert>

        <!-- 左右卡片 -->
        <el-row :gutter="20">
          <!-- 左侧卡片 -->
          <el-col :span="12">
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
              >
                <span>销售排行</span>
              </div>
              <div class="text item">
                <!-- 左侧表格 -->
                <el-table
                  :data="saleData"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="goodsname"
                    label="商品名称"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="salescount"
                    label="销量"
                  >
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>

          <!-- 右侧卡片 -->
          <el-col :span="12">
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
              >
                <span>缺货的商品</span>
              </div>
              <div class="text item">
                <!-- 右侧表格 -->
                <el-table
                  :data="stockoutData"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="goodsname"
                    label="商品名称"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="inventory"
                    label="库存"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="salescount"
                    label="操作"
                  >
                  <template>
                        <el-button type="text" size="small">入库</el-button>
                  </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      saleData: [
        {
          goodsname: "霸王",
          salescount: 80
        },
        {
          goodsname: "飘柔",
          salescount: 6
        },
        {
          goodsname: "海飞丝",
          salescount: 5
        },
        {
          goodsname: "阿道夫",
          salescount: 4
        }
      ],
      stockoutData: [
        {
          goodsname: "我的优乐美",
          inventory: "0"
        },
        {
          goodsname: "我的益达",
          inventory: "2"
        },
        {
          goodsname: "香飘飘",
          inventory: "4"
        }
      ]
    };
  }
};
</script>

<style lang="less">
.home {
  .el-card {
    .el-card__header {
      text-align-last: left;
      font-size: 18px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body {
      .item {
        .el-alert {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>