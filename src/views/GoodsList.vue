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
                  <div class="price">{{item.productPrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
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
const goods = [
  {
    productId: "100001",
    productName: "音响",
    productPrice: 199,
    productImg: "1.jpg"
  },
  {
    productId: "100002",
    productName: "小米7",
    productPrice: 3499,
    productImg: "2.jpg"
  },
  {
    productId: "100003",
    productName: "YY",
    productPrice: 888,
    productImg: "3.jpg"
  }
];
export default {
  data() {
    return {
      goodsList: [],
      priceChecked: "all",
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "500.00"
        },
        {
          startPrice: "501.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1001.00",
          endPrice: "2000.00"
        }
      ],
      filterBy: false,
      overLayFlag: false,
      sortFlag:false
    }
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
    getGoodsList() {
      axios.get("/api/goods").then(res=>{
          console.log(res);
          this.goodsList = res.data.result.list;
      });
      // axios.get("../goods.json").then(res=>{
      //     console.log(res);
      //     this.goodsList = JSON.parse(res.data.result);
      // });
      // this.goodsList = goods;
      // console.log(this.goodsList);
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
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
</style>