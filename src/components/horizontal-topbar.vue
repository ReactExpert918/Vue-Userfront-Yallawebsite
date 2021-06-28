<script>
import i18n from "../i18n";

import simplebar from "simplebar-vue";
import { layoutComputed } from "@/state/helpers";

/**
 * Horizontal-topbar component
 */
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...layoutComputed,
  },
  components: {
    simplebar,
  },
  data() {
    return {
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "Spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      current_language: i18n.locale,
      text: null,
      flag: null,
      value: null,
    };
  },
  mounted() {
    this.value = this.languages.find((x) => x.language === i18n.locale);
    this.text = this.value.title;
    this.flag = this.value.flag;
  },
  methods: {
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    toggleMenu() {
      let element = document.getElementById("topnav-menu-content");
      element.classList.toggle("show");
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.current_language = locale;
      this.text = country;
      this.flag = flag;
      i18n.locale = locale;
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-topbar", "dark");
              break;
            case "light":
              document.body.setAttribute("data-topbar", "light");
              document.body.removeAttribute("data-layout-size", "boxed");
              break;
            case "colored":
              document.body.setAttribute("data-topbar", "colored");
              document.body.removeAttribute("data-layout-size", "boxed");
              break;
            default:
              document.body.setAttribute("data-topbar", "dark");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-size", "boxed");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-mode", "fluid");
              document.body.removeAttribute("data-layout-size");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "scrollable":
              document.body.setAttribute("data-layout-scrollable", "true");
              document.body.removeAttribute("data-layout-mode");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="col-9 row">
        <!-- LOGO -->
        <div class="navbar-brand-box col-3">
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt height="17" />
            </span>
          </router-link>

          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo-light.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-light.png" alt height="30" />
            </span>
          </router-link>
        </div>
        <button id="toggle" type="button" class="btn btn-sm mr-2 font-size-16 d-lg-none header-item" @click="toggleMenu">
          <i class="fa fa-fw fa-bars"></i>
        </button>

        <!-- App Search-->
        <form class="app-search d-none d-lg-block col-9">
          <div class="position-relative">
            <input type="text" class="form-control" placeholder="Search..." />
            <span class="bx bx-search-alt"></span>
          </div>
        </form>

        <!-- <b-dropdown variant="black" class="dropdown-mega d-none d-lg-block ml-2" toggle-class="header-item" menu-class="dropdown-megamenu">
          <template v-slot:button-content>
            {{ $t("navbar.dropdown.megamenu.text") }}
            <i class="mdi mdi-chevron-down"></i>
          </template>

          <div class="row">
            <div class="col-sm-8">
              <div class="row">
                <div class="col-md-4">
                  <h5 class="font-size-14 mt-0">{{ $t("navbar.dropdown.megamenu.uicontent.title") }}</h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.lightbox") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.rangeslider") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.sweetalert") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.rating") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.forms") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.tables") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.charts") }}</a>
                    </li>
                  </ul>
                </div>

                <div class="col-md-4">
                  <h5 class="font-size-14 mt-0">{{ $t("navbar.dropdown.megamenu.application.title") }}</h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.application.list.ecommerce") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.application.list.calendar") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.application.list.email") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.application.list.projects") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.application.list.tasks") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.application.list.contacts") }}</a>
                    </li>
                  </ul>
                </div>

                <div class="col-md-4">
                  <h5 class="font-size-14 mt-0">{{ $t("navbar.dropdown.megamenu.extrapages.title") }}</h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.lightsidebar") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.compactsidebar") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.horizontallayout") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.maintenance") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.comingsoon") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.timeline") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.extrapages.list.faqs") }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="row">
                <div class="col-sm-6">
                  <h5 class="font-size-14 mt-0">{{ $t("navbar.dropdown.megamenu.uicontent.title") }}</h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.lightbox") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.rangeslider") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.sweetalert") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.rating") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.forms") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.tables") }}</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">{{ $t("navbar.dropdown.megamenu.uicontent.list.charts") }}</a>
                    </li>
                  </ul>
                </div>

                <div class="col-sm-5">
                  <div>
                    <img src="@/assets/images/megamenu-img.png" alt class="img-fluid mx-auto d-block" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-dropdown> -->
      </div>

      <div class="d-flex">
        <b-dropdown class="d-inline-block d-lg-none ml-2" variant="black" menu-class="dropdown-menu-lg p-0" toggle-class="header-item noti-icon" right>
          <template v-slot:button-content>
            <i class="mdi mdi-magnify"></i>
          </template>

          <form class="p-3">
            <div class="form-group m-0">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                <div class="input-group-append">
                  <button class="btn btn-primary" type="submit">
                    <i class="mdi mdi-magnify"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </b-dropdown>
        <b-dropdown variant="white" right toggle-class="header-item">
          <template v-slot:button-content>
            <img class :src="flag" alt="Header Language" height="16" />
            {{ text }}
          </template>
          <b-dropdown-item class="notify-item" v-for="(entry, i) in languages" :key="`Lang${i}`" :value="entry" @click="setLanguage(entry.language, entry.title, entry.flag)" :class="{ active: current_language === entry.language }">
            <img :src="`${entry.flag}`" alt="user-image" class="mr-1" height="12" />
            <span class="align-middle">{{ entry.title }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <!-- <b-dropdown class="d-none d-lg-inline-block noti-icon" menu-class="dropdown-menu-lg" right toggle-class="header-item" variant="black">
          <template v-slot:button-content>
            <i class="bx bx-customize"></i>
          </template>

          <div class="px-lg-2">
            <div class="row no-gutters">
              <div class="col">
                <a class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/github.png" alt="Github" />
                  <span>{{ $t("navbar.dropdown.site.list.github") }}</span>
                </a>
              </div>
              <div class="col">
                <a class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/bitbucket.png" alt="bitbucket" />
                  <span>{{ $t("navbar.dropdown.site.list.github") }}</span>
                </a>
              </div>
              <div class="col">
                <a class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/dribbble.png" alt="dribbble" />
                  <span>{{ $t("navbar.dropdown.site.list.dribbble") }}</span>
                </a>
              </div>
            </div>

            <div class="row no-gutters">
              <div class="col">
                <a class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/dropbox.png" alt="dropbox" />
                  <span>{{ $t("navbar.dropdown.site.list.dropbox") }}</span>
                </a>
              </div>
              <div class="col">
                <a class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/mail_chimp.png" alt="mail_chimp" />
                  <span>{{ $t("navbar.dropdown.site.list.mailchimp") }}</span>
                </a>
              </div>
              <div class="col">
                <a class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/slack.png" alt="slack" />
                  <span>{{ $t("navbar.dropdown.site.list.slack") }}</span>
                </a>
              </div>
            </div>
          </div>
        </b-dropdown> -->

        <!-- <div class="dropdown d-none d-lg-inline-block ml-1">
          <button type="button" class="btn header-item noti-icon" @click="initFullScreen">
            <i class="bx bx-fullscreen"></i>
          </button>
        </div> -->

        <b-dropdown right menu-class="dropdown-menu-lg p-0" toggle-class="header-item noti-icon" variant="black">
          <template v-slot:button-content>
            <i class="bx bx-basket"></i>
            <span class="badge badge-danger badge-pill">{{ $t("navbar.dropdown.notification.badge") }}</span>
          </template>

          <div class="p-3">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0">{{ $t("navbar.dropdown.cart.text") }}</h6>
              </div>
              <div class="col-auto">
                <a href="#" class="small">{{ $t("navbar.dropdown.cart.subtext") }}</a>
              </div>
            </div>
          </div>
          <simplebar style="max-height: 230px">
            <a href="javascript: void(0);" class="text-reset notification-item">
              <div class="media">
                <div class="avatar-xs mr-3">
                  <span class="avatar-title bg-primary font-size-16">
                    <i class="bx bx-cart"></i>
                  </span>
                </div>
                <div class="media-body">
                  <div class="row">
                    <h6 class="mt-0 mb-1 col-9">Product 1</h6>
                    <p class="mb-1 col-2">£20.00</p>
                  </div>
                  <div class="row">
                    <h6 class="font-size-12 text-muted col-2 pt-2">Qty:</h6>
                    <p class="mb-1 col-4"><b-form-input id="input-name" placeholder="" value="1" class="text-center"></b-form-input></p>
                    <div class="mb-1 col-6 text-right">
                      <i class="bx bx-trash-alt"></i>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </simplebar>
          <div class="p-2 border-top">
            <a class="btn btn-sm btn-light btn-block text-center bg-primary avatar-title pt-2 pb-2" href="javascript:void(0)">
              {{ $t("navbar.dropdown.cart.button.checkout") }}
            </a>
          </div>
        </b-dropdown>

        <b-dropdown right variant="black" toggle-class="header-item">
          <template v-slot:button-content>
            <div class="avatar-xs">
              <span class="header-profile-user avatar-title rounded-circle font-size-16">
                <i class="bx bx-user"></i>
              </span>
            </div>
          </template>
          <!-- item-->
          <b-dropdown-item>
            <router-link tag="span" to="/accounts/dashboard">
              <i class="bx bx-user font-size-16 align-middle mr-1"></i>
              {{ $t("navbar.dropdown.customer.list.my-account") }}
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item class="d-block" href="/accounts/orders">
            <i class="bx bx-box font-size-16 align-middle mr-1"></i>
            {{ $t("navbar.dropdown.customer.list.my-orders") }}
          </b-dropdown-item>
          <b-dropdown-item class="d-block" href="/accounts/addresses">
            <i class="bx bx-map-pin font-size-16 align-middle mr-1"></i>
            {{ $t("navbar.dropdown.customer.list.addresses") }}
          </b-dropdown-item>
          <b-dropdown-item class="d-block" href="/accounts/preferences">
            <i class="bx bx-envelope font-size-16 align-middle mr-1"></i>
            {{ $t("navbar.dropdown.customer.list.preferences") }}
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <a href="/logout" class="dropdown-item text-danger">
            <i class="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>
            {{ $t("navbar.dropdown.henry.list.logout") }}
          </a>
        </b-dropdown>

        <!-- <div class="dropdown d-inline-block">
          <button type="button" class="btn header-item noti-icon right-bar-toggle toggle-right" @click="toggleRightSidebar">
            <i class="bx bx-cog bx-spin toggle-right"></i>
          </button>
        </div> -->
      </div>
    </div>
  </header>
</template>
