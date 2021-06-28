<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";


/**
 * Product-checkout Component
 */
export default {
  page: {
    title: "Security",
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
      title: 'Security',
      items: [
        {
          text: "Dashboard",
          href: '/account/dashboard'
        },
        {
          text: "Security",
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
          <div class="card-body m-5">
            <div class="row">
              <div class="col-lg-4 mx-auto">
                <div class="row mb-0">
                  <div class="col-md-12">
                    <label class="col-form-label">New Password</label>
                    <b-form-input for="text" value=""></b-form-input>
                  </div>
                  <div class="col-md-12">
                    <label class="col-form-label">Confirm Password</label>
                    <b-form-input for="text" value=""></b-form-input>
                  </div>
                  <div class="col-md-12">
                    <label class="col-form-label">Current Password</label>
                    <b-form-input for="text" value=""></b-form-input>
                  </div>
                  <div class="col-md-12 text-center">
                    <b-button class="mt-3" variant="primary">Save</b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
