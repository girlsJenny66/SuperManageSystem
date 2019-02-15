<template>
  <div class="index">
    <el-container>
      <!-- 左侧 -->
      <el-aside width="200px">
        <!-- 自定义导航组件 -->
        <Nav></Nav>
      </el-aside>

      <!-- 右侧 -->
      <el-container>
        <!-- 右侧头部 -->
        <el-header>
          <!-- 头部组件 -->
          <Top></Top>
        </el-header>
        <!-- 右侧内容 -->
        <el-main>
          <!-- 路由出口 -->
          <router-view/>
        </el-main>
        <!-- 右侧尾部 -->
        <el-footer>
          <!-- 尾部组件 -->
          <Bottom></Bottom>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 引入导航组件
import Nav from "@/components/Nav/Nav.vue"
// 引入头部组件
import Top from "@/components/Top/Top.vue"
// 引入尾部组件
import Bottom from "@/components/Bottom/Bottom.vue"

export default {
  // 注册组件
  components:{
    Nav,
    Top,
    Bottom
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
      background-color: #fff;
      color: #2d3a4b;
      text-align: center;
      line-height: 60px;
    }
    .el-header{
      border-bottom: 1px solid #ccc;
    }
    .el-aside {
      background-color: #2d3a4b;     
      text-align: center;      
    }

    .el-main {
      background-color: #fff;
      color: #2d3a4b;
      text-align: center;
    }
  }
}
</style>


