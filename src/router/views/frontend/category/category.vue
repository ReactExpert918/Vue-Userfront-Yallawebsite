<script>
import VueSlideBar from "vue-slide-bar";
// import axios from "axios";

import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import axios from 'axios';
import {authHeader} from "@/helpers/authservice/auth-header";
import {handleAxiosError} from "@/helpers/authservice/user.service";
import {getTimeDiffInSeconds} from "@/helpers/common";

/**
 * Products component
 */
export default {
  page: {
    title: "Category",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { VueSlideBar, Layout, PageHeader },
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      products: [],
      category: {sub_categories:[]},
      filters: {
        priceFrom: 0,
        priceTo: 0,
        ratingGTE: 0,
        ratingEQ: 0,
        name: "",
      },
      cartEditLoader: "",
      title: "Category",
      sliderPrice: 800,
      currentPage: 1,
      perPage: 20,
      totalProducts: 0,
      currentCategoryID: "",
      discountRates: [],
      maxStars: 5,
      ratingFilter4Above: "4above",
      ratingFilter3Above: "3above",
      ratingFilter2Above: "2above",
      ratingFilter1: "1",
      ratingFilter4Checked: false,
      ratingFilter3Checked: false,
      ratingFilter2Checked: false,
      ratingFilter1Checked: false,
      throttle:{
        timer: undefined,
        duration: 2, //seconds
        last_invoke_time: undefined,
        invoke_after: 500, //miliseconds
      },
    };
  },
  mounted() {

    this.fetchCategory();
    this.fetchProducts();

  },
  methods: {
    fetchProducts(){
      this.cartEditLoader = true;
      this.currentCategoryID = this.$route.params.id;
      axios
      .get(`${this.backendURL}/api/v1/products/categories/${this.$route.params.id}?per_page=${this.perPage}&page=${this.currentPage}` , authHeader())
      .then(response => {
        this.products = response.data.data;
        this.totalProducts = response.data.pagination.total;
        this.cartEditLoader = false;
        
      })
      .catch(error=> handleAxiosError(error, this));
    },
    fetchCategory(){
      axios
      .get(`${this.backendURL}/api/v1/categories/${this.$route.params.id}` , authHeader())
      .then(response => (this.category = response.data.data))
      .catch(error=> handleAxiosError(error, this));
    },
    fetchProductsByCategory(catID){
      this.cartEditLoader = true;
      this.currentCategoryID = catID;
      axios
      .get(`${this.backendURL}/api/v1/products/categories/${catID}?per_page=${this.perPage}&page=${this.currentPage}` , authHeader())
      .then(response => {
        this.products = response.data.data;
        this.totalProducts = response.data.pagination.total;
        this.cartEditLoader = false;
      })
      .catch(error=> handleAxiosError(error, this));
    },
    fetchProductsByFilters(){
        this.cartEditLoader = true;
        var url = `${this.backendURL}/api/v1/products/categories/${this.currentCategoryID}?per_page=${this.perPage}&page=${this.currentPage}`;
        if (this.filters.priceFrom > 0){
          url += `&price_from=${this.filters.priceFrom}`;
        }
        if (this.filters.priceTo > 0){
          url += `&price_to=${this.filters.priceTo}`;
        }
        if (this.filters.ratingGTE > 0){
          url += `&rating_gte=${this.filters.ratingGTE}`;
        }
        if (this.filters.ratingEQ > 0){
          url += `&rating_eq=${this.filters.ratingEQ}`;
        }
        if (this.filters.name != ""){
          url += `&name=${this.filters.name}`
        }

        axios
        .get(url , authHeader())
        .then(response => {
          this.products = response.data.data;
          this.totalProducts = response.data.pagination.total;
          this.cartEditLoader = false;
        })
        .catch(error=> handleAxiosError(error, this));

    },

    valuechange(value) {
      // this.products = this.products.filter(function (product) {
      //   return product.price <= value.currentValue;
      // });
      this.filters.priceTo = value.currentValue;
      this.fetchProductsByFilters();
    },

    searchFilter(e) {
      const searchStr = e.target.value;
      this.filters.name = searchStr.trim();
      
      // this.products = this.products.filter((product) => {
      //   return (
      //     product.name.toLowerCase().search(searchStr.toLowerCase()) !== -1
      //   );
      // });

      // throttling so that rapid press of the buttons doesn't invoke rapid API calls
      var t = new Date();
      var last_t = this.throttle.last_invoke_time;
      if (last_t){
        if (getTimeDiffInSeconds(last_t, t) < this.throttle.duration){ // if the time difference between two button press if less than the allowed duration
          if (this.throttle.timer){
            clearTimeout(this.throttle.timer); // then clear the wait time to reset it
          }
        }
      }
      
      this.throttle.timer = setTimeout(()=>(this.fetchProductsByFilters()),  this.throttle.invoke_after); // setting(resetting if cleared) the invoke time after rapid hits
      this.throttle.last_invoke_time = new Date(); // storing the last invoked time to keep track of rapid hits
    },

    discountLessFilter(e, percentage) {
      if (e === "accepted" && this.discountRates.length === 0) {
        this.products = this.products.filter((product) => {
          return product.discount < percentage;
        });
      } else {
        this.products = this.products.filter((product) => {
          return product.discount >= Math.max.apply(null, this);
        }, this.discountRates);
      }
    },

    discountMoreFilter(e, percentage) {
      if (e === "accepted") {
        this.discountRates.push(percentage);
      } else {
        this.discountRates.splice(this.discountRates.indexOf(percentage), 1);
      }
      this.products = this.products.filter((product) => {
        return product.discount >= Math.max.apply(null, this);
      }, this.discountRates);
    },
    notRatedStars(rating){
      if (rating > this.maxStars){
        rating = this.maxStars;
      }
      return this.maxStars - rating;
    },
    filterByRating(checked, rating){
      this.filters.ratingGTE = 0;
      this.filters.ratingEQ = 0;
      this.ratingFilter4Checked = false;
      this.ratingFilter3Checked = false;
      this.ratingFilter2Checked = false;
      this.ratingFilter1Checked = false;
      if(!checked){
        rating = "";
      }

      switch (rating){
        case this.ratingFilter4Above:
          this.filters.ratingGTE = 4;
          this.ratingFilter4Checked = true;
          break;
        case this.ratingFilter3Above:
          this.filters.ratingGTE = 3;
          this.ratingFilter3Checked = true;
          break;
        case this.ratingFilter2Above:
          this.filters.ratingGTE = 2;
          this.ratingFilter2Checked = true;
          break;
        case this.ratingFilter1:
          this.filters.ratingEQ = 1;
          this.ratingFilter1Checked = true;
          break;
      }


      this.fetchProductsByFilters();

    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title"  />

    <div class="row">
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Filter</h4>

            <div v-if="category.sub_categories.length > 0">
              <h5 class="font-size-14 mb-3" v-on:click="fetchProductsByCategory(category.id)">{{category.name}}</h5>
              <ul class="list-unstyled product-list">
                <li v-for="sc in category.sub_categories" :key="sc.id">
                  <a href="javascript: void(0);">
                    <i class="mdi mdi-chevron-right mr-1" v-on:click="fetchProductsByCategory(sc.id)"></i> {{sc.name}}
                  </a>
                </li>
              </ul>
            </div>
            <div class="mt-4 pt-3">
              <h5 class="font-size-14 mb-3">Price</h5>
              <vue-slide-bar
                v-model="sliderPrice"
                :min="0"
                :max="1000"
                @dragEnd="valuechange"
              />
            </div>

            <div class="mt-4 pt-3">
              <h5 class="font-size-14 mb-3">Customer Rating</h5>
              <div>
                <b-form-checkbox
                  id="checkbox-1"
                  name="checkbox-1"
                  v-model="ratingFilter4Checked"
                  @change="(checked) => filterByRating(checked , ratingFilter4Above)"
                >
                  4
                  <i class="bx bx-star text-warning"></i> & Above
                </b-form-checkbox>

                <b-form-checkbox
                  id="checkbox-2"
                  class="mt-2"
                  name="checkbox-2"
                  v-model="ratingFilter3Checked"
                  @change="(checked) => filterByRating(checked , ratingFilter3Above)"
                >
                  3
                  <i class="bx bx-star text-warning"></i> & Above
                </b-form-checkbox>

                <b-form-checkbox
                  id="checkbox-3"
                  class="mt-2"
                  name="checkbox-3"
                  v-model="ratingFilter2Checked"
                  @change="(checked) => filterByRating(checked , ratingFilter2Above)"
                >
                  2
                  <i class="bx bx-star text-warning"></i> & Above
                </b-form-checkbox>
                <b-form-checkbox
                  id="checkbox-4"
                  class="mt-2"
                  name="checkbox-4"
                  v-model="ratingFilter1Checked"
                  @change="(checked) => filterByRating(checked , ratingFilter1)"
                >
                  1
                  <i class="bx bx-star text-warning"></i>
                </b-form-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <div class="row mb-3">
          <div class="col-xl-4 col-sm-6">
            <div class="mt-2">
              <h5>{{category.name}}</h5>
            </div>
          </div>
          <div class="col-lg-8 col-sm-6">
            <form class="mt-4 mt-sm-0 float-sm-right form-inline">
              <div class="search-box mr-2">
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-control border-0"
                    placeholder="Search..."
                    @input="searchFilter($event)"
                  />
                  <i class="bx bx-search-alt search-icon"></i>
                </div>
              </div>
              <ul class="nav nav-pills product-view-nav">
                <li class="nav-item">
                  <a class="nav-link active" href="javascript: void(0);">
                    <i class="bx bx-grid-alt"></i>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="javascript: void(0);">
                    <i class="bx bx-list-ul"></i>
                  </a>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div v-if="cartEditLoader" class="row spinner">
          <div class="loader"></div>
        </div>
        <div  v-else>
          <div class="row">
            <div
              v-for="product in products"
              :key="product.id"
              class="col-xl-4 col-sm-6"
            >
              <div class="card">
                <div class="card-body">
                  <div class="product-img position-relative">
                    <div v-if="product.discount" class="avatar-sm product-ribbon">
                      <span class="avatar-title rounded-circle bg-primary"
                        >-{{ product.discount }}%</span
                      >
                    </div>
                    <router-link
                      tag="a"
                      :to="`/product/${product.id}`"
                    >
                      <img
                        :src="`${product.image}`"
                        alt
                        class="img-fluid mx-auto d-block"
                      />
                    </router-link>
                  </div>
                  <div class="mt-4 text-center">
                    <h5 class="mb-3 text-truncate">
                      <router-link
                        tag="a"
                        class="text-dark"
                        :to="`/product/${product.id}`"
                        >{{ product.name }}</router-link
                      >
                    </h5>
                    <p class="text-muted">
                      <i class="bx bx-star text-warning" v-for="i in product.rating" :key="'gold'+i"></i>
                      <i class="bx bx-star ml-0" v-for="i in notRatedStars(product.rating)" :key="'black'+i"></i>
                    </p>
                    <h5 class="my-0">
                      <span class="text-muted mr-2" v-if="product.price > product.discounted_price">
                        <del>${{ product.price }}</del>
                      </span>
                      <b>${{ product.discounted_price }}</b>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div> 
          <!-- end row -->

          <div class="row">
            <div class="col-lg-12">
              <b-pagination
                v-if="products.length > 0"
                class="justify-content-center"
                pills
                v-model="currentPage"
                :total-rows="products.length"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style lang="scss" scoped>
  .loader {
    border: 46px solid #f3f3f3;
    border-top: 46px solid #3498db;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    animation: spin 1s linear infinite;
  }

  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
