
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Template from "./index.pug";
import "./index.styl";

const MONTH: Array<string> = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];

@Template
@Component
export default class Main extends Vue {
  public authValid: boolean = true;

  public get required ( ): ( v: string ) => true | string {
    return ( v ): true | string => !!v || "required";
  }

  public get requiredForRegister ( ): ( v: string ) => true | string {
    return ( v ): true | string => !this.$store.auth.register || !!v || "required";
  }

  public get passmatch ( ): ( v: string ) => true | string {
    return ( v ): true | string => v === this.$store.auth.data.password || "passwords must match";
  }

  public formatBirthday ( date: string ): string {
    const d: Date = new Date(date);
    return `Born ${MONTH[d.getMonth()]} ${d.getDate()}`;
  }

  public async submit ( ): Promise<any> {
    if ((this.$refs.auth as any).validate()) {
      return this.$store.authorize();
    }
  }
}
