<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";


/**
 * Product-checkout Component
 */
export default {
  page: {
    title: "c",
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
      title: 'Preferences',
      items: [
        {
          text: "Dashboard",
          href: '/account/dashboard'
        },
        {
          text: "Preferences",
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
              <div class="col-lg-7 mx-auto">
                <div class="row">
                  <div class="col-lg-10">
                    <h5 class="">Email</h5>
                    <p>I’d like to keep up to date with new products, news and offers by email</p>
                  </div>
                  <div class="col-lg-2">
                     <b-form-checkbox switch size="lg" v-model="lgchecked" class="pt-3"></b-form-checkbox>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10">
                    <h5 class="">Post</h5>
                    <p>I’d like to be inspired by brochures and promotions by post</p>
                  </div>
                  <div class="col-lg-2">
                     <b-form-checkbox switch size="lg" v-model="lgchecked" class="pt-3"></b-form-checkbox>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-10">
                    <h5 class="">Our partners</h5>
                    <p>I'd like to receive offers and promotions from selected partners</p>
                  </div>
                  <div class="col-lg-2">
                     <b-form-checkbox switch size="lg" v-model="lgchecked" class="pt-3"></b-form-checkbox>
                  </div>
                </div>
                <div class="text-center">
                  <b-button class="mt-3" variant="primary">Save</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
