<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a
          href="javascript:void(0)"
          class="price"
          v-bind:class="{'sort-up':sortFlag}"
          @click="sortGoods()"
        >
          Price
          <svg class="icon icon-arrow-short">
            <use xlink:href="#icon-arrow-short" />
          </svg>
        </a>
        <a href="javascript:void(0)" class="filterby stopPop" @click.stop="showFilterPop">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- 价格选择 -->
        <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd>
              <a
                href="javascript:void(0)"
                @click="setPriceFilter('all')"
                v-bind:class="{'cur':priceChecked=='all'}"
              >All</a>
            </dd>
            <dd v-for="(item,index) in priceFilter" :key="index">
              <a
                href="javascript:void(0)"
                @click="setPriceFilter(index)"
                v-bind:class="{'cur':priceChecked==index}"
              >{{item.startPrice}} - {{item.endPrice}}</a>
            </dd>
          </dl>
        </div>
        <!-- 商品列表 -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="(item,i) in goodsList" :key="i">
                <div class="pic">
                  <a href="#">
                    <img :src="'/static/'+item.productImage" alt />
                  </a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div class="load-more"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="10"
            >加载中...</div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";

import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";

import axios from "axios";

export default {
  data() {
    return {
      goodsList: [],
      priceChecked: "all",
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "2000.00"
        }
      ],
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false // 如果此属性的值为true，则将禁用无限滚动
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel:this.priceChecked
      };
      axios
        .get("/api/goods", {
          params: param
        })
        .then(response => {
          console.log(response);
          let res= response.data;
          if (res.status == "0") {
            if (flag) {
              if (res.result.list.length > 0) {
                this.goodsList = this.goodsList.concat(res.result.list);
              }
              if (res.result.list.length < this.pageSize) {
                this.busy = true;
              }else{
                 this.busy = false; // 漏写
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          }else{
            this.goodsList = [];
          }
        });
    },
    sortGoods() {
      // 排序
      this.page = 1;
      this.getGoodsList();
      this.sortFlag = !this.sortFlag;
    },
    loadMore() {
      // 分页加载
      this.busy = true;
      setTimeout(() => {
        //console.log("...loadMore");
        this.page++;
        this.getGoodsList(true);
      }, 1000);
    },
    setPriceFilter(index) {
      // 点击价格区间
      this.priceChecked = index;
      this.closePop();
      this.page=1;
      this.getGoodsList();
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    }
  }
};
</script>
<style scoped>
.container {
  background-color: #fff;
}
.load-more{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>