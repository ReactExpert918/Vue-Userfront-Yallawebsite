<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { addressesData } from "./addresses-data";

export default {
  page: {
    title: "Addresses",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      addressesData: addressesData,
      stateValue: null,
      countryValue: null,
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
      <div class="col-lg-4" v-for="address in addressesData" :key="address.id">
        <div class="card">
          <div class="card-body p-5">
            <p>
              <span v-if="address.isDefaultShipping === true" class="text-success mr-3"><i class="bx bx-check-double"></i> Default Shipping</span>
            </p>
            <p>
            {{address.firstName}} {{address.lastName}}<br>
            {{address.addressLine1}}<br>
            {{address.addressLine2}}<br>
            {{address.city}}<br>
            {{address.zipPostal}}<br>
            {{address.phoneNumber}}<br>
            </p>
            <b-button v-b-modal.modal-edit-address variant="secondary" class="mr-2">Edit</b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="modal-add-address" scrollable title="Add Address" title-class="font-18" hide-footer>
      <div class="row">
        <div class="col-sm-6">
          <label class="mt-3">First Name</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Last Name</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Address Line 1</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Address Line 2</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">City</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Postcode</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Phone Number</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Default Shipping</label>
          <b-form-checkbox switch size="lg" v-model="lgchecked"></b-form-checkbox>
        </div>
      </div>
      <br>
      <div class="text-sm-right">
        <b-button variant="primary">
            <i class="bx bx-check-double font-size-16 align-middle mr-2"></i>
            Save
        </b-button>
      </div>
    </b-modal>
    <b-modal id="modal-edit-address" scrollable title="Edit Address" title-class="font-18" hide-footer>
      <div class="row">
        <div class="col-sm-6">
          <label class="mt-3">First Name</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Last Name</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Address Line 1</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Address Line 2</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">City</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Postcode</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Phone Number</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Default Shipping</label>
          <b-form-checkbox switch size="lg" v-model="lgchecked"></b-form-checkbox>
        </div>
      </div>
      <br>
      <div class="text-sm-right">
        <b-button variant="primary">
            <i class="bx bx-check-double font-size-16 align-middle mr-2"></i>
            Save
        </b-button>
      </div>
    </b-modal>
  </Layout>
</template>
