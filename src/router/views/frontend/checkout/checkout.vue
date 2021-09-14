<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";


import axios from 'axios';
import {authHeader} from "@/helpers/authservice/auth-header";
import {handleAxiosError} from "@/helpers/authservice/user.service";

/**
 * Product-checkout Component
 */
export default {
  page: {
    title: "Checkout",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: {Layout, PageHeader },
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      cart: {total:{} , products:[]},
      title: "Checkout",
      stepShipping: 'shipping',
      stepBilling: 'billing',
      stepCheckout: 'checkout',
      paymentData: [],
      paymentMap: {},
      currentPayment:{},
      currentPaymentType: {},
      step: "",
      items: [
        {
          text: "Ecommerce",
          href: "/"
        },
        {
          text: "Checkout",
          active: true
        }
      ],
      selectedCountry: {},
      countries: [],
      additional_instruction: "",
      shipping_address:{
        first_name: "",
        last_name: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        country_id: "",
        state: "",
        city: "",
        postcode:"",
      }
    };
  },
  mounted(){
    this.step = this.stepShipping;
    this.fetchAllowedCountries();
    this.fetchPaymentMethods();
    this.fetchCart();
  },
  methods: {
    checkout(){
      this.shipping_address.country_id = this.selectedCountry.id;
      const payload = {
        address: this.shipping_address,
        additional_instruction: this.additional_instruction,
      }
      axios
      .post(`${this.backendURL}/api/v1/carts/checkout`,payload, authHeader())
      .then(response => {
        alert(`Checkout Successful: ${response.data.data.id}`);
        this.purchase(response.data.data.id);
      })
      .catch(handleAxiosError);
    },
    fetchAllowedCountries(){
      axios
      .get(`${this.backendURL}/api/v1/areas/countries`, authHeader())
      .then(response => {
        this.countries = response.data.data;
      })
      .catch(handleAxiosError);
    },
    fetchPaymentMethods(){
      axios
      .get(`${this.backendURL}/api/v1/payments/methods` , authHeader())
      .then(response => {
          this.paymentData = response.data.data;

          for(var i = 0; i < this.paymentData.length; i++){
            var pd = this.paymentData[i];
            if (!(pd.display_name in this.paymentMap)){
               this.paymentMap[pd.display_name] = pd;
            }
            if (pd.display_name == "stripe"){
                // include stripe library dynamically
                this.includeStripe('js.stripe.com/v3/' , function(){
                  this.configureStripe();
                }.bind(this));
            }
          }          
        })
      .catch(handleAxiosError);
    },
    // Invluce stripe dynamically
    includeStripe( URL, callback ){
      let documentTag = document, tag = 'script',
          object = documentTag.createElement(tag),
          scriptTag = documentTag.getElementsByTagName(tag)[0];
      object.src = '//' + URL;
      if (callback) { object.addEventListener('load', function (e) { callback(null, e); }, false); }
      scriptTag.parentNode.insertBefore(object, scriptTag);
    },
    configureStripe(){
      this.stripe = window.Stripe(this.paymentMap["stripe"].api_key);

      this.elements = this.stripe.elements();
      this.card = this.elements.create('card' , {
        hidePostalCode : true,
      });

      this.card.mount('#card-element');
    },
    purchase(orderID){
      if (this.currentPayment.display_name == 'stripe'){
        if (this.currentPaymentType.method_slug == 'card_payment'){
          this.purchaseWithStripeCard(orderID)
        }
      }
      if(this.currentPayment.display_name == 'paypal'){
        this.purchaseWithPaypal(orderID);
      }
    },
    purchaseWithStripeCard(orderID){
        this.stripe.createToken(this.card)
        .then(result => {
          if(result.error){
            alert("Failed to create stripe card token because: " + result.error.message);
            return;
          }

          var payload = {
            order_id: orderID,
            method: "stripe",
            type: "card",
            info: {
              token: result.token.id,
            },
          }
          axios
          .post(`${this.backendURL}/api/v1/payments/${this.currentPayment.id}/pay` , payload , authHeader())
          .then(response => (
            this.data = response.data,
            alert("Got paid Successfully")
            ))
          .catch(handleAxiosError);
        })
    },
    checkStripeCard(name , type , enabled){
      if (enabled && name == "stripe" && type == "card_payment"){
        return true;
      }
      return false;
    },
    purchaseWithPaypal(orderID) {
      var payload = {
            order_id: orderID,
            method: "paypal",
          }
      axios
          .post(`${this.backendURL}/api/v1/payments/${this.currentPayment.id}/pay` , payload , authHeader())
          .then(response => (
            this.data = response.data,
            alert(`Got Paid Successfully!`)
            ))
          .catch(handleAxiosError);
    },
    setCurrentPaymentType(checked , type){
      if (checked){
        this.currentPaymentType = type;
      }else{
        this.currentPaymentType = {};
      }
    },
    processShippingAddress(){
      var nameArr = this.shipping_address.name.split(" ");
      this.shipping_address.first_name = nameArr[0];
      if (nameArr.length > 1){
        this.shipping_address.last_name = nameArr[1];
      }

      if (this.selectedCountry.name){
        this.shipping_address.country = this.selectedCountry.name;
      }
      this.step = this.stepBilling;
    },
    processBillingInfo(){
      this.step = this.stepCheckout;
    },
    fetchCart(){
      axios
      .get(`${this.backendURL}/api/v1/carts`, authHeader())
      .then(response => {
        this.cart = response.data.data;

      })
      .catch(handleAxiosError);
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="checkout-tabs">
      <b-tabs pills vertical nav-class="p-0" nav-wrapper-class="col-lg-2 w-100">
        <b-tab :active="step==stepShipping" v-on:click="step=stepShipping">
          <template v-slot:title>
            <i class="bx bxs-truck d-block check-nav-icon mt-4 mb-2"></i>
            <p class="font-weight-bold mb-4">Shipping Info</p>
          </template>
          <b-card-text>
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Shipping information</h4>
                <p class="card-title-desc">Fill all information below</p>
                <form>
                  <b-row class="mb-4">
                    <b-col md="2">
                      <label for="input-name">Name</label>
                    </b-col>
                    <b-col md="10">
                      <b-form-input id="input-name" placeholder="Enter your name" v-model="shipping_address.name"></b-form-input>
                    </b-col>
                  </b-row>

                  <b-row class="mb-4">
                    <b-col md="2">
                      <label for="billing-email-address">Email Address</label>
                    </b-col>
                    <b-col md="10">
                      <b-form-input id="billing-email-address" placeholder="Enter your email" v-model="shipping_address.email"></b-form-input>
                    </b-col>
                  </b-row>

                  <b-row class="mb-4">
                    <b-col md="2">
                      <label for="billing-phone">Phone</label>
                    </b-col>
                    <b-col md="10">
                      <b-form-input id="billing-phone" placeholder="Enter your Phone no." v-model="shipping_address.phone"></b-form-input>
                    </b-col>
                  </b-row>

                  <b-row class="mb-4">
                    <b-col md="2">
                      <label for="billing-address">Address</label>
                    </b-col>
                    <b-col md="10">
                      <b-form-textarea
                        id="billing-address"
                        rows="3"
                        placeholder="Enter full address"
                        v-model="shipping_address.address"
                      ></b-form-textarea>
                    </b-col>
                  </b-row>

                  <div class="form-group row mb-4">
                    <label class="col-md-2 col-form-label">Country</label>
                    <div class="col-md-10">
                      <select class="custom-select custom-select-sm" v-model="selectedCountry">
                        <option v-for="country in countries" v-bind:value="country" :key="country.id">{{country.name}}</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group row mb-4">
                    <label class="col-md-2 col-form-label">State</label>
                    <div class="col-md-10">
                      <b-form-input id="state" placeholder="Enter your State" v-model="shipping_address.state"></b-form-input>
                    </div>
                  </div>
                  <div class="form-group row mb-4">
                    <label class="col-md-2 col-form-label">Postcode</label>
                    <div class="col-md-10">
                      <b-form-input id="postcode" placeholder="Enter your postcode" v-model="shipping_address.postcode"></b-form-input>
                    </div>
                  </div>
                  <div class="form-group row mb-4">
                    <label class="col-md-2 col-form-label">City</label>
                    <div class="col-md-10">
                      <b-form-input id="city" placeholder="Enter your City" v-model="shipping_address.city"></b-form-input>
                    </div>
                  </div>
                  <b-row class="mb-4">
                    <b-col md="2">
                      <label for="example-textarea">Order Notes:</label>
                    </b-col>
                    <b-col md="10">
                      <b-form-textarea
                        id="example-textarea"
                        rows="3"
                        placeholder="Write some note.."
                        v-model="additional_instruction"
                      ></b-form-textarea>
                    </b-col>
                  </b-row>
                </form>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-sm-6">
                <router-link
                  tag="a"
                  to="/ecommerce/cart"
                  class="btn text-muted d-none d-sm-inline-block btn-link"
                >
                  <i class="mdi mdi-arrow-left mr-1"></i> Back to Shopping Cart
                </router-link>
              </div>
              <!-- end col -->
              <div class="col-sm-6">
                <div class="text-sm-right">
                  <div class="btn btn-success" v-on:click="processShippingAddress">
                    <i class="mdi mdi-truck-fast mr-1"></i> Proceed to Billing
                  </div>
                </div>
              </div>
              <!-- end col -->
            </div>
          </b-card-text>
        </b-tab>
        <b-tab :active="step==stepBilling" v-on:click="step=stepBilling">
          <template v-slot:title>
            <i class="bx bx-money d-block check-nav-icon mt-4 mb-2"></i>
            <p class="font-weight-bold mb-4">Payment Info</p>
          </template>
          <b-card-text>
            <div class="card">
              <div class="card-body">
                <div>
                  <h4 class="card-title">Payment information</h4>
                  <p class="card-title-desc">Fill all information below</p>

                  <div>
                    <!-- <div class="custom-control custom-radio custom-control-inline mr-4" v-for="payment in paymentData" :key="payment.id" @click="currentPayment = payment">
                      <input
                        :id="payment.id"
                        type="radio"
                        :name="payment.display_name"
                        class="custom-control-input"
                      />
                      <label class="custom-control-label" :for="payment.id">
                        <i class="fab fa-cc-mastercard mr-1 font-size-20 align-top"></i> {{payment.on_screen_name}}
                      </label>
                    </div> -->
                     <b-tabs pills horizontal nav-class="p-0" nav-wrapper-class="col-sm-6" content-class="pt-0 px-2 text-muted">
                        <b-tab v-for="payment in paymentData" :key="payment.id" :title="payment.on_screen_name" active title-item-class="mb-2" @click="currentPayment = payment">
                          <!-- <b-card-text> -->
                            <!-- <div class="row"> -->
                              <div v-for="type in payment.types" :key="type.method_slug" v-bind:value="type.method_slug">
                                <div id="card-element" v-if="checkStripeCard(payment.display_name , type.method_slug, type.enabled)">
                                </div>
                                <b-form-checkbox v-if="type.enabled" @change="(v)=>setCurrentPaymentType(v, type)" class="custom-checkbox custom-checkbox-primary"></b-form-checkbox>
                              </div>

                              <b-card-text v-if="payment.display_name == 'paypal'">
                                <div class="col-sm-12">
                                  <b-button variant="primary">
                                      <i class="bx bx-check-double font-size-16 align-middle mr-2"></i>
                                      Pay With Paypal
                                  </b-button>
                                </div>
                              </b-card-text>>
                        </b-tab>
                     </b-tabs>
                    <!-- <div class="custom-control custom-radio custom-control-inline mr-4">
                      <input
                        id="customRadioInline2"
                        type="radio"
                        name="customRadioInline1"
                        class="custom-control-input"
                      />
                      <label class="custom-control-label" for="customRadioInline2">
                        <i class="fab fa-cc-paypal mr-1 font-size-20 align-top"></i> Paypal
                      </label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline mr-4">
                      <input
                        id="customRadioInline3"
                        type="radio"
                        name="customRadioInline1"
                        class="custom-control-input"
                        checked
                      />
                      <label class="custom-control-label" for="customRadioInline3">
                        <i class="far fa-money-bill-alt mr-1 font-size-20 align-top"></i> Cash on Delivery
                      </label>
                    </div> -->
                  </div>

                   <!-- <div v-for="payment in paymentData" :key="payment.id">
                     <div v-for="type in payment.types" :key="type.method_slug" v-bind:value="type.method_slug">
                      <div id="card-element" v-if="checkStripeCard(payment.display_name , type.method_slug, type.enabled)">
                      </div> -->
                      <!-- <b-form-checkbox v-if="type.enabled" @change="(v)=>setCurrentPaymentType(v, type)" class="custom-checkbox custom-checkbox-primary"></b-form-checkbox> -->
                      <!-- <b-card-text v-if="payment.display_name == 'paypal'">
                          <div class="col-sm-12">
                            <b-button variant="primary">
                                <i class="bx bx-check-double font-size-16 align-middle mr-2"></i>
                                Pay With Paypal
                            </b-button>
                          </div>
                      </b-card-text> -->
                    <!-- </div> -->
                    
                   <!-- </div> -->
                   
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-sm-6">
                <router-link
                  tag="a"
                  to="/ecommerce/cart"
                  class="btn text-muted d-none d-sm-inline-block btn-link"
                >
                  <i class="mdi mdi-arrow-left mr-1"></i> Back to Shopping Cart
                </router-link>
              </div>
              <!-- end col -->
              <div class="col-sm-6">
                <div class="text-sm-right">
                  <div class="btn btn-success" v-on:click="processBillingInfo">
                    <i class="mdi mdi-truck-fast mr-1"></i> Proceed to Confirmation
                  </div>
                </div>
              </div>
              <!-- end col -->
            </div>
          </b-card-text>
        </b-tab>
        <b-tab :active="step==stepCheckout" v-on:click="step=stepCheckout">
          <template v-slot:title>
            <i class="bx bx-badge-check d-block check-nav-icon mt-4 mb-2"></i>
            <p class="font-weight-bold mb-4">Confirmation</p>
          </template>
          <b-card-text>
            <div class="card">
              <div class="card-body">
                <div class="card shadow-none border mb-0">
                  <div class="card-body">
                    <h4 class="card-title mb-4">Order Summary</h4>

                    <div class="table-responsive">
                      <table class="table table-centered mb-0 table-nowrap">
                        <thead class="thead-light">
                          <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Product Desc</th>
                            <th scope="col">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="product in cart.products" :key="product.cart_id">
                            <th scope="row">
                              <img
                                :src="product.image"
                                alt="product-img"
                                title="product-img"
                                class="avatar-md"
                              />
                            </th>
                            <td>
                              <h5 class="font-size-14 text-truncate">
                                <router-link
                                  tag="a"
                                  :to="`/product/${product.id}`"
                                  class="text-dark"
                                >{{product.name}}</router-link>
                              </h5>
                              <p class="text-muted mb-0">
                                <span class="text-muted mr-2" v-if="product.discounted_price < product.price">
                                  <del>${{product.price}}</del>
                                </span>
                                ${{product.discounted_price}} x {{product.quantity}}
                              </p>
                            </td>
                            <td>$ {{product.total}}</td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <h6 class="m-0 text-right">Sub Total:</h6>
                            </td>
                            <td>$ {{cart.total.grand_total}}</td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <h6 class="m-0 text-right">Discount:</h6>
                            </td>
                            <td>$ {{cart.total.discount}}</td>
                          </tr>
                          <tr>
                            <td colspan="3">
                              <div class="bg-soft-primary p-3 rounded">
                                <h5 class="font-size-14 text-primary mb-0">
                                  <i class="fas fa-shipping-fast mr-2"></i> Shipping
                                  <span class="float-right" v-if="cart.total.shipping_charge < 1">Free</span>
                                  <span class="float-right" v-else>{{cart.total.shipping_charge}}</span>
                                </h5>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">
                              <h6 class="m-0 text-right">Total:</h6>
                            </td>
                            <td>$ {{cart.total.total}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-sm-6">
                <router-link
                  tag="a"
                  to="/ecommerce/cart"
                  class="btn text-muted d-none d-sm-inline-block btn-link"
                >
                  <i class="mdi mdi-arrow-left mr-1"></i> Back to Shopping Cart
                </router-link>
              </div>
              <!-- end col -->
              <div class="col-sm-6">
                <div class="text-sm-right">
                  <div  class="btn btn-success" v-on:click="checkout">
                    <i class="mdi mdi-truck-fast mr-1"></i> Place Order
                  </div>
                </div>
              </div>
              <!-- end col -->
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </div>
  </Layout>
</template>
