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
              <div class="col-md-2">
                <label class="col-form-label">Title</label>
                <select class="custom-select">
                  <option selected>Title</option>
                  <option value="1">Ms</option>
                  <option value="2">Mr</option>
                  <option value="3">Mrs</option>
                  <option value="4">Miss</option>
                </select>
              </div>
              <div class="col-md-2">
                <label class="col-form-label">First Name</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
              <div class="col-md-2">
                <label class="col-form-label">Last Name</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">Email</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
              <div class="col-md-3">
                <label class="col-form-label">Contact Number</label>
                <b-form-input for="text" value=""></b-form-input>
              </div>
            </div>
            <h5 class="mt-3">Contact Address</h5>
            <div class="row mb-0">
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
            </div>
            <b-button class="mt-3" variant="primary">Save</b-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
