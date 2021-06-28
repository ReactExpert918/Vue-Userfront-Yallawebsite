<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { paymentData } from "./payment-data";

export default {
  page: {
    title: "Payment Details",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      paymentData: paymentData,
      stateValue: null,
      countryValue: null,
      //slider
      slide: 0,
      sliding: null,
      title:  'Payment Details',
      items: [
        {
          text: "Dashboard",
          href: '/account/dashboard'
        },
        {
          text: "Payment Details",
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
        <div class="card text-center pt-3 pb-5" v-b-modal.modal-add-payment>
          <div class="card-body p-5">
            <div class="avatar-sm mx-auto mb-4">
              <span class="avatar-title rounded-circle bg-soft-primary text-primary font-size-16">+</span>
            </div>
            <h5 class="font-size-15">
              <a href="javascript: void(0);" class="text-dark">Add Payment</a>
            </h5>
            <p class="text-muted">Add new payment details and billing address</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4" v-for="payment in paymentData" :key="payment.id">
        <div class="card">
          <div class="card-body p-5">
            <p>
              <span v-if="payment.isDefaultBilling === true" class="text-success mr-3"><i class="bx bx-check-double"></i> Default Billing</span>
            </p>
            <p><i class="bx bx-credit-card"></i> {{payment.cardNo}}, Expiry {{payment.cardExpiry}}</p>
            <p>
            {{payment.firstName}} {{payment.lastName}}<br>
            {{payment.addressLine1}}<br>
            {{payment.addressLine2}}<br>
            {{payment.city}}<br>
            {{payment.zipPostal}}<br>
            {{payment.phoneNumber}}<br>
            </p>
            <b-button v-b-modal.modal-edit-payment variant="secondary" class="mr-2">Edit</b-button>
            <b-button variant="danger" class="mr-2">Delete</b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="modal-add-payment" scrollable title="Add Payment" title-class="font-18" hide-footer>
      <div class="row">
        <div class="col-sm-6">
          <label class="mt-3">Card Number</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Card Expiry</label>
          <b-form-input id="month" value="2019-08" type="month"></b-form-input>
        </div>
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
          <label class="mt-3">Default Billing</label>
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
    <b-modal id="modal-edit-payment" scrollable title="Edit Payment" title-class="font-18" hide-footer>
      <div class="row">
        <div class="col-sm-6">
          <label class="mt-3">Card Number</label>
          <b-form-input for="text" value=""></b-form-input>
        </div>
        <div class="col-sm-6">
          <label class="mt-3">Card Expiry</label>
          <b-form-input id="month" value="2019-08" type="month"></b-form-input>
        </div>
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
          <label class="mt-3">Default Billing</label>
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
