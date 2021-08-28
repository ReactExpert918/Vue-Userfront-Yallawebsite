<script>
import Layout from '../../../layouts/main'
import PageHeader from '@/components/page-header'
import appConfig from "@/app.config";

import axios from 'axios';
import {authHeader} from "@/helpers/authservice/auth-header";
import {handleAxiosError} from "@/helpers/authservice/user.service";

/**
 * Product-cart component
 */
export default {
   page: {
    title: "Cart",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      cart: {total:{} , products:[]},
      title: 'Cart',
      items: [
        {
          text: 'Ecommerce',
          href: '/',
        },
        {
          text: 'Cart',
          active: true,
        },
      ],
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    fetchCart(){
      axios
      .get(`${this.backendURL}/api/v1/carts`, authHeader())
      .then(response => {
        this.cart = response.data.data;

      })
      .catch(handleAxiosError);
    },
    removeProduct(id){
      const payload = {
        cart_item_id: id,
        quantity: 0,
      }
      axios
      .put(`${this.backendURL}/api/v1/carts`,payload, authHeader())
      .then(response => {
        window.console.log(response.data.data);
        this.fetchCart();
      })
      .catch(handleAxiosError);
    }
  }
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-centered mb-0 table-nowrap">
                <thead class="thead-light">
                  <tr>
                    <th>Product</th>
                    <th>Product Desc</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th colspan="2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in cart.products" :key="product.cart_id">
                    <td>
                      <img
                        :src="product.image"
                        alt="product-img"
                        title="product-img"
                        class="avatar-md"
                      />
                    </td>
                    <td>
                      <h5 class="font-size-14 text-truncate">
                        <router-link
                          :to="`/product/${product.id}`"
                          class="text-dark"
                        >{{product.name}}</router-link>
                      </h5>
                      <p class="mb-0" v-for="option in product.options" :key="option.name">
                        {{option.name}} :
                        <span class="font-weight-medium">{{option.value}}</span>
                      </p>
                    </td>
                    <td>$ {{product.price}}</td>
                    <td>{{product.quantity}}</td>
                    <td>$ {{product.total}}</td>
                    <td>
                      <a href="javascript:void(0);" class="action-icon text-danger">
                        <i class="mdi mdi-trash-can font-size-18" v-on:click="removeProduct(product.cart_id)"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row mt-4">
              <div class="col-sm-6">
                <router-link to="/ecommerce/product-detail" class="btn btn-secondary">
                  <i class="mdi mdi-arrow-left mr-1"></i> Continue Shopping
                </router-link>
              </div>
              <!-- end col -->
              <div class="col-sm-6">
                <div class="text-sm-right mt-2 mt-sm-0">
                  <router-link to="/checkout" class="btn btn-success">
                    <i class="mdi mdi-cart-arrow-right mr-1"></i> Checkout
                  </router-link>
                </div>
              </div>
              <!-- end col -->
            </div>
            <!-- end row-->
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Card Details</h5>

            <div class="card bg-primary text-white visa-card mb-0">
              <div class="card-body">
                <div>
                  <i class="bx bxl-visa visa-pattern"></i>

                  <div class="float-right">
                    <i class="bx bxl-visa visa-logo display-3"></i>
                  </div>

                  <div>
                    <i class="bx bx-chip h1 text-warning"></i>
                  </div>
                </div>

                <div class="row mt-5">
                  <div class="col-4">
                    <p>
                      <i class="fas fa-star-of-life m-1"></i>
                      <i class="fas fa-star-of-life m-1"></i>
                      <i class="fas fa-star-of-life m-1"></i>
                    </p>
                  </div>
                  <div class="col-4">
                    <p>
                      <i class="fas fa-star-of-life m-1"></i>
                      <i class="fas fa-star-of-life m-1"></i>
                      <i class="fas fa-star-of-life m-1"></i>
                    </p>
                  </div>
                  <div class="col-4">
                    <p>
                      <i class="fas fa-star-of-life m-1"></i>
                      <i class="fas fa-star-of-life m-1"></i>
                      <i class="fas fa-star-of-life m-1"></i>
                    </p>
                  </div>
                </div>

                <div class="mt-5">
                  <h5 class="text-white float-right mb-0">12/22</h5>
                  <h5 class="text-white mb-0">Fredrick Taylor</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-3">Order Summary</h4>

            <div class="table-responsive">
              <table class="table mb-0">
                <tbody>
                  <tr>
                    <td>Grand Total :</td>
                    <td>$ {{cart.total.grand_total}}</td>
                  </tr>
                  <tr>
                    <td>Discount :</td>
                    <td>- $ {{cart.total.discount}}</td>
                  </tr>
                  <tr>
                    <td>Shipping Charge :</td>
                    <td>$ {{cart.total.shipping_charge}}</td>
                  </tr>
                  <tr>
                    <td>Estimated Tax :</td>
                    <td>$ {{cart.total.tax}}</td>
                  </tr>
                  <tr>
                    <th>Total :</th>
                    <th>$ {{cart.total.total}}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- end table-responsive -->
          </div>
        </div>
        <!-- end card -->
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>
