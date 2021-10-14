<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import axios from 'axios';
import {authHeader} from "@/helpers/authservice/auth-header";
import {handleAxiosError} from "@/helpers/authservice/user.service";

export default {
  page: {
    title: "Addresses",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      addressesData: {billing_addresses: [] , shipping_addresses: []},
      currentAddress: {},
      stateValue: null,
      selectedCountry: {},
      countries: [],
      newAddress: {
        first_name: "",
        last_name: "",
        country_id: "",
        street: "",
        city: "",
        postcode: "",
        state: "",
        default_shipping_address: false,
      },
      //slider
      slide: 0,
      sliding: null,
      title:  'Addresses',
      items: [
        {
          text: "Dashboard",
          href: '/account/dashboard'
        },
        {
          text: "Checkout",
          active: true
        }
      ]
    };
  },
  mounted(){
    this.fetchCustomerAddresses();
    this.fetchAllowedCountries();
  },
  methods: {
    fetchCustomerAddresses(){
      axios
      .get(`${this.backendURL}/api/v1/customers/address`, authHeader())
      .then(response => {
        this.addressesData = response.data.data;
      })
      .catch(error=> handleAxiosError(error, this));
    },
    updateCustomerAddresses(){

      const payload = {
        shipping_addresses: this.addressesData.shipping_addresses,
      }

      axios
      .put(`${this.backendURL}/api/v1/customers`,payload ,  authHeader())
      .then(response => {
        this.data = response.data;
        this.$toast.success("Address Updated Successfully!", {
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
        })
      })
      .catch(error=> handleAxiosError(error, this));
    },
    fetchAllowedCountries(){
      axios
      .get(`${this.backendURL}/api/v1/areas/countries`, authHeader())
      .then(response => {
        this.countries = response.data.data;
      })
      .catch(error=> handleAxiosError(error, this));
    },
    addNewAddress(){
      if (this.selectedCountry.id != ""){
        this.newAddress.country_id = this.selectedCountry.id;
        this.newAddress.country = this.selectedCountry.name;
      }
      this.addressesData.shipping_addresses.push(this.newAddress);
      this.updateCustomerAddresses();
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
     <div class="row">
      <div class="col-lg-4">
        <div class="card text-center pt-3 pb-5" v-b-modal.modal-add-address>
          <div class="card-body p-5">
            <div class="avatar-sm mx-auto mb-4">
              <span class="avatar-title rounded-circle bg-soft-primary text-primary font-size-16">+</span>
            </div>
            <h5 class="font-size-15">
              <a href="javascript: void(0);" class="text-dark">Add New Address</a>
            </h5>
            <p class="text-muted">Add a new address to your address book</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4" v-for="address in addressesData.shipping_addresses" :key="address">
        <div class="card">
          <div class="card-body p-5">
            <p>
              <span v-if="address.default_shipping_address === true" class="text-success mr-3"><i class="bx bx-check-double"></i> Default Shipping</span>
            </p>
            <p>
            {{address.first_name}} {{address.last_name}}<br>
            {{address.street}}<br>
            {{address.city}}<br>
            {{address.country}}<br>
            {{address.state}}<br>
            {{address.postcode}}<br>
            </p>
            <b-button v-b-modal.modal-edit-address variant="secondary" class="mr-2" v-on:click="currentAddress = address">Edit</b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="modal-add-address" scrollable title="Add Address" title-class="font-18" hide-footer>
      <div class="row">
        <div class="col-sm-6">
          <label class="mt-3">First Name</label>
          <b-form-input for="text" v-model="newAddress.first_name"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Last Name</label>
          <b-form-input for="text" v-model="newAddress.last_name"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Address Line</label>
          <b-form-input for="text" v-model="newAddress.street"></b-form-input>
        </div>
        <!-- <div class="col-sm-6">
          <label class="mt-3">Address Line 2</label>
          <b-form-input for="text" value=""></b-form-input>
        </div> -->
        <div class="col-sm-6">
          <label class="mt-3">Country</label>
          <select class="custom-select custom-select-sm" v-model="selectedCountry">
            <option v-for="country in countries" v-bind:value="country" :key="country.id">{{country.name}}</option>
          </select>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">State</label>
          <b-form-input for="text" v-model="newAddress.state"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">City</label>
          <b-form-input for="text" v-model="newAddress.city"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Postcode</label>
          <b-form-input for="text" v-model="newAddress.postcode"></b-form-input>
        </div>
        <!-- <div class="col-sm-6">
          <label class="mt-3">Phone Number</label>
          <b-form-input for="text" value=""></b-form-input>
        </div> -->
        <div class="col-sm-6">
          <label class="mt-3">Default Shipping</label>
          <b-form-checkbox switch size="lg" v-model="newAddress.default_shipping_address" ></b-form-checkbox>
        </div>
      </div>
      <br>
      <div class="text-sm-right">
        <b-button variant="primary" v-on:click="addNewAddress">
            <i class="bx bx-check-double font-size-16 align-middle mr-2"></i>
            Save
        </b-button>
      </div>
    </b-modal>
    <b-modal id="modal-edit-address" scrollable title="Edit Address" title-class="font-18" hide-footer>
      <div class="row">
        <div class="col-sm-6">
          <label class="mt-3">First Name</label>
          <b-form-input for="text" v-model="currentAddress.first_name"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Last Name</label>
          <b-form-input for="text" v-model="currentAddress.last_name"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Address Line</label>
          <b-form-input for="text" v-model="currentAddress.street"></b-form-input>
        </div>
        <!-- <div class="col-sm-6">
          <label class="mt-3">Address Line 2</label>
          <b-form-input for="text" value=""></b-form-input>
        </div> -->
        <div class="col-sm-6">
          <label class="mt-3">City</label>
          <b-form-input for="text" v-model="currentAddress.city"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Country</label>
          <select class="custom-select custom-select-sm" v-model="currentAddress.country_id">
            <option v-for="country in countries" v-bind:value="country.id" :key="country.id">{{country.name}}</option>
          </select>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">State</label>
          <b-form-input for="text" v-model="currentAddress.state"></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Postcode</label>
          <b-form-input for="text" v-model="currentAddress.postcode"></b-form-input>
        </div>
        <!-- <div class="col-sm-6">
          <label class="mt-3">Phone Number</label>
          <b-form-input for="text" value=""></b-form-input>
        </div> -->
        <div class="col-sm-6">
          <label class="mt-3">Default Shipping</label>
          <b-form-checkbox switch size="lg" v-model="currentAddress.default_shipping_address"></b-form-checkbox>
        </div>
      </div>
      <br>
      <div class="text-sm-right">
        <b-button variant="primary" v-on:click="updateCustomerAddresses">
            <i class="bx bx-check-double font-size-16 align-middle mr-2"></i>
            Save
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>
