<script>
import Layout from "../../../layouts/main";
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
      sliding: null
    };
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
     <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <b-carousel
              id="carousel-1"
              v-model="slide"
              :interval="7000"
              indicators
              background="#ababab"
              img-width="1024"
              img-height="480"
              style="text-shadow: 1px 1px 2px #333;"
              @sliding-start="onSlideStart"
              @sliding-end="onSlideEnd"
              >
              <!-- Slide with blank fluid image to maintain slide aspect ratio -->
              <b-carousel-slide img-blank img-alt="Blank image">
                <p>
                 Blank Image
                </p>
              </b-carousel-slide>
            </b-carousel>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%; height: 140px;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <img style="width: 100%; height: 140px;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-2">
                <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
                <h4 class="mt-2 text-center">Category 1</h4>
              </div>
              <div class="col-lg-2">
                <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
                <h4 class="mt-2 text-center">Category 2</h4>
              </div>
              <div class="col-lg-2">
                <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
                <h4 class="mt-2 text-center">Category 3</h4>
              </div>
              <div class="col-lg-2">
                <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
                <h4 class="mt-2 text-center">Category 4</h4>
              </div>
              <div class="col-lg-2">
                <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
                <h4 class="mt-2 text-center">Category 5</h4>
              </div>
              <div class="col-lg-2">
                <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
                <h4 class="mt-2 text-center">Category 6</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <img style="width: 100%;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-3">
                <img style="width: 100%; height: 100px;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
              </div>
              <div class="col-lg-3">
                <img style="width: 100%; height: 100px;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
              </div>
              <div class="col-lg-3">
                <img style="width: 100%; height: 100px;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
              </div>
              <div class="col-lg-3">
                <img style="width: 100%; height: 100px;" src="@/assets/images/marketing/email-campaigns/placeholder.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
              
  </Layout>
</template>
