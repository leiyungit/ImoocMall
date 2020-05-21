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
                    <a href="javascript:;" class="btn btn--m" @click="addCart">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div
              class="load-more"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="10"
            >
              <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <!-- 加入购物车前检查未登录 -->
    <modal :modalShow="modalShow" @close="closeModal">
      <p slot="message">请先登录，才可以加入到购物车！</p>
      <div slot="btnGrop">
        <a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a>
      </div>
    </modal>
    <!-- 加入购物车成功 -->
    <modal :modalShow="modalShowCart" @close="closeModal">
      <p slot="message">
         <!-- svg 图标未显示 -->
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok" />
        </svg>
        <span>加入到购物车成功！</span>
      </p>
      <div slot="btnGrop">
        <a href="javascript:;" class="btn btn--m" @click="modalShowCart=false">继续购物</a>
        <router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";

import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modal from "./../components/Modal";

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
          endPrice: "5000.00"
        }
      ],
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false, // 如果此属性的值为true，则将禁用无限滚动
      loading: false,
      modalShow: false,
      modalShowCart: false
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
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
        priceLevel: this.priceChecked
      };
      this.loading = true;
      axios
        .get("/api/goods", {
          params: param
        })
        .then(response => {
          console.log(response);
          this.loading = false;
          let res = response.data;
          if (res.status == "0") {
            if (flag) {
              if (res.result.list.length > 0) {
                this.goodsList = this.goodsList.concat(res.result.list);
              }
              if (res.result.list.length < this.pageSize) {
                this.busy = true;
              } else {
                this.busy = false; // 漏写
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        });
    },
    addCart() {
      axios.post("/api/goods/addCart").then(res => {
        console.log(res.data);
        if (res.data.status === 200) {
          console.log(res.data);
          //alert("加入成功");
          this.modalShowCart = true;
        } else {
          //alert(res.data.msg);
          this.modalShow = true;
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
      this.page = 1;
      this.getGoodsList();
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    closeModal() {
      this.modalShow = false;
      this.modalShowCart = false;
    }
  }
};
</script>
<style scoped>
.container {
  background-color: #fff;
}
.load-more {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>