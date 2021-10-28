<script>
import { layoutMethods } from "@/state/helpers";
import axios from 'axios';
import {handleAxiosError} from "@/helpers/authservice/user.service";
import {authHeader} from "@/helpers/authservice/auth-header";
import { menuItems } from "./horizontal-menu";
import Vue from "vue";

import VueRouter from 'vue-router'

Vue.use(VueRouter)
export default {
  data() {
    return {
      backendURL: process.env.VUE_APP_BACKEND_URL,
      categories: [],
      menuItems: menuItems,
    };
  },
  mounted() {

    axios
    .get(`${this.backendURL}/api/v1/categories?tree=true` , authHeader())
    .then(response => (this.categories = response.data.data))
    .catch(handleAxiosError);

    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("active");
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add("active");
        }
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("active");
          var childAnchor = parent3.querySelector(".has-dropdown");
          if (childAnchor) childAnchor.classList.add("active");
        }

        const parent4 = parent3.parentElement;
        if (parent4) parent4.classList.add("active");
        const parent5 = parent4.parentElement;
        if (parent5) parent5.classList.add("active");
      }
    }
  },
  methods: {
    ...layoutMethods,
    /**
     * Menu clicked show the submenu
     */
    onMenuClick(event) {
      event.preventDefault();
      const nextEl = event.target.nextSibling;
      if (nextEl && !nextEl.classList.contains("show")) {
        const parentEl = event.target.parentNode;
        if (parentEl) {
          parentEl.classList.remove("show");
        }
        nextEl.classList.add("show");
      } else if (nextEl) {
        nextEl.classList.remove("show");
      }
      return false;
    },
    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasChildren(cat) {
      return cat.sub_categories !== undefined ? cat.sub_categories.length > 0 : false;
    },
    hasItems(item) {
      return item.subItems !== undefined ? item.subItems.length > 0 : false;
    }
  }
};
</script>
<template>
  <div class="topnav">
    <div class="container-fluid">
      <nav class="navbar navbar-light navbar-expand-lg topnav-menu active">
        <div class="collapse navbar-collapse active" id="topnav-menu-content">
          <ul class="navbar-nav">
            <!-- Menu data -->

            <li class="nav-item dropdown" v-for="cat of categories" :key="cat.id">
              <router-link
                class="nav-link dropdown-toggle arrow-none"
                tag="a"
                href="javascript: void(0);"
                @click.native="onMenuClick"
                :to="'/category/'+cat.id"
              >
                <i :class="`bx ${cat.image} mr-2`"></i>
                {{ $t(cat.name) }}
                <div v-if="hasChildren(cat)" class="arrow-down"></div>
              </router-link>
              <router-view :key="$route.path"></router-view>
              <div
                class="dropdown-menu row"
                aria-labelledby="topnav-dashboard"
                v-if="hasChildren(cat)"
              >
                <span v-for="sub_cat in cat.sub_categories" :key="sub_cat.id">
                  <router-link
                    class="col dropdown-item side-nav-link-ref"
                    v-if="!hasChildren(sub_cat)"
                    :to="`/category/${sub_cat.id}`"
                  >{{ $t(sub_cat.name) }}</router-link>
                  <router-view :key="$route.path"></router-view>
                  <div class="dropdown" v-if="hasChildren(sub_cat)">
                    <a class="dropdown-item" href="javascript: void(0);" @click="onMenuClick">
                      {{ $t(sub_cat.name) }}
                      <div class="arrow-down"></div>
                    </a>
                    <div class="dropdown-menu">
                      <router-link
                        v-for="sub_sub_cat in sub_cat.sub_categories"
                        :key="sub_sub_cat.id"
                        :to="`http://localhost:8081/category/${cat.id}`"
                        class="dropdown-item side-nav-link-ref"
                        
                      >{{ $t(sub_sub_cat.name) }}</router-link>
                      <router-view :key="$route.path"></router-view>
                    </div>
                  </div>
                </span>
              </div>
              <router-view :key="$route.path"></router-view>
            </li>
            <li class="nav-item dropdown" v-for="(item, index) of menuItems" :key="index">
              <router-link
                class="nav-link dropdown-toggle arrow-none"
                tag="a"
                href="javascript: void(0);"
                @click.native="onMenuClick"
                :to="item.link ? item.link : ''"
              >
                <i :class="`bx ${item.icon} mr-2`"></i>
                {{ $t(item.label) }}
                <div v-if="hasItems(item)" class="arrow-down"></div>
              </router-link>
              <div
                class="dropdown-menu row"
                aria-labelledby="topnav-dashboard"
                v-if="hasItems(item)"
              >
                <span v-for="(subitem, index) of item.subItems" :key="index">
                  <router-link
                    class="col dropdown-item side-nav-link-ref"
                    v-if="!hasItems(subitem)"
                    :to="subitem.link"
                  >{{ $t(subitem.label) }}</router-link>
                  <div class="dropdown" v-if="hasItems(subitem)">
                    <a class="dropdown-item" href="javascript: void(0);" @click="onMenuClick">
                      {{ $t(subitem.label) }}
                      <div class="arrow-down"></div>
                    </a>
                    <div class="dropdown-menu">
                      <router-link
                        v-for="(subSubitem, index) of subitem.subItems"
                        :key="index"
                        :to="subSubitem.link"
                        class="dropdown-item side-nav-link-ref"
                      >{{ $t(subSubitem.label) }}</router-link>
                    </div>
                  </div>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>