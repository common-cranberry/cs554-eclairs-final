
import Vue, { ComponentOptions,
  CreateElement, VNode } from "vue";
import VueRouter from "vue-router";

import Main from "./main";
import { router } from "./router";
import "./vendor";
import "./data/store";
import io from 'socket.io-client';

// @ts-ignore
const socket = io('http://localhost:5000');
socket.on('newPost',function (msg:any) {
  let date = msg.date;
  console.log("A user just made a post for" + date);
});

Vue.use(VueRouter);

const vue: Vue = new Vue({router, render ( create: CreateElement ): VNode {
    return create(Main);
  }
} as ComponentOptions<Vue>);

// to use runtime exclusively mount to nothing
//     which forces vue to create a new element
//     lastly bind this element to the dom
vue.$mount();
document.body.appendChild(vue.$el);
