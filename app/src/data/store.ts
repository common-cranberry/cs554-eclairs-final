
import Vue, { VueConstructor } from "vue";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { User } from "../../../api/data/types";

const STORAGE: string = "554-auth";

export type AuthResponse =
  AxiosResponse<{
    user: User,
    token: string,
    errors: Array<string> }>;

export type AuthData = {
  name: string;
  dob: null | Date;
  email: string;
  password: string;
  passmatch: string;
  trusted: boolean;
};

export type Auth = {
  register: boolean;
  success: boolean;
  pending: boolean;
  error: null | string;
  data: AuthData;
};

export type Store = {
  http: AxiosInstance;
  auth: Auth;
};

export type Methods = {
  authorize: ( ) => Promise<AuthResponse>;
};

declare module "vue/types/vue" {
  export interface Vue {
    $store: Vue & Readonly<Store> & Readonly<Methods>;
  }
}

Vue.use({
  install ( Invoker: VueConstructor ): void {
    if ((this as any).installed) { return; }
    (this as any).installed = true;

    if (Vue !== Invoker) {
      throw new Error("Too many instances of Vue detected");
    }

    Vue.prototype.$store = new Vue({
      mixins: [
        Vue.extend({
          data ( ): Store {
            return {
              http: Axios.create({
                baseURL: process.env.ENDPOINT || "http://localhost:3000"
              }),
              auth: {
                register: true,
                success: false,
                pending: false,
                error: null,
                data: {
                  name: "",
                  dob: null,
                  email: "",
                  password: "",
                  passmatch: "",
                  trusted: true
                }
              }
            };
          },
          created ( ): void {
            if (localStorage.hasOwnProperty(STORAGE)) {
              this.auth.register = false;
              try {
                const data: { user?: User, token?: string } =
                  JSON.parse(localStorage.getItem(STORAGE) || "{}");
                if (data.token) {
                  this.http.defaults.headers.Authorization =
                    "Bearer " +  data.token;
                  this.auth.success = true;
                }
                if (data.user) {
                  Object.assign(this.auth.data, data.user);
                }
              } catch ( ignored ) { }
            }
          },
          methods: {
            async authorize ( ): Promise<AuthResponse> {
              this.auth.pending = true;
              this.auth.error = null;
              const request: Promise<AuthResponse> = this.http.post(
                this.auth.register ? "/register" : "/login", this.auth.data);
              let result: AuthResponse = null as any;
              try {
                result = await request;
              } catch ( e ) {
                if (e.response && e.response.data.errors) {
                  result = e.response;
                } else {
                  this.auth.error = e.message;
                }
              } finally {
                this.auth.pending = false;
              }
              if (result && result.data.errors) {
                this.auth.error = result.data.errors[0];
              }
              if (this.auth.error) {
                return request;
              }
              this.auth.success = true;
              if (this.auth.data.trusted) {
                localStorage.setItem(STORAGE, JSON.stringify(result.data));
              }
              return result;
            }
          }
        })
      ]
    });
  }
});
