<script>
import VueSlideBar from "vue-slide-bar";
// import axios from "axios";

import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import axios from 'axios';
import {authHeader} from "@/helpers/authservice/auth-header";
import {handleAxiosError} from "@/helpers/authservice/user.service";

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
      category: {sub_categoeies:[]},
      title: "Category",
      sliderPrice: 800,
      currentPage: 1,
      perPage: 20,
      totalProducts: 0,
      currentCategoryID: "",
      discountRates: [],
      maxStars: 5,
    };
  },
  mounted() {

    //** Get data from product api */

    // axios
    //   .get(`http://localhost:8000/api/products`)
    //   .then((res) => {
    //     this.products = res.data.data;
    //   })
    //   .catch((err) => {
    //     return err;
    //   });

    this.fetchCategory();
    this.fetchProducts();

  },
  methods: {
    fetchProducts(){
      this.currentCategoryID = this.$route.params.id;
      axios
      .get(`${this.backendURL}/api/v1/products/categories/${this.$route.params.id}?per_page=${this.perPage}&page=${this.currentPage}` , authHeader())
      .then(response => {
        this.products = response.data.data;
        this.totalProducts = response.data.pagination.total;
      })
      .catch(handleAxiosError);
    },
    fetchCategory(){
      axios
      .get(`${this.backendURL}/api/v1/categories/${this.$route.params.id}` , authHeader())
      .then(response => (this.category = response.data.data))
      .catch(handleAxiosError);
    },
    fetchProductsByCategory(catID){
      this.currentCategoryID = catID;
      axios
      .get(`${this.backendURL}/api/v1/products/categories/${catID}?per_page=${this.perPage}&page=${this.currentPage}` , authHeader())
      .then(response => {
        this.products = response.data.data;
        this.totalProducts = response.data.pagination.total;
      })
      .catch(handleAxiosError);
    },
    fetchProductsByFilters(filters){

      
      if(filters){
        var url = `${this.backendURL}/api/v1/products/categories/${filters.categoryID}?per_page=${this.perPage}&page=${this.currentPage}`;
        if (filters.priceFrom){
          url += `&price_from=${filters.priceFrom}`;
        }
        if (filters.priceTo){
          url += `&price_to=${filters.priceTo}`;
        }

        axios
        .get(url , authHeader())
        .then(response => {
          this.products = response.data.data;
          this.totalProducts = response.data.pagination.total;
        })
        .catch(handleAxiosError);

      }

      
    },

    valuechange(value) {
      // this.products = this.products.filter(function (product) {
      //   return product.price <= value.currentValue;
      // });
      this.fetchProductsByFilters({
        categoryID: this.currentCategoryID,
        priceTo: value.currentValue,
      })
    },

    searchFilter(e) {
      const searchStr = e.target.value;
      this.products = this.products.filter((product) => {
        return (
          product.name.toLowerCase().search(searchStr.toLowerCase()) !== -1
        );
      });
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
              <h5 class="font-size-14 mb-3">Discount</h5>

              <b-form-checkbox
                id="productdiscountCheck1"
                class="mt-2"
                value="accepted"
                unchecked-value="not_accepted"
                @change="discountLessFilter($event, 10)"
                >Less than 10%</b-form-checkbox
              >

              <b-form-checkbox
                id="productdiscountCheck2"
                class="mt-2"
                value="accepted"
                unchecked-value="not_accepted"
                @change="discountMoreFilter($event, 10)"
                >10% or more</b-form-checkbox
              >

              <b-form-checkbox
                id="productdiscountCheck3"
                class="mt-2"
                value="accepted"
                unchecked-value="not_accepted"
                @change="discountMoreFilter($event, 20)"
                >20% or more</b-form-checkbox
              >

              <b-form-checkbox
                id="productdiscountCheck4"
                class="mt-2"
                value="accepted"
                unchecked-value="not_accepted"
                @change="discountMoreFilter($event, 30)"
                >30% or more</b-form-checkbox
              >

              <b-form-checkbox
                id="productdiscountCheck5"
                class="mt-2"
                value="accepted"
                unchecked-value="not_accepted"
                @change="discountMoreFilter($event, 40)"
                >40% or more</b-form-checkbox
              >

              <b-form-checkbox
                id="productdiscountCheck6"
                class="mt-2"
                value="accepted"
                unchecked-value="not_accepted"
                @change="discountMoreFilter($event, 50)"
                >50% or more</b-form-checkbox
              >
            </div>

            <div class="mt-4 pt-3">
              <h5 class="font-size-14 mb-3">Customer Rating</h5>
              <div>
                <b-form-checkbox
                  id="checkbox-1"
                  name="checkbox-1"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  4
                  <i class="bx bx-star text-warning"></i> & Above
                </b-form-checkbox>

                <b-form-checkbox
                  id="checkbox-2"
                  class="mt-2"
                  name="checkbox-2"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  3
                  <i class="bx bx-star text-warning"></i> & Above
                </b-form-checkbox>

                <b-form-checkbox
                  id="checkbox-3"
                  class="mt-2"
                  name="checkbox-3"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  2
                  <i class="bx bx-star text-warning"></i> & Above
                </b-form-checkbox>
                <b-form-checkbox
                  id="checkbox-4"
                  class="mt-2"
                  name="checkbox-4"
                  value="accepted"
                  unchecked-value="not_accepted"
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
                    <i class="bx bx-star text-warning" v-for="i in product.rating" :key="i"></i>
                    <i class="bx bx-star ml-0" v-for="i in notRatedStars(product.rating)" :key="i"></i>
                  </p>
                  <h5 class="my-0">
                    <span class="text-muted mr-2">
                      <del>${{ product.oldprice }}</del>
                    </span>
                    <b>${{ product.price }}</b>
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
    <!-- end row -->
  </Layout>
</template>
