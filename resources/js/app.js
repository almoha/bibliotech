
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

//momentJs
import moment from 'moment';
moment.locale('fr'); 
// ./momentJs

//Gate.js
import Gate from "./Gate";
Vue.prototype.$gate = new Gate(window.user); // permet un accès à la fonction  partout dans l'application
// ./Gate.js

//VueProgressBar
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
});
// ./VueProgressBar

// Sweetalert2
import swal from 'sweetalert2'
window.swal = swal;

const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

window.toast = toast;
// ./Sweetalert2

// Custom event => global en l'espèce
window.Fire = new Vue(); // Fire est un nom libre
// ./ Custom event


// vform
import { Form, HasError, AlertError } from 'vform';

window.Form = Form; //rajout de Code inspire=> global variable

Vue.component(HasError.name, HasError);// global component
Vue.component(AlertError.name, AlertError);//global component
// ./vform

//Vue Router
import VueRouter from 'vue-router';
Vue.use(VueRouter);

//on peut aussi référencer un fichier route externe
let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/developer', component: require('./components/Developer.vue').default},   
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/users', component: require('./components/Users.vue').default }
];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`

});
// ./Vue Router


//global filter
Vue.filter('capitalize', function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('formatDate', function (value) {
    return moment(value).format('Do MMMM YYYY');
});


// ./global filter


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

//Pour page 404 si accès interdit
Vue.component('not-found', require('./components/NotFound.vue').default);

// Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router

});
