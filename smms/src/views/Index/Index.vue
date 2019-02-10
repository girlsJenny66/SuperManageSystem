<template>
  <div class="index">
    <el-container>
      <!-- 左侧 -->
      <el-aside width="200px">

        <Nav></Nav>
      </el-aside>

      <!-- 右侧 -->
      <el-container>
        <!-- 右侧头部 -->
        <el-header>Header</el-header>
        <!-- 右侧内容 -->
        <el-main>

          <!-- 路由出口 -->
          <router-view/>
        </el-main>
        <!-- 右侧尾部 -->
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 引入导航组件
import Nav from "@/components/Nav/Nav.vue"

export default {
  // 注册组件
  components:{
    Nav
  }
};
</script>

<style lang="less">
.index {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header,
    .el-footer {
      background-color: #b3c0d1;
      color: #333;
      text-align: center;
      line-height: 60px;
    }

    .el-aside {
      background-color: #2d3a4b;     
      text-align: center;      
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
    }
  }
}
</style>


