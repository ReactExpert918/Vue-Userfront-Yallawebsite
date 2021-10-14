<script>
import Layout from "../../../../layouts/main";
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
  components: { Layout, PageHeader },
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      customer: {},
      password: "",
      passwordConfirm: "",
      stateValue: null,
      countryValue: null,
      //slider
      slide: 0,
      sliding: null,
      title: 'Personal Details',
      items: [
        {
          text: "Dashboard",
          href: '/account/dashboard'
        },
        {
          text: "Personal Details",
          active: true
        }
      ],
    };
  },
  mounted(){
    this.fetchCustomer();
  },
  methods: {
    fetchCustomer(){
      axios
      .get(`${this.backendURL}/api/v1/customers`, authHeader())
      .then(response => {
        this.customer = response.data.data;
      })
      .catch(error=> handleAxiosError(error, this));
    },
    updateCustomer(){

      const payload = {
        first_name: this.customer.first_name,
        last_name: this.customer.last_name,
        email: this.customer.email,
        password: this.password,
        password_confirmation: this.passwordConfirm,
      }

      axios
      .put(`${this.backendURL}/api/v1/customers` , payload , authHeader())
      .then(response => (
        this.data = response.data,
        this.$toast.success("Customers Updated Successfully!", {
          position: "top-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        })))
      .catch(error=> handleAxiosError(error, this));
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
            <h5>General</h5>
            <div class="row mb-0">
              <!-- <div class="col-md-2">
                <label class="col-form-label">Title</label>
                <select class="custom-select">
                  <option selected>Title</option>
                  <option value="1">Ms</option>
                  <option value="2">Mr</option>
                  <option value="3">Mrs</option>
                  <option value="4">Miss</option>
                </select>
              </div> -->
              <div class="col-md-2">
                <label class="col-form-label">First Name</label>
                <b-form-input for="text"  v-model="customer.first_name"></b-form-input>
              </div>
              <div class="col-md-2">
                <label class="col-form-label">Last Name</label>
                <b-form-input for="text"  v-model="customer.last_name"></b-form-input>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">Email</label>
                <b-form-input for="text" v-model="customer.email"></b-form-input>
              </div>
              <!-- <div class="col-md-3">
                <label class="col-form-label">Contact Number</label>
                <b-form-input for="text" value=""></b-form-input>
              </div> -->
            </div>
            <h5 class="mt-3">Security</h5>
            <div class="row mb-0">
              <div class="col-md-2">
                <label class="col-form-label">New Password</label>
                <b-form-input for="text"  v-model="password"></b-form-input>
              </div>
              <div class="col-md-2">
                <label class="col-form-label">Password Confirmation</label>
                <b-form-input for="text"  v-model="passwordConfirm"></b-form-input>
              </div>
            </div>
            <!-- <h5 class="mt-3">Contact Address</h5> -->
            <!-- <div class="row mb-0">
              <div class="col-md-3">
                <label class="col-form-label">Country</label>
                <select class="custom-select">
                  <option selected>United Kingdom</option>
                  <option value="1">Ms</option>
                  <option value="2">Mr</option>
                  <option value="3">Mrs</option>
                  <option value="4">Miss</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">House Number</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">Address Line 2</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">Town / City</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">Zip / Postal Code</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
            </div> -->
            <b-button class="mt-3" variant="primary" v-on:click="updateCustomer">Save</b-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
