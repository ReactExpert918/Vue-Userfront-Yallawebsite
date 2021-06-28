<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { ordersData, globalData } from "./orders-data";
import axios from "axios";

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
      ordersData: ordersData,
      globalData: globalData,
      stateValue: null,
      countryValue: null,
      //slider
      slide: 0,
      sliding: null,
      title: 'My Orders',
      items: [
        {
          text: "Dashboard",
          href: '/account/dashboard'
        },
        {
          text: "Orders",
          active: true
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      selected: [],
      isCheckAll: false,
      sortBy: "age",
      sortDesc: false,
      fields: [
          {
              label: "Order Date",
              key: "orderDate",
              sortable: true,
          },
          {
              label: "Order Number",
              key: "orderNumber",
              sortable: true,
          },
          {
              label: "Total",
              key: "total",
              sortable: true,
          },
          {
              label: "Order Status",
              key: "status",
              sortable: true,
          },
          {
              key: "actions",
          },
      ],
    };
  },
  computed: {
      /**
        * Total no. of records
        */
      rows() {
          return this.ordersData.length;
      },
  },
  watch: {
    selectedAll: function() {
      const selectedLength = this.ordersData.filter(data => data.selected);
      return this.ordersData.forEach( e => {
        if(this.selectedAll === true) { e.selected = true; }
        else if (selectedLength.length === this.ordersData.length) {
          e.selected = false;
        }
      })
    }
  },
  mounted() {
      // Set the initial number of items
      this.totalRows = this.items.length;
      axios
          .get("http://dummy.restapiexample.com/api/v1/employees", {
              headers: {
                  "Content-type": "application/json;charset=utf-8",
              },
          })
          .then((res) => {
              return res;
          });
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
     <div class="row">
       <div class="col-lg-12">
        <div class="card">
          <div class="card-body text-center">

            <div class="mt-4 row">
              <div class="col-sm-12 col-md-6 text-left">
                <div id="tickets-table_length" class="dataTables_length">
                    <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                    </label>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                  <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                      <label class="d-inline-flex align-items-center">Search:
                          <b-form-input v-model="filter" type="search" placeholder="Search..." class="form-control form-control-sm ml-2"></b-form-input>
                      </label>
                  </div>
              </div>
              <!-- End search -->
              <!-- Table -->
                <div class="table-responsive mb-0 text-left">
                    <b-table :items="ordersData" 
                      :fields="fields" 
                      responsive="sm" 
                      :per-page="perPage" 
                      :current-page="currentPage" 
                      :sort-by.sync="sortBy" 
                      :sort-desc.sync="sortDesc" 
                      :filter="filter" 
                      :filter-included-fields="filterOn" 
                      @filtered="onFiltered"
                    >
                      <template #cell(status)="data">
                        <span class="badge badge-success font-size-12">
                          {{data.item.status}}
                        </span>
                      </template>
                      <template #cell(orderNumber)="data">
                          <a href="#">{{data.item.orderNumber}}</a>
                      </template>
                      <template #cell(total)="data">
                          {{globalData[0].currencySymbol}}{{data.item.total}}
                      </template>
                      <template #cell(actions)>
                         <b-button variant="primary" href="#">View Order</b-button>
                      </template>
                    </b-table>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="dataTables_paginate paging_simple_numbers float-right">
                            <ul class="pagination pagination-rounded mb-0">
                                <!-- pagination -->
                                <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                            </ul>
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
