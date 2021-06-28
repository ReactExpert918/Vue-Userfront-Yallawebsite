<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";


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
      stateValue: null,
      countryValue: null,
      //slider
      slide: 0,
      sliding: null,
      items: [
        {
          text: "Dashboard",
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
       <div class="col-lg-12">
        <div class="card">
          <div class="card-body text-center">
            <label class="card-title">My Account</label>
            <p>Hello Customer</p>
            <b-button type="submit" variant="secondary" class="">Logout</b-button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="bx bx-box font-size-22 pb-2"></i>
            <h5>Your Orders</h5>
            <p>View current and past orders</p>
            <b-button href="/account/orders" type="submit" variant="primary" class="">View</b-button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="bx bx-user-circle font-size-22 pb-2"></i>
            <h5>Personal Details</h5>
            <p>Manage your name, email address and contact number</p>
            <b-button href="/account/personal-details/" type="submit" variant="primary" class="">View</b-button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="bx bx-map-pin font-size-22 pb-2"></i>
            <h5>Your Addresses</h5>
            <p>Manage your delivery and billiing addresses</p>
            <b-button href="/account/addresses/" type="submit" variant="primary" class="">View</b-button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="bx bx-money font-size-22 pb-2"></i>
            <h5>Payment Details</h5>
            <p>Manage your payment methods</p>
            <b-button href="/account/payment-details/" type="submit" variant="primary" class="">View</b-button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="bx bx-lock-alt font-size-22 pb-2"></i>
            <h5>Security</h5>
            <p>Change your password</p>
            <b-button href="/account/security/" type="submit" variant="primary" class="">View</b-button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body text-center p-5">
            <i class="bx bx-envelope font-size-22 pb-2"></i>
            <h5>My Preferences</h5>
            <p>Manage how we keep you updated</p>
            <b-button href="/account/preferences/" type="submit" variant="primary" class="">View</b-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
