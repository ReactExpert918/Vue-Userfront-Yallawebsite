<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";


import axios from 'axios';
import {authHeader} from "@/helpers/authservice/auth-header";
import {handleAxiosError} from "@/helpers/authservice/user.service";
import {arrayOfObjectEqual} from "@/helpers/common";

/**
 * Product detail component
 */
export default {
  page: {
    title: "Product Detail",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      productDetail: {},
      reviews: [],
      maxStars: 5,
      perPage: 5,
      page: 1,
      selectedOptionMap: {},
      currentVariation: {},
      quantity: 1,
      title: "Product Detail",
      items: [
        {
          text: "Category",
          href: "/"
        },
        {
          text: "Product Detail",
          active: true
        }
      ]
    };
  },
  created() {
   
  },
  mounted(){
    this.fetchProduct();
    this.fetchReviews();
  },
  methods: {
    /**
     * Selected image shows
     */
    imageShow(event) {
      const image = event.target.src;
      const expandImg = document.getElementById("expandedImg");
      expandImg.src = image;
    },
    fetchProduct(){
      axios
      .get(`${this.backendURL}/api/v1/products/${this.$route.params.id}`, authHeader())
      .then(response => {
        this.productDetail = response.data.data;
        for(var i = 0; i < this.productDetail.specifications.length; i++){
          var spec = this.productDetail.specifications[i];
          if (spec.values.length > 0){
            this.selectedOptionMap[spec.name] = spec.values[0];
          }
        }
        if (this.productDetail.variations.length > 0){
          this.parseVariation();
        }
      })
      .catch(handleAxiosError);
    },
    fetchReviews(){
      axios
      .get(`${this.backendURL}/api/v1/products/reviews/${this.$route.params.id}?per_page=${this.perPage}&page=${this.page}`, authHeader())
      .then(response => {
        this.reviews = response.data.data;

      })
      .catch(handleAxiosError);
    },
    addToCart(){
      var variation_id = "";
      if (this.productDetail.variations.length > 0){
        variation_id = this.currentVariation.id;
      }
      const payload = {
        product_id: this.productDetail.id,
        quantity: parseInt(this.quantity),
        variation_id: variation_id
      }

      axios
      .post(`${this.backendURL}/api/v1/carts`, payload, authHeader())
      .then(response => {
        alert(`${response.data.data.id} added to cart!`);

      })
      .catch(handleAxiosError);
    },
    notRatedStars(rating){
      if (rating > this.maxStars){
        rating = this.maxStars;
      }
      return this.maxStars - rating;
    },
    optionSelected(specName , val){
      var option = this.selectedOptionMap[specName];
      if (option && option == val){
        return true;
      }
      return false;
    },
    selectOption(specName , val){
      this.selectedOptionMap[specName] = val;
      this.parseVariation();
    },
    parseVariation(){
      var labels = [];
      for(var key in this.selectedOptionMap){
        var obj = {};
        obj[key] = this.selectedOptionMap[key];
        labels.push(obj);
      }

      for(var i = 0; i < this.productDetail.variations.length; i++){
        var variation = this.productDetail.variations[i];
        if (arrayOfObjectEqual(variation.labels , labels)){
          this.currentVariation = variation;
          break;
        }
      }
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-xl-6">
                <div class="product-detai-imgs">
                  <b-tabs pills vertical nav-wrapper-class="col-md-2 col-sm-3 col-4">
                     <b-tab v-for="img in productDetail.images" :key="img">
                      <template v-slot:title>
                        <img
                          :src="img"
                          alt
                          class="img-fluid mx-auto d-block tab-img rounded"
                        />
                      </template>
                      <div class="product-img">
                        <img
                          :src="img"
                          alt
                          class="img-fluid mx-auto d-block"
                        />
                      </div>
                    </b-tab>
                  </b-tabs>
                </div>
              </div>

              <div class="col-xl-6">
                <div class="mt-3">
                  <h4 class="mt-1 mb-3">{{productDetail.name}}</h4>

                  <p class="text-muted float-left mr-3">
                    <span class="bx bx-star text-warning" v-for="i in productDetail.rating" :key="'gold'+i"></span>
                    <span class="bx bx-star ml-0" v-for="i in notRatedStars(productDetail.rating)" :key="'black'+i"></span>
                  </p>
                  <p class="text-muted mb-4">( {{productDetail.review_count}} Customers Review )</p>

                  <h6 class="text-success text-uppercase">{{productDetail.discount}} Off</h6>
                  <h5 class="mb-4">
                    Price :
                    <span class="text-muted mr-2" v-if="productDetail.discounted_price < productDetail.price">
                      <del>${{productDetail.price}}</del>
                    </span>
                    <b>${{productDetail.discounted_price}}</b>
                  </h5>
                  <p
                    class="text-muted mb-4"
                    v-html="productDetail.short_description"
                  >{{productDetail.short_description}}</p>
                  

                  <div class="product-color" v-for="spec in productDetail.specifications" :key="spec.id">
                    <h5 class="font-size-15">{{spec.name}} :</h5>
                    <a
                      href="javascript: void(0);"
                      class="active"
                      v-for="(value, index) in spec.values"
                      :key="index"
                      style="padding: 2px;margin: 2px;"
                    >
                      <!-- <div class="product-color-item border rounded">
                        <img :src="item.value" alt class="avatar-md" />
                      </div> -->
                      <button v-if="optionSelected(spec.name , value)" class="filter-button" style="background:red" v-on:click="selectOption(spec.name , value)">{{value}}</button>
                      <button v-else class="filter-button" v-on:click="selectOption(spec.name , value)">{{value}}</button>
                    </a>
                  </div> 
                  <div class="row">
                    <div class="col-md-3">
                      <b-form-input id="input-name" type="number" placeholder="" v-model="quantity" class="text-center"></b-form-input>
                    </div>
                    <div class="col-md-9">
                        <b-button type="submit" variant="primary" class="btn-block w-large" v-on:click="addToCart">Add To Cart</b-button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <!-- end row -->

            <div class="mt-5">
              <p
                    class="text-muted mb-4"
                    v-html="productDetail.long_description"
                  >{{productDetail.long_description}}</p>
              <h5 v-if="productDetail.attributes.length > 0" class="mb-3">Specifications :</h5>

              <div class="table-responsive">
                <table class="table mb-0 table-bordered">
                  <tbody>
                    <tr v-for="attr in productDetail.attributes" :key="attr.id">
                      <th scope="row" style="width: 400px;">{{attr.name}}</th>
                      <td>{{attr.value}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- end Specifications -->

            <div class="mt-5">
              <h5 v-if="reviews.length > 0" class="mb-4">Reviews :</h5>

              <div class="media py-3 border-bottom" v-for="review in reviews" :key="review.id">
                <!-- <img
                  src="@/assets/images/users/avatar-2.jpg"
                  class="avatar-xs mr-3 rounded-circle"
                  alt="img"
                /> -->
                <div class="media-body">
                  <h5 class="mt-0 font-size-15">{{review.customer.first_name}} {{review.customer.last_name}}
                    
                  </h5>
                  <span class="bx bx-star text-warning" v-for="i in review.rating" :key="'gold'+i"></span>
                    <span class="bx bx-star ml-0" v-for="i in notRatedStars(review.rating)" :key="'black'+i"></span>
                  <p
                    class="text-muted"
                  >{{review.comment}}</p>
                  <!-- <ul class="list-inline float-sm-right">
                    <li class="list-inline-item">
                      <a href="javascript: void(0);">
                        <i class="far fa-thumbs-up mr-1"></i> Like
                      </a>
                    </li>
                    <li class="list-inline-item">
                      <a href="javascript: void(0);">
                        <i class="far fa-comment-dots mr-1"></i> Comment
                      </a>
                    </li>
                  </ul> -->
                  <div class="text-muted">
                    <i class="far fa-calendar-alt text-primary mr-1"></i> {{review.created_at}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <!-- end row -->

    <div class="row mt-3">
      <div class="col-lg-12">
        <div>
          <h5 class="mb-3">Recent product :</h5>

          <div class="row">
            <div class="col-xl-4 col-sm-6">
              <div class="card">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-4">
                      <img
                        src="@/assets/images/product/img-7.png"
                        alt
                        class="img-fluid mx-auto d-block"
                      />
                    </div>
                    <div class="col-md-8">
                      <div class="text-center text-md-left">
                        <h5 class="mb-3 text-truncate">
                          <a href="javascript: void(0);" class="text-dark">Wirless Headphone</a>
                        </h5>
                        <p class="text-muted">
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star"></i>
                        </p>
                        <h5 class="my-0">
                          <span class="text-muted mr-2">
                            <del>$240</del>
                          </span>
                          <b>$225</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-sm-6">
              <div class="card">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-4">
                      <img
                        src="@/assets/images/product/img-4.png"
                        alt
                        class="img-fluid mx-auto d-block"
                      />
                    </div>
                    <div class="col-md-8">
                      <div class="text-center text-md-left">
                        <h5 class="mb-3 text-truncate">
                          <a href="javascript: void(0);" class="text-dark">Phone patterned cases</a>
                        </h5>
                        <p class="text-muted">
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star"></i>
                        </p>
                        <h5 class="my-0">
                          <span class="text-muted mr-2">
                            <del>$150</del>
                          </span>
                          <b>$145</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-sm-6">
              <div class="card">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-4">
                      <img
                        src="@/assets/images/product/img-6.png"
                        alt
                        class="img-fluid mx-auto d-block"
                      />
                    </div>
                    <div class="col-md-8">
                      <div class="text-center text-md-left">
                        <h5 class="mb-3 text-truncate">
                          <a
                            href="javascript: void(0);"
                            class="text-dark"
                          >Phone Dark Patterned cases</a>
                        </h5>
                        <p class="text-muted">
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star text-warning"></i>
                          <i class="bx bx-star"></i>
                        </p>
                        <h5 class="my-0">
                          <span class="text-muted mr-2">
                            <del>$138</del>
                          </span>
                          <b>$135</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end row -->
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>
